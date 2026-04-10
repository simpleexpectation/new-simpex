const venueOptions = [
  { key: 'changkai', name: '敞开酒馆', mood: '适合慢下来认真聊', slot: '晚间可发起' },
  { key: 'boguang', name: '泊光集', mood: '适合复盘与余味', slot: '夜晚更合适' },
  { key: 'cat', name: '猫客厅', mood: '适合轻松破冰', slot: '傍晚到晚间' },
  { key: 'kuangye', name: '旷野公社', mood: '适合新想法碰撞', slot: '白天也能开始' },
  { key: 'haofeng', name: '好逢小屋', mood: '适合熟人感与温度', slot: '周末更自然' },
  { key: 'banana', name: '香蕉小院', mood: '适合松弛表达', slot: '下午到黄昏' }
]

const launchModes = [
  { key: 'online', label: '线上', hint: '更轻、更快，适合先发起一个开放话题' },
  { key: 'offline', label: '线下', hint: '更在场，适合把这张卡落到真实空间里' }
]

const gradientFamilies = [
  { h: 14, s: 42, l: 72, accent: 48 },
  { h: 208, s: 30, l: 76, accent: 50 },
  { h: 74, s: 24, l: 70, accent: 52 },
  { h: 332, s: 28, l: 74, accent: 46 },
  { h: 186, s: 24, l: 72, accent: 50 },
  { h: 34, s: 38, l: 74, accent: 50 }
]

const hashString = (input: string) => {
  let hash = 0
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0
  }
  return hash
}

const pickGradientFamily = (input: string) => {
  if (/夜|散步|酒馆|慢|安静|独处/.test(input)) return gradientFamilies[0]
  if (/思考|观察|理解|连接|问题/.test(input)) return gradientFamilies[1]
  if (/自然|空间|附近|场地|生活/.test(input)) return gradientFamilies[2]
  return gradientFamilies[hashString(input) % gradientFamilies.length]
}

const createGradientStyle = (input: string) => {
  const seed = hashString(input || 'simpex')
  const family = pickGradientFamily(input)
  const shift = seed % 12
  const h1 = family.h
  const h2 = (family.h + 18 + shift) % 360
  const l1 = family.l + 6
  const l2 = family.l + 14
  const glowAlpha = 0.14 + (seed % 6) * 0.008
  return [
    `background: radial-gradient(circle at 82% 18%, hsla(${family.accent}, 82%, 78%, ${glowAlpha}), transparent 24%), radial-gradient(circle at 20% 84%, hsla(${(family.accent + 18) % 360}, 56%, 82%, 0.08), transparent 26%), linear-gradient(180deg, hsl(${h1}, ${Math.max(16, family.s - 10)}%, ${l1}%), hsl(${h2}, ${Math.max(14, family.s - 12)}%, ${l2}%))`,
    'border: 1rpx solid rgba(255,255,255,0.08)'
  ].join(';')
}

const buildGeneratedTopics = (raw: string) => {
  const trimmed = raw.trim()
  const excerpt = trimmed.length > 22 ? `${trimmed.slice(0, 22)}...` : trimmed
  return [
    {
      id: 'generated-1',
      title: '最近这段时间，什么正在慢慢改变你看生活的方式？',
      reason: `从“${excerpt}”这类近况切进去，更容易把最近真实发生的变化慢慢聊开。`,
      style: createGradientStyle(`${trimmed}-1`)
    },
    {
      id: 'generated-2',
      title: '当你开始留意这些细小变化时，你最想确认的到底是什么？',
      reason: `把你刚刚说到的观察和感受收成一个问题，适合和愿意认真回应的人继续往下聊。`,
      style: createGradientStyle(`${trimmed}-2`)
    },
    {
      id: 'generated-3',
      title: '最近接触到的人和事里，哪一种感觉最让你想继续聊下去？',
      reason: '从你最近接触的人群与现场感受出发，会更自然地把人带进来，而不是像在写一篇完整介绍。',
      style: createGradientStyle(`${trimmed}-3`)
    }
  ]
}

