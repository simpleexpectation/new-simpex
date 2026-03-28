import { topics } from '../../data/mock'

Page({
  data: {
    topic: null as any,
    pageReady: false,
    pageLeaving: false
  },
  onLoad(options: Record<string, string>) {
    const id = options.id
    const topic = topics.find((t: any) => t.id === id) || topics[0]
    this.setData({ topic })
  },
  onShow() {
    this.setData({ pageLeaving: false, pageReady: false })
    setTimeout(() => { this.setData({ pageReady: true }) }, 20)
  },
  goMemberCard(e: WechatMiniprogram.BaseEvent) {
    const { id } = e.currentTarget.dataset as any
    wx.navigateTo({ url: `/pages/profile/index?memberId=${id}` })
  }
})
