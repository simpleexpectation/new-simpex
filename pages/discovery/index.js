const { featuredEvent, officialEvents, venues } = require('../../data/mock')

Page({
  data: {
    featuredEvent,
    officialEvents,
    pageReady: false,
    pageLeaving: false,
    dates: [
      { week: '一', day: '16' },
      { week: '二', day: '17' },
      { week: '三', day: '18' },
      { week: '四', day: '19' },
      { week: '五', day: '20', active: true },
      { week: '六', day: '21' },
      { week: '日', day: '22', warm: true }
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
      tabBar.sync('/pages/discovery/index', false)
    }
  },
  goEventDetail(e) {
    const { id } = (e && e.currentTarget && e.currentTarget.dataset) || {}
    this.setData({ pageLeaving: true })
    setTimeout(() => {
      wx.navigateTo({ url: `/pages/event-detail/index?id=${id || 'event-night-0322'}` })
    }, 180)
  }
})
