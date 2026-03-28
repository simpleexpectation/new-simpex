const { venues } = require('../../data/mock')

Page({
  data: {
    venues,
    pageReady: false,
    pageLeaving: false
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
      tabBar.sync('/pages/card/index', false)
    }
  },
  goVenueDetail(e) {
    const { id } = e.currentTarget.dataset
    this.setData({ pageLeaving: true })
    setTimeout(() => {
      wx.navigateTo({ url: `/pages/venue-detail/index?id=${id}` })
    }, 180)
  }
})
