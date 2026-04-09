const backend = require('./lib/backend/index')

App({
  globalData: {
    systemInfo: null,
    backendMode: 'mock',
    currentUser: null
  },
  async onLaunch() {
    const systemInfo = wx.getSystemInfoSync()
    this.globalData.systemInfo = systemInfo

    const bootstrap = await backend.bootstrapBackend()
    this.globalData.backendMode = bootstrap.mode

    const session = await backend.ensureCurrentUser()
    this.globalData.currentUser = session.user
    this.globalData.backendMode = session.mode
  }
})
