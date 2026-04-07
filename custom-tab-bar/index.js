const tabs = [
  { text: '话题', pagePath: '/pages/card/index', icon: '◉' },
  { text: '在场', pagePath: '/pages/blackhole/index', icon: '☰' },
  { text: '我的', pagePath: '/pages/profile/index', icon: '◐' }
]

const quickActions = [
  {
    key: 'launch',
    label: '发起对话',
    description: '直接写，或先聊聊最近的状态',
    url: '/pages/direct-launch/index?entry=tab'
  }
]

Component({
  data: {
    selected: 0,
    tabs,
    hidden: false,
    composerOpen: false,
    quickActions,
    showFab: true
  },
  methods: {
    sync(route, hidden) {
      const currentRoute = route || '/pages/card/index'
      const selected = tabs.findIndex((item) => item.pagePath === currentRoute)
      this.setData({
        selected: selected >= 0 ? selected : 0,
        hidden: !!hidden,
        showFab: currentRoute === '/pages/card/index'
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
    openQuickAction(e) {
      const { url } = e.currentTarget.dataset
      this.setData({ composerOpen: false })
      if (!url) return
      wx.navigateTo({ url })
    },
    switchTab(e) {
      const { path, index } = e.currentTarget.dataset
      this.setData({ selected: index, composerOpen: false, showFab: path === '/pages/card/index' })
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
