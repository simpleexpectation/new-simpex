export const featuredEvent = {
  id: 'event-night-0322',
  title: '设计焦虑与不确定感的对话',
  subtitle: '今晚 19:30 - 21:30 · 泊光集 · 余位 7',
  host: '引导人 Iris',
  description: '把工作里的噪音留在门外，只讨论那些你最近真正卡住的事。',
  status: '报名中'
}

export const officialEvents = [
  {
    id: 'event-night-0322',
    title: '设计焦虑与不确定感的对话',
    time: '03/22 周日 19:30',
    venue: '泊光集',
    seats: '余位 7'
  },
  {
    id: 'event-morning-0324',
    title: '探索活动推荐创意',
    time: '03/24 周二 10:00',
    venue: '旷野公社',
    seats: '余位 12'
  },
  {
    id: 'event-party-0328',
    title: '跨领域夜谈：城市里的人情味',
    time: '03/28 周六 20:00',
    venue: '猫客厅',
    seats: '余位 5'
  }
]

export const venues = [
  {
    id: 'venue-kuangye',
    name: '敞开酒馆',
    caption: '适合慢下来说真话',
    mood: '适合慢下来说真话',
    heroImage: 'https://images.pexels.com/photos/30658142/pexels-photo-30658142.jpeg?cs=srgb&dl=pexels-noelace-30658142.jpg&fm=jpg',
    discount: '会员 8.5 折',
    presence: '在店 11 人',
    monthLabel: '3月',
    dayLabel: '22',
    dateCopy: '周六开放'
  },
  {
    id: 'venue-boguang',
    name: '泊光集',
    caption: '适合深夜反刍与复盘',
    mood: '适合深夜反刍与复盘',
    heroImage: 'https://images.pexels.com/photos/32458791/pexels-photo-32458791.jpeg?cs=srgb&dl=pexels-xx-32458791.jpg&fm=jpg',
    discount: '赠热饮一杯',
    presence: '在店 7 人',
    monthLabel: '3月',
    dayLabel: '20',
    dateCopy: '本周精选'
  },
  {
    id: 'venue-cat',
    name: '猫客厅',
    caption: '适合轻松破冰与漫谈',
    mood: '适合轻松破冰与漫谈',
    heroImage: 'https://images.pexels.com/photos/34989165/pexels-photo-34989165.jpeg?cs=srgb&dl=pexels-shields-34989165.jpg&fm=jpg',
    discount: '会员专属入场',
    presence: '在店 14 人',
    monthLabel: '3月',
    dayLabel: '18',
    dateCopy: '常驻空间'
  }
]

export const bubbles = [
  { id: 'bubble-1', name: '青原', initial: '青', role: '研究哲学的程序员', x: 22, y: 24, size: 188, floatDelay: '0', driftX: '14rpx', driftY: '22rpx', accentA: '#FFD9AE', accentB: '#F3A8C7', accentC: '#B6D7FF' },
  { id: 'bubble-2', name: 'Momo', initial: 'M', role: '做城市策展的人', x: 68, y: 18, size: 168, floatDelay: '-1.4', driftX: '18rpx', driftY: '16rpx', accentA: '#FFF0A8', accentB: '#A7E7C7', accentC: '#A9C7FF' },
  { id: 'bubble-3', name: 'Lynn', initial: 'L', role: '在练习更松弛地创作', x: 56, y: 46, size: 208, floatDelay: '-2.8', driftX: '16rpx', driftY: '24rpx', accentA: '#FFC7D9', accentB: '#F7E2A6', accentC: '#C4C8FF' },
  { id: 'bubble-4', name: '小越', initial: '小', role: '产品设计师，最近在重建节奏', x: 20, y: 58, size: 174, floatDelay: '-0.7', driftX: '20rpx', driftY: '18rpx', accentA: '#CFE7FF', accentB: '#B8F0D2', accentC: '#F6C3B1' },
  { id: 'bubble-5', name: 'Aki', initial: 'A', role: '拍纪录片，也写诗', x: 78, y: 64, size: 184, floatDelay: '-3.5', driftX: '22rpx', driftY: '20rpx', accentA: '#FFE2B6', accentB: '#FDB7AE', accentC: '#D3C3FF' },
  { id: 'bubble-6', name: 'Nora', initial: 'N', role: '一个做播客的观察者', x: 42, y: 70, size: 178, floatDelay: '-4.6', driftX: '18rpx', driftY: '26rpx', accentA: '#FFE8C8', accentB: '#B8D8FF', accentC: '#F2B6D8' }
]

