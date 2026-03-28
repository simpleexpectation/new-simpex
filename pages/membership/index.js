Page({
  data: {
    pageReady: false,
    pageLeaving: false,
    membership: {
      plan: '999 全域会员',
      renewal: '2026.04.21',
      perks: [
        '24 场官方核心局',
        '2 场跨领域派对',
        '实体 NFC 数字名片',
        '合作空间会员折扣',
        '签到后进入在场模式'
      ]
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
