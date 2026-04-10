import { attendeeCards, presenceConversations, presenceEvent, venues } from '../../data/mock'

const buildGlyphs = (text: string, step = 0.12) =>
  Array.from(text).map((glyph, index) => ({
    glyph,
    isSpace: glyph === ' ',
    delay: `${(index * step).toFixed(2)}s`
  }))

const isHorizontalSwipe = (startX: number, startY: number, endX: number, endY) => {
  const dx = endX - startX
  const dy = endY - startY
  return Math.abs(dx) > 72 && Math.abs(dx) > Math.abs(dy) * 1.35
}

const sortPresenceConversations = (conversations: any[]) => {
  const recap = conversations.filter((item) => item.status === 'recap')
  const rest = conversations.filter((item) => item.status !== 'recap')
  return [...recap, ...rest].slice(0, 4)
}

const initialPresenceConversations = sortPresenceConversations(presenceConversations)
const initialSelectedConversationId =
  initialPresenceConversations.find((item) => item.status !== 'recap')?.id || initialPresenceConversations[0].id

const findConversationById = (conversations: any[], conversationId?: string) =>
  conversations.find((item) => item.id === conversationId) || null

const toRecapConversation = (conversation: any) => {
  const scheduleTail = conversation.schedule.includes('·')
    ? conversation.schedule.split('·').slice(1).join('·').trim()
    : conversation.schedule

  return {
    ...conversation,
    role: 'ended',
    roleLabel: '刚刚结束',
    status: 'recap',
    statusLabel: '写此刻',
    statusHint: '这一刻已经过去了。如果愿意，留一句话或一张照片，让它成为下次相遇前的期待。',
    autoConfirmHint: '你留下的内容，会在下次对话前被温柔展示。',
    ticketReady: false,
    schedule: `刚刚结束 · ${scheduleTail}`
  }
}