Page({
  data: {
    entry: 'tab',
    source: 'direct',
    launchMode: 'online',
    voiceDraft: '',
    generatedTopics: [] as Array<{ id: string; title: string; reason: string; style: string }>,
    selectedGeneratedId: '',
    showManualFields: true,
    previewGradientStyle: createGradientStyle('simpex'),
    form: {
      topic: '最近这段时间，有没有一件小事让你慢慢觉得自己开始进入新生活了？',
      reason: '我想从一个最近真实发生的小片段开始，和几个人认真聊一聊。',
      time: '',
      venue: venueOptions[0].name,
      platform: '微信群 / 线上房间',
      joinHint: '发起后自动带出加入方式'
    },
    launchModes,
    venueOptions,
    pageReady: false,
    pageLeaving: false
  },
  onLoad(query: Record<string, string>) {
    const source = query.source || 'direct'
    const topic = query.topic ? decodeURIComponent(query.topic) : ''
    const reason = query.reason ? decodeURIComponent(query.reason) : ''
    const time = query.time ? decodeURIComponent(query.time) : ''
    const mode = query.mode ? decodeURIComponent(query.mode) : 'online'
    const venue = query.venue ? decodeURIComponent(query.venue) : ''
    const platform = query.platform ? decodeURIComponent(query.platform) : ''
    const joinHint = query.joinHint ? decodeURIComponent(query.joinHint) : ''
    const previewGradientStyle = createGradientStyle(`${topic} ${reason}`)
    this.setData({
      entry: query.entry || 'tab',
      source,
      launchMode: mode,
      showManualFields: source !== 'starter',
      previewGradientStyle,
      form: {
        ...this.data.form,
        topic: topic || this.data.form.topic,
        reason: reason || this.data.form.reason,
        time: source === 'starter' ? time : this.data.form.time,
        venue: venue || this.data.form.venue,
        platform: platform || this.data.form.platform,
        joinHint: joinHint || this.data.form.joinHint
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
  updateField(e: WechatMiniprogram.Input) {
    const { field } = e.currentTarget.dataset as { field?: string }
    if (!field) return
    const value = e.detail.value
    const nextForm = {
      ...this.data.form,
      [field]: value
    }
    this.setData({
      [`form.${field}`]: value
    })
    if (field === 'topic' || field === 'reason') {
      this.setData({
        previewGradientStyle: createGradientStyle(`${nextForm.topic} ${nextForm.reason}`)
      })
    }
  },
  updatePreviewGradient(topic: string, reason: string) {
    this.setData({
      previewGradientStyle: createGradientStyle(`${topic} ${reason}`)
    })
  },
  updateVoiceDraft(e: WechatMiniprogram.Input) {
    this.setData({
      voiceDraft: e.detail.value
    })
  },
  generateFromVoice() {
    const raw = this.data.voiceDraft.trim()
    if (!raw) {
      wx.showToast({
        title: '先随便说一点最近的状态',
        icon: 'none'
      })
      return
    }
    const generatedTopics = buildGeneratedTopics(raw)
    const first = generatedTopics[0]
    this.setData({
      generatedTopics,
      selectedGeneratedId: first.id,
      showManualFields: false,
      'form.topic': first.title,
      'form.reason': first.reason
    })
    this.updatePreviewGradient(first.title, first.reason)
  },
  selectGeneratedTopic(e: WechatMiniprogram.BaseEvent) {
    const { id } = e.currentTarget.dataset as { id?: string }
    if (!id) return
    const current = this.data.generatedTopics.find((item) => item.id === id)
    if (!current) return
    this.setData({
      selectedGeneratedId: current.id,
      'form.topic': current.title,
      'form.reason': current.reason
    })
    this.updatePreviewGradient(current.title, current.reason)
  },
  toggleManualFields() {
    this.setData({
      showManualFields: !this.data.showManualFields
    })
  },
  selectVenue(e: WechatMiniprogram.BaseEvent) {
    const { value } = e.currentTarget.dataset as { value?: string }
    if (!value) return
    this.setData({
      'form.venue': value
    })
  },
  switchLaunchMode(e: WechatMiniprogram.BaseEvent) {
    const { mode } = e.currentTarget.dataset as { mode?: string }
    if (!mode || mode === this.data.launchMode) return
    this.setData({ launchMode: mode })
  },
  confirmLaunch() {
    wx.showToast({
      title: '这里接直接发起提交流程',
      icon: 'none'
    })
  }
})
