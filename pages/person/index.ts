const backend = require('../../lib/backend/index') as typeof import('../../lib/backend/index')

Page({
  data: {
    person: null as any,
    visibleEvents: [],
    selectedEvent: null as any,
    showEventModal: false,
    backendMode: 'mock',
    pageReady: false,
    pageLeaving: false
  },
  async onLoad(options: Record<string, string>) {
    const result = await backend.fetchPersonProfile(options.id)
    this.setData({
      person: result.person,
      visibleEvents: result.visibleEvents,
      backendMode: result.mode
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
  openEvent(e: WechatMiniprogram.BaseEvent) {
    const { id } = e.currentTarget.dataset as { id?: string }
    if (!id) return
    const selectedEvent = this.data.visibleEvents.find((item: any) => item.id === id) || null
    this.setData({
      selectedEvent,
      showEventModal: !!selectedEvent
    })
  },
  closeEventModal() {
    this.setData({
      selectedEvent: null,
      showEventModal: false
    })
  },
  connectFromEvent() {
    wx.showToast({ title: '这里接认识 TA', icon: 'none' })
  },
  resonateFromEvent() {
    wx.showToast({ title: '这里接共鸣互动', icon: 'none' })
  }
})
