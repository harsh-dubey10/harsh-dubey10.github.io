import type { ReactNode } from 'react'
import { ArrowUpRight, Cloud, GraduationCap, Trophy, Wrench } from 'lucide-react'
import { achievements, connectLinks, education, profile, skills } from '../data/content'
import type { AchievementIcon } from '../types'
import Reveal from './Reveal'

const ACHIEVEMENT_ICONS: Record<AchievementIcon, typeof Trophy> = {
  trophy: Trophy,
  graduation: GraduationCap,
  cloud: Cloud,
  wrench: Wrench,
}

/** One row of the character sheet: a small label beside its contents. */
function SheetRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-3 border-t border-white/10 py-5 sm:grid-cols-[7.5rem_1fr] sm:gap-6">
      <dt className="pt-0.5 font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-brass">{label}</dt>
      <dd>{children}</dd>
    </div>
  )
}

export default function Profile() {
  const [lead, ...rest] = profile.bio

  return (
    <section
      id="profile"
      className="relative left-1/2 right-1/2 -mx-[50vw] flex min-h-screen w-screen flex-col justify-center px-6 py-24 lg:py-32"
    >
      <div className="relative z-[35] mx-auto w-full max-w-5xl">
        <Reveal className="mb-10 sm:mb-12">
          <p className="mb-3 font-mono text-xs font-medium uppercase tracking-[0.3em] text-brass">
            01 — Character sheet
          </p>
          <h2 className="font-display text-4xl font-bold text-white sm:text-5xl lg:text-6xl">About</h2>
        </Reveal>

        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Portrait */}
          <Reveal delay={0.05} className="mx-auto w-full max-w-md lg:col-span-5 lg:max-w-none">
            <figure>
              <div className="group relative aspect-[4/5] w-full overflow-hidden rounded-xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.55)] transition-colors duration-300 hover:border-brass/50">
                <img
                  src="/profile.PNG"
                  alt={profile.name}
                  className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(to top, rgba(8,11,19,0.92) 0%, rgba(8,11,19,0.35) 38%, transparent 100%), linear-gradient(165deg, rgba(217,165,74,0.14) 0%, transparent 35%)',
                  }}
                />
                <span className="pointer-events-none absolute right-4 top-4 rounded-lg border border-brass/50 bg-[#0B0F1A]/80 px-3.5 py-1 font-display text-lg font-bold text-brass shadow-lg backdrop-blur-md">
                  {profile.level}
                </span>
                <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5">
                  <h3 className="font-display text-2xl font-bold leading-tight text-white">{profile.name}</h3>
                  <p className="mt-0.5 font-mono text-xs uppercase tracking-widest text-white/80">
                    M.Tech CSE · IIT Gandhinagar
                  </p>
                </div>
              </div>
              <figcaption className="mt-4 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">
                <span className="h-px w-6 bg-brass/60" />
                Loves systems · building · research
              </figcaption>
            </figure>
          </Reveal>

          {/* Bio and sheet */}
          <Reveal delay={0.1} className="lg:col-span-7">
            <p className="font-display text-[1.6rem] leading-snug text-white sm:text-3xl">{lead}</p>
            {rest.map((para) => (
              <p key={para} className="mt-5 text-[15px] leading-relaxed text-white/70 sm:text-base">
                {para}
              </p>
            ))}

            <dl className="mt-9 border-b border-white/10">
              <SheetRow label="Education">
                <ul className="space-y-3">
                  {education.map((e) => (
                    <li key={e.school}>
                      <p className="text-[15px] font-semibold text-white">{e.school}</p>
                      <p className="text-sm text-white/60">
                        {e.program}
                        {(e.period || e.stat) && (
                          <span className="ml-2 font-mono text-[11px] text-brass">
                            {[e.period, e.stat].filter(Boolean).join(' · ')}
                          </span>
                        )}
                      </p>
                    </li>
                  ))}
                </ul>
              </SheetRow>

              <SheetRow label="Skills">
                <ul className="flex flex-wrap gap-1.5">
                  {skills.map((skill) => (
                    <li
                      key={skill}
                      className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 font-mono text-[11.5px] text-white/80 transition-colors hover:border-brass/60 hover:text-brass"
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </SheetRow>

              <SheetRow label="Connect">
                <ul className="flex flex-wrap gap-x-6 gap-y-2">
                  {connectLinks.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        target={link.href.startsWith('http') ? '_blank' : undefined}
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-1 font-mono text-[13px] text-white/85 transition-colors hover:text-brass"
                      >
                        {link.label}
                        <ArrowUpRight
                          size={14}
                          className="text-brass/70 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        />
                      </a>
                    </li>
                  ))}
                </ul>
              </SheetRow>
            </dl>
          </Reveal>
        </div>

        {/* Achievements Unlocked */}
        <Reveal delay={0.15} className="mt-16 sm:mt-20">
          <div className="mb-6 flex items-baseline justify-between gap-4">
            <p className="font-mono text-xs font-medium uppercase tracking-[0.3em] text-brass">Achievements unlocked</p>
            <p className="font-mono text-[11px] text-white/40">
              {achievements.length} / {achievements.length}
            </p>
          </div>
          <ul className="grid grid-cols-2 border-y border-white/10 sm:grid-cols-4 sm:divide-x sm:divide-white/10">
            {achievements.map((a, i) => {
              const Icon = ACHIEVEMENT_ICONS[a.icon]
              return (
                <li
                  key={a.title}
                  className={`group flex cursor-default flex-col items-center px-4 py-8 text-center ${
                    i % 2 === 0 ? 'max-sm:border-r max-sm:border-white/10' : ''
                  } ${i < 2 ? 'max-sm:border-b max-sm:border-white/10' : ''}`}
                >
                  <div className="relative mb-4">
                    <div className="absolute -inset-3 rounded-full bg-brass/20 opacity-50 blur-xl transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="relative flex h-14 w-14 items-center justify-center rounded-full border-2 border-brass/50 bg-gradient-to-b from-[#1A2234] to-[#0B0F1A] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-transform duration-300 group-hover:-translate-y-1">
                      <Icon size={22} strokeWidth={1.75} className="text-brass" aria-hidden="true" />
                    </div>
                  </div>
                  <span className="mb-2 rounded-full border border-brass/40 bg-brass/10 px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-brass">
                    {a.tag}
                  </span>
                  <p className="text-[13px] font-medium leading-snug text-white transition-colors duration-300 group-hover:text-brass">
                    {a.title}
                  </p>
                  <p className="mt-1 font-mono text-[11px] text-white/55">{a.date}</p>
                </li>
              )
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
