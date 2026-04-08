const promptChips = ['最近的状态', '想聊的方向', '一个问题', '今天的感受']

const defaultDraft = '我最近想聊聊 AI 为什么一边让人更高效，一边也更疲惫。'

const buildAutofillPayload = (draft: string) => {
  const raw = draft.trim() || defaultDraft
  const online = /AI|线上|远程|工具|互联网|产品|技术/.test(raw)

  return {
    topic: raw.includes('在场')
      ? '真正的在场'
      : raw.includes('AI')
        ? 'AI 让人更高效了，为什么也更疲惫了？'
        : '一个值得认真聊聊的问题',
    reason: raw.includes('AI')
      ? '我想聊聊一种越来越明显的体感：当 AI 让一切更高效之后，人为什么反而更容易分散、疲惫，甚至更难真正进入工作与交流。'
      : '我想从一个最近反复想到的状态开始，把它变成一场别人也愿意加入的对话。',
    time: online ? '本周内' : '周六下午',
    launchMode: online ? 'online' : 'offline',
    venue: online ? '线上优先' : '杭州',
    platform: online ? '微信群 / 线上房间' : '微信群 / 线上房间',
    joinHint: online ? '发起后自动带出加入方式' : '发起后自动带出加入方式'
  }
}

Page({
  data: {
    pageReady: false,
    pageLeaving: false,
    processing: false,
    processingMode: 'autofill',
    promptChips,
    voiceDraft: defaultDraft
  },
  onShow() {
    this.setData({ pageLeaving: false, pageReady: false, processing: false })
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
  updateVoiceDraft(e: WechatMiniprogram.Input) {
    this.setData({ voiceDraft: e.detail.value })
  },
  appendPrompt(e: WechatMiniprogram.BaseEvent) {
    const { value } = e.currentTarget.dataset as { value?: string }
    if (!value) return
    const nextDraft = this.data.voiceDraft.trim()
      ? `${this.data.voiceDraft}\n${value}：`
      : `${value}：`
    this.setData({ voiceDraft: nextDraft })
  },
  goToLaunch(withAutofill: boolean) {
    const payload = withAutofill ? buildAutofillPayload(this.data.voiceDraft) : {
      topic: '',
      reason: '',
      time: '',
      launchMode: 'online',
      venue: '',
      platform: '',
      joinHint: ''
    }
    const params = [
      `entry=ai`,
      `source=starter`,
      `autofill=${withAutofill ? '1' : '0'}`,
      `topic=${encodeURIComponent(payload.topic)}`,
      `reason=${encodeURIComponent(payload.reason)}`,
      `time=${encodeURIComponent(payload.time)}`,
      `mode=${encodeURIComponent(payload.launchMode)}`,
      `venue=${encodeURIComponent(payload.venue)}`,
      `platform=${encodeURIComponent(payload.platform)}`,
      `joinHint=${encodeURIComponent(payload.joinHint)}`
    ].join('&')

    this.setData({
      processing: true,
      processingMode: withAutofill ? 'autofill' : 'skip'
    })

    setTimeout(() => {
      this.setData({ pageLeaving: true })
      setTimeout(() => {
        wx.navigateTo({
          url: `/pages/direct-launch/index?${params}`
        })
      }, 120)
    }, 1400)
  },
  generateCard() {
    this.goToLaunch(true)
  },
  skipEntry() {
    this.goToLaunch(false)
  }
})
