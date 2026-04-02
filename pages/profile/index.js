const { myEvents } = require('../../data/mock')

Page({
  data: {
    user: {
      name: 'Lynn',
      initial: 'L',
      bio: '在练习更松弛地创作',
      location: '中国 · 杭州',
      tags: ['创作者']
    },
    benefitsHub: {
      eyebrow: 'Access',
      title: '权益中心',
      summary: '两种方式，同样进入',
      intro: '你可以选择开通会员，或者邀请 2 位朋友加入，免费解锁当月体验。',
      tip: '发起活动时可额外邀请 1 位站外好友参与，具体规则可分别进入查看。'
    },
    membership: {
      badge: '订阅进入',
      plan: '99 / 月会员',
      renewal: '2026.04.21'
    },
    inviteSummary: {
      badge: '邀请进入',
      title: '邀请 2 人免费解锁',
      detail: '邀请 2 位新用户注册，可得当月免费订阅'
    },
    myEvents,
    selectedEvent: null,
    showEventModal: false,
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
  },
  openInviteCenter() {
    this.setData({ pageLeaving: true })
    setTimeout(() => {
      wx.navigateTo({ url: '/pages/invite-unlock/index?source=profile' })
    }, 180)
  },
  openMyEvent(e) {
    const { id } = e.currentTarget.dataset
    if (!id) return
    const selectedEvent = this.data.myEvents.find((item) => item.id === id) || null
    this.setData({
      selectedEvent,
      showEventModal: !!selectedEvent
    })
  },
  closeEventModal() {
    this.setData({
      selectedEvent: null,
      showEventModal: false
    })
  },
  pinEventToProfile() {
    wx.showToast({ title: '这里接挂到名片', icon: 'none' })
  },
  useEventAsStarter() {
    wx.showToast({ title: '这里接作为发起入口', icon: 'none' })
  }
})
