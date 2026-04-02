const { attendeeCards, presenceConversations, presenceEvent } = require('../../data/mock')

const buildGlyphs = (text, step = 0.12) =>
  Array.from(text).map((glyph, index) => ({
    glyph,
    isSpace: glyph === ' ',
    delay: `${(index * step).toFixed(2)}s`
  }))

const sortPresenceConversations = (conversations) => {
  const recap = conversations.filter((item) => item.status === 'recap')
  const rest = conversations.filter((item) => item.status !== 'recap')
  return [...recap, ...rest].slice(0, 4)
}

const initialPresenceConversations = sortPresenceConversations(presenceConversations)
const initialSelectedConversationId =
  initialPresenceConversations.find((item) => item.status !== 'recap')?.id || initialPresenceConversations[0].id
const decoratePresenceConversation = (conversation) => {
  const common = {
    moodKeywords: '真诚、缓慢、可以停顿',
    whoYouMayMeet: '也愿意认真交换近况、不急着把答案说满的人'
  }
  if (conversation.status === 'confirmed' && conversation.role === 'applicant') {
    return {
      ...conversation,
      ...common,
      bridgeStateTitle: '你已进入这场对话',
      bridgeWhyYou: '因为你最近更在意那些“工作里的噪音之外，什么还能定义一个人”的问题，这场对话刚好会接住你。',
      bridgeSceneCopy: '今晚不急着给答案，更像一群人一起把最近真正卡住的事说清楚一点。',
      bridgeArrivalTip: '进门后右转靠窗长桌，提前 10 分钟到会更从容。找不到位置时，直接向店员说“Simpex 对话”。',
      bridgePrimaryAction: '看同行名片',
      bridgeSecondaryAction: '查看地址',
      bridgeStatusMeta: '状态已确认 · 到场即可开始'
    }
  }
  if (conversation.status === 'pending' && conversation.role === 'applicant') {
    return {
      ...conversation,
      ...common,
      bridgeStateTitle: '你已经在等待这场对话回应',
      bridgeWhyYou: '你最近的表达更偏“慢下来、重新找回节奏”，所以系统把你放进了这类更适合认真交换近况的对话里。',
      bridgeSceneCopy: '现在不需要你继续做什么，系统会先替你把这次相遇托住，等对方给出回应。',
      bridgeArrivalTip: '如果对方确认，这里会自动补齐地址、桌位和到场方式。你只需要保留一点点期待。',
      bridgePrimaryAction: '看同行名片',
      bridgeSecondaryAction: '查看状态',
      bridgeStatusMeta: '正在等待发起人点头'
    }
  }
  if (conversation.status === 'pending' && conversation.role === 'host') {
    return {
      ...conversation,
      ...common,
      bridgeStateTitle: '这场对话正在等你做最后确认',
      bridgeWhyYou: '因为这是你发起的对话，所以这里不仅要承接你的情绪，也要帮你快速完成这次邀请的决定。',
      bridgeSceneCopy: '如果你愿意，这场对话今晚就会慢慢成形。你不需要拉群，只需要决定要不要让对方进来。',
      bridgeArrivalTip: '确认后，这张卡会自动切换成到场指引和票据信息，不需要再做第二次承接。',
      bridgePrimaryAction: '先看数字名片',
      bridgeSecondaryAction: '查看详情',
      bridgeStatusMeta: '还有 1 位申请者在等待'
    }
  }
  if (conversation.status === 'confirmed' && conversation.role === 'host') {
    return {
      ...conversation,
      ...common,
      bridgeStateTitle: '这场对话已经成形',
      bridgeWhyYou: '你发起的这个问题，已经吸引到了愿意认真进入的人。现在最重要的不是继续扩散，而是把到场体验做好。',
      bridgeSceneCopy: '这会更像一场有温度的桌边相遇，而不是一场需要被热闹撑起来的群聊。',
      bridgeArrivalTip: '西湖边书店进门后上二层，靠内侧木桌。桌上会放一张开场问题卡，签到后自动进入在场。',
      bridgePrimaryAction: '看同行名片',
      bridgeSecondaryAction: '打开票据',
      bridgeStatusMeta: '人已凑齐 · 剩下的交给在场'
    }
  }
  if (conversation.status === 'declined') {
    return {
      ...conversation,
      ...common,
      bridgeStateTitle: '这场对话这次没有接住你',
      bridgeWhyYou: '不是你不适合表达，而只是这一次的人和状态没有刚好对上。',
      bridgeSceneCopy: '系统已经为你保留了同类型的推荐，所以你不用重新解释自己，也不用急着再开始一次。',
      bridgeArrivalTip: '可以先放下这场，稍后回来看看别的相遇。下一次，会更贴近你现在真正想进入的状态。',
      bridgePrimaryAction: '看推荐对象',
      bridgeSecondaryAction: '先收起',
      bridgeStatusMeta: '未匹配成功 · 但线索已保留'
    }
  }
  return {
    ...conversation,
    ...common,
    bridgeStateTitle: '这一刻已经过去了',
    bridgeWhyYou: '有些对话结束后，真正留下来的不是观点，而是你终于说出来的那一部分自己。',
    bridgeSceneCopy: '如果愿意，让今晚留下一点痕迹，它会在下一次相遇前轻轻提醒别人你曾经如何在场。',
    bridgeArrivalTip: '一句话或一张照片就够了，不需要完整复盘。',
    bridgePrimaryAction: '写一句话',
    bridgeSecondaryAction: '放一张照片',
    bridgeStatusMeta: '24h 内仍可留痕'
  }
}
const buildPresenceConversations = (conversations) =>
  sortPresenceConversations(conversations).map(decoratePresenceConversation)

