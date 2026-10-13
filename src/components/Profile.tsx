import { useEffect, useRef, useState } from 'react'
import { animate, motion, useInView } from 'framer-motion'
import { Cloud, GraduationCap, Trophy, Wrench } from 'lucide-react'
import { achievements, education, profile, skills, stats, timeline } from '../data/content'
import type { AchievementIcon } from '../types'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'

const ACHIEVEMENT_ICONS: Record<AchievementIcon, typeof Trophy> = {
  trophy: Trophy,
  graduation: GraduationCap,
  cloud: Cloud,
  wrench: Wrench,
}

const current = timeline.find((t) => t.current)

/** Counts up from zero the first time it scrolls into view. */
function CountUp({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, to, {
      duration: 1.6,
      ease: [0.2, 0.7, 0.2, 1],
      onUpdate: (v) => setValue(Math.round(v)),
    })
    return () => controls.stop()
  }, [inView, to])

  return <span ref={ref}>{value}</span>
}

export default function Profile() {
  return (
    <section
      id="profile"
      className="relative left-1/2 right-1/2 -mx-[50vw] w-screen border-t border-white/[0.06] px-6 py-24 lg:py-36"
    >
      <div className="relative z-20 mx-auto w-full max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Story */}
          <div className="lg:col-span-7">
            <SectionHeading eyebrow="01 — Character sheet" title="About" />

            <Reveal delay={0.1}>
              <p className="mt-10 font-display text-2xl leading-snug text-white/90 sm:text-[1.75rem]">
                {profile.bio[0]}
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-white/70 sm:text-[17px]">
                {profile.bio[1]}
              </p>
            </Reveal>

            {current && (
              <Reveal delay={0.2}>
                <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] py-2 pl-3 pr-4 backdrop-blur-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
                  </span>
                  <span className="text-sm text-white/80">
                    <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/50">Now · </span>
                    {current.org}
                  </span>
                </div>
              </Reveal>
            )}
          </div>

          {/* Education + toolkit */}
          <Reveal delay={0.1} className="lg:col-span-5 lg:pt-4">
            <div className="rounded-2xl border border-white/10 bg-[#0D1220]/70 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-8">
              <p className="mb-5 font-mono text-[11px] font-medium uppercase tracking-[0.3em] text-brass">Education</p>
              <ol className="relative space-y-6 border-l border-white/10 pl-6">
                {education.map((e, i) => (
                  <li key={e.school} className="relative">
                    <span
                      className={`absolute -left-[29px] top-1.5 h-2.5 w-2.5 rounded-full border-2 ${
                        i === 0 ? 'border-brass bg-brass/40' : 'border-white/30 bg-[#0D1220]'
                      }`}
                    />
                    <p className="font-display text-lg font-semibold leading-tight text-white">{e.school}</p>
                    <p className="mt-1 text-sm text-white/65">{e.program}</p>
                  </li>
                ))}
              </ol>

              <div className="my-7 h-px bg-white/10" />

              <p className="mb-4 font-mono text-[11px] font-medium uppercase tracking-[0.3em] text-brass">Toolkit</p>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill, i) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.2 + i * 0.025 }}
                    className="rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-xs font-medium text-white/85 transition-colors hover:border-brass/60 hover:text-brass"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        {/* By the numbers */}
        <div className="mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.06} className="h-full">
              <div className="h-full bg-[#0B0F1A]/90 p-6 backdrop-blur-xl sm:p-8">
                <p className="font-display text-4xl font-bold text-brass sm:text-5xl">
                  <CountUp to={s.value} />
                  <span className="text-white/40">{s.suffix}</span>
                </p>
                <p className="mt-3 text-sm leading-snug text-white/70">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Achievements */}
        <Reveal delay={0.1} className="mt-20">
          <p className="mb-8 font-mono text-xs font-medium uppercase tracking-[0.3em] text-brass">
            Achievements unlocked
          </p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-4">
            {achievements.map((a) => {
              const Icon = ACHIEVEMENT_ICONS[a.icon]
              return (
                <div key={a.title} className="group flex cursor-default flex-col items-center text-center">
                  <div className="relative mb-3">
                    <div className="absolute -inset-3 rounded-full bg-brass/20 opacity-60 blur-xl transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="relative flex h-16 w-16 items-center justify-center rounded-full border-2 border-brass/50 bg-gradient-to-b from-[#1A2234] to-[#0B0F1A] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-transform duration-300 group-hover:-translate-y-1">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-brass/35 text-brass">
                        <Icon size={22} strokeWidth={1.75} aria-hidden="true" />
                      </div>
                    </div>
                  </div>
                  <span className="mb-2 rounded-full border border-brass/40 bg-brass/10 px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-brass">
                    {a.tag}
                  </span>
                  <p className="text-[13px] font-medium leading-snug text-white transition-colors duration-300 group-hover:text-brass">
                    {a.title}
                  </p>
                  <p className="mt-1 font-mono text-[11px] text-white/60">{a.date}</p>
                </div>
              )
            })}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
