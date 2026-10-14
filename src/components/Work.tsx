import { ArrowUpRight } from 'lucide-react'
import { type MouseEvent, useRef } from 'react'
import { projects } from '../data/content'
import type { ProjectEntry } from '../types'
import Reveal from './Reveal'

function ProjectCard({
  project,
  delay,
}: {
  project: ProjectEntry
  delay: number
}) {
  const ref = useRef<HTMLDivElement>(null)

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -1.5
    const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 1.5
    el.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`
  }

  function handleMouseLeave() {
    const el = ref.current
    if (!el) return
    el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0)'
  }

  return (
    <Reveal delay={delay} className="mb-8">
      <div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="group relative overflow-hidden rounded-2xl border border-[#D8D2C5] bg-[#F7F5F0] p-6 shadow-[0_1px_2px_rgba(40,30,15,0.06),0_12px_32px_rgba(40,30,15,0.06)] transition-[border-color,transform,box-shadow] duration-300 will-change-transform hover:border-[#B9A27A] hover:shadow-[0_1px_2px_rgba(40,30,15,0.08),0_18px_44px_rgba(40,30,15,0.1)] sm:p-10"
      >
        <div className="grid gap-6 sm:grid-cols-[auto,1fr] sm:gap-10">
          <span className="font-display text-4xl font-bold leading-none text-[#B08A4A] transition-colors group-hover:text-[#8A5A12] sm:text-5xl">
            {project.index}
          </span>

          <div>
            <h3 className="mb-1 font-display text-2xl font-bold leading-tight text-[#15130F] sm:text-3xl">
              {project.title}
            </h3>
            <p className="mb-5 font-mono text-xs uppercase tracking-[0.14em] text-[#8A5A12]">
              {project.summary}
            </p>

            <ul className="mb-6 space-y-2.5 text-[15px] leading-relaxed text-[#3D3A34]">
              {project.bullets.map((bullet) => (
                <li
                  key={bullet}
                  className="relative pl-5 before:absolute before:left-0 before:top-[0.7em] before:h-px before:w-2.5 before:bg-[#B08A4A]"
                >
                  {bullet}
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[#D8D2C5] bg-[#EFEBE3] px-3 py-1 font-mono text-[11px] font-medium text-[#4A463F]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <a
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[#15130F] px-4 py-2 font-mono text-[12px] font-medium text-[#15130F] transition-colors hover:bg-[#15130F] hover:text-[#F7F5F0]"
              >
                {project.linkLabel} <ArrowUpRight size={14} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  )
}

export default function Work() {
  return (
    <section
      id="work"
      className="paper-bg relative left-1/2 right-1/2 -mx-[50vw] w-screen py-24 sm:py-32"
    >
      <div className="relative z-[35] mx-auto w-full max-w-4xl px-6">
        <Reveal className="mb-12 text-left">
          <p className="mb-3 font-mono text-xs font-medium uppercase tracking-[0.3em] text-[#8A5A12]">
            03 — Quest log
          </p>
          <h2 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[#15130F] mb-2">
            Projects
          </h2>
          <p className="max-w-2xl text-base text-[#5A564E] sm:text-lg">
            Selected work across distributed systems, LLM agents, and systems programming.
          </p>
        </Reveal>

        <div>
          {projects.map((project, i) => (
            <ProjectCard
              key={project.title}
              project={project}
              delay={i * 0.08}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
