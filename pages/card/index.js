const backend = require('../../lib/backend/index')
const stateKeywords = ['松弛', '节奏', '创作', '表达', 'AI', '关系']

const sortTopicsByDate = (topics, selectedDateKey = '') => {
  const getDayValue = (dateKey) => new Date(dateKey).getTime()
  if (!selectedDateKey) {
    return [...topics].sort((a, b) => getDayValue(a.dateKey) - getDayValue(b.dateKey))
  }
  const target = getDayValue(selectedDateKey)
  return [...topics].sort((a, b) => {
    const aTime = getDayValue(a.dateKey)
    const bTime = getDayValue(b.dateKey)
    const aMatch = a.dateKey === selectedDateKey ? 0 : 1
    const bMatch = b.dateKey === selectedDateKey ? 0 : 1
    if (aMatch !== bMatch) return aMatch - bMatch
    const aFutureBucket = aTime >= target ? 0 : 1
    const bFutureBucket = bTime >= target ? 0 : 1
    if (aFutureBucket !== bFutureBucket) return aFutureBucket - bFutureBucket
    if (aFutureBucket === 0 && aTime !== bTime) return aTime - bTime
    if (aFutureBucket === 1 && aTime !== bTime) return bTime - aTime
    return aTime - bTime
  })
}

const weekdayLabels = ['日', '一', '二', '三', '四', '五', '六']

const buildVenueCards = (venues) => {
  const now = new Date()
  const monthLabel = `${now.getMonth() + 1}月`
  const dayLabel = `${now.getDate()}`
  const todayCopy = `今天 · 周${weekdayLabels[now.getDay()]}`

  return venues.map((venue) => ({
    ...venue,
    monthLabel,
    dayLabel,
    dateCopy: todayCopy
  }))
}

const buildCalendarDays = (topics) => {
  const topicDateSet = new Set(topics.map((item) => item.dateKey))
  const allDates = [...topicDateSet].sort()
  const startDate = allDates.length ? new Date(allDates[0]) : new Date()
  const sourceDates = Array.from({ length: 14 }, (_, index) => {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + index)
    return date.toISOString().slice(0, 10)
  })

  return sourceDates.map((dateKey) => {
    const date = new Date(dateKey)
    return {
      key: dateKey,
      day: `${date.getDate()}`,
      weekday: weekdayLabels[date.getDay()],
      hasTopic: topicDateSet.has(dateKey)
    }
  })
}

const scoreTopicByState = (topic) => {
  const source = `${topic.title} ${(topic.tags || []).join(' ')} ${topic.location || ''}`
  return stateKeywords.reduce((score, keyword) => score + (source.includes(keyword) ? 3 : 0), 0) + Math.max(0, 10 - topic.current)
}

const buildRecommendedTopics = (topics) => [...topics]
  .sort((left, right) => {
    const scoreDiff = scoreTopicByState(right) - scoreTopicByState(left)
    if (scoreDiff !== 0) return scoreDiff
    return new Date(left.dateKey).getTime() - new Date(right.dateKey).getTime()
  })
  .slice(0, 3)

const isHorizontalSwipe = (startX, startY, endX, endY) => {
  const dx = endX - startX
  const dy = endY - startY
  return Math.abs(dx) > 72 && Math.abs(dx) > Math.abs(dy) * 1.35
}

