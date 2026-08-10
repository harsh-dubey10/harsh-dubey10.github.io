import type {
  AchievementEntry,
  ConnectLink,
  EducationEntry,
  ProjectEntry,
  TimelineEntry,
} from '../types'

export const profile = {
  name: 'Harsh Vardhan Dubey',
  location: 'Gandhinagar, India',
  level: 'Lv. 23',
  roles: ['M.Tech student, IIT Gandhinagar', 'Systems × Formal Verification'],
  bio: [
    "I'm a second-year M.Tech student in Computer Science & Engineering at IIT Gandhinagar, working in the FUSS Group under the supervision of Prof. Abhishek Bichhawat.",
    'I like building things end to end from distributed multi-agent systems to NLP pipelines for Hindi, and spend most of my time figuring out how something works, then making it work better.',
  ],
}

export const education: EducationEntry[] = [
  {
    school: 'IIT Gandhinagar',
    program: 'M.Tech, Computer Science & Engineering',
    period: '',
    stat: '',
  },
  {
    school: 'Bhilai Institute of Technology, Durg',
    program: 'B.Tech, Computer Science & Engineering',
    period: '',
    stat: '',
  },
]

export const skills: string[] = [
  'C++',
  'Python',
  'Go',
  'JavaScript',
  'PyTorch',
  'Scikit-Learn',
  'IndicNLP',
  'FastAPI',
  'React',
  'Node.js',
  'MongoDB',
  'MySQL',
  'Docker',
  'Git',
  'NLP',
  'LLMs',
]

export const timeline: TimelineEntry[] = [
  {
    id: 'aicte',
    initial: 'A',
    org: 'AICTE Idea Lab, BIT Durg',
    role: 'Student Ambassador',
    period: 'Oct 2022 — May 2024',
    level: 1,
    description:
      'Provided technical assistance and guidance to students working with Arduino Uno, 3D printers, CNC machines, and other fabrication tools. Promoted design thinking and assisted in technical problem-solving and project execution.',
    tags: ['Arduino', '3D Printing', 'Mentorship'],
  },
  {
    id: 'vivada',
    initial: 'V',
    org: 'Vivada, Yarasi Tech',
    role: 'Software Engineering Intern',
    period: 'Apr 2024 — Jul 2024',
    level: 2,
    description:
      'Applied data-driven experimentation and iterative prototyping, reducing abandonment by 25%. Collaborated with cross-functional teams to evaluate design improvements and optimize user engagement.',
    tags: ['Experimentation', 'Prototyping'],
  },
  {
    id: 'fuss',
    initial: 'F',
    org: 'FUSS Group, IIT Gandhinagar',
    role: 'M.Tech Researcher, advised by Prof. Abhishek Bichhawat',
    period: '2025 — Present',
    level: 3,
    description:
      'Researching and building within the FUSS Group, working across systems, NLP, and AI-driven tooling.',
    tags: ['Research', 'NLP', 'Systems'],
    current: true,
  },
]

export const projects: ProjectEntry[] = [
  {
    index: '01',
    title: 'Viralyst',
    summary: 'AI-powered virality analysis platform',
    bullets: [
      'Designed and implemented a distributed multi-agent system using autonomous LLM agents, with concurrent execution via goroutines and channels simulating 100+ parallel agents.',
      'Built scalable experimentation pipelines for evaluating engagement prediction across generated content.',
      'Engineered task scheduling and inter-agent communication to ensure fault-tolerant execution at scale.',
    ],
    tags: ['Go', 'LLM Agents', 'Concurrency', 'Distributed Systems'],
    href: 'https://github.com/harsh-dubey10/Viralyst',
    linkLabel: 'View repository',
  },
  {
    index: '02',
    title: 'Grammarly for Hindi',
    summary: 'Hindi grammar correction system',
    bullets: [
      'Developed an NLP-based Hindi grammar correction system capable of detecting spelling, agreement, and syntactic errors across diverse sentence structures.',
      'Built preprocessing and feature engineering pipelines for Hindi text using Python and IndicNLP.',
      'Conducted structured evaluation across formal, conversational, and mixed-dialect datasets, with error analysis to improve correction quality through iterative experimentation.',
    ],
    tags: ['Python', 'NLP', 'IndicNLP'],
    href: 'https://github.com/SaaranshShandilya/grammarly-for-hindi',
    linkLabel: 'View repository',
  },
]

export const achievements: AchievementEntry[] = [
  {
    tag: 'Rank 3',
    title: 'Dept. rank 3 of 125, B.Tech — 4th-year topper',
    date: 'March 2025',
  },
  {
    tag: 'Qualified',
    title: 'GATE CS 2025',
    date: 'March 2025',
  },
  {
    tag: 'Selected',
    title: 'Google Cloud Ready Program',
    date: 'May – July 2023',
  },
  {
    tag: 'Completed',
    title: 'AICTE Smart Manufacturing skilling program',
    date: 'September 2022',
  },
]

export const connectLinks: ConnectLink[] = [
  { label: 'Resume', href: '/resume.pdf', action: 'Loot', icon: 'download' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/harshvardhandubey-/', action: 'Connect', icon: 'linkedin' },
  { label: 'Email', href: 'mailto:harsh.dubey@iitgn.ac.in', action: 'Write', icon: 'mail' },
  { label: 'GitHub', href: 'https://github.com/harsh-dubey10', action: 'Browse', icon: 'github' },
]

export const galleryImages: { src: string; caption: string }[] = [
  { src: '/profile.PNG', caption: 'Late-night wander, gear in hand.' },
]
