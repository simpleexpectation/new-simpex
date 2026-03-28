App({
  globalData: {
    systemInfo: null
  },
  onLaunch() {
    const systemInfo = wx.getSystemInfoSync()
    this.globalData.systemInfo = systemInfo
  }
})
