const unlockSlots = [
  { key: 'self', label: '你自己', status: '已点亮', active: true },
  { key: 'friend-a', label: '好友 #1', status: '等待中', active: false },
  { key: 'friend-b', label: '好友 #2', status: '等待中', active: false }
]

Page({
  data: {
    pageReady: false,
    pageLeaving: false,
    statusBarHeight: 20,
    inviteCode: 'SIMPEX-2026',
    unlockSlots
  },
  onLoad() {
    const systemInfo = wx.getSystemInfoSync()
    this.setData({
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
  inviteFriend() {
    wx.showToast({
      title: '这里接微信邀请',
      icon: 'none'
    })
  },
  copyInviteCode() {
    wx.setClipboardData({
      data: this.data.inviteCode
    })
  }
})
