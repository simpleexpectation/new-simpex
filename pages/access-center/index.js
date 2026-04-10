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
    selectedPlanKey: 'week',
    planOptions: [
      {
        key: 'week',
        badge: 'TRY FIRST',
        title: '真实发生周卡',
        price: '49',
        billing: '/ 周',
        copy: '7 天轻量体验，先试试看适不适合你'
      },
      {
        key: 'month',
        badge: 'MONTHLY ACCESS',
        title: '真实发生月卡',
        price: '99',
        billing: '/ 月',
        copy: '到期前 3 天提醒，随时可取消续费'
      }
    ],
    activePlan: {
      key: 'week',
      badge: 'TRY FIRST',
      title: '真实发生周卡',
      price: '49',
      billing: '/ 周',
      copy: '7 天轻量体验，先试试看适不适合你'
    },
    inviteCode: 'SIMPEX-2026',
    membershipBenefitsByPlan: {
      week: [
        { icon: '◉', title: '7 天内解锁 8 场精选真实对话，含线上活动入口' },
        { icon: '✦', title: '第一次进入的人可以更低成本地试一周' },
        { icon: '◈', title: '保留一次主动发起权，先试着发起一场' }
      ],
      month: [
        { icon: '◉', title: '每月解锁全部 60 场深度对话，不限话题类型' },
        { icon: '✦', title: '优先匹配同频成员，响应时间缩短至 4 小时内' },
        { icon: '◈', title: '专属黑洞模式：进入对话后屏蔽所有外部通知' },
        { icon: '⌖', title: '每月 3 次主动发起权，可自定义话题和规则' },
        { icon: '◯', title: '对话结束后获得 AI 提炼的「话题 DNA」卡片' }
      ]
    },
    activeBenefits: [
      { icon: '◉', title: '7 天内解锁 8 场精选真实对话，含线上活动入口' },
      { icon: '✦', title: '第一次进入的人可以更低成本地试一周' },
      { icon: '◈', title: '保留一次主动发起权，先试着发起一场' }
    ],
    cobuildBenefits: [
      { icon: '◉', title: '核心动作是邀请同频好友，而不是拉泛流量' },
      { icon: '✦', title: '每成功邀请一位完成月度订阅，你会获得25%对应的持续关键回馈' },
      { icon: '◈', title: '共建者可获得月卡权益与长期共建身份标识' },
      { icon: '⌖', title: '面向已被验证的高质量参与者、发起者与 KOL 开放' }
    ]
  },
  onLoad(query) {
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
  selectPlan(e) {
    const { key } = e.currentTarget.dataset || {}
    if (!key) return
    const activePlan = this.data.planOptions.find((item) => item.key === key) || this.data.planOptions[0]
    const activeBenefits = this.data.membershipBenefitsByPlan[key] || this.data.membershipBenefitsByPlan.week
    this.setData({
      selectedPlanKey: key,
      activePlan,
      activeBenefits
    })
  },
  goBack() {
    this.setData({ pageLeaving: true })
    setTimeout(() => {
      wx.navigateBack()
    }, 180)
  },
  startMembershipPurchase() {
    wx.showToast({
      title: `这里接 ${this.data.activePlan.price} 元购买流程`,
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
