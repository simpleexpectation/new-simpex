const { topics } = require('../../data/mock')

Page({
  data: {
    topic: null,
    statusBarHeight: 0,
    pageReady: false,
    pageLeaving: false
  },
  onLoad(options) {
    const info = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync()
    const id = options.id
    const topic = topics.find(function (t) { return t.id === id }) || topics[0]
    this.setData({
      topic: topic,
      statusBarHeight: info.statusBarHeight || 0
    })
  },
  onShow() {
    this.setData({ pageLeaving: false, pageReady: false })
    setTimeout(() => { this.setData({ pageReady: true }) }, 20)
  },
  goBack() {
    wx.navigateBack()
  },
  goMemberCard(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({ url: `/pages/profile/index?memberId=${id}` })
  }
})
