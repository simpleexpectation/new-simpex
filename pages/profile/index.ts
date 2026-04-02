import { myEvents } from '../../data/mock'

Page({
  data: {
    user: {
      name: 'Lynn',
      initial: 'L',
      bio: '在练习更松弛地创作',
      location: '中国 · 杭州',
      tags: ['创作者']
    },
    membership: {
      plan: '99 / 月会员',
      renewal: '2026.04.21'
    },
    inviteSummary: {
      title: '邀请中心',
      detail: '邀请 2 位新用户注册，可得当月免费订阅',
      subdetail: '活动发起时可额外邀请 1 位站外好友参与'
    },
    myEvents,
    pageReady: false,
    pageLeaving: false
  },
  onShow() {
    this.showTabBar()
    this.enterPage()
  },
  enterPage() {
    this.setData({ pageLeaving: false, pageReady: false })
    setTimeout(() => { this.setData({ pageReady: true }) }, 20)
  },
  showTabBar() {
    const tabBar = this.getTabBar && this.getTabBar() as any
    if (tabBar && tabBar.sync) tabBar.sync('/pages/profile/index', false)
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
  openMyEvent(e: WechatMiniprogram.BaseEvent) {
    const id = e.currentTarget.dataset.id as string
    if (!id) return
    this.setData({ pageLeaving: true })
    setTimeout(() => {
      wx.navigateTo({ url: `/pages/event-detail/index?source=profile&id=${id}` })
    }, 180)
  }
})
