Page({
  data: {
    pageReady: false,
    pageLeaving: false,
    membership: {
      plan: '真实发生月卡',
      price: '99',
      renewal: '到期前 3 天提醒，随时可取消续费',
      perks: [
        '🌑 每月解锁全部 60 场深度对话，不限话题类型',
        '✦ 优先匹配同频成员，响应时间缩短至 4 小时内',
        '◈ 专属黑洞模式：进入对话后屏蔽所有外部通知',
        '⌖ 每月 3 次主动发起权，可自定义话题和规则',
        '◉ 对话结束后获得 AI 提炼的「话题 DNA」卡片'
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
  startMembershipPurchase() {
    wx.showToast({
      title: '这里接 99 元购买流程',
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
