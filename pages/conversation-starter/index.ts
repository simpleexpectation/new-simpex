const journeySteps = [
  { key: 'upload', label: '上传近期表达' },
  { key: 'insight', label: '生成自我线索' },
  { key: 'topics', label: '推荐适合话题' },
  { key: 'launch', label: '发起这次对话' }
]

const uploadCards = [
  {
    id: 'moments',
    source: '朋友圈截图',
    badge: '已上传',
    caption: '最近总在记录搬家后的夜晚散步',
    selected: true,
    tone: 'warm'
  },
  {
    id: 'bonjour',
    source: 'Bonjour 卡片',
    badge: '已上传',
    caption: '今天想把生活节奏重新调慢一点',
    selected: true,
    tone: 'mist'
  },
  {
    id: 'xiaohongshu',
    source: '小红书截图',
    badge: '已上传',
    caption: '收藏了很多和城市空间、独处体验有关的内容',
    selected: true,
    tone: 'glow'
  }
]

const insightCards = [
  { title: '近期关键词', value: '新城市、独处、散步、节奏调整、空间感' },
  { title: '当前状态', value: '正在适应一个新的生活阶段，也在重新感受一个人和城市相处的方式' },
  { title: '表达倾向', value: '更想记录真实感受，也愿意和有类似经历的人慢慢聊开' },
  { title: '最近想被看见的一面', value: '不是更厉害的自己，而是还在适应中的自己' }
]

const recommendedTopics = [
  {
    id: 'topic-1',
    depth: '轻话题',
    status: '适合破冰',
    current: '4',
    total: '6',
    initiator: '系统整理',
    time: '适合今天开启',
    location: '从最近状态出发',
    tags: ['轻开口', '最近状态', '低门槛'],
    rules: '更适合轻松开始，不需要一次说太多',
    title: '来到新城市后，你最先重新建立的生活习惯是什么',
    reason: '适合从“最近状态”自然开口，不需要一下讲太多。',
    openers: ['最近搬来之后，我最先重新建立的是散步这件事。', '如果换了一个生活环境，你会先保留什么习惯？']
  },
  {
    id: 'topic-2',
    depth: '共鸣型话题',
    status: '推荐优先',
    current: '5',
    total: '6',
    initiator: '系统整理',
    time: '最贴近你此刻',
    location: '适合同频连接',
    tags: ['共鸣', '独处体验', '关系感'],
    rules: '适合找到有相似阶段和心境的人',
    title: '一个人生活后，你更喜欢自由，还是更需要连接',
    reason: '和你当前的独处体验、节奏调整高度相关，更容易遇到同频的人。',
    openers: ['最近一个人待着的时间变多了，我开始重新理解自由和连接。', '你会不会也有那种很想独处，但又想被理解的时刻？']
  },
  {
    id: 'topic-3',
    depth: '深一点的话题',
    status: '适合深入',
    current: '3',
    total: '6',
    initiator: '系统整理',
    time: '适合认真表达',
    location: '更适合深聊',
    tags: ['阶段变化', '自我重建', '认真表达'],
    rules: '适合愿意深入交换近况的时候再开启',
    title: '如果生活节奏突然变了，你一般怎么慢慢找回自己',
    reason: '这条会更接近你现在真正关心的问题，适合进入更深的表达。',
    openers: ['我最近在适应新的生活节奏，也在重新找回自己。', '如果一个阶段结束了，你通常怎么开始下一个阶段？']
  }
]

const audienceOptions = [
  '也在经历环境变化的人',
  '对城市空间和散步有感觉的人',
  '想认真交换近况的人'
]

const toneOptions = [
  '真诚',
  '轻松',
  '思考型'
]

