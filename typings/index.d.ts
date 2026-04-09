interface IAppOption {
  globalData: {
    systemInfo: WechatMiniprogram.SystemInfo | null
    backendMode?: 'cloud' | 'mock'
    currentUser?: {
      id: string
      name: string
      initial: string
      bio: string
      location: string
      tags: string[]
    } | null
  }
}
