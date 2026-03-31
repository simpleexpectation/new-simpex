const { topics, venues } = require('../../data/mock')

const sortTopics = (list) => [...list].sort((a, b) => new Date(a.dateKey).getTime() - new Date(b.dateKey).getTime())

Page({
  data: {
    venue: venues[0],
    venueTopics: [],
    venueTodayMood: '',
    statusBarHeight: 44,
    pageReady: false,
    pageLeaving: false
  },
  onLoad(query) {
    const venue = venues.find((item) => item.id === query.id) || venues[0]
    const venueTopics = sortTopics(topics.filter((item) => item.venueId === venue.id))
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
    this.enterPage()
  },
  enterPage() {
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
  goTopicDetail(e) {
    const { id } = e.currentTarget.dataset
    if (!id) return
    this.setData({ pageLeaving: true })
    setTimeout(() => {
      wx.navigateTo({ url: `/pages/topic-detail/index?id=${id}` })
    }, 180)
  }
})
