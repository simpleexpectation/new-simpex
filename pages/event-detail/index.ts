import { featuredEvent } from '../../data/mock'

Page({
  data: {
    event: featuredEvent
  },
  enterBlackhole() {
    wx.switchTab({ url: '/pages/blackhole/index' })
  }
})
