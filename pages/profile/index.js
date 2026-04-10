const backend = require('../../lib/backend/index')

function decorateEvent(item) {
  if (!item) return item
  return {
    ...item,
    coreTopic: item.innerQuestion || item.title,
    coreTopicHint: item.identityLens,
    expandChips: (item.chips || []).slice(0, 3),
    expandHint: item.summary || item.footnote || ''
  }
}

Page({
  data: {
    user: {
      name: 'Lynn',
      initial: 'L',
      bio: '在练习更松弛地创作',
      location: '中国 · 杭州',
      tags: ['创作者']
    },
    unlockEntry: {
      badge: 'Invite to unlock',
      title: '邀请解锁',
      detail: '邀请 2 位同频好友，解锁本月完整权益',
      cta: '去邀请'
    },
    coBuildEntry: {
      badge: 'Co-build plan',
      title: '共建计划',
      detail: '邀请同频新朋友完成订阅，获得持续关键回馈',
      cta: '查看计划'
    },
    eventSlides: [],
    eventCurrent: 0,
    selectedEvent: null,
    showEventModal: false,
    pressedEventId: '',
    pressedEntry: '',
    pressedModalAction: '',
    pressedProfileAction: '',
    backendMode: 'mock',
    pageReady: false,
    pageLeaving: false
  },
  async onShow() {
    this.showTabBar()
    await this.loadProfileHome()
    this.enterPage()
  },
  async loadProfileHome() {
    const result = await backend.fetchProfileHome()
    this.setData({
      user: result.user,
      unlockEntry: result.unlockEntry,
      coBuildEntry: result.coBuildEntry,
      eventSlides: result.eventSlides,
      selectedEvent: decorateEvent(result.eventSlides[0] || null),
      backendMode: result.mode
    })
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
  onEventSwiperChange(e) {
    this.setData({ eventCurrent: e.detail.current })
  },
  pressEventCard(e) {
    const { id } = e.currentTarget.dataset
    if (!id) return
    this.setData({ pressedEventId: id })
  },
  releaseEventCard() {
    if (!this.data.pressedEventId) return
    this.setData({ pressedEventId: '' })
  },
  pressModalAction(e) {
    const { action } = e.currentTarget.dataset
    if (!action) return
    this.setData({ pressedModalAction: action })
  },
  releaseModalAction() {
    if (!this.data.pressedModalAction) return
    this.setData({ pressedModalAction: '' })
  },
  pressEntryCard(e) {
    const { entry } = e.currentTarget.dataset
    if (!entry) return
    this.setData({ pressedEntry: entry })
  },
  releaseEntryCard() {
    if (!this.data.pressedEntry) return
    this.setData({ pressedEntry: '' })
  },
  pressProfileAction(e) {
    const { action } = e.currentTarget.dataset
    if (!action) return
    this.setData({ pressedProfileAction: action })
  },
  releaseProfileAction() {
    if (!this.data.pressedProfileAction) return
    this.setData({ pressedProfileAction: '' })
  },
  openInviteUnlock() {
    this.releaseEntryCard()
    this.setData({ pageLeaving: true })
    setTimeout(() => {
      wx.navigateTo({ url: '/pages/access-center/index?source=profile&mode=unlock' })
    }, 180)
  },
  openCoBuildPlan() {
    this.releaseEntryCard()
    this.setData({ pageLeaving: true })
    setTimeout(() => {
      wx.navigateTo({ url: '/pages/access-center/index?source=profile&mode=cobuild' })
    }, 180)
  },
  openMyEvent(e) {
    const { id } = e.currentTarget.dataset
    if (!id) return
    const selectedEvent = this.data.eventSlides.find((item) => item.id === id) || this.data.eventSlides[0]
    this.releaseEventCard()
    this.setData({
      selectedEvent: decorateEvent(selectedEvent),
      showEventModal: true
    })
  },
  closeEventModal() {
    this.releaseModalAction()
    this.setData({ showEventModal: false })
  },
  pinEventToCard() {
    this.releaseModalAction()
    wx.showToast({ title: '已挂到名片', icon: 'none' })
  },
  useEventAsPrompt() {
    this.releaseModalAction()
    wx.showToast({ title: '已设为发起入口', icon: 'none' })
  },
  editProfile() {
    this.releaseProfileAction()
    wx.showToast({ title: '下一步接入编辑资料页', icon: 'none' })
  }
})
