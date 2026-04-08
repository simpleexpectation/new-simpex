Page({
  data: {
    source: 'profile',
    mode: 'unlock',
    pageReady: false,
    pageLeaving: false,
    statusBarHeight: 20,
    quota: {
      remaining: 12,
      total: 30
    },
    inviteCode: 'SIMPEX-2026',
    membershipBenefits: [
      { icon: '◉', title: '每月解锁全部 60 场深度对话，不限话题类型' },
      { icon: '✦', title: '优先匹配同频成员，响应时间缩短至 4 小时内' },
      { icon: '◈', title: '专属黑洞模式：进入对话后屏蔽所有外部通知' },
      { icon: '⌖', title: '每月 3 次主动发起权，可自定义话题和规则' },
      { icon: '◯', title: '对话结束后获得 AI 提炼的「话题 DNA」卡片' }
    ],
    cobuildBenefits: [
      { icon: '◉', title: '核心动作是邀请同频好友，而不是拉泛流量' },
      { icon: '✦', title: '每成功邀请一位完成月度订阅，你会获得25%对应的持续关键回馈' },
      { icon: '◈', title: '共建者可获得月卡权益与长期共建身份标识' },
      { icon: '⌖', title: '面向已被验证的高质量参与者、发起者与 KOL 开放' }
    ]
  },
  onLoad(query: Record<string, string>) {
    const systemInfo = wx.getSystemInfoSync()
    this.setData({
      source: query.source || 'profile',
      mode: query.mode === 'cobuild' ? 'cobuild' : 'unlock',
      statusBarHeight: systemInfo.statusBarHeight || 20
    })
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
  goBack() {
    this.setData({ pageLeaving: true })
    setTimeout(() => {
      wx.navigateBack()
    }, 180)
  },
  startMembershipPurchase() {
    wx.showToast({
      title: '这里接 99 元购买流程',
      icon: 'none'
    })
  },
  openInviteFriends() {
    this.setData({ pageLeaving: true })
    setTimeout(() => {
      wx.navigateTo({ url: '/pages/invite-friends/index?source=access-center' })
    }, 180)
  },
  inviteFriend() {
    wx.showToast({
      title: this.data.mode === 'cobuild' ? '这里接共建邀请' : '这里接微信邀请',
      icon: 'none'
    })
  },
  copyInviteCode() {
    wx.setClipboardData({
      data: this.data.inviteCode
    })
  }
})
