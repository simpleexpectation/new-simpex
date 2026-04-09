const backend = require('../../lib/backend/index')

Page({
  data: {
    person: null,
    visibleEvents: [],
    selectedEvent: null,
    showEventModal: false,
    backendMode: 'mock',
    pageReady: false,
    pageLeaving: false
  },
  async onLoad(options) {
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
  openEvent(e) {
    const { id } = e.currentTarget.dataset
    if (!id) return
    const selectedEvent = this.data.visibleEvents.find((item) => item.id === id) || null
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
