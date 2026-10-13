import { Cloud, GraduationCap, Trophy, Wrench } from 'lucide-react'
import { achievements, connectLinks, education, profile, skills } from '../data/content'
import type { AchievementIcon } from '../types'
import Reveal from './Reveal'

const ACHIEVEMENT_ICONS: Record<AchievementIcon, typeof Trophy> = {
  trophy: Trophy,
  graduation: GraduationCap,
  cloud: Cloud,
  wrench: Wrench,
}

export default function Profile() {
  return (
    <section
      id="profile"
      className="relative left-1/2 right-1/2 -mx-[50vw] flex min-h-screen w-screen flex-col justify-center border-t border-white/[0.06] px-6 py-24 lg:py-32"
    >
      <div className="relative z-20 mx-auto w-full max-w-5xl">
        {/* Section Header */}
        <Reveal className="mb-8 text-center sm:text-left">
          <p className="mb-3 font-mono text-xs font-medium uppercase tracking-[0.3em] text-brass">
            01 — Character sheet
          </p>
          <h2 className="mb-1 font-display text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
            About
          </h2>
        </Reveal>

        {/* Two-Column Grid Replicating shubhamgl.com Exactly */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* Left Column: Character Avatar / Image Card */}
          <Reveal delay={0.05} className="h-full">
            <div className="relative rounded-xl overflow-hidden border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.55)] aspect-square w-full group transition-all duration-300 hover:border-brass/50">
              <img
                src="/profile.PNG"
                alt={profile.name}
                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(to top, rgba(8,11,19,0.92) 0%, rgba(8,11,19,0.4) 40%, transparent 100%)',
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 p-5 pointer-events-none flex items-end justify-between">
                <div>
                  <h3 className="font-display font-bold text-2xl text-white leading-tight">
                    {profile.name}
                  </h3>
                  <p className="text-white/80 font-mono text-xs uppercase tracking-widest mt-0.5">
                    M.Tech CSE · IIT Gandhinagar
                  </p>
                </div>
                <span className="font-display font-bold text-lg text-brass border border-brass/50 bg-[#0B0F1A]/80 backdrop-blur-md px-3.5 py-1 rounded-lg shadow-lg">
                  {profile.level}
                </span>
              </div>
              <div
                className="absolute inset-0 pointer-events-none rounded-xl"
                style={{
                  background:
                    'linear-gradient(165deg, rgba(217,165,74,0.14) 0%, transparent 35%)',
                }}
              />
            </div>
          </Reveal>

          {/* Right Column: Bio, Education, Skills, and Connect Links (bg-mortar theme) */}
          <Reveal delay={0.1} className="h-full">
            <div className="flex h-full flex-col justify-between rounded-xl border border-white/10 bg-[#0D1220]/75 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl transition-colors hover:border-brass/30 sm:p-7">
              <div>
                <div className="text-white/85 text-[15px] leading-relaxed mb-4 space-y-3">
                  {profile.bio.map((para) => (
                    <p key={para}>{para}</p>
                  ))}
                </div>

                {/* Education Pills */}
                <div className="flex flex-col gap-2 mb-4">
                  {education.map((e) => (
                    <div
                      key={e.school}
                      className="flex flex-wrap items-center justify-between gap-2 bg-brass/[0.08] border border-brass/25 rounded-lg px-3.5 py-2"
                    >
                      <span className="text-white text-xs font-semibold">
                        {e.school} — {e.program}
                      </span>
                      {(e.period || e.stat) && (
                        <span className="text-brass text-[11px] font-mono font-medium">
                          {[e.period, e.stat].filter(Boolean).join(' · ')}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                <div className="w-full h-px bg-white/[0.10] my-4" />

                {/* Skills */}
                <div>
                  <p className="text-xs font-mono font-medium text-brass uppercase tracking-[0.3em] mb-3">
                    Skills
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-1 text-xs text-white/85 bg-white/[0.04] border border-white/10 rounded font-mono font-medium hover:border-brass/60 hover:text-brass transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="w-full h-px bg-white/[0.10] my-4" />

                {/* Connect */}
                <div>
                  <p className="text-xs font-mono font-medium text-brass uppercase tracking-[0.3em] mb-3">
                    Connect
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    {connectLinks.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        target={link.href.startsWith('http') ? '_blank' : undefined}
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 bg-brass/10 border border-brass/35 text-brass text-[12px] px-3.5 py-1.5 rounded-md hover:bg-brass/20 transition-colors font-mono"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <div className="w-full h-px bg-white/[0.10] mt-5 mb-3" />
                <p className="text-white/60 font-mono text-[11px] text-center">
                  Loves systems · Loves building · Loves research
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Achievements Unlocked Section */}
        <Reveal delay={0.15} className="mt-12">
          <p className="text-xs font-mono font-medium text-brass uppercase tracking-[0.3em] mb-6">
            Achievements Unlocked
          </p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4">
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
