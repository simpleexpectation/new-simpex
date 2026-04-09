const venues = [
  {
    id: 'venue-kuangye',
    name: '敞开酒馆',
    caption: '适合慢下来说真话',
    mood: '适合慢下来说真话',
    discount: '会员 8.5 折',
    presence: '在店 11 人'
  },
  {
    id: 'venue-boguang',
    name: '泊光集',
    caption: '适合深夜反刍与复盘',
    mood: '适合深夜反刍与复盘',
    discount: '赠热饮一杯',
    presence: '在店 7 人'
  },
  {
    id: 'venue-cat',
    name: '猫客厅',
    caption: '适合轻松破冰与漫谈',
    mood: '适合轻松破冰与漫谈',
    discount: '会员专属入场',
    presence: '在店 14 人'
  }
]

const topics = [
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
    participants: ['person-qingyuan', 'person-xiaoyue', 'person-momo', 'person-aki']
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
    participants: ['person-lynn', 'person-momo', 'person-aki']
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
    participants: ['person-qingyuan', 'person-xiaoyue']
  }
]

const people = [
  {
    id: 'person-qingyuan',
    name: '青原',
    initial: '青',
    bio: '一个正在研究哲学的程序员',
    location: '中国 · 杭州',
    tags: ['哲学', '程序员'],
    connectionHint: '如果你也在想工作之外还有什么能定义一个人，也许可以从这里开始。',
    eventIds: ['my-event-1', 'my-event-4']
  },
  {
    id: 'person-momo',
    name: 'Momo',
    initial: 'M',
    bio: '做城市策展，也在学习慢一点生活',
    location: '中国 · 杭州',
    tags: ['策展', '城市'],
    connectionHint: '她很在意城市里的陌生感和人与人之间微妙的距离。',
    eventIds: ['my-event-2', 'my-event-5']
  },
  {
    id: 'person-lynn',
    name: 'Lynn',
    initial: 'L',
    bio: '在练习更松弛地创作',
    location: '中国 · 杭州',
    tags: ['创作者'],
    connectionHint: '和她聊天，常常会从一个很小的真感受开始，然后慢慢打开。',
    eventIds: ['my-event-3', 'my-event-4']
  },
  {
    id: 'person-aki',
    name: 'Aki',
    initial: 'A',
    bio: '拍纪录片，也写诗',
    location: '中国 · 杭州',
    tags: ['纪录片', '写作'],
    connectionHint: 'TA 会记住气氛、光线和停顿，比结论更先被留下来。',
    eventIds: ['my-event-2', 'my-event-5']
  },
  {
    id: 'person-xiaoyue',
    name: '小越',
    initial: '越',
    bio: '产品设计师，最近在重建节奏',
    location: '中国 · 杭州',
    tags: ['产品设计', '生活节奏'],
    connectionHint: '如果你也在经历失控之后的重建，可能会很容易和 TA 接上。',
    eventIds: ['my-event-1', 'my-event-3']
  },
  {
    id: 'person-nora',
    name: 'Nora',
    initial: 'N',
    bio: '一个做播客的观察者',
    location: '中国 · 杭州',
    tags: ['播客', '观察'],
    connectionHint: '她很擅长把模糊的情绪说得很轻，也很准。',
    eventIds: ['my-event-4', 'my-event-5']
  }
]

const profileEvents = [
  {
    id: 'my-event-1',
    ownerId: 'demo-user',
    previewEyebrow: '一句话',
    previewTitle: '我开始允许自己慢下来',
    previewText: '先承认自己已经太久没有停下来。',
    kindLabel: '一句话',
    title: '离职之后，你是怎么重新找到节奏的？',
    venue: '文二路某咖啡馆',
    date: '04/01',
    heroTone: '0',
    anchor: '写此刻',
    body: '在泊光集聊完之后，我终于决定停掉一个无效合作。原来重新找到节奏，不是立刻开始新的计划，而是先承认自己已经太久没有停下来。',
    summary: '一句话也可以成为一场相遇的后续。',
    identityLens: '它让别人看见，你不是一个一直往前冲的人。你在意节奏，也在意自己有没有被生活真正接住。',
    innerQuestion: '如果不再用效率证明自己，我还可以怎样定义现在的我？',
    graphTag: '节奏感',
    footnote: '来自一场刚结束的对话'
  },
  {
    id: 'my-event-2',
    ownerId: 'demo-user',
    previewEyebrow: '照片 + 文字',
    previewTitle: '风很大的夜里',
    previewText: '夜色',
    kindLabel: '照片',
    title: '当代城市里，什么是真正的孤独？',
    venue: '西湖边某处',
    date: '03/28',
    heroTone: '1',
    anchor: '一张照片',
    body: '那天的风很大，我们聊完以后沿着湖边走了很久，谁都没有急着离开。后来只留下这一张不太清晰的照片，但它反而比记叙更像真实发生过。',
    summary: '它会在下一次相遇前，轻轻提醒对方你曾经如何在场。',
    identityLens: '它代表你会记住氛围、停顿和人与空间之间的细小关系，而不只是结论本身。',
    innerQuestion: '什么样的时刻，会让我愿意和一个人继续走下去，而不是聊完就散？',
    graphTag: '场景感',
    footnote: '一张照片也能成为事件'
  },
  {
    id: 'my-event-3',
    ownerId: 'demo-user',
    previewEyebrow: '图文一起',
    previewTitle: '终于愿意把焦虑说完整',
    previewText: '泊光集',
    kindLabel: '图文',
    title: '设计焦虑与不确定感的对话',
    venue: '泊光集',
    date: '03/22',
    heroTone: '2',
    anchor: '图文一起',
    body: '第一次把焦虑说完整，发现它没有那么可怕。原来最难的不是解决问题，而是承认自己其实已经很累了。',
    summary: '这是你最常被点开的事件。',
    identityLens: '它会让人感到，你并不只想交换观点，你也愿意把自己真实卡住的地方说出来。',
    innerQuestion: '当我不再急着看起来成熟，什么样的连接才会开始发生？',
    graphTag: '脆弱感',
    footnote: '最近最常被看到的一则'
  }
]

const officialEvents = [
  {
    id: 'event-night-0322',
    title: '设计焦虑与不确定感的对话',
    subtitle: '今晚 19:30 - 21:30 · 泊光集 · 余位 7',
    host: '引导人 Iris',
    description: '把工作里的噪音留在门外，只讨论那些你最近真正卡住的事。',
    status: '报名中',
    schedule: '今晚 19:30 - 21:30',
    location: '泊光集 · 杭州天目里附近',
    guide: 'Iris · 产品叙事研究',
    seatsText: '报名中 · 余 7 位（限额 20 人）'
  }
]

const defaultUser = {
  id: 'demo-user',
  name: 'Lynn',
  initial: 'L',
  bio: '在练习更松弛地创作',
  location: '中国 · 杭州',
  tags: ['创作者']
}

module.exports = {
  venues,
  topics,
  people,
  profileEvents,
  officialEvents,
  defaultUser
}
