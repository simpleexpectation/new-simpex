import { attendeeCards, bubbles, presenceConversations, presenceEvent, presencePhases, reflectionPrompts } from '../../data/mock'

const qrMatrix = [
  [1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1],
  [1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0],
  [0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0],
  [1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1]
]

Page({
  data: {
    presenceEvent,
    presencePhases,
    presenceConversations,
    attendeeCards,
    reflectionPrompts,
    qrMatrix,
    bubbles,
    presencePhase: 'before',
    showPassSheet: false,
    showRosterSheet: false,
    selectedConversationId: presenceConversations[0].id,
    selectedBubble: null as (typeof bubbles[0]) | null,
    showCard: false,
    connected: true,
    pageReady: false,
    pageLeaving: false
  },
  onShow() {
    this.setData({
      pageLeaving: false,
      pageReady: false,
      showCard: false,
      showPassSheet: false,
      showRosterSheet: false,
      selectedBubble: null,
      connected: true
    })
    this.syncTabBar(this.data.presencePhase)
    setTimeout(() => { this.setData({ pageReady: true }) }, 20)
  },
  switchPhase(e: WechatMiniprogram.BaseEvent) {
    const phase = e.currentTarget.dataset.phase as string
    if (!phase) return
    this.setData({
      presencePhase: phase,
      showCard: false,
      selectedBubble: null,
      connected: phase === 'during' ? this.data.connected : true
    })
    this.syncTabBar(phase)
  },
  enterImmersive() {
    this.setData({
      presencePhase: 'during',
      connected: true,
      showCard: false,
      selectedBubble: null
    })
    this.syncTabBar('during')
    wx.vibrateShort({ type: 'heavy' })
  },
  openPassSheet() {
    this.setData({ showPassSheet: true })
  },
  closePassSheet() {
    this.setData({ showPassSheet: false })
  },
  openRosterSheet(e: WechatMiniprogram.BaseEvent) {
    const conversationId = e.currentTarget.dataset.id as string
    this.setData({
      showRosterSheet: true,
      selectedConversationId: conversationId || this.data.selectedConversationId
    })
  },
  closeRosterSheet() {
    this.setData({ showRosterSheet: false })
  },
  selectConversation(e: WechatMiniprogram.BaseEvent) {
    const conversationId = e.currentTarget.dataset.id as string
    if (!conversationId) return
    this.setData({ selectedConversationId: conversationId })
  },
  toggleConnect() {
    const connected = !this.data.connected
    this.setData({ connected, showCard: false })
    wx.vibrateShort({ type: connected ? 'heavy' : 'light' })
  },
  syncTabBar(phase?: string) {
    const tabBar = this.getTabBar && this.getTabBar()
    if (tabBar && (tabBar as any).sync) {
      ;(tabBar as any).sync('/pages/blackhole/index', phase === 'during')
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
      wx.switchTab({ url: '/pages/card/index' })
    }, 180)
  },
  completeSession() {
    this.setData({
      presencePhase: 'after',
      connected: true,
      showPassSheet: false,
      showRosterSheet: false,
      showCard: false,
      selectedBubble: null
    })
    this.syncTabBar('after')
  },
  createMoment() {
    wx.showToast({ title: '下一步接入“自我事件”', icon: 'none' })
  }
})
