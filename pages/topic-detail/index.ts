const backend = require('../../lib/backend/index') as typeof import('../../lib/backend/index')

Page({
  data: {
    topic: null as any,
    statusBarHeight: 0,
    isSubmitting: false,
    backendMode: 'mock',
    pageReady: false,
    pageLeaving: false
  },
  async onLoad(options: Record<string, string>) {
    const info = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync()
    const id = options.id
    const result = await backend.fetchTopicDetail(id)
    this.setData({
      topic: result.topic,
      statusBarHeight: info.statusBarHeight || 0,
      backendMode: result.mode
    })
  },
  onShow() {
    this.setData({ pageLeaving: false, pageReady: false })
    setTimeout(() => { this.setData({ pageReady: true }) }, 20)
  },
  goBack() {
    wx.navigateBack()
  },
  async applyToJoin() {
    const topicId = this.data.topic?.id
    if (!topicId || this.data.isSubmitting) return
    this.setData({ isSubmitting: true })
    try {
      const result = await backend.applyToTopic(topicId)
      wx.showToast({ title: result.message, icon: 'none' })
    } finally {
      this.setData({ isSubmitting: false })
    }
  },
  goMemberCard(e: WechatMiniprogram.BaseEvent) {
    const { id } = e.currentTarget.dataset as any
    wx.navigateTo({ url: `/pages/person/index?id=${id}` })
  }
})
