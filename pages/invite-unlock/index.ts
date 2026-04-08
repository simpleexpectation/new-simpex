const unlockSlots = [
  { key: 'self', label: '你自己', status: '已点亮', active: true },
  { key: 'friend-a', label: '好友 #1', status: '等待中', active: false },
  { key: 'friend-b', label: '好友 #2', status: '等待中', active: false }
]

const cobuildSlots = [
  { key: 'self', label: '你自己', status: '已验证', active: true },
  { key: 'friend-a', label: '共建伙伴 #1', status: '待加入', active: false },
  { key: 'friend-b', label: '共建伙伴 #2', status: '待加入', active: false }
]

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
    ],
    unlockSlots,
    cobuildSlots,
    unlockFriends: [
      { initial: 'M', name: 'Mia', note: '你们上次在「城市游牧」话题中相遇' },
      { initial: 'A', name: 'Aki', note: '她最近也在关注如何把焦虑说完整' }
    ],
    cobuildFriends: [
      { initial: 'W', name: 'Waytoagi 社群主理人', note: '适合共同带入高质量 AI 学习与分享人群' },
      { initial: 'L', name: '良渚在地发起者', note: '适合一起把良渚区域里的同频关系带进来' }
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
  jumpToInviteSection() {
    wx.pageScrollTo({
      selector: '#invite-section',
      duration: 280
    })
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
