const { featuredEvent } = require('../../data/mock')

Page({
  data: {
    event: featuredEvent,
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
  enterBlackhole() {
    this.setData({ pageLeaving: true })
    setTimeout(() => {
      wx.switchTab({ url: '/pages/blackhole/index' })
    }, 180)
  }
})
