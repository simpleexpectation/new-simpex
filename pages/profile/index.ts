import { myEvents } from '../../data/mock'

const eventSlides = [...myEvents]
  .sort((a, b) => (a.date < b.date ? 1 : -1))
  .map((item, index) => ({
    ...item,
    relativeTime: ['17 天前', '12 天前', '8 天前', '5 天前', '3 天前'][index] || `${index + 1} 周前`,
    venueShort: item.venue.replace('某', '').slice(0, 4) || item.venue,
    indexLabel: `${String(index + 1).padStart(2, '0')} / ${String(myEvents.length).padStart(2, '0')}`
  }))

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
    eventSlides,
    eventCurrent: 0,
    selectedEvent: eventSlides[0],
    showEventModal: false,
    pressedEventId: '',
    pressedEntry: '',
    pressedModalAction: '',
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
  onEventSwiperChange(e: WechatMiniprogram.SwiperChange) {
    this.setData({ eventCurrent: e.detail.current })
  },
  pressEventCard(e: WechatMiniprogram.BaseEvent) {
    const id = e.currentTarget.dataset.id as string
    if (!id) return
    this.setData({ pressedEventId: id })
  },
  releaseEventCard() {
    if (!this.data.pressedEventId) return
    this.setData({ pressedEventId: '' })
  },
  pressModalAction(e: WechatMiniprogram.BaseEvent) {
    const action = e.currentTarget.dataset.action as string
    if (!action) return
    this.setData({ pressedModalAction: action })
  },
  releaseModalAction() {
    if (!this.data.pressedModalAction) return
    this.setData({ pressedModalAction: '' })
  },
  pressEntryCard(e: WechatMiniprogram.BaseEvent) {
    const entry = e.currentTarget.dataset.entry as string
    if (!entry) return
    this.setData({ pressedEntry: entry })
  },
  releaseEntryCard() {
    if (!this.data.pressedEntry) return
    this.setData({ pressedEntry: '' })
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
  openMyEvent(e: WechatMiniprogram.BaseEvent) {
    const id = e.currentTarget.dataset.id as string
    if (!id) return
    const selectedEvent = this.data.eventSlides.find((item: any) => item.id === id) || this.data.eventSlides[0]
    this.releaseEventCard()
    this.setData({
      selectedEvent,
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
  }
})
