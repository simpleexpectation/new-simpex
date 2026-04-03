const venueOptions = [
  { key: 'changkai', name: '敞开酒馆', mood: '适合慢下来认真聊', slot: '晚间可发起' },
  { key: 'boguang', name: '泊光集', mood: '适合复盘与余味', slot: '夜晚更合适' },
  { key: 'cat', name: '猫客厅', mood: '适合轻松破冰', slot: '傍晚到晚间' },
  { key: 'kuangye', name: '旷野公社', mood: '适合新想法碰撞', slot: '白天也能开始' },
  { key: 'haofeng', name: '好逢小屋', mood: '适合熟人感与温度', slot: '周末更自然' },
  { key: 'banana', name: '香蕉小院', mood: '适合松弛表达', slot: '下午到黄昏' }
]

const backgroundOptions = [
  { key: 'warm-dusk', label: '暖暮' },
  { key: 'mist-blue', label: '雾蓝' },
  { key: 'olive-glow', label: '浅橄榄' },
  { key: 'night-amber', label: '夜琥珀' },
  { key: 'rose-cloud', label: '玫瑰云' },
  { key: 'forest-deep', label: '深林' },
  { key: 'sand-gold', label: '砂金' },
  { key: 'plum-night', label: '梅夜' },
  { key: 'lake-light', label: '湖光' }
]

Page({
  data: {
    entry: 'tab',
    source: 'direct',
    form: {
      topic: '最近这段时间，有没有一件小事让你慢慢觉得自己开始进入新生活了？',
      reason: '我想从一个最近真实发生的小片段开始，和几个人认真聊一聊。',
      time: '',
      venue: venueOptions[0].name,
      background: backgroundOptions[0].key
    },
    venueOptions,
    backgroundOptions,
    pageReady: false,
    pageLeaving: false
  },
  onLoad(query) {
    const source = query.source || 'direct'
    const topic = query.topic ? decodeURIComponent(query.topic) : ''
    const reason = query.reason ? decodeURIComponent(query.reason) : ''
    const background = query.background ? decodeURIComponent(query.background) : ''
    this.setData({
      entry: query.entry || 'tab',
      source,
      form: {
        ...this.data.form,
        topic: topic || this.data.form.topic,
        reason: reason || this.data.form.reason,
        background: background || this.data.form.background,
        time: source === 'starter' ? '' : this.data.form.time
      }
    })
  },
  onShow() {
    this.enterPage()
  },
  enterPage() {
    this.setData({ pageLeaving: false, pageReady: false })
    setTimeout(() => {
      this.setData({ pageReady: true })
    }, 20)
  },
  goBack() {
    this.setData({ pageLeaving: true })
    setTimeout(() => {
      wx.navigateBack()
    }, 180)
  },
  updateField(e) {
    const { field } = e.currentTarget.dataset
    if (!field) return
    const value = e.detail.value
    this.setData({
      [`form.${field}`]: value
    })
  },
  selectVenue(e) {
    const { value } = e.currentTarget.dataset
    if (!value) return
    this.setData({
      'form.venue': value
    })
  },
  selectBackground(e) {
    const { value } = e.currentTarget.dataset
    if (!value) return
    this.setData({
      'form.background': value
    })
  },
  confirmLaunch() {
    wx.showToast({
      title: '这里接直接发起提交流程',
      icon: 'none'
    })
  }
})