Page({
  data: {
    topics: [],
    visibleTopics: [],
    recommendedTopics: [],
    activeTab: 'online',
    activeTabIndex: 0,
    realityCurrent: 0,
    calendarDays: [],
    nextWeekDays: [],
    showCalendar: false,
    selectedDateKey: '',
    pressedDateKey: '',
    pressedToggle: false,
    pressedTopicId: '',
    pressedJoinId: '',
    stateFocus: {
      eyebrow: 'Based on your current state',
      title: '先不推一个信息流，只先给你三个更适合今晚进入的线下对话',
      copy: '结合你最近「练习更松弛地创作」的状态，我们先把入口收窄，帮你更轻地迈出去。',
      tags: ['创作松弛', '表达欲', 'AI 与关系']
    },
    backendMode: 'mock',
    isLoading: true,
    pageReady: false,
    pageLeaving: false
  },
  async onShow() {
    this.showTabBar()
    await this.loadDiscoveryFeed()
    this.enterPage()
  },
  async loadDiscoveryFeed() {
    const result = await backend.fetchDiscoveryFeed()
    const calendarDays = buildCalendarDays(result.topics)
    const selectedDateKey = this.data.selectedDateKey || (calendarDays[0] && calendarDays[0].key) || ''
    const visibleTopics = sortTopicsByDate(result.topics, selectedDateKey)
    const recommendedTopics = buildRecommendedTopics(result.topics)

    this.setData({
      topics: result.topics,
      visibleTopics,
      recommendedTopics,
      calendarDays: calendarDays.slice(0, 7),
      nextWeekDays: calendarDays.slice(7),
      selectedDateKey,
      backendMode: result.mode,
      isLoading: false
    })
  },
  enterPage() {
    this.setData({ pageLeaving: false, pageReady: false })
    setTimeout(() => {
      this.setData({ pageReady: true })
    }, 20)
  },
  showTabBar() {
    const tabBar = this.getTabBar && this.getTabBar()
    if (tabBar && tabBar.sync) {
      tabBar.sync('/pages/card/index', false)
    }
  },
  switchTab(e) {
    const { tab } = e.currentTarget.dataset
    this.setData({
      activeTab: tab,
      activeTabIndex: tab === 'reality' ? 1 : 0
    })
  },
  onTopicSectionChange(e) {
    const index = e.detail.current
    this.setData({
      activeTabIndex: index,
      activeTab: index === 1 ? 'reality' : 'online'
    })
  },
  startPageSwipe(e) {
    const touch = e.touches[0]
    if (!touch) return
    this.pageSwipeStart = {
      x: touch.clientX,
      y: touch.clientY
    }
  },
  endPageSwipe(e) {
    const start = this.pageSwipeStart
    const touch = e.changedTouches[0]
    this.pageSwipeStart = null
    if (!start || !touch) return

    if (!isHorizontalSwipe(start.x, start.y, touch.clientX, touch.clientY)) return
    const dx = touch.clientX - start.x
    if (dx < 0 && this.data.activeTab === 'online') {
      this.setData({ activeTab: 'reality' })
      return
    }
    if (dx > 0 && this.data.activeTab === 'reality') {
      this.setData({ activeTab: 'online' })
    }
  },
  cancelPageSwipe() {
    this.pageSwipeStart = null
  },
  toggleCalendar() {
    this.setData({ showCalendar: !this.data.showCalendar })
  },
  pressCalendarDate(e) {
    const { key } = e.currentTarget.dataset
    if (!key) return
    this.setData({ pressedDateKey: key })
  },
  releaseCalendarDate() {
    if (!this.data.pressedDateKey) return
    this.setData({ pressedDateKey: '' })
  },
  pressCalendarToggle() {
    this.setData({ pressedToggle: true })
  },
  releaseCalendarToggle() {
    if (!this.data.pressedToggle) return
    this.setData({ pressedToggle: false })
  },
  pressTopicCard(e) {
    const { id } = e.currentTarget.dataset
    if (!id) return
    this.setData({ pressedTopicId: id })
  },
  releaseTopicCard() {
    if (!this.data.pressedTopicId) return
    this.setData({ pressedTopicId: '' })
  },
  pressJoinButton(e) {
    const { id } = e.currentTarget.dataset
    if (!id) return
    this.setData({ pressedJoinId: id })
  },
  releaseJoinButton() {
    if (!this.data.pressedJoinId) return
    this.setData({ pressedJoinId: '' })
  },
  selectCalendarDate(e) {
    const { key } = e.currentTarget.dataset
    if (!key) return
    this.releaseCalendarDate()
    const selectedDateKey = this.data.selectedDateKey === key ? '' : key
    const visibleTopics = sortTopicsByDate(this.data.topics, selectedDateKey)
    this.setData({
      selectedDateKey,
      visibleTopics
    })
  },
  onRealitySwiperChange(e) {
    this.setData({ realityCurrent: e.detail.current })
  },
  goTopicDetail(e) {
    const { id } = e.currentTarget.dataset
    this.releaseTopicCard()
    this.setData({ pageLeaving: true })
    setTimeout(() => {
      wx.navigateTo({ url: `/pages/topic-detail/index?id=${id}` })
    }, 180)
  },
  joinTopic(e) {
    const { id } = e.currentTarget.dataset
    this.releaseJoinButton()
    this.releaseTopicCard()
    this.setData({ pageLeaving: true })
    setTimeout(() => {
      wx.navigateTo({ url: `/pages/topic-detail/index?id=${id}` })
    }, 180)
  }
})
