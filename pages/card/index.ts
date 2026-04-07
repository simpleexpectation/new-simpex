import { venues, topics } from '../../data/mock'

const calendarDays = [
  { key: '2026-03-16', day: '16', weekday: '一', hasTopic: false },
  { key: '2026-03-17', day: '17', weekday: '二', hasTopic: false },
  { key: '2026-03-18', day: '18', weekday: '三', hasTopic: false },
  { key: '2026-03-19', day: '19', weekday: '四', hasTopic: false },
  { key: '2026-03-20', day: '20', weekday: '五', hasTopic: true },
  { key: '2026-03-21', day: '21', weekday: '六', hasTopic: true },
  { key: '2026-03-22', day: '22', weekday: '日', hasTopic: true }
]

const sortTopicsByDate = (selectedDateKey = '') => {
  const getDayValue = (dateKey: string) => new Date(dateKey).getTime()
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
    activeTab: 'topics',
    showCalendar: false,
    selectedDateKey: '2026-03-20',
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
    setTimeout(() => { this.setData({ pageReady: true }) }, 20)
  },
  showTabBar() {
    const tabBar = this.getTabBar && this.getTabBar() as any
    if (tabBar && tabBar.sync) tabBar.sync('/pages/card/index', false)
  },
  switchTab(e: WechatMiniprogram.BaseEvent) {
    const tab = (e.currentTarget.dataset as any).tab
    this.setData({ activeTab: tab })
  },
  toggleCalendar() {
    this.setData({ showCalendar: !this.data.showCalendar })
  },
  openAiEntry() {
    this.setData({ pageLeaving: true })
    setTimeout(() => {
      wx.navigateTo({ url: '/pages/ai-entry/index' })
    }, 180)
  },
  selectCalendarDate(e: WechatMiniprogram.BaseEvent) {
    const { key } = e.currentTarget.dataset as any
    if (!key) return
    const selectedDateKey = this.data.selectedDateKey === key ? '' : key
    const visibleTopics = sortTopicsByDate(selectedDateKey)
    this.setData({
      selectedDateKey,
      visibleTopics
    })
  },
  goTopicDetail(e: WechatMiniprogram.BaseEvent) {
    const { id } = e.currentTarget.dataset as any
    this.setData({ pageLeaving: true })
    setTimeout(() => {
      wx.navigateTo({ url: `/pages/topic-detail/index?id=${id}` })
    }, 180)
  },
  joinTopic(e: WechatMiniprogram.BaseEvent) {
    const { id } = e.currentTarget.dataset as any
    this.setData({ pageLeaving: true })
    setTimeout(() => {
      wx.navigateTo({ url: `/pages/topic-detail/index?id=${id}` })
    }, 180)
  },
  goVenueDetail(e: WechatMiniprogram.BaseEvent) {
    const { id } = e.currentTarget.dataset as any
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
