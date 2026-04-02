import { attendeeCards, presenceConversations, presenceEvent, presenceRooms } from '../../data/mock'

const buildGlyphs = (text: string, step = 0.12) =>
  Array.from(text).map((glyph, index) => ({
    glyph,
    isSpace: glyph === ' ',
    delay: `${(index * step).toFixed(2)}s`
  }))

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

const buildPresenceRoom = (conversation?: any) => {
  if (!conversation) return null
  if (conversation.status === 'recap') {
    return {
      conversationId: conversation.id,
      title: conversation.title,
      schedule: conversation.schedule,
      venue: conversation.venue,
      badge: '对话刚刚结束',
      prompt: '如果愿意，把这一刻留下一点点。24 小时后，这个房间会自然消失。',
      actionMode: 'recap',
      messages: [
        { id: `${conversation.id}-system-1`, type: 'system', text: '这场对话刚刚结束。' },
        { id: `${conversation.id}-system-2`, type: 'system', text: '如果愿意，现在可以写一句话，或者放一张照片。' }
      ]
    }
  }
  if (!conversation.roomReady || conversation.status !== 'confirmed') return null
  const staticRoom = presenceRooms.find((item) => item.conversationId === conversation.id)
  if (staticRoom) {
    return {
      ...staticRoom,
      actionMode: 'chat'
    }
  }

  return {
    conversationId: conversation.id,
    title: conversation.title,
    schedule: conversation.schedule,
    venue: conversation.venue,
    badge: '活动前同行房',
    prompt: '开始前先轻轻聊几句，开场后这里会自动静默。',
    actionMode: 'chat',
    messages: [
      { id: `${conversation.id}-system-1`, type: 'system', text: '这场对话已开放同行房。' }
    ]
  }
}

const buildChatRooms = (conversations: any[]) =>
  conversations
    .filter((item) => (item.roomReady && item.status === 'confirmed') || item.status === 'recap')
    .map((item) => ({
      id: item.id,
      title: item.title,
      meta: `${item.schedule} · ${item.venue}`
    }))

const buildCurrentRoom = (conversations: any[], conversationId?: string) =>
  buildPresenceRoom(findConversationById(conversations, conversationId)) ||
  buildPresenceRoom(conversations.find((item) => item.status === 'recap')) ||
  buildPresenceRoom(conversations.find((item) => item.roomReady && item.status === 'confirmed'))

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
    presenceEvent,
    presenceConversations: initialPresenceConversations,
    chatRooms: buildChatRooms(initialPresenceConversations),
    activeSubtab: 'presence',
    currentRoom: buildCurrentRoom(initialPresenceConversations, initialSelectedConversationId),
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
      activeSubtab: 'presence',
      currentRoom: buildCurrentRoom(this.data.presenceConversations, this.data.selectedConversationId)
    })
    this.syncTabBar(this.data.presencePhase)
    setTimeout(() => { this.setData({ pageReady: true }) }, 20)
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
    this.setData({
      selectedConversationId: conversationId,
      activeSubtab: 'chat',
      currentRoom: buildCurrentRoom(this.data.presenceConversations, conversationId)
    })
  },
  switchSubtab(e: WechatMiniprogram.BaseEvent) {
    const key = e.currentTarget.dataset.key as string
    if (!key || key === this.data.activeSubtab) return
    if (key === 'chat') {
      const currentRoom = buildCurrentRoom(this.data.presenceConversations, this.data.selectedConversationId)
      this.setData({
        activeSubtab: 'chat',
        currentRoom
      })
      return
    }
    this.setData({ activeSubtab: 'presence' })
  },
  selectConversation(e: WechatMiniprogram.BaseEvent) {
    const conversationId = e.currentTarget.dataset.id as string
    if (!conversationId) return
    this.setData({
      selectedConversationId: conversationId,
      currentRoom: buildCurrentRoom(this.data.presenceConversations, conversationId)
    })
  },
  selectChatRoom(e: WechatMiniprogram.BaseEvent) {
    const conversationId = e.currentTarget.dataset.id as string
    if (!conversationId) return
    this.setData({
      selectedConversationId: conversationId,
      currentRoom: buildCurrentRoom(this.data.presenceConversations, conversationId)
    })
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
      chatRooms: buildChatRooms(presenceConversations),
      selectedConversationId: conversationId,
      currentRoom: buildCurrentRoom(presenceConversations, conversationId)
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
      chatRooms: buildChatRooms(presenceConversations),
      selectedConversationId: conversationId,
      currentRoom: buildCurrentRoom(presenceConversations, conversationId)
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
      chatRooms: buildChatRooms(presenceConversations),
      selectedConversationId: presenceConversations[0]?.id || this.data.selectedConversationId,
      currentRoom: buildCurrentRoom(presenceConversations, presenceConversations[0]?.id),
      activeSubtab: 'presence',
      presencePhase: 'before',
      enteringImmersive: false,
      showPassSheet: false,
      showRosterSheet: false
    })
    this.syncTabBar('before')
  },
  createMoment() {
    wx.showToast({ title: '下一步接入“自我事件”', icon: 'none' })
  }
})
