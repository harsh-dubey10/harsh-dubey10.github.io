import { ArrowUpRight } from 'lucide-react'
import { type MouseEvent, useEffect, useRef, useState } from 'react'
import { type MotionValue, motion, useScroll, useTransform } from 'framer-motion'
import { projects } from '../data/content'
import type { ProjectEntry } from '../types'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'

/** Card stacking only makes sense where a whole card fits on screen. */
function useIsDesktop() {
  const [match, setMatch] = useState(() => window.matchMedia('(min-width: 1024px)').matches)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const onChange = () => setMatch(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return match
}

function ProjectCard({
  project,
  index,
  total,
  progress,
  stacked,
}: {
  project: ProjectEntry
  index: number
  total: number
  progress: MotionValue<number>
  stacked: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  // Earlier cards recede slightly as later ones stack over them (desktop).
  const scale = useTransform(progress, [index / total, 1], [1, 1 - (total - 1 - index) * 0.05])
  const dim = useTransform(progress, [index / total, 1], [1, 1 - (total - 1 - index) * 0.35])

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -1.5
    const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 1.5
    el.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`
    el.style.setProperty('--mx', `${x}px`)
    el.style.setProperty('--my', `${y}px`)
  }

  function handleMouseLeave() {
    const el = ref.current
    if (!el) return
    el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0)'
  }

  return (
    <motion.div
      style={stacked ? { scale, opacity: dim, top: `${96 + index * 28}px` } : undefined}
      className="mb-8 origin-top lg:sticky"
    >
    <Reveal>
      <div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0D1220]/90 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl transition-[border-color,transform] duration-300 will-change-transform hover:border-brass/35 sm:p-10"
      >
        {/* Cursor spotlight */}
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 [background:radial-gradient(420px_circle_at_var(--mx,50%)_var(--my,50%),rgba(217,165,74,0.10),transparent_60%)]" />
        {/* Brass sheen along the top edge */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brass/40 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-100" />

        <div className="relative grid gap-6 sm:grid-cols-[auto,1fr] sm:gap-10">
          <span className="font-display text-4xl font-bold leading-none text-brass/70 transition-colors group-hover:text-brass sm:text-5xl">
            {project.index}
          </span>

          <div>
            <h3 className="mb-1 font-display text-2xl font-bold leading-tight text-white sm:text-3xl">
              {project.title}
            </h3>
            <p className="mb-5 font-mono text-xs uppercase tracking-[0.14em] text-brass/90">
              {project.summary}
            </p>

            <ul className="mb-6 space-y-2.5 text-[15px] leading-relaxed text-white/80">
              {project.bullets.map((bullet) => (
                <li
                  key={bullet}
                  className="relative pl-5 before:absolute before:left-0 before:top-[0.7em] before:h-px before:w-2.5 before:bg-brass/70"
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
                    className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-[11px] font-medium text-white/80"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <a
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 font-mono text-[12px] font-medium text-white transition-colors hover:border-brass/60 hover:text-brass"
              >
                {project.linkLabel} <ArrowUpRight size={14} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
    </motion.div>
  )
}

export default function Work() {
  const stackRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: stackRef, offset: ['start start', 'end end'] })
  const stacked = useIsDesktop()

  return (
    <section
      id="work"
      className="relative left-1/2 right-1/2 -mx-[50vw] w-screen border-t border-white/[0.06] py-24 sm:py-32"
    >
      <div className="relative z-10 mx-auto w-full max-w-4xl px-6">
        <div className="mb-14">
          <SectionHeading
            eyebrow="03 — Quest log"
            title="Selected projects"
            subtitle="Work across distributed systems, LLM agents, and NLP pipelines."
          />
        </div>

        <div ref={stackRef} className="lg:pb-24">
          {projects.map((project, i) => (
            <ProjectCard
              key={project.title}
              project={project}
              index={i}
              total={projects.length}
              progress={scrollYProgress}
              stacked={stacked}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
