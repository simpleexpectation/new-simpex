const { venues } = require('../../data/mock')

Page({
  data: {
    venue: venues[0],
    pageReady: false,
    pageLeaving: false
  },
  onLoad(query) {
    const venue = venues.find((item) => item.id === query.id) || venues[0]
    this.setData({ venue })
  },
  onShow() {
    this.enterPage()
  },
  enterPage() {
    this.setData({ pageLeaving: false, pageReady: false })
    setTimeout(() => {
      this.setData({ pageReady: true })
    }, 20)
  }
})
