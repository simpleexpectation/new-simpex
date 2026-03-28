const { featuredEvent } = require('../../data/mock')

Page({
  data: {
    event: featuredEvent,
    // 本月未签到次数（模拟数据，接真实 API 后替换）
    noShowCount: 2,
    showRsvpModal: false,
    pageReady: false,
    pageLeaving: false
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
