const backend = require('../../lib/backend/index')

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
  const sourceDates = allDates.length ? allDates : [new Date().toISOString().slice(0, 10)]

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

Page({
  data: {
    venues: [],
    venueMonthLabel: '',
    venueDayLabel: '',
    topics: [],
    visibleTopics: [],
    calendarDays: [],
    nextWeekDays: [],
    activeTab: 'topics',
    showCalendar: false,
    selectedDateKey: '',
    pressedDateKey: '',
    pressedTopicId: '',
    pressedJoinId: '',
    pressedToggle: false,
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
    const now = new Date()
    const result = await backend.fetchDiscoveryFeed()
    const calendarDays = buildCalendarDays(result.topics)
    const selectedDateKey = this.data.selectedDateKey || (calendarDays[0] && calendarDays[0].key) || ''
    const visibleTopics = sortTopicsByDate(result.topics, selectedDateKey)

    this.setData({
      venues: buildVenueCards(result.venues),
      venueMonthLabel: `${now.getMonth() + 1}月`,
      venueDayLabel: `${now.getDate()}`,
      topics: result.topics,
      visibleTopics,
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
    this.setData({ activeTab: tab })
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
  },
  goVenueDetail(e) {
    const { id } = e.currentTarget.dataset
    this.setData({ pageLeaving: true })
    setTimeout(() => {
      wx.navigateTo({ url: `/pages/venue-detail/index?id=${id}` })
    }, 180)
  },
  openVenueRecommend() {
    wx.showToast({
      title: '下一步接入推荐空间提交流程',
      icon: 'none'
    })
  }
})
