import { bubbles } from '../../data/mock'

Page({
  data: {
    bubbles,
    selectedBubble: bubbles[2]
  },
  selectBubble(e: WechatMiniprogram.CustomEvent) {
    const id = e.currentTarget.dataset.id as string
    const selectedBubble = bubbles.find((item) => item.id === id) || bubbles[0]
    this.setData({ selectedBubble })
  },
  nudge() {
    wx.showToast({
      title: '已轻触提醒',
      icon: 'none'
    })
  }
})