export const presencePhases = [
  { key: 'before', label: '活动前' },
  { key: 'during', label: '活动中' },
  { key: 'after', label: '活动后' }
]

export const presenceEvent = {
  title: '设计焦虑与不确定感的对话',
  schedule: '今晚 19:30 - 21:30',
  venue: '泊光集 2F',
  status: '申请已确认',
  passCode: 'SPX-0721',
  qrHint: '到场后出示二维码完成签到，之后自动进入数字静默。',
  notice: '你已被加入本次在场名单。系统会在开场前 20 分钟再次提醒。'
}

export const attendeeCards = [
  {
    id: 'attendee-1',
    name: '青原',
    line: '一个正在研究哲学的程序员',
    expectation: '工作之外，什么还能定义一个人',
    accent: 'peach'
  },
  {
    id: 'attendee-2',
    name: 'Momo',
    line: '做城市策展，也在学习慢一点生活',
    expectation: '会带来一个关于城市陌生感的真实故事',
    accent: 'mist'
  },
  {
    id: 'attendee-3',
    name: 'Aki',
    line: '拍纪录片，也写诗',
    expectation: '也许会把今晚某个瞬间变成一句被记住的话',
    accent: 'sand'
  },
  {
    id: 'attendee-4',
    name: 'Lynn',
    line: '在练习更松弛地创作',
    expectation: '最近正在重新定义努力与表达',
    accent: 'sky'
  },
  {
    id: 'attendee-5',
    name: '小越',
    line: '产品设计师，最近在重建节奏',
    expectation: '可能会谈到如何从失控里慢慢回来',
    accent: 'peach'
  },
  {
    id: 'attendee-6',
    name: 'Nora',
    line: '一个做播客的观察者',
    expectation: '她总能把别人的情绪说得很轻很准',
    accent: 'mist'
  }
]

export const reflectionPrompts = [
  '把今晚你最想带走的一句话留在这里。',
  '记录一个你原本不会开口，但最后说出来了的瞬间。',
  '如果愿意，把这次相遇沉淀成一个属于你的事件。'
]

export const presenceConversations = [
  {
    id: 'presence-dialog-1',
    title: '设计焦虑与不确定感的对话',
    schedule: '今晚 19:30 - 21:30',
    venue: '泊光集 2F',
    month: '3月',
    day: '22日',
    role: 'applicant',
    roleLabel: '你申请加入',
    status: 'confirmed',
    statusLabel: '已确认',
    statusHint: '你和发起人都已确认，这场对话已经成立。',
    autoConfirmHint: '若 30 分钟内无人操作，系统将默认同意。',
    ticketReady: true,
    attendeeCount: 6,
    featuredAttendeeId: 'attendee-1',
    featuredAttendeeName: '青原',
    featuredAttendeeLine: '一个正在研究哲学的程序员'
  },
  {
    id: 'presence-dialog-2',
    title: '离职之后，你是怎么重新找到节奏的？',
    schedule: '今晚 22:30 - 00:30',
    venue: '文二路某咖啡馆',
    month: '4月',
    day: '1日',
    role: 'applicant',
    roleLabel: '你申请加入',
    status: 'pending',
    statusLabel: '等待回应',
    statusHint: '发起人还没有处理你的申请。现在不需要你做任何事，只等对方点头。',
    autoConfirmHint: '若 30 分钟内仍未处理，系统将默认同意。',
    ticketReady: false,
    attendeeCount: 4,
    featuredAttendeeId: 'attendee-2',
    featuredAttendeeName: 'Momo',
    featuredAttendeeLine: '做城市策展，也在学习慢一点生活'
  },
  {
    id: 'presence-dialog-3',
    title: '城市里的人情味，会如何慢慢长出来？',
    schedule: '明晚 20:00 - 22:00',
    venue: '旷野公社',
    month: '4月',
    day: '2日',
    role: 'host',
    roleLabel: '你发起的对话',
    status: 'pending',
    statusLabel: '待你确认',
    statusHint: '有 1 位申请者正在等待加入。你不处理的话，30 分钟后系统会默认同意。',
    autoConfirmHint: '剩余自动确认时间 17 分钟。',
    ticketReady: false,
    attendeeCount: 4,
    featuredAttendeeId: 'attendee-4',
    featuredAttendeeName: 'Lynn',
    featuredAttendeeLine: '在练习更松弛地创作'
  },
  {
    id: 'presence-dialog-4',
    title: '人在亲密关系里，最难说出口的话是什么？',
    schedule: '4月3日 21:00 - 23:00',
    venue: '天目里咖啡厅',
    month: '4月',
    day: '3日',
    role: 'applicant',
    roleLabel: '你申请加入',
    status: 'declined',
    statusLabel: '未通过',
    statusHint: '这场对话这次没有和你匹配成功。你可以先放下，之后再看看别的相遇。',
    autoConfirmHint: '系统已为你保留同类型推荐。',
    ticketReady: false,
    attendeeCount: 0,
    featuredAttendeeId: 'attendee-6',
    featuredAttendeeName: 'Nora',
    featuredAttendeeLine: '一个做播客的观察者'
  },
  {
    id: 'presence-dialog-5',
    title: '如果不再追求效率，生活会不会更完整？',
    schedule: '4月4日 15:00 - 17:00',
    venue: '西湖边书店',
    month: '4月',
    day: '4日',
    role: 'host',
    roleLabel: '你发起的对话',
    status: 'confirmed',
    statusLabel: '已成局',
    statusHint: '这场对话已经凑齐人了。你只需要按时到场，剩下的交给在场。',
    autoConfirmHint: '票据与同场名单已就绪。',
    ticketReady: true,
    attendeeCount: 5,
    featuredAttendeeId: 'attendee-3',
    featuredAttendeeName: 'Aki',
    featuredAttendeeLine: '拍纪录片，也写诗'
  },
  {
    id: 'presence-dialog-6',
    title: '当代城市里，什么是真正的孤独？',
    schedule: '刚刚结束 · 今晚 23:00',
    venue: '西湖边某处',
    month: '4月',
    day: '1日',
    role: 'ended',
    roleLabel: '刚刚结束',
    status: 'recap',
    statusLabel: '写此刻',
    statusHint: '这一刻已经过去了。如果愿意，留一句话或一张照片，让它成为下次相遇前的期待。',
    autoConfirmHint: '你留下的内容，会在下次对话前被温柔展示。',
    ticketReady: false,
    attendeeCount: 2,
    featuredAttendeeId: 'attendee-5',
    featuredAttendeeName: '小越',
    featuredAttendeeLine: '产品设计师，最近在重建节奏'
  }
]

