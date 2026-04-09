export interface BackendUser {
  id: string
  name: string
  initial: string
  bio: string
  location: string
  tags: string[]
}

export interface Venue {
  id: string
  name: string
  caption: string
  mood: string
  heroImage?: string
  discount: string
  presence: string
  monthLabel: string
  dayLabel: string
  dateCopy: string
}

export interface TopicParticipant {
  id: string
  name: string
  role: string
  initial: string
}

export interface Topic {
  id: string
  venueId: string
  dateKey: string
  monthLabel: string
  dayLabel: string
  weekday: string
  status: string
  statusLabel: string
  title: string
  initiator: string
  time: string
  location: string
  tags: string[]
  current: number
  total: number
  rules: string
  participants: TopicParticipant[]
}

export interface ProfileEvent {
  id: string
  previewEyebrow?: string
  kindLabel: string
  previewTitle: string
  previewText: string
  graphTag: string
  venue: string
  venueShort?: string
  relativeTime?: string
  indexLabel?: string
  identityLens: string
  summary: string
  footnote: string
  date: string
  heroTone: string
  body: string
  innerQuestion: string
}

export interface PersonProfile {
  id: string
  name: string
  initial: string
  bio: string
  location: string
  tags: string[]
  connectionHint: string
}

export function bootstrapBackend(): Promise<{ mode: 'cloud' | 'mock'; error?: unknown }>
export function ensureCurrentUser(): Promise<{ mode: 'cloud' | 'mock'; user: BackendUser; error?: unknown }>
export function fetchDiscoveryFeed(): Promise<{ mode: 'cloud' | 'mock'; venues: Venue[]; topics: Topic[]; error?: unknown }>
export function fetchTopicDetail(id: string): Promise<{ mode: 'cloud' | 'mock'; topic: Topic; error?: unknown }>
export function applyToTopic(id: string): Promise<{ mode: 'cloud' | 'mock'; ok: boolean; message: string; error?: unknown }>
export function fetchProfileHome(): Promise<{
  mode: 'cloud' | 'mock'
  user: BackendUser
  unlockEntry: { badge: string; title: string; detail: string; cta: string }
  coBuildEntry: { badge: string; title: string; detail: string; cta: string }
  eventSlides: ProfileEvent[]
  error?: unknown
}>
export function fetchEventDetail(options?: { id?: string; source?: string }): Promise<{
  mode: 'cloud' | 'mock'
  detailMode: 'official' | 'profile'
  event: any
  error?: unknown
}>
export function fetchPersonProfile(id: string): Promise<{
  mode: 'cloud' | 'mock'
  person: PersonProfile
  visibleEvents: ProfileEvent[]
  error?: unknown
}>
