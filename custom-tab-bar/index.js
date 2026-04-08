const tabs = [
  { text: '话题', pagePath: '/pages/card/index', icon: '◉' },
  { text: '在场', pagePath: '/pages/blackhole/index', icon: '☰' },
  { text: '我的', pagePath: '/pages/profile/index', icon: '◐' }
]

const promptChips = ['最近的状态', '想聊的方向', '一个问题', '今天的感受']

const defaultDraft = '我最近想聊聊 AI 为什么一边让人更高效，一边也更疲惫。'

const buildAutofillPayload = (draft) => {
  const raw = (draft || '').trim() || defaultDraft
  const online = /AI|线上|远程|工具|互联网|产品|技术/.test(raw)

  return {
    topic: raw.includes('在场')
      ? '真正的在场'
      : raw.includes('AI')
        ? 'AI 让人更高效了，为什么也更疲惫了？'
        : '一个值得认真聊聊的问题',
    reason: raw.includes('AI')
      ? '我想聊聊一种越来越明显的体感：当 AI 让一切更高效之后，人为什么反而更容易分散、疲惫。'
      : '我想从一个最近反复想到的状态开始，把它变成一场别人也愿意加入的对话。',
    time: online ? '本周内' : '周六下午',
    launchMode: online ? 'online' : 'offline',
    venue: online ? '线上优先' : '杭州',
    platform: '微信群 / 线上房间',
    joinHint: '发起后自动带出加入方式'
  }
}

Component({
  data: {
    selected: 0,
    tabs,
    hidden: false,
    showFab: true,
    composerOpen: false,
    promptChips,
    draft: defaultDraft,
    launching: false
  },
  methods: {
    noop() {},
    sync(route, hidden) {
      const currentRoute = route || '/pages/card/index'
      const selected = tabs.findIndex((item) => item.pagePath === currentRoute)
      this.setData({
        selected: selected >= 0 ? selected : 0,
        hidden: !!hidden,
        showFab: currentRoute === '/pages/card/index',
        composerOpen: false
      })
    },
    setHidden(hidden) {
      this.setData({ hidden: !!hidden })
    },
    toggleComposer() {
      this.setData({ composerOpen: !this.data.composerOpen })
    },
    closeComposer() {
      this.setData({ composerOpen: false })
    },
    updateDraft(e) {
      this.setData({ draft: e.detail.value })
    },
    appendPrompt(e) {
      const { value } = e.currentTarget.dataset || {}
      if (!value) return
      const nextDraft = this.data.draft.trim() ? `${this.data.draft}\n${value}：` : `${value}：`
      this.setData({ draft: nextDraft })
    },
    startVoiceInput() {
      const voiceDraft = this.data.draft.trim()
        ? `${this.data.draft}\n我刚刚补充了一段语音，想表达最近这个主题为什么值得聊。`
        : '我刚刚补充了一段语音，想表达最近这个主题为什么值得聊。'
      this.setData({ draft: voiceDraft })
      wx.showToast({
        title: '这里接语音转文字输入',
        icon: 'none'
      })
    },
    goToLaunch(withAutofill) {
      if (this.data.launching) return
      const payload = withAutofill ? buildAutofillPayload(this.data.draft) : {
        topic: '',
        reason: '',
        time: '',
        launchMode: 'online',
        venue: '',
        platform: '',
        joinHint: ''
      }
      const params = [
        'entry=tab',
        'source=starter',
        `autofill=${withAutofill ? '1' : '0'}`,
        `topic=${encodeURIComponent(payload.topic)}`,
        `reason=${encodeURIComponent(payload.reason)}`,
        `time=${encodeURIComponent(payload.time)}`,
        `mode=${encodeURIComponent(payload.launchMode)}`,
        `venue=${encodeURIComponent(payload.venue)}`,
        `platform=${encodeURIComponent(payload.platform)}`,
        `joinHint=${encodeURIComponent(payload.joinHint)}`
      ].join('&')

      this.setData({ launching: true })
      wx.navigateTo({
        url: `/pages/direct-launch/index?${params}`,
        success: () => {
          this.setData({
            composerOpen: false,
            launching: false
          })
        },
        fail: () => {
          this.setData({ launching: false })
          wx.showToast({
            title: '跳转失败，请重试',
            icon: 'none'
          })
        }
      })
    },
    startAutofill() {
      this.goToLaunch(true)
    },
    skipEntry() {
      this.goToLaunch(false)
    },
    switchTab(e) {
      const { path, index } = e.currentTarget.dataset
      this.setData({ selected: index, showFab: path === '/pages/card/index', composerOpen: false })
      wx.switchTab({ url: path })
    }
  },
  lifetimes: {
    attached() {
      const pages = getCurrentPages()
      const current = pages[pages.length - 1]
      const currentRoute = `/${(current && current.route) || 'pages/card/index'}`
      this.sync(currentRoute, currentRoute === '/pages/blackhole/index')
    }
  }
})
