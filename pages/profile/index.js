Page({
  data: {
    user: {
      name: 'Lynn',
      initial: 'L',
      bio: '在练习更松弛地创作',
      location: '中国 · 杭州',
      tags: ['创作者', '999 全域']
    },
    membership: {
      plan: '999 全域会员',
      renewal: '2026.04.21'
    },
    stats: [
      { label: '真实到场', value: '17' },
      { label: '深度对话', value: '31' },
      { label: '空间激活', value: '6' }
    ],
    dialogHistory: [
      {
        id: 'd1',
        title: '离职之后，你是怎么重新找到节奏的？',
        venue: '文二路某咖啡馆',
        date: '03/22',
        people: ['强', '越', 'M', 'A'],
        insight: '在泊光集聊完之后，我终于决定停掉一个无效合作。'
      },
      {
        id: 'd2',
        title: '当代城市里，什么是真正的孤独？',
        venue: '西湖边某处',
        date: '03/15',
        people: ['青', '越'],
        insight: ''
      },
      {
        id: 'd3',
        title: '设计焦虑与不确定感的对话',
        venue: '泊光集',
        date: '03/08',
        people: ['L', 'M', 'A'],
        insight: '第一次把焦虑说完整，发现它没有那么可怕。'
      }
    ],
    pageReady: false,
    pageLeaving: false
  },
  onShow() {
    this.showTabBar()
    this.enterPage()
  },
  enterPage() {
    this.setData({ pageLeaving: false, pageReady: false })
    setTimeout(() => {
      this.setData({ pageReady: true })
    }, 20)
  },
  showTabBar() {
    const tabBar = this.getTabBar && this.getTabBar()
    if (tabBar && tabBar.sync) {
      tabBar.sync('/pages/profile/index', false)
    }
  },
  openMembership() {
    this.setData({ pageLeaving: true })
    setTimeout(() => {
      wx.navigateTo({ url: '/pages/membership/index' })
    }, 180)
  }
})
