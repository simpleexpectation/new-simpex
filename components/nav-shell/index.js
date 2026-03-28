Component({
  properties: {
    title: {
      type: String,
      value: ''
    },
    eyebrow: {
      type: String,
      value: ''
    },
    compact: {
      type: Boolean,
      value: false
    }
  },
  data: {
    topInset: 44
  },
  lifetimes: {
    attached() {
      const app = getApp()
      const systemInfo = app.globalData.systemInfo || wx.getSystemInfoSync()
      this.setData({
        topInset: systemInfo.statusBarHeight || 44
      })
    }
  }
})
