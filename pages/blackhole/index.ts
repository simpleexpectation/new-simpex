import { bubbles } from '../../data/mock'

Page({
  data: {
    bubbles,
    selectedBubble: null as (typeof bubbles[0]) | null,
    showCard: false,
    connected: true,
    pageReady: false,
    pageLeaving: false
  },
  onShow() {
    this.hideTabBar()
    this.setData({ pageLeaving: false, pageReady: false, showCard: false, selectedBubble: null })
    setTimeout(() => { this.setData({ pageReady: true }) }, 20)
  },
  toggleConnect() {
    const connected = !this.data.connected
    this.setData({ connected, showCard: false })
    wx.vibrateShort({ type: connected ? 'heavy' : 'light' })
  },
  hideTabBar() {
    const tabBar = this.getTabBar && this.getTabBar()
    if (tabBar && (tabBar as any).sync) {
      (tabBar as any).sync('/pages/blackhole/index', true)
    }
  },
  selectBubble(e: WechatMiniprogram.CustomEvent) {
    const id = e.currentTarget.dataset.id as string
    const selectedBubble = bubbles.find((item) => item.id === id) || bubbles[0]
    this.setData({ selectedBubble, showCard: true })
  },
  nudgeBubble(e: WechatMiniprogram.CustomEvent) {
    const id = e.currentTarget.dataset.id as string
    const bubble = bubbles.find((item) => item.id === id) || bubbles[0]
    this.setData({ selectedBubble: bubble, showCard: true })
    wx.vibrateShort({ type: 'medium' })
    setTimeout(() => {
      wx.showToast({ title: `已轻触 ${bubble.name}`, icon: 'none' })
    }, 120)
  },
  nudge() {
    const name = (this.data.selectedBubble as any)?.name || ''
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
