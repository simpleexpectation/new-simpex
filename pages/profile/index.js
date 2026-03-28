Page({
  data: {
    pageReady: false,
    pageLeaving: false,
    membership: {
      plan: '999 全域会员',
      renewal: '2026.04.21',
      perks: [
        '24 场官方局 + 2 场跨界派对',
        '实体 NFC 名片',
        '空间折扣与现场黑洞模式'
      ]
    },
    stats: [
      { label: '真实到场', value: '17', hint: '次' },
      { label: '深度对话', value: '31', hint: '场' },
      { label: '空间激活', value: '6', hint: '个' }
    ]
  },
  onShow() {
    this.showTabBar()
    this.enterPage()
  },
  enterPage() {
    this.setData({ pageLeaving: false, pageReady: false })
    setTimeout(() => {
      this.setData({ pageReady: true })
    }, 20)
  },
  showTabBar() {
    const tabBar = this.getTabBar && this.getTabBar()
    if (tabBar && tabBar.sync) {
      tabBar.sync('/pages/profile/index', false)
    }
  },
  openMembership() {
    this.setData({ pageLeaving: true })
    setTimeout(() => {
      wx.navigateTo({ url: '/pages/membership/index' })
    }, 180)
  }
})
