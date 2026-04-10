const { featuredEvent, myEvents, topics, venues, onlineEvents } = require('../../data/mock')

const CLOUD_ENV_ID = 'replace-with-your-cloud-env-id'
const CLOUD_FUNCTION_NAME = 'api'
const PLACEHOLDER_ENV_ID = 'replace-with-your-cloud-env-id'

const fallbackUser = {
  id: 'local-user',
  name: 'Lynn',
  initial: 'L',
  bio: '在练习更松弛地创作',
  location: '中国 · 杭州',
  tags: ['创作者']
}

const fallbackUnlockEntry = {
  badge: 'Invite to unlock',
  title: '邀请解锁',
  detail: '邀请 2 位同频好友，解锁本月完整权益',
  cta: '去邀请'
}

const fallbackCoBuildEntry = {
  badge: 'Co-build plan',
  title: '共建计划',
  detail: '邀请同频新朋友完成订阅，获得持续关键回馈',
  cta: '查看计划'
}

const memberProfiles = [
  {
    id: 'person-qingyuan',
    name: '青原',
    initial: '青',
    bio: '一个正在研究哲学的程序员',
    location: '中国 · 杭州',
    tags: ['哲学', '程序员'],
    connectionHint: '如果你也在想工作之外还有什么能定义一个人，也许可以从这里开始。',
    eventIds: ['my-event-1', 'my-event-4']
  },
  {
    id: 'person-momo',
    name: 'Momo',
    initial: 'M',
    bio: '做城市策展，也在学习慢一点生活',
    location: '中国 · 杭州',
    tags: ['策展', '城市'],
    connectionHint: '她很在意城市里的陌生感和人与人之间微妙的距离。',
    eventIds: ['my-event-2', 'my-event-5']
  },
  {
    id: 'person-lynn',
    name: 'Lynn',
    initial: 'L',
    bio: '在练习更松弛地创作',
    location: '中国 · 杭州',
    tags: ['创作者'],
    connectionHint: '和她聊天，常常会从一个很小的真感受开始，然后慢慢打开。',
    eventIds: ['my-event-3', 'my-event-4']
  },
  {
    id: 'person-aki',
    name: 'Aki',
    initial: 'A',
    bio: '拍纪录片，也写诗',
    location: '中国 · 杭州',
    tags: ['纪录片', '写作'],
    connectionHint: 'TA 会记住气氛、光线和停顿，比结论更先被留下来。',
    eventIds: ['my-event-2', 'my-event-5']
  },
  {
    id: 'person-xiaoyue',
    name: '小越',
    initial: '越',
    bio: '产品设计师，最近在重建节奏',
    location: '中国 · 杭州',
    tags: ['产品设计', '生活节奏'],
    connectionHint: '如果你也在经历失控之后的重建，可能会很容易和 TA 接上。',
    eventIds: ['my-event-1', 'my-event-3']
  },
  {
    id: 'person-nora',
    name: 'Nora',
    initial: 'N',
    bio: '一个做播客的观察者',
    location: '中国 · 杭州',
    tags: ['播客', '观察'],
    connectionHint: '她很擅长把模糊的情绪说得很轻，也很准。',
    eventIds: ['my-event-4', 'my-event-5']
  }
]

const memberProfileByName = memberProfiles.reduce((accumulator, profile) => {
  accumulator[profile.name] = profile
  return accumulator
}, {})

const cloudState = {
  initialized: false,
  enabled: false
}

const isCloudConfigured = () => Boolean(
  typeof wx !== 'undefined' &&
  wx.cloud &&
  CLOUD_ENV_ID &&
  CLOUD_ENV_ID !== PLACEHOLDER_ENV_ID
)

const initCloudIfNeeded = () => {
  if (cloudState.initialized) return cloudState.enabled
  cloudState.initialized = true
  cloudState.enabled = isCloudConfigured()
  if (!cloudState.enabled) return false

  wx.cloud.init({
    env: CLOUD_ENV_ID,
    traceUser: true
  })
  return true
}

const callApi = async (action, payload = {}) => {
  if (!initCloudIfNeeded()) {
    throw new Error('Cloud backend is not configured.')
  }

  const response = await wx.cloud.callFunction({
    name: CLOUD_FUNCTION_NAME,
    data: {
      action,
      ...payload
    }
  })

  const result = response.result || {}
  if (result.ok === false) {
    throw new Error(result.message || 'Cloud function failed.')
  }

  return Object.prototype.hasOwnProperty.call(result, 'data') ? result.data : result
}

const sortEventsByDate = (events) => [...events].sort((left, right) => (left.date < right.date ? 1 : -1))

