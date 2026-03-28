const { featuredEvent } = require('../../data/mock')

Page({
  data: {
    event: featuredEvent,
    noShowCount: 2,
    showRsvpModal: false,
    statusBarHeight: 0,
    pageReady: false,
    pageLeaving: false
  },
  onLoad() {
    const info = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync()
    this.setData({ statusBarHeight: info.statusBarHeight || 0 })
  },
  onShow() {
    this.enterPage()
  },
  enterPage() {
    this.setData({ pageLeaving: false, pageReady: false })
    setTimeout(() => { this.setData({ pageReady: true }) }, 20)
  },
  goBack() {
    wx.navigateBack()
  },
  openRsvpModal() {
    this.setData({ showRsvpModal: true })
  },
  closeRsvpModal() {
    this.setData({ showRsvpModal: false })
  },
  confirmRsvp() {
    this.setData({ showRsvpModal: false })
    wx.showToast({ title: '预约成功', icon: 'success', duration: 1800 })
  },
  enterBlackhole() {
    this.setData({ pageLeaving: true })
    setTimeout(() => {
      wx.switchTab({ url: '/pages/blackhole/index' })
    }, 180)
  }
})
