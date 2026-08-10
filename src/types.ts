export interface EducationEntry {
  school: string
  program: string
  period: string
  stat: string
}

export interface TimelineEntry {
  id: string
  initial: string
  org: string
  role: string
  period: string
  level: number
  description: string
  tags: string[]
  current?: boolean
}

export interface ProjectEntry {
  index: string
  title: string
  summary: string
  bullets: string[]
  tags: string[]
  href: string
  linkLabel: string
}

export interface AchievementEntry {
  tag: string
  title: string
  date: string
}

export type ConnectIcon = 'mail' | 'linkedin' | 'github' | 'download'

export interface ConnectLink {
  label: string
  href: string
  action: string
  icon: ConnectIcon
}
