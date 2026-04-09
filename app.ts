const backend = require('./lib/backend/index') as typeof import('./lib/backend/index')

App<IAppOption>({
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
