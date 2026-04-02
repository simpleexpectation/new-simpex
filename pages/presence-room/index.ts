import { presenceRooms } from '../../data/mock'

const defaultRoom = presenceRooms[0]

Page({
  data: {
    room: defaultRoom,
    pageReady: false,
    pageLeaving: false,
    draft: ''
  },
  onLoad(options: Record<string, string>) {
    const room = presenceRooms.find((item) => item.conversationId === options.id) || defaultRoom
    this.setData({ room })
  },
  onShow() {
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
  onDraftInput(e: WechatMiniprogram.BaseEvent) {
    this.setData({ draft: e.detail.value })
  },
  sendDraft() {
    wx.showToast({
      title: '先做同行房体验，真实发言后面接入',
      icon: 'none'
    })
  }
})
