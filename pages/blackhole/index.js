const { bubbles } = require('../../data/mock')

Page({
  data: {
    bubbles,
    selectedBubble: null,
    showCard: false,
    pageReady: false,
    pageLeaving: false
  },
  onShow() {
    this.hideTabBar()
    this.setData({ pageLeaving: false, pageReady: false, showCard: false, selectedBubble: null })
    setTimeout(() => { this.setData({ pageReady: true }) }, 20)
  },
  hideTabBar() {
    const tabBar = this.getTabBar && this.getTabBar()
    if (tabBar && tabBar.sync) {
      tabBar.sync('/pages/blackhole/index', true)
    }
  },
  selectBubble(e) {
    const { id } = e.currentTarget.dataset
    const selectedBubble = bubbles.find((item) => item.id === id) || bubbles[0]
    this.setData({ selectedBubble, showCard: true })
  },
  nudgeBubble(e) {
    const { id } = e.currentTarget.dataset
    const bubble = bubbles.find((item) => item.id === id) || bubbles[0]
    this.setData({ selectedBubble: bubble, showCard: true })
    wx.vibrateShort({ type: 'medium' })
    setTimeout(() => {
      wx.showToast({ title: `已轻触 ${bubble.name}`, icon: 'none' })
    }, 120)
  },
  nudge() {
    const name = this.data.selectedBubble?.name || ''
    wx.vibrateShort({ type: 'medium' })
    this.setData({ showCard: false })
    setTimeout(() => {
      wx.showToast({ title: `已轻触 ${name}`, icon: 'none' })
    }, 120)
  },
  closeCard() {
    this.setData({ showCard: false })
  },
  viewCard() {
    this.setData({ pageLeaving: true, showCard: false })
    setTimeout(() => {
      wx.switchTab({ url: '/pages/profile/index' })
    }, 180)
  },
  endSession() {
    this.setData({ pageLeaving: true, showCard: false })
    setTimeout(() => {
      wx.switchTab({ url: '/pages/discovery/index' })
    }, 180)
  }
})