export const topics = [
  {
    id: 'topic-1',
    venueId: 'venue-kuangye',
    dateKey: '2026-03-20',
    monthLabel: '3月',
    dayLabel: '20',
    weekday: '五',
    status: 'live',
    statusLabel: '正在发生',
    title: '"离职之后，你是怎么重新找到节奏的？"',
    initiator: '阿强',
    time: '22:30 · 今晚',
    location: '文二路某咖啡馆',
    tags: ['Gap Year', '职场'],
    current: 4,
    total: 6,
    rules: '< 6人 · 时长 > 2小时 · 用户自发',
    participants: [
      { id: 'bubble-1', name: '青原', role: '研究哲学的程序员', initial: '青' },
      { id: 'bubble-4', name: '小越', role: '产品设计师', initial: '越' },
      { id: 'bubble-2', name: 'Momo', role: '做城市策展的人', initial: 'M' },
      { id: 'bubble-5', name: 'Aki', role: '拍纪录片，也写诗', initial: 'A' }
    ]
  },
  {
    id: 'topic-2',
    venueId: 'venue-boguang',
    dateKey: '2026-03-21',
    monthLabel: '3月',
    dayLabel: '21',
    weekday: '六',
    status: 'upcoming',
    statusLabel: '明天发生',
    title: '"AI 会不会让创意工作者失业？我不这么认为"',
    initiator: '七哥',
    time: '20:00 · 明天',
    location: '某 Co-working Space',
    tags: ['AI', '创意', '辩论'],
    current: 3,
    total: 6,
    rules: '< 6人 · 时长 > 2小时 · 用户自发',
    participants: [
      { id: 'bubble-3', name: 'Lynn', role: '在练习更松弛地创作', initial: 'L' },
      { id: 'bubble-2', name: 'Momo', role: '做城市策展的人', initial: 'M' },
      { id: 'bubble-5', name: 'Aki', role: '拍纪录片，也写诗', initial: 'A' }
    ]
  },
  {
    id: 'topic-3',
    venueId: 'venue-cat',
    dateKey: '2026-03-22',
    monthLabel: '3月',
    dayLabel: '22',
    weekday: '日',
    status: 'live',
    statusLabel: '正在发生',
    title: '"当代城市里，什么是真正的孤独？"',
    initiator: '子木',
    time: '23:00 · 今晚',
    location: '西湖边某处',
    tags: ['城市', '孤独', '深度'],
    current: 2,
    total: 6,
    rules: '< 6人 · 时长 > 2小时 · 用户自发',
    participants: [
      { id: 'bubble-1', name: '青原', role: '研究哲学的程序员', initial: '青' },
      { id: 'bubble-4', name: '小越', role: '产品设计师', initial: '越' }
    ]
  },
  {
    id: 'topic-4',
    venueId: 'venue-boguang',
    dateKey: '2026-03-20',
    monthLabel: '3月',
    dayLabel: '20',
    weekday: '五',
    status: 'upcoming',
    statusLabel: '今晚发生',
    title: '"探索活动推荐创意"',
    initiator: 'Mavis',
    time: '19:30 · 今晚',
    location: '滨江共享空间',
    tags: ['活动', '创意', '策划'],
    current: 2,
    total: 6,
    rules: '< 6人 · 时长 > 90分钟 · 用户自发',
    participants: []
  },
  {
    id: 'topic-5',
    venueId: 'venue-kuangye',
    dateKey: '2026-03-21',
    monthLabel: '3月',
    dayLabel: '21',
    weekday: '六',
    status: 'live',
    statusLabel: '正在发生',
    title: '"第一次创业失败后，怎么重新相信自己？"',
    initiator: '林夏',
    time: '20:30 · 周六',
    location: '武林路小酒馆',
    tags: ['创业', '失败', '重建'],
    current: 5,
    total: 6,
    rules: '< 6人 · 时长 > 2小时 · 用户自发',
    participants: []
  },
  {
    id: 'topic-6',
    venueId: 'venue-cat',
    dateKey: '2026-03-21',
    monthLabel: '3月',
    dayLabel: '21',
    weekday: '六',
    status: 'upcoming',
    statusLabel: '明晚发生',
    title: '"人在亲密关系里，最难说出口的话是什么？"',
    initiator: '阿北',
    time: '21:00 · 周六',
    location: '天目里咖啡厅',
    tags: ['亲密关系', '表达'],
    current: 3,
    total: 6,
    rules: '< 6人 · 时长 > 2小时 · 用户自发',
    participants: []
  },
  {
    id: 'topic-7',
    venueId: 'venue-boguang',
    dateKey: '2026-03-22',
    monthLabel: '3月',
    dayLabel: '22',
    weekday: '日',
    status: 'live',
    statusLabel: '正在发生',
    title: '"如果不再追求效率，生活会不会更完整？"',
    initiator: '周周',
    time: '15:00 · 周日',
    location: '西湖边书店',
    tags: ['生活', '效率', '松弛'],
    current: 4,
    total: 6,
    rules: '< 6人 · 时长 > 90分钟 · 用户自发',
    participants: []
  },
  {
    id: 'topic-8',
    venueId: 'venue-kuangye',
    dateKey: '2026-03-22',
    monthLabel: '3月',
    dayLabel: '22',
    weekday: '日',
    status: 'upcoming',
    statusLabel: '今晚发生',
    title: '"为什么我们越来越难真正地休息？"',
    initiator: 'Momo',
    time: '19:00 · 周日',
    location: '湖滨露台',
    tags: ['休息', '情绪', '身体'],
    current: 1,
    total: 6,
    rules: '< 6人 · 时长 > 2小时 · 用户自发',
    participants: []
  },
  {
    id: 'topic-9',
    venueId: 'venue-cat',
    dateKey: '2026-03-22',
    monthLabel: '3月',
    dayLabel: '22',
    weekday: '日',
    status: 'upcoming',
    statusLabel: '周日发生',
    title: '"城市里还有没有真正的陌生人时刻？"',
    initiator: 'Aki',
    time: '20:30 · 周日',
    location: '运河边散步线',
    tags: ['城市', '陌生感', '观察'],
    current: 2,
    total: 6,
    rules: '< 6人 · 时长 > 2小时 · 用户自发',
    participants: []
  }
]

export const memberMoments = [
  {
    title: '在泊光集聊完之后，我终于决定停掉一个无效合作。',
    venue: '泊光集',
    date: '03/12'
  },
  {
    title: '第一次在旷野公社把焦虑说完整，发现它没有那么可怕。',
    venue: '旷野公社',
    date: '03/05'
  }
]
