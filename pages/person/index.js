const { memberProfiles, myEvents } = require('../../data/mock')

const fallbackPerson = memberProfiles[0]

Page({
  data: {
    person: fallbackPerson,
    visibleEvents: myEvents.filter((item) => fallbackPerson.eventIds.includes(item.id)),
    selectedEvent: null,
    showEventModal: false,
    pageReady: false,
    pageLeaving: false
  },
  onLoad(options) {
    const person = memberProfiles.find((item) => item.id === options.id) || fallbackPerson
    const visibleEvents = myEvents.filter((item) => person.eventIds.includes(item.id))
    this.setData({ person, visibleEvents })
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
