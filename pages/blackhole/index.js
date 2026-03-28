const { bubbles } = require('../../data/mock')

Page({
  data: {
    bubbles,
    selectedBubble: bubbles[2],
    pageReady: false,
    pageLeaving: false
  },
  onShow() {
    this.hideTabBar()
    this.enterPage()
  },
  enterPage() {
    this.setData({ pageLeaving: false, pageReady: false })
    setTimeout(() => {
      this.setData({ pageReady: true })
    }, 20)
  },
  hideTabBar() {
    const tabBar = this.getTabBar && this.getTabBar()
    if (tabBar && tabBar.sync) {
      tabBar.sync('/pages/blackhole/index', true)
    }
  },
  viewCard() {
    this.setData({ pageLeaving: true })
    setTimeout(() => {
      wx.switchTab({ url: '/pages/profile/index' })
    }, 180)
  },
  selectBubble(e) {
    const { id } = e.currentTarget.dataset
    const selectedBubble = bubbles.find((item) => item.id === id) || bubbles[0]
    this.setData({ selectedBubble })
  },
  nudge() {
    wx.showToast({
      title: '已轻触提醒',
      icon: 'none'
    })
  },
  endSession() {
    this.setData({ pageLeaving: true })
    setTimeout(() => {
      wx.switchTab({ url: '/pages/discovery/index' })
    }, 180)
  }
})
