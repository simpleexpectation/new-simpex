Page({
  data: {
    pageReady: false,
    pageLeaving: false,
    selectedPlanKey: 'week',
    planOptions: [
      {
        key: 'week',
        badge: 'First try',
        plan: '真实发生周卡',
        price: '49',
        billing: '/ 周',
        renewal: '7 天轻量体验，适合第一次试试看',
        cta: '立即购买周卡 ¥49',
        perks: [
          '◉ 7 天内解锁 8 场精选真实对话，含线上活动入口',
          '✦ 保留一次主动发起权，先试着发起一场',
          '◈ 对话结束后保留事件沉淀与回看'
        ]
      },
      {
        key: 'month',
        badge: 'Deep use',
        plan: '真实发生月卡',
        price: '99',
        billing: '/ 月',
        renewal: '到期前 3 天提醒，随时可取消续费',
        cta: '立即购买月卡 ¥99',
        perks: [
          '🌑 每月解锁全部 60 场深度对话，不限话题类型',
          '✦ 优先匹配同频成员，响应时间缩短至 4 小时内',
          '◈ 专属黑洞模式：进入对话后屏蔽所有外部通知',
          '⌖ 每月 3 次主动发起权，可自定义话题和规则',
          '◉ 对话结束后获得 AI 提炼的「话题 DNA」卡片'
        ]
      }
    ],
    activePlan: {
      key: 'week',
      badge: 'First try',
      plan: '真实发生周卡',
      price: '49',
      billing: '/ 周',
      renewal: '7 天轻量体验，适合第一次试试看',
      cta: '立即购买周卡 ¥49',
      perks: [
        '◉ 7 天内解锁 8 场精选真实对话，含线上活动入口',
        '✦ 保留一次主动发起权，先试着发起一场',
        '◈ 对话结束后保留事件沉淀与回看'
      ]
    },
    limitedQuota: {
      remaining: 12,
      total: 30
    },
    inviteProgram: {
      buttonText: '邀请 2 位好友，限时 0 元开启',
      description: '好友完成注册并参与第一次对话后，你的月卡自动生效。无需付款，无需等待。'
    }
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
  selectPlan(e) {
    const { key } = e.currentTarget.dataset || {}
    if (!key) return
    const activePlan = this.data.planOptions.find((item) => item.key === key) || this.data.planOptions[0]
    this.setData({
      selectedPlanKey: key,
      activePlan
    })
  },
  startMembershipPurchase() {
    wx.showToast({
      title: `这里接 ${this.data.activePlan.price} 元${this.data.activePlan.plan}购买流程`,
      icon: 'none'
    })
  },
  startInviteUnlock() {
    this.setData({ pageLeaving: true })
    setTimeout(() => {
      wx.navigateTo({ url: '/pages/access-center/index?source=membership&mode=unlock' })
    }, 180)
  },
  goBack() {
    this.setData({ pageLeaving: true })
    setTimeout(() => {
      wx.navigateBack()
    }, 180)
  },
  goProfile() {
    this.setData({ pageLeaving: true })
    setTimeout(() => {
      wx.switchTab({ url: '/pages/profile/index' })
    }, 180)
  }
})