Page({
  data: {
    entry: 'home',
    mode: 'self',
    currentStep: 0,
    steps: journeySteps,
    uploadCards,
    selectedUploadIds: uploadCards.filter((item) => item.selected).map((item) => item.id),
    insightCards,
    recommendedTopics,
    selectedTopicId: recommendedTopics[1].id,
    selectedTopicTitle: recommendedTopics[1].title,
    selectedOpener: recommendedTopics[1].openers[0],
    audienceOptions,
    selectedAudience: audienceOptions[0],
    toneOptions,
    selectedTone: toneOptions[0],
    autoFillFields: [
      { label: '对话标题', value: recommendedTopics[1].title },
      { label: '发起方式', value: '从最近状态开始' },
      { label: '可见身份', value: '带轻量数字名片进入' }
    ],
    createdConversation: {
      title: recommendedTopics[1].title,
      opener: recommendedTopics[1].openers[0],
      audience: audienceOptions[0],
      tone: toneOptions[0],
      roomStatus: '已创建，正在等待第一个回应',
      inviteHint: '系统会优先推荐也处在生活转场期、愿意认真交换近况的人'
    },
    launchCompleted: false,
    resultReady: false,
    pageReady: false,
    pageLeaving: false
  },
  onLoad(query: Record<string, string>) {
    const entry = query.entry || 'home'
    const mode = query.mode || 'self'
    this.setData({ entry, mode })
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
    if (this.data.launchCompleted) {
      this.setData({ launchCompleted: false })
      return
    }
    if (this.data.currentStep === 0) {
      this.setData({ pageLeaving: true })
      setTimeout(() => wx.navigateBack(), 180)
      return
    }
    this.setData({
      currentStep: this.data.currentStep - 1,
      resultReady: false
    })
  },
  nextStep() {
    const next = Math.min(this.data.currentStep + 1, this.data.steps.length - 1)
    this.setData({
      currentStep: next,
      resultReady: next === this.data.steps.length - 1
    })
  },
  selectUpload(e: WechatMiniprogram.BaseEvent) {
    const { id } = e.currentTarget.dataset as { id?: string }
    if (!id) return
    const selectedUploadIds = this.data.selectedUploadIds.includes(id)
      ? this.data.selectedUploadIds.filter((item) => item !== id)
      : [...this.data.selectedUploadIds, id]
    this.setData({ selectedUploadIds })
  },
  selectTopic(e: WechatMiniprogram.BaseEvent) {
    const { id } = e.currentTarget.dataset as { id?: string }
    if (!id) return
    const currentTopic = recommendedTopics.find((item) => item.id === id)
    this.setData({
      selectedTopicId: id,
      selectedTopicTitle: currentTopic ? currentTopic.title : this.data.selectedTopicTitle,
      selectedOpener: currentTopic ? currentTopic.openers[0] : this.data.selectedOpener,
      autoFillFields: [
        { label: '对话标题', value: currentTopic ? currentTopic.title : this.data.selectedTopicTitle },
        { label: '发起方式', value: '从最近状态开始' },
        { label: '可见身份', value: '带轻量数字名片进入' }
      ],
      createdConversation: {
        ...this.data.createdConversation,
        title: currentTopic ? currentTopic.title : this.data.selectedTopicTitle,
        opener: currentTopic ? currentTopic.openers[0] : this.data.selectedOpener
      }
    })
  },
  selectAudience(e: WechatMiniprogram.BaseEvent) {
    const { value } = e.currentTarget.dataset as { value?: string }
    if (!value) return
    this.setData({
      selectedAudience: value,
      createdConversation: {
        ...this.data.createdConversation,
        audience: value
      }
    })
  },
  selectTone(e: WechatMiniprogram.BaseEvent) {
    const { value } = e.currentTarget.dataset as { value?: string }
    if (!value) return
    this.setData({
      selectedTone: value,
      createdConversation: {
        ...this.data.createdConversation,
        tone: value
      }
    })
  },
  confirmLaunch() {
    this.setData({
      launchCompleted: true,
      resultReady: true,
      createdConversation: {
        ...this.data.createdConversation,
        title: this.data.selectedTopicTitle,
        opener: this.data.selectedOpener,
        audience: this.data.selectedAudience,
        tone: this.data.selectedTone
      }
    })
  }
})
