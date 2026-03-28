import { featuredEvent, officialEvents, venues } from '../../data/mock'

Page({
  data: {
    featuredEvent,
    officialEvents,
    venues
  },
  goEventDetail() {
    wx.navigateTo({ url: '/pages/event-detail/index?id=event-night-0322' })
  },
  goVenueDetail(e: WechatMiniprogram.BaseEvent) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({ url: `/pages/venue-detail/index?id=${id}` })
  }
})
