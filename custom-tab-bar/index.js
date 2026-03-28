const tabs = [
  { text: '发现', pagePath: '/pages/discovery/index', icon: '〰' },
  { text: '空间', pagePath: '/pages/card/index', icon: '◉' },
  { text: '在场', pagePath: '/pages/blackhole/index', icon: '☰' },
  { text: '我的', pagePath: '/pages/profile/index', icon: '◐' }
]

Component({
  data: {
    selected: 0,
    tabs,
    hidden: false
  },
  methods: {
    sync(route, hidden) {
      const currentRoute = route || '/pages/discovery/index'
      const selected = tabs.findIndex((item) => item.pagePath === currentRoute)
      this.setData({
        selected: selected >= 0 ? selected : 0,
        hidden: !!hidden
      })
    },
    setHidden(hidden) {
      this.setData({ hidden: !!hidden })
    },
    switchTab(e) {
      const { path, index } = e.currentTarget.dataset
      this.setData({ selected: index })
      wx.switchTab({ url: path })
    }
  },
  lifetimes: {
    attached() {
      const pages = getCurrentPages()
      const current = pages[pages.length - 1]
      const currentRoute = `/${(current && current.route) || 'pages/discovery/index'}`
      this.sync(currentRoute, currentRoute === '/pages/blackhole/index')
    }
  }
})
