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
    name: '旷野公社',
    mood: '适合慢下来说真话',
    discount: '会员 8.5 折',
    presence: '在店 11 人'
  },
  {
    id: 'venue-boguang',
    name: '泊光集',
    mood: '适合深夜反刍与复盘',
    discount: '赠热饮一杯',
    presence: '在店 7 人'
  },
  {
    id: 'venue-cat',
    name: '猫客厅',
    mood: '适合轻松破冰与漫谈',
    discount: '会员专属入场',
    presence: '在店 14 人'
  }
]

export const bubbles = [
  { id: 'bubble-1', name: '青原', initial: '青', role: '研究哲学的程序员', x: 22, y: 24, size: 120, floatDelay: '0' },
  { id: 'bubble-2', name: 'Momo', initial: 'M', role: '做城市策展的人', x: 68, y: 18, size: 92, floatDelay: '-1.4' },
  { id: 'bubble-3', name: 'Lynn', initial: 'L', role: '在练习更松弛地创作', x: 56, y: 46, size: 138, floatDelay: '-2.8' },
  { id: 'bubble-4', name: '小越', initial: '小', role: '产品设计师，最近在重建节奏', x: 20, y: 58, size: 106, floatDelay: '-0.7' },
  { id: 'bubble-5', name: 'Aki', initial: 'A', role: '拍纪录片，也写诗', x: 78, y: 64, size: 116, floatDelay: '-3.5' }
]

export const topics = [
  {
    id: 'topic-1',
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