const toRecapConversation = (conversation) => {
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

const updateConversation = (conversations, conversationId, updater) =>
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
    presenceEvent,
    presenceConversations: buildPresenceConversations(initialPresenceConversations),
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
  onShow() {
    this.setData({
      pageLeaving: false,
      pageReady: false,
      enteringImmersive: false,
      showPassSheet: false,
      showRosterSheet: false
    })
    this.syncTabBar(this.data.presencePhase)
    setTimeout(() => { this.setData({ pageReady: true }) }, 20)
  },
  enterImmersive(e) {
    if (this.data.enteringImmersive) return
    const { id } = e.currentTarget.dataset
    this.setData({
      selectedConversationId: id || this.data.selectedConversationId,
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
  openRosterSheet(e) {
    const { id } = e.currentTarget.dataset
    this.setData({
      showRosterSheet: true,
      selectedConversationId: id || this.data.selectedConversationId
    })
  },
  closeRosterSheet() {
    this.setData({ showRosterSheet: false })
  },
  selectConversation(e) {
    const { id } = e.currentTarget.dataset
    if (!id) return
    this.setData({ selectedConversationId: id })
  },
  approveApplicant(e) {
    const { id } = e.currentTarget.dataset
    if (!id) return
    const presenceConversations = updateConversation(this.data.presenceConversations, id, (conversation) => ({
      ...conversation,
      status: 'confirmed',
      statusLabel: '已确认加入',
      statusHint: '你已同意这位申请者加入。这场对话现在已经进入待到场状态。',
      autoConfirmHint: '票据与同场名单已就绪。',
      ticketReady: true
    }))

    this.setData({
      presenceConversations: buildPresenceConversations(presenceConversations),
      selectedConversationId: id
    })
    wx.showToast({ title: '已同意加入', icon: 'none' })
  },
  rejectApplicant(e) {
    const { id } = e.currentTarget.dataset
    if (!id) return
    const presenceConversations = updateConversation(this.data.presenceConversations, id, (conversation) => ({
      ...conversation,
      status: 'declined',
      statusLabel: '你已婉拒',
      statusHint: '你刚刚婉拒了这次申请。系统会继续为对方推荐别的相遇。',
      autoConfirmHint: '这条提醒会在稍后淡出列表。',
      ticketReady: false
    }))

    this.setData({
      presenceConversations: buildPresenceConversations(presenceConversations),
      selectedConversationId: id
    })
    wx.showToast({ title: '已暂不同意', icon: 'none' })
  },
  syncTabBar(phase) {
    const tabBar = this.getTabBar && this.getTabBar()
    if (tabBar && tabBar.sync) {
      tabBar.sync('/pages/blackhole/index', phase === 'during')
    }
  },
  completeSession() {
    const presenceConversations = sortPresenceConversations(this.data.presenceConversations.map((conversation) =>
      conversation.id === this.data.selectedConversationId ? toRecapConversation(conversation) : conversation
    ))

    this.setData({
      presenceConversations: buildPresenceConversations(presenceConversations),
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
  }
})
