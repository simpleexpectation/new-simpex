const tabs = [
  { text: '话题', pagePath: '/pages/card/index', icon: '◉' },
  { text: '在场', pagePath: '/pages/blackhole/index', icon: '☰' },
  { text: '我的', pagePath: '/pages/profile/index', icon: '◐' }
]

const quickActions = [
  {
    key: 'self',
    label: '从最近表达开始',
    description: '上传近期表达，整理此刻的你',
    url: '/pages/conversation-starter/index?entry=tab&mode=self'
  },
  {
    key: 'direct',
    label: '直接发起话题',
    description: '带着一个想法，直接补全主题、时间和地点',
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
    sync(route: string, hidden: boolean) {
      const currentRoute = route || '/pages/card/index'
      const selected = tabs.findIndex((item) => item.pagePath === currentRoute)
      this.setData({
        selected: selected >= 0 ? selected : 0,
        hidden: !!hidden,
        showFab: currentRoute === '/pages/card/index'
      })
    },
    setHidden(hidden: boolean) {
      this.setData({ hidden: !!hidden })
    },
    toggleComposer() {
      this.setData({ composerOpen: !this.data.composerOpen })
    },
    closeComposer() {
      this.setData({ composerOpen: false })
    },
    openQuickAction(e: WechatMiniprogram.BaseEvent) {
      const { url } = e.currentTarget.dataset as { url?: string }
      this.setData({ composerOpen: false })
      if (!url) return
      wx.navigateTo({ url })
    },
    switchTab(e: WechatMiniprogram.BaseEvent) {
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
