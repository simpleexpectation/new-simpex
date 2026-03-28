import { venues } from '../../data/mock'

Page({
  data: {
    venue: venues[0]
  },
  onLoad(query: Record<string, string>) {
    const venue = venues.find((item) => item.id === query.id) || venues[0]
    this.setData({ venue })
  }
})
