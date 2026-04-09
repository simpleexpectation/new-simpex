const cloud = require('wx-server-sdk')
const seed = require('./seed')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const db = cloud.database()

const COLLECTIONS = {
  users: 'simpex_users',
  venues: 'simpex_venues',
  topics: 'simpex_topics',
  people: 'simpex_people',
  profileEvents: 'simpex_profile_events',
  officialEvents: 'simpex_official_events',
  applications: 'simpex_topic_applications'
}

const COLLECTION_NAMES = Object.values(COLLECTIONS)

const groupByKey = (items, key = 'id') => items.reduce((accumulator, item) => {
  accumulator[item[key]] = item
  return accumulator
}, {})

const safeGetCollection = (name) => db.collection(name)

async function readAll(name) {
  const result = await safeGetCollection(name).limit(100).get()
  return result.data || []
}

async function ensureSeedData() {
  for (const [collectionName, items] of [
    [COLLECTIONS.venues, seed.venues],
    [COLLECTIONS.topics, seed.topics],
    [COLLECTIONS.people, seed.people],
    [COLLECTIONS.profileEvents, seed.profileEvents],
    [COLLECTIONS.officialEvents, seed.officialEvents]
  ]) {
    const existing = await readAll(collectionName)
    if (existing.length > 0) continue
    for (const item of items) {
      await safeGetCollection(collectionName).add({ data: item })
    }
  }
}

async function ensureUser(openid) {
  const users = await safeGetCollection(COLLECTIONS.users).where({ openid }).limit(1).get()
  const existing = users.data && users.data[0]
  if (existing) return existing

  const user = {
    openid,
    ...seed.defaultUser,
    createdAt: Date.now(),
    updatedAt: Date.now()
  }
  await safeGetCollection(COLLECTIONS.users).add({ data: user })
  return user
}

async function bootstrap() {
  try {
    await ensureSeedData()
    return {
      ok: true,
      data: {
        collections: COLLECTION_NAMES
      }
    }
  } catch (error) {
    return {
      ok: false,
      message: `Bootstrap failed: ${error.message}`
    }
  }
}

async function authSession(openid) {
  const user = await ensureUser(openid)
  return {
    ok: true,
    data: {
      user: {
        id: user.id,
        name: user.name,
        initial: user.initial,
        bio: user.bio,
        location: user.location,
        tags: user.tags
      }
    }
  }
}

async function discoveryFeed() {
  const [venues, topics, people] = await Promise.all([
    readAll(COLLECTIONS.venues),
    readAll(COLLECTIONS.topics),
    readAll(COLLECTIONS.people)
  ])

  const peopleById = groupByKey(people)
  const venueCards = venues.map((item) => ({
    ...item,
    monthLabel: `${new Date().getMonth() + 1}月`,
    dayLabel: `${new Date().getDate()}`,
    dateCopy: `今天 · 周${'日一二三四五六'[new Date().getDay()]}`
  }))

  const topicCards = topics.map((item) => ({
    ...item,
    participants: (item.participants || []).map((personId) => {
      const person = peopleById[personId]
      return person ? {
        id: person.id,
        name: person.name,
        role: person.bio,
        initial: person.initial
      } : null
    }).filter(Boolean)
  }))

  return {
    ok: true,
    data: {
      venues: venueCards,
      topics: topicCards
    }
  }
}

async function topicDetail(id) {
  const [topics, people] = await Promise.all([
    safeGetCollection(COLLECTIONS.topics).where({ id }).limit(1).get(),
    readAll(COLLECTIONS.people)
  ])
  const topic = topics.data && topics.data[0]
  if (!topic) {
    return { ok: false, message: 'Topic not found.' }
  }

  const peopleById = groupByKey(people)
  return {
    ok: true,
    data: {
      ...topic,
      participants: (topic.participants || []).map((personId) => {
        const person = peopleById[personId]
        return person ? {
          id: person.id,
          name: person.name,
          role: person.bio,
          initial: person.initial
        } : null
      }).filter(Boolean)
    }
  }
}

async function topicRsvp(id, openid) {
  const users = await safeGetCollection(COLLECTIONS.users).where({ openid }).limit(1).get()
  const user = users.data && users.data[0]
  if (!user) {
    await ensureUser(openid)
  }

  const existing = await safeGetCollection(COLLECTIONS.applications).where({
    topicId: id,
    openid
  }).limit(1).get()

  if (existing.data && existing.data[0]) {
    return {
      ok: true,
      data: {
        ok: true,
        message: '你已经申请过这场对话了'
      }
    }
  }

  await safeGetCollection(COLLECTIONS.applications).add({
    data: {
      topicId: id,
      openid,
      status: 'pending',
      createdAt: Date.now()
    }
  })

  return {
    ok: true,
    data: {
      ok: true,
      message: '已提交申请，等待发起人确认'
    }
  }
}

async function profileHome(openid) {
  const ensuredUser = await ensureUser(openid)
  const [users, events] = await Promise.all([
    safeGetCollection(COLLECTIONS.users).where({ openid }).limit(1).get(),
    readAll(COLLECTIONS.profileEvents)
  ])
  const user = (users.data && users.data[0]) || ensuredUser

  return {
    ok: true,
    data: {
      user: {
        id: user.id,
        name: user.name,
        initial: user.initial,
        bio: user.bio,
        location: user.location,
        tags: user.tags
      },
      unlockEntry: {
        badge: 'Invite to unlock',
        title: '邀请解锁',
        detail: '邀请 2 位同频好友，解锁本月完整权益',
        cta: '去邀请'
      },
      coBuildEntry: {
        badge: 'Co-build plan',
        title: '共建计划',
        detail: '邀请同频新朋友完成订阅，获得持续关键回馈',
        cta: '查看计划'
      },
      eventSlides: events.filter((item) => item.ownerId === user.id)
    }
  }
}

async function eventDetail(id, source) {
  if (source === 'profile') {
    const result = await safeGetCollection(COLLECTIONS.profileEvents).where({ id }).limit(1).get()
    const event = result.data && result.data[0]
    if (!event) return { ok: false, message: 'Event not found.' }
    return { ok: true, data: event }
  }

  const result = await readAll(COLLECTIONS.officialEvents)
  return {
    ok: true,
    data: result[0]
  }
}

async function peopleDetail(id) {
  const [peopleResult, events] = await Promise.all([
    safeGetCollection(COLLECTIONS.people).where({ id }).limit(1).get(),
    readAll(COLLECTIONS.profileEvents)
  ])
  const person = peopleResult.data && peopleResult.data[0]
  if (!person) return { ok: false, message: 'Person not found.' }

  return {
    ok: true,
    data: {
      person,
      visibleEvents: events.filter((item) => (person.eventIds || []).includes(item.id))
    }
  }
}

exports.main = async (event = {}) => {
  const { action, id, source } = event
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID || 'local-openid'

  switch (action) {
    case 'bootstrap':
      return bootstrap()
    case 'auth.session':
      return authSession(openid)
    case 'discovery.feed':
      return discoveryFeed()
    case 'topics.detail':
      return topicDetail(id)
    case 'topics.rsvp':
      return topicRsvp(id, openid)
    case 'profile.home':
      return profileHome(openid)
    case 'events.detail':
      return eventDetail(id, source)
    case 'people.detail':
      return peopleDetail(id)
    default:
      return {
        ok: false,
        message: `Unknown action: ${action || 'undefined'}`
      }
  }
}
