const quickQuestions = [
  {
    key: 'expectation',
    eyebrow: 'Question 01',
    title: '你最近期待聊些什么？',
    hint: '不用想得很完整，只要说一个你最近反复想起的话题就够了。',
    placeholder: '比如：我最近很想聊聊重新建立生活节奏这件事。',
    suggestions: ['重新适应生活节奏', '想认识能认真聊天的人', '最近总在想关系和连接']
  },
  {
    key: 'state',
    eyebrow: 'Question 02',
    title: '你最近的状态是什么？',
    hint: '可以是一种情绪、一段阶段感，也可以是一种生活气候。',
    placeholder: '比如：我最近像在过渡期，很多东西都还没完全安定下来。',
    suggestions: ['有点过渡期', '慢慢恢复表达欲', '比以前更想靠近真实的人']
  },
  {
    key: 'thinking',
    eyebrow: 'Question 03',
    title: '你最近有哪些思考？',
    hint: '一句模糊的问题也可以，系统会帮你把它整理成更适合发起的话题卡。',
    placeholder: '比如：我开始在想，人到底是在寻找连接，还是寻找被刚好理解的感觉。',
    suggestions: ['关系里最珍贵的是什么', '我真正想留下什么', '附近有没有更适合我的人']
  }
]

const generatedCard = {
  eyebrow: 'AI 整理出的第一张对话卡',
  title: '最近这段时间，你有没有慢慢进入一种新的生活方式？',
  summary: '你最近像站在一个新的阶段门口，既在重新适应节奏，也在认真判断自己想靠近怎样的人。',
  launchReason: '从一个真实的近况开始，去遇见能认真接住这个状态的人。',
  people: ['正在适应变化的人', '愿意认真交换近况的人', '也在寻找刚好理解感的人']
}

const buildQuestionCards = (answers) =>
  quickQuestions.map((question) => ({
    ...question,
    value: answers[question.key] || ''
  }))

const initialAnswers = {
  expectation: '我最近想聊聊，生活节奏慢慢变化以后，人会重新靠近什么。',
  state: '像在一个过渡期里，表面很平静，但心里其实一直在重新排序很多东西。',
  thinking: '我开始在想，人与人靠近时，最珍贵的到底是陪伴，还是那种被刚好理解的感觉。'
}

Page({
  data: {
    mode: 'questions',
    pageReady: false,
    pageLeaving: false,
    questionCards: buildQuestionCards(initialAnswers),
    answers: initialAnswers,
    voiceDraft: '我最近总觉得自己正在慢慢进入新的生活方式，也比以前更想和能认真回应的人在一起。如果要发起一场对话，我想从这种正在变化的状态开始。',
    generatedCard,
    cardReady: true
  },
  onShow() {
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
  switchMode(e) {
    const { mode } = e.currentTarget.dataset
    if (!mode || mode === this.data.mode) return
    this.setData({ mode })
  },
  fillSuggestion(e) {
    const { key, value } = e.currentTarget.dataset
    if (!key || !value) return
    const answers = {
      ...this.data.answers,
      [key]: value
    }
    this.setData({
      [`answers.${key}`]: value,
      questionCards: buildQuestionCards(answers)
    })
  },
  updateAnswer(e) {
    const { key } = e.currentTarget.dataset
    if (!key) return
    const answers = {
      ...this.data.answers,
      [key]: e.detail.value
    }
    this.setData({
      [`answers.${key}`]: e.detail.value,
      questionCards: buildQuestionCards(answers)
    })
  },
  updateVoiceDraft(e) {
    this.setData({ voiceDraft: e.detail.value })
  },
  generateCard() {
    this.setData({ cardReady: true })
    wx.showToast({
      title: '已经替你整理出第一张卡',
      icon: 'none'
    })
  },
  subscribeLaunch() {
    wx.showToast({
      title: '这里接订阅并发起流程',
      icon: 'none'
    })
  },
  continueOptimize() {
    wx.showToast({
      title: '这里接继续优化卡片流程',
      icon: 'none'
    })
  }
})
