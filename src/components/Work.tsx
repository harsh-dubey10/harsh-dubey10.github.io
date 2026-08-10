import { ArrowUpRight } from 'lucide-react'
import { type MouseEvent, useRef } from 'react'
import { projects } from '../data/content'
import type { ProjectEntry } from '../types'
import DynamicBackground from './DynamicBackground'
import Reveal from './Reveal'

const ROMAN_NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI']

function ProjectCard({
  project,
  index,
  delay,
}: {
  project: ProjectEntry
  index: number
  delay: number
}) {
  const ref = useRef<HTMLDivElement>(null)

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -2.5
    const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 2.5
    el.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`
  }

  function handleMouseLeave() {
    const el = ref.current
    if (!el) return
    el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0)'
  }

  return (
    <Reveal delay={delay} className="mb-12">
      {/* Roman Numeral Section Divider Header matching reference site */}
      <div className="flex justify-center mb-5">
        <div className="flex items-center gap-3">
          <div className="h-px w-12 bg-amber-700/45" />
          <span className="text-sm font-display font-bold text-amber-500/90 tracking-[0.3em]">
            {ROMAN_NUMERALS[index] || `0${index + 1}`}
          </span>
          <div className="h-px w-12 bg-amber-700/45" />
        </div>
      </div>

      {/* Main Project Card Container */}
      <div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="group relative rounded-xl p-6 sm:p-10 border border-white/[0.12] backdrop-blur-sm hover:border-white/[0.25] transition-colors cursor-pointer will-change-transform"
        style={{
          background:
            'linear-gradient(135deg, rgba(30, 15, 15, 0.9) 0%, rgba(20, 10, 10, 0.95) 50%, rgba(30, 15, 15, 0.9) 100%)',
          boxShadow:
            '0 0 60px rgba(180, 30, 30, 0.06), 0 0 120px rgba(255, 140, 0, 0.03), inset 0 1px 0 rgba(255, 255, 255, 0.04)',
        }}
      >
        {/* Top/Bottom Gradient Sheen Border */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px transition-opacity duration-300 opacity-100 group-hover:opacity-0"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(255, 160, 50, 0.3), transparent)',
          }}
        />
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px transition-opacity duration-300 opacity-0 group-hover:opacity-100"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(255, 160, 50, 0.5), transparent)',
          }}
        />

        {/* Vintage Corner Accents */}
        <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-amber-700/45 group-hover:border-amber-500/50 rounded-tl-sm transition-colors" />
        <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-amber-700/45 group-hover:border-amber-500/50 rounded-tr-sm transition-colors" />
        <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-amber-700/45 group-hover:border-amber-500/50 rounded-bl-sm transition-colors" />
        <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-amber-700/45 group-hover:border-amber-500/50 rounded-br-sm transition-colors" />

        {/* Cleanly Aligned Project Title & Summary Block */}
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="flex-1 text-left">
            <h3 className="font-display font-bold text-2xl sm:text-3xl text-white leading-tight mb-1">
              {project.title}
            </h3>
            <p className="text-amber-500/90 font-mono text-xs uppercase tracking-wider">
              {project.summary}
            </p>
          </div>
          <span className="font-display font-extrabold text-3xl sm:text-4xl text-amber-500/25 group-hover:text-amber-500/45 transition-colors shrink-0 leading-none">
            {project.index}
          </span>
        </div>

        {/* Bullets */}
        <ul className="mb-6 space-y-2 text-sm sm:text-base leading-relaxed text-white/80 text-left">
          {project.bullets.map((bullet) => (
            <li
              key={bullet}
              className="pl-4 relative before:absolute before:left-0 before:text-amber-500/60 before:content-['—']"
            >
              {bullet}
            </li>
          ))}
        </ul>

        {/* Tech Stack Pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-red-950/50 border border-red-800/30 rounded-lg text-xs font-mono font-medium text-red-200/80"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Repository Link Button */}
        <div className="text-left">
          <a
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-white/[0.20] rounded-xl hover:border-amber-500/60 hover:text-amber-400 transition-colors text-sm font-mono font-medium text-white"
          >
            {project.linkLabel} <ArrowUpRight size={15} />
          </a>
        </div>

        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(180, 30, 30, 0.25), transparent)',
          }}
        />
      </div>
    </Reveal>
  )
}

export default function Work() {
  return (
    <section
      id="work"
      className="relative left-1/2 right-1/2 -mx-[50vw] w-screen overflow-hidden border-t border-[#341B20] py-24 sm:py-28"
    >
      <DynamicBackground variant="section" tint="maroon" />

      <div className="relative z-10 mx-auto w-full max-w-4xl px-6">
        <Reveal className="mb-12 text-left">
          <p className="text-xs font-mono font-bold uppercase tracking-[0.3em] mb-2 text-brass">
            Quest Log
          </p>
          <h2 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-text mb-2">
            Projects
          </h2>
          <p className="text-base sm:text-lg text-text-dim font-serif italic">
            Featured quests worth a closer look — distributed systems, LLM agents, and NLP pipelines.
          </p>
        </Reveal>

        <div>
          {projects.map((project, i) => (
            <ProjectCard
              key={project.title}
              project={project}
              index={i}
              delay={i * 0.08}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
