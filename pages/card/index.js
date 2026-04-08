const { venues, topics } = require('../../data/mock')

const calendarDays = [
  { key: '2026-03-16', day: '16', weekday: '一', hasTopic: false },
  { key: '2026-03-17', day: '17', weekday: '二', hasTopic: false },
  { key: '2026-03-18', day: '18', weekday: '三', hasTopic: false },
  { key: '2026-03-19', day: '19', weekday: '四', hasTopic: false },
  { key: '2026-03-20', day: '20', weekday: '五', hasTopic: true },
  { key: '2026-03-21', day: '21', weekday: '六', hasTopic: true },
  { key: '2026-03-22', day: '22', weekday: '日', hasTopic: true }
]

const nextWeekDays = [
  { key: '2026-03-23', day: '23', weekday: '一', hasTopic: false },
  { key: '2026-03-24', day: '24', weekday: '二', hasTopic: false },
  { key: '2026-03-25', day: '25', weekday: '三', hasTopic: false },
  { key: '2026-03-26', day: '26', weekday: '四', hasTopic: false },
  { key: '2026-03-27', day: '27', weekday: '五', hasTopic: false },
  { key: '2026-03-28', day: '28', weekday: '六', hasTopic: false },
  { key: '2026-03-29', day: '29', weekday: '日', hasTopic: false }
]

const sortTopicsByDate = (selectedDateKey = '') => {
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

const buildVenueCards = () => {
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

Page({
  data: {
    venues: buildVenueCards(),
    venueMonthLabel: '',
    venueDayLabel: '',
    topics,
    visibleTopics: sortTopicsByDate('2026-03-20'),
    calendarDays,
    nextWeekDays,
    activeTab: 'topics',
    showCalendar: false,
    selectedDateKey: '2026-03-20',
    pressedDateKey: '',
    pressedTopicId: '',
    pressedJoinId: '',
    pressedToggle: false,
    pageReady: false,
    pageLeaving: false
  },
  onShow() {
    this.showTabBar()
    const now = new Date()
    this.setData({
      venues: buildVenueCards(),
      venueMonthLabel: `${now.getMonth() + 1}月`,
      venueDayLabel: `${now.getDate()}`
    })
    this.enterPage()
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
    const visibleTopics = sortTopicsByDate(selectedDateKey)
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
