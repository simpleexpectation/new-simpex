import { topics, venues } from '../../data/mock'

const sortTopics = (list: any[]) => [...list].sort((a, b) => new Date(a.dateKey).getTime() - new Date(b.dateKey).getTime())

Page({
  data: {
    venue: venues[0],
    venueTopics: [] as any[],
    venueTodayMood: '',
    statusBarHeight: 44,
    pageReady: false,
    pageLeaving: false
  },
  onLoad(query: Record<string, string>) {
    const venue = venues.find((item) => item.id === query.id) || venues[0]
    const venueTopics = sortTopics(topics.filter((item: any) => item.venueId === venue.id))
    const venueTodayMood = `今天${venue.mood}`
    const systemInfo = wx.getSystemInfoSync()
    this.setData({
      venue,
      venueTopics,
      venueTodayMood,
      statusBarHeight: systemInfo.statusBarHeight || 44
    })
  },
  onShow() {
    this.setData({ pageLeaving: false, pageReady: false })
    setTimeout(() => {
      this.setData({ pageReady: true })
    }, 20)
  },
  goBack() {
    const pages = getCurrentPages()
    if (pages.length > 1) {
      wx.navigateBack()
      return
    }
    wx.switchTab({ url: '/pages/card/index' })
  },
  goTopicDetail(e: WechatMiniprogram.BaseEvent) {
    const { id } = e.currentTarget.dataset as any
    if (!id) return
    this.setData({ pageLeaving: true })
    setTimeout(() => {
      wx.navigateTo({ url: `/pages/topic-detail/index?id=${id}` })
    }, 180)
  }
})