const updateConversation = (conversations: any[], conversationId: string, updater: (conversation: any) => any) =>
  sortPresenceConversations(
    conversations.map((conversation) => (
      conversation.id === conversationId ? updater(conversation) : conversation
    ))
  )

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
    statusBarHeight: 44,
    activeTopTab: 'presence',
    activeTopTabIndex: 0,
    presenceEvent,
    venues,
    presenceConversations: initialPresenceConversations,
    attendeeCards,
    immersiveCopyCn: buildGlyphs('此刻只需要慢慢在场', 0.1),
    immersiveCopyEn: buildGlyphs('Just be here in this moment', 0.08),
    qrMatrix,
    presencePhase: 'before',
    enteringImmersive: false,
    showPassSheet: false,
    showRosterSheet: false,
    selectedConversationId: initialSelectedConversationId,
    pageReady: false,
    pageLeaving: false
  },
  onLoad() {
    const info = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync()
    this.setData({
      statusBarHeight: info.statusBarHeight || 44
    })
  },
  onShow() {
    this.setData({
      pageLeaving: false,
      pageReady: false,
      enteringImmersive: false,
      showPassSheet: false,
      showRosterSheet: false,
      selectedConversationId: this.data.selectedConversationId
    })
    this.syncTabBar(this.data.presencePhase)
    setTimeout(() => { this.setData({ pageReady: true }) }, 20)
  },
  switchTopTab(e: WechatMiniprogram.BaseEvent) {
    const { tab } = e.currentTarget.dataset as any
    if (!tab) return
    this.setData({
      activeTopTab: tab,
      activeTopTabIndex: tab === 'spaces' ? 1 : 0
    })
  },
  onTopTabSectionChange(e: WechatMiniprogram.SwiperChange) {
    const index = e.detail.current
    this.setData({
      activeTopTabIndex: index,
      activeTopTab: index === 1 ? 'spaces' : 'presence'
    })
  },
  startTopTabSwipe(e: WechatMiniprogram.TouchEvent) {
    if (this.data.presencePhase === 'during' || this.data.showPassSheet || this.data.showRosterSheet) return
    const touch = e.touches[0]
    if (!touch) return
    ;(this as any).topTabSwipeStart = {
      x: touch.clientX,
      y: touch.clientY
    }
  },
  endTopTabSwipe(e: WechatMiniprogram.TouchEvent) {
    const start = (this as any).topTabSwipeStart
    const touch = e.changedTouches[0]
    ;(this as any).topTabSwipeStart = null
    if (!start || !touch) return

    if (!isHorizontalSwipe(start.x, start.y, touch.clientX, touch.clientY)) return
    const dx = touch.clientX - start.x
    if (dx < 0 && this.data.activeTopTab === 'presence') {
      this.setData({ activeTopTab: 'spaces' })
      return
    }
    if (dx > 0 && this.data.activeTopTab === 'spaces') {
      this.setData({ activeTopTab: 'presence' })
    }
  },
  cancelTopTabSwipe() {
    ;(this as any).topTabSwipeStart = null
  },
  enterImmersive(e: WechatMiniprogram.BaseEvent) {
    if (this.data.enteringImmersive) return
    const conversationId = e.currentTarget.dataset.id as string
    this.setData({
      selectedConversationId: conversationId || this.data.selectedConversationId,
      enteringImmersive: true
    })
    setTimeout(() => {
      this.setData({
        enteringImmersive: false,
        presencePhase: 'during'
      })
      this.syncTabBar('during')
    }, 880)
  },
  exitImmersive() {
    this.setData({
      enteringImmersive: false,
      presencePhase: 'before'
    })
    this.syncTabBar('before')
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
  openPresenceRoom(e: WechatMiniprogram.BaseEvent) {
    const conversationId = e.currentTarget.dataset.id as string
    if (!conversationId) return
    const conversation = findConversationById(this.data.presenceConversations, conversationId)
    if (!conversation || !conversation.roomReady || conversation.status !== 'confirmed') return
    this.setData({ pageLeaving: true })
    setTimeout(() => {
      wx.navigateTo({ url: `/pages/presence-room/index?id=${conversationId}` })
    }, 180)
  },
  selectConversation(e: WechatMiniprogram.BaseEvent) {
    const conversationId = e.currentTarget.dataset.id as string
    if (!conversationId) return
    this.setData({ selectedConversationId: conversationId })
  },
  approveApplicant(e: WechatMiniprogram.BaseEvent) {
    const conversationId = e.currentTarget.dataset.id as string
    if (!conversationId) return
    const presenceConversations = updateConversation(this.data.presenceConversations, conversationId, (conversation) => ({
      ...conversation,
      status: 'confirmed',
      statusLabel: '已确认加入',
      statusHint: '你已同意这位申请者加入。这场对话现在已经进入待到场状态。',
      autoConfirmHint: '票据与同场名单已就绪。',
      ticketReady: true,
      roomReady: true
    }))

    this.setData({
      presenceConversations,
      selectedConversationId: conversationId
    })
    wx.showToast({ title: '已同意加入', icon: 'none' })
  },
  rejectApplicant(e: WechatMiniprogram.BaseEvent) {
    const conversationId = e.currentTarget.dataset.id as string
    if (!conversationId) return
    const presenceConversations = updateConversation(this.data.presenceConversations, conversationId, (conversation) => ({
      ...conversation,
      status: 'declined',
      statusLabel: '你已婉拒',
      statusHint: '你刚刚婉拒了这次申请。系统会继续为对方推荐别的相遇。',
      autoConfirmHint: '这条提醒会在稍后淡出列表。',
      ticketReady: false
    }))

    this.setData({
      presenceConversations,
      selectedConversationId: conversationId
    })
    wx.showToast({ title: '已暂不同意', icon: 'none' })
  },
  syncTabBar(phase?: string) {
    const tabBar = this.getTabBar && this.getTabBar()
    if (tabBar && (tabBar as any).sync) {
      ;(tabBar as any).sync('/pages/blackhole/index', phase === 'during')
    }
  },
  completeSession() {
    const presenceConversations = sortPresenceConversations(this.data.presenceConversations.map((conversation: any) =>
      conversation.id === this.data.selectedConversationId ? toRecapConversation(conversation) : conversation
    ))

    this.setData({
      presenceConversations,
      selectedConversationId: presenceConversations[0]?.id || this.data.selectedConversationId,
      presencePhase: 'before',
      enteringImmersive: false,
      showPassSheet: false,
      showRosterSheet: false
    })
    this.syncTabBar('before')
  },
  createMoment() {
    wx.showToast({ title: '下一步接入“自我事件”', icon: 'none' })
  },
  goVenueDetail(e: WechatMiniprogram.BaseEvent) {
    const { id } = e.currentTarget.dataset as any
    if (!id) return
    this.setData({ pageLeaving: true })
    setTimeout(() => {
      wx.navigateTo({ url: `/pages/venue-detail/index?id=${id}` })
    }, 180)
  },
  openVenueRecommend() {
    wx.showToast({ title: '下一步接入推荐空间提交流程', icon: 'none' })
  }
})
