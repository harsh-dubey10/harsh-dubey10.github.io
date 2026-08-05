import { ArrowUpRight } from 'lucide-react'
import { type MouseEvent, useRef } from 'react'
import { projects } from '../data/content'
import type { ProjectEntry } from '../types'
import Reveal from './Reveal'

function ProjectCard({ project, delay }: { project: ProjectEntry; delay: number }) {
  const ref = useRef<HTMLDivElement>(null)

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -3
    const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 3
    el.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`
  }

  function handleMouseLeave() {
    const el = ref.current
    if (!el) return
    el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0)'
  }

  return (
    <Reveal delay={delay}>
      <div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="grid overflow-hidden rounded-lg border border-ink-border bg-ink-surface transition-[border-color,box-shadow] duration-300 will-change-transform hover:border-brass-dim hover:shadow-[0_30px_60px_-30px_rgba(217,165,74,0.2)] sm:grid-cols-[220px_1fr]"
      >
        <div className="flex items-center justify-center border-b border-ink-border bg-gradient-to-br from-ink-raised to-[#0C1122] p-8 sm:border-b-0 sm:border-r">
          <span className="font-display text-[56px] text-brass/20">{project.index}</span>
        </div>
        <div className="p-8">
          <div className="font-mono text-[11.5px] uppercase tracking-wide text-text-faint">
            {project.summary}
          </div>
          <h3 className="mt-1.5 font-display text-[22px] font-semibold text-text">
            {project.title}
          </h3>
          <ul className="mt-3 space-y-1.5 text-[14px] leading-relaxed text-text-dim">
            {project.bullets.map((bullet) => (
              <li key={bullet} className="pl-4 relative before:absolute before:left-0 before:content-['—']">
                {bullet}
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded border border-ink-border px-2.5 py-1 font-mono text-[11px] text-text-faint"
              >
                {tag}
              </span>
            ))}
          </div>
          <a
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-1.5 border-b border-wire/35 font-mono text-[12.5px] text-wire transition-colors hover:border-brass-dim hover:text-brass"
          >
            {project.linkLabel} <ArrowUpRight size={13} />
          </a>
        </div>
      </div>
    </Reveal>
  )
}

export default function Work() {
  return (
    <section id="work" className="border-t border-ink-borderSoft py-24 sm:py-28">
      <Reveal className="mb-12">
        <div className="flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.16em] text-brass">
          <span className="h-px w-4 bg-brass-dim" /> Quest Log
        </div>
        <h2 className="mt-3 font-display text-[clamp(30px,4vw,42px)] font-semibold text-text">
          Projects
        </h2>
        <p className="mt-2.5 max-w-md text-[15px] text-text-dim">
          Two projects worth a closer look — a concurrent agent platform and an NLP tool for Hindi.
        </p>
      </Reveal>

      <div className="grid gap-6">
        {projects.map((project, i) => (
          <ProjectCard key={project.title} project={project} delay={i * 0.08} />
        ))}
      </div>
    </section>
  )
}