const buildEventSlides = (events) => sortEventsByDate(events).map((item, index, list) => ({
  ...item,
  relativeTime: ['17 天前', '12 天前', '8 天前', '5 天前', '3 天前'][index] || `${index + 1} 周前`,
  venueShort: item.venue.replace('某', '').slice(0, 4) || item.venue,
  indexLabel: `${String(index + 1).padStart(2, '0')} / ${String(list.length).padStart(2, '0')}`
}))

const enrichTopicParticipants = (topic) => ({
  ...topic,
  participants: (topic.participants || []).map((participant) => {
    const person = memberProfileByName[participant.name]
    return {
      ...participant,
      id: person ? person.id : participant.id,
      initial: person ? person.initial : participant.initial
    }
  })
})

const buildDiscoveryFeed = () => ({
  venues,
  topics: topics.map(enrichTopicParticipants),
  onlineEvents
})

const buildProfileHome = () => ({
  user: fallbackUser,
  unlockEntry: fallbackUnlockEntry,
  coBuildEntry: fallbackCoBuildEntry,
  eventSlides: buildEventSlides(myEvents)
})

const getPersonProfileFallback = (id) => {
  const person = memberProfiles.find((item) => item.id === id) || memberProfiles[0]
  const visibleEvents = myEvents.filter((item) => person.eventIds.includes(item.id))
  return {
    person,
    visibleEvents
  }
}

async function bootstrapBackend() {
  try {
    if (!initCloudIfNeeded()) {
      return { mode: 'mock' }
    }

    await callApi('bootstrap')
    return { mode: 'cloud' }
  } catch (error) {
    return {
      mode: 'mock',
      error
    }
  }
}

async function ensureCurrentUser() {
  try {
    if (!initCloudIfNeeded()) {
      return {
        mode: 'mock',
        user: fallbackUser
      }
    }

    const data = await callApi('auth.session')
    return {
      ...data,
      mode: 'cloud'
    }
  } catch (error) {
    return {
      mode: 'mock',
      user: fallbackUser,
      error
    }
  }
}

async function fetchDiscoveryFeed() {
  try {
    const data = await callApi('discovery.feed')
    return {
      ...data,
      topics: (data.topics || []).map(enrichTopicParticipants),
      mode: 'cloud'
    }
  } catch (error) {
    return {
      ...buildDiscoveryFeed(),
      mode: 'mock',
      error
    }
  }
}

async function fetchTopicDetail(id) {
  try {
    const topic = await callApi('topics.detail', { id })
    return {
      topic: enrichTopicParticipants(topic),
      mode: 'cloud'
    }
  } catch (error) {
    const fallbackTopic = buildDiscoveryFeed().topics.find((item) => item.id === id) || buildDiscoveryFeed().topics[0]
    return {
      topic: fallbackTopic,
      mode: 'mock',
      error
    }
  }
}

async function applyToTopic(id) {
  try {
    const data = await callApi('topics.rsvp', { id })
    return {
      ...data,
      mode: 'cloud'
    }
  } catch (error) {
    return {
      ok: true,
      message: '已提交申请，等待发起人确认',
      mode: 'mock',
      error
    }
  }
}

async function fetchProfileHome() {
  try {
    const data = await callApi('profile.home')
    return {
      ...data,
      eventSlides: buildEventSlides(data.eventSlides || []),
      mode: 'cloud'
    }
  } catch (error) {
    return {
      ...buildProfileHome(),
      mode: 'mock',
      error
    }
  }
}

async function fetchEventDetail(options = {}) {
  const { id = '', source = 'official' } = options
  try {
    const event = await callApi('events.detail', { id, source })
    return {
      event,
      detailMode: source === 'profile' ? 'profile' : 'official',
      mode: 'cloud'
    }
  } catch (error) {
    const fallbackEvent = source === 'profile'
      ? (myEvents.find((item) => item.id === id) || myEvents[0])
      : {
        ...featuredEvent,
        schedule: '今晚 19:30 - 21:30',
        location: '泊光集 · 杭州天目里附近',
        guide: 'Iris · 产品叙事研究',
        seatsText: `${featuredEvent.status} · 余 7 位（限额 20 人）`
      }

    return {
      event: fallbackEvent,
      detailMode: source === 'profile' ? 'profile' : 'official',
      mode: 'mock',
      error
    }
  }
}

async function fetchPersonProfile(id) {
  try {
    const data = await callApi('people.detail', { id })
    return {
      ...data,
      mode: 'cloud'
    }
  } catch (error) {
    return {
      ...getPersonProfileFallback(id),
      mode: 'mock',
      error
    }
  }
}

module.exports = {
  bootstrapBackend,
  ensureCurrentUser,
  fetchDiscoveryFeed,
  fetchTopicDetail,
  applyToTopic,
  fetchProfileHome,
  fetchEventDetail,
  fetchPersonProfile
}
