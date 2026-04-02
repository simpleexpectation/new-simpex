const initialSlots = [
  { key: 'self', label: '你自己', status: '已点亮', active: true },
  { key: 'friend-a', label: '好友 A', status: '待激活', active: false },
  { key: 'friend-b', label: '好友 B', status: '待激活', active: false }
]

Page({
  data: {
    source: 'membership',
    pageReady: false,
    pageLeaving: false,
    quota: {
      remaining: 37,
      total: 100
    },
    slots: initialSlots,
    inviteCode: 'SIMPEX-REAL-37',
    invitedFriends: [
      { name: '好友 A', state: '等待接受', note: '已发送邀请链接，24 小时内有效' },
      { name: '好友 B', state: '尚未发送', note: '再邀请 1 位，就能解锁本月月卡' }
    ]
  },
  onLoad(query) {
    this.setData({
      source: query.source || 'membership'
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
  inviteFriend(e) {
    const { index } = e.currentTarget.dataset
    if (index === undefined) return
    const invitedFriends = this.data.invitedFriends.map((item, idx) => {
      if (idx !== index) return item
      return {
        ...item,
        state: '已发送邀请',
        note: '邀请已生成，等对方完成注册后自动点亮'
      }
    })
    wx.showToast({
      title: '这里接微信分享',
      icon: 'none'
    })
    this.setData({ invitedFriends })
  },
  copyInviteCode() {
    wx.setClipboardData({
      data: this.data.inviteCode
    })
  }
})
