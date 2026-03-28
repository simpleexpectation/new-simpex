import { venues, topics } from '../../data/mock'

Page({
  data: {
    venues,
    topics,
    activeTab: 'topics',
    pageReady: false,
    pageLeaving: false
  },
  onShow() {
    this.showTabBar()
    this.enterPage()
  },
  enterPage() {
    this.setData({ pageLeaving: false, pageReady: false })
    setTimeout(() => { this.setData({ pageReady: true }) }, 20)
  },
  showTabBar() {
    const tabBar = this.getTabBar && this.getTabBar() as any
    if (tabBar && tabBar.sync) tabBar.sync('/pages/card/index', false)
  },
  switchTab(e: WechatMiniprogram.BaseEvent) {
    const tab = (e.currentTarget.dataset as any).tab
    this.setData({ activeTab: tab })
  },
  goTopicDetail(e: WechatMiniprogram.BaseEvent) {
    const { id } = e.currentTarget.dataset as any
    this.setData({ pageLeaving: true })
    setTimeout(() => {
      wx.navigateTo({ url: `/pages/topic-detail/index?id=${id}` })
    }, 180)
  },
  joinTopic() {
    // 阻止冒泡已用 catchtap，此处仅占位
  },
  goVenueDetail(e: WechatMiniprogram.BaseEvent) {
    const { id } = e.currentTarget.dataset as any
    this.setData({ pageLeaving: true })
    setTimeout(() => {
      wx.navigateTo({ url: `/pages/venue-detail/index?id=${id}` })
    }, 180)
  }
})
