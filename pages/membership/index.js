Page({
  data: {
    pageReady: false,
    pageLeaving: false,
    membership: {
      plan: '真实发生月卡',
      price: '99',
      billing: '按月订阅，随时关闭',
      perks: [
        '本月可解锁 60 场深度对话',
        '优先进入真实发生主题局',
        '发起活动时可额外带 1 位站外好友参与',
        '合作空间与线下局折扣',
        '签到后进入在场模式'
      ]
    },
    limitedQuota: {
      remaining: 37,
      total: 100
    },
    inviteProgram: {
      buttonText: '邀请 2 位好友，限时 0 元开启',
      description: '先不急着付款。如果你愿意带两位同频朋友一起进入，这个月可以直接 0 元开启。'
    }
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
  startMembershipPurchase() {
    wx.showToast({
      title: '这里接 99 元购买流程',
      icon: 'none'
    })
  },
  startInviteUnlock() {
    this.setData({ pageLeaving: true })
    setTimeout(() => {
      wx.navigateTo({ url: '/pages/invite-unlock/index?source=membership' })
    }, 180)
  },
  goBack() {
    this.setData({ pageLeaving: true })
    setTimeout(() => {
      wx.navigateBack()
    }, 180)
  },
  goProfile() {
    this.setData({ pageLeaving: true })
    setTimeout(() => {
      wx.switchTab({ url: '/pages/profile/index' })
    }, 180)
  }
})
