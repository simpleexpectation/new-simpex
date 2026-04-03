const journeySteps = [
  { key: 'upload', label: '上传近期表达' },
  { key: 'insight', label: '生成自我线索' },
  { key: 'topics', label: '推荐适合话题' }
]

const insightCards = [
  { title: '近期关键词', value: '新城市、独处、散步、节奏调整、空间感' },
  { title: '当前状态', value: '正在适应一个新的生活阶段，也在重新感受一个人和城市相处的方式' },
  { title: '表达倾向', value: '更想记录真实感受，也愿意和有类似经历的人慢慢聊开' }
]

const recommendedTopics = [
  {
    id: 'topic-1',
    depth: '轻话题',
    status: '适合破冰',
    current: '4',
    total: '6',
    initiator: '系统整理',
    time: '从最近经历出发',
    location: '适合今天开启',
    tags: ['轻开口', '最近经历', '低门槛'],
    rules: '更适合轻松开始，不需要一次说太多',
    title: '最近这段时间，有没有一件小事让你慢慢觉得自己开始进入新生活了？',
    reason: '从最近真实发生过的一件小事切入，比直接聊状态更容易让人接得住，也更容易打开第一次对话。',
    launchReason: '我想从最近真实发生过的一件小事开始，和几个人慢慢聊开。',
    background: 'warm-dusk',
    openers: ['最近有个很小的瞬间，让我突然觉得自己开始慢慢进入新的生活了。', '如果要说最近一个让你有“生活正在变化”感觉的片段，会是什么？']
  },
  {
    id: 'topic-2',
    depth: '共鸣型话题',
    status: '推荐优先',
    current: '5',
    total: '6',
    initiator: '系统整理',
    time: '从一个思考出发',
    location: '适合碰到会认真接的人',
    tags: ['一个思考', '关系判断', '可讨论'],
    rules: '适合从一个明确问题进入，彼此交换不同答案',
    title: '我们到底是在寻找连接，还是在寻找一种“被刚好理解”的感觉？',
    reason: '这条更像把你最近反复思考的一个判断拿出来，适合吸引愿意认真交换看法的人，而不是只聊近况。',
    launchReason: '我想把最近反复想到的一个问题拿出来，认真听听别人的答案。',
    background: 'mist-blue',
    openers: ['我最近一直在想，人想要的到底是连接本身，还是那种被刚好理解的感觉。', '如果是你，你觉得人与人靠近时，最珍贵的到底是什么？']
  },
  {
    id: 'topic-3',
    depth: '深一点的话题',
    status: '适合深入',
    current: '3',
    total: '6',
    initiator: '系统整理',
    time: '从一种表达出发',
    location: '适合把感觉说完整',
    tags: ['表达片段', '生活感', '认真表达'],
    rules: '适合把一句你最近很想说的话，慢慢展开成一场对话',
    title: '如果让你带一句最近最想留下的话来见人，你会带哪一句？',
    reason: '这条直接从一句表达开始，不需要先讲完整故事，适合把很轻但很真的个人片段慢慢展开。',
    launchReason: '我想从一句最近很想留下的话开始，看看它会把什么样的人带过来。',
    background: 'olive-glow',
    openers: ['如果今晚只能带一句最近最想留下的话来见人，我大概会带这一句。', '你最近有没有一句很想留下、很像现在自己的话？']
  }
]

Page({
  data: {
    entry: 'home',
    mode: 'self',
    currentStep: 0,
    steps: journeySteps,
    insightCards,
    recommendedTopics,
    selectedTopicId: recommendedTopics[1].id,
    selectedTopicTitle: recommendedTopics[1].title,
    selectedOpener: recommendedTopics[1].openers[0],
    selectedLaunchReason: recommendedTopics[1].launchReason,
    selectedBackground: recommendedTopics[1].background,
    pageReady: false,
    pageLeaving: false
  },
  onLoad(query) {
    const entry = query.entry || 'home'
    const mode = 'self'
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
    if (this.data.currentStep === 0) {
      this.setData({ pageLeaving: true })
      setTimeout(() => wx.navigateBack(), 180)
      return
    }
    this.setData({
      currentStep: this.data.currentStep - 1
    })
  },
  nextStep() {
    if (this.data.currentStep >= this.data.steps.length - 1) {
      const topic = encodeURIComponent(this.data.selectedTopicTitle)
      const reason = encodeURIComponent(this.data.selectedLaunchReason)
      const background = encodeURIComponent(this.data.selectedBackground)
      this.setData({ pageLeaving: true })
      setTimeout(() => {
        wx.navigateTo({
          url: `/pages/direct-launch/index?entry=starter&source=starter&topic=${topic}&reason=${reason}&background=${background}`
        })
      }, 180)
      return
    }
    this.setData({
      currentStep: this.data.currentStep + 1
    })
  },
  selectTopic(e) {
    const { id } = e.currentTarget.dataset
    if (!id) return
    const currentTopic = recommendedTopics.find((item) => item.id === id)
    this.setData({
      selectedTopicId: id,
      selectedTopicTitle: currentTopic ? currentTopic.title : this.data.selectedTopicTitle,
      selectedOpener: currentTopic ? currentTopic.openers[0] : this.data.selectedOpener,
      selectedLaunchReason: currentTopic ? currentTopic.launchReason : this.data.selectedLaunchReason,
      selectedBackground: currentTopic ? currentTopic.background : this.data.selectedBackground
    })
  }
})
