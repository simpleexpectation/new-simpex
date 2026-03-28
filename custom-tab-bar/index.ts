const tabs = [
  { text: '发现', pagePath: '/pages/discovery/index', icon: '◔' },
  { text: '名片', pagePath: '/pages/card/index', icon: '◎' },
  { text: '黑洞', pagePath: '/pages/blackhole/index', icon: '◌' },
  { text: '我的', pagePath: '/pages/profile/index', icon: '●' }
]

Component({
  data: {
    selected: 0,
    tabs
  },
  methods: {
    switchTab(e: WechatMiniprogram.BaseEvent) {
      const { path, index } = e.currentTarget.dataset
      this.setData({ selected: index })
      wx.switchTab({ url: path })
    }
  },
  lifetimes: {
    attached() {
      const pages = getCurrentPages()
      const currentRoute = `/${pages[pages.length - 1]?.route || 'pages/discovery/index'}`
      const selected = tabs.findIndex((item) => item.pagePath === currentRoute)
      this.setData({ selected: selected >= 0 ? selected : 0 })
    }
  }
})
