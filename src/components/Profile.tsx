import { motion, type Variants } from 'framer-motion'
import { Download, Github, Linkedin, Mail } from 'lucide-react'
import { connectLinks, education, profile, skills } from '../data/content'
import type { ConnectIcon } from '../types'
import Reveal from './Reveal'

const ICONS: Record<ConnectIcon, typeof Mail> = {
  mail: Mail,
  linkedin: Linkedin,
  github: Github,
  download: Download,
}

const listContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.045 } },
}

const listItem: Variants = {
  hidden: { opacity: 0, y: 8, scale: 0.9 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: [0.34, 1.56, 0.64, 1] } },
}

export default function Profile() {
  return (
    <section id="profile" className="border-t border-ink-borderSoft py-20 sm:py-24">
      <Reveal className="mb-10">
        <div className="flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.16em] text-brass">
          <span className="h-px w-4 bg-brass-dim" /> About
        </div>
        <h2 className="mt-3 font-display text-[clamp(30px,4vw,42px)] font-semibold text-text">
          Character Sheet
        </h2>
      </Reveal>

      <Reveal
        delay={0.05}
        className="overflow-hidden rounded-lg border border-ink-border bg-gradient-to-b from-ink-surface to-ink-raised transition-colors hover:border-brass-dim"
      >
        {/* equal-split photo / bio */}
        <div className="grid sm:grid-cols-2">
          <div className="relative min-h-[240px] border-b border-ink-border sm:min-h-[360px] sm:border-b-0 sm:border-r">
            <img
              src="/profile.jpg"
              alt={profile.name}
              className="absolute inset-0 h-full w-full object-cover object-[50%_22%]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-surface/90 via-transparent to-transparent" />
            <span className="absolute right-4 top-4 rounded-full border border-brass-dim bg-ink/80 px-3.5 py-1.5 font-mono text-[12px] tracking-wide text-brass backdrop-blur-sm">
              {profile.level}
            </span>
          </div>

          <div className="p-7 sm:p-9">
            <div className="font-display text-[26px] font-semibold text-text">{profile.name}</div>
            <div className="mt-1 font-mono text-[12px] tracking-wide text-text-dim">
              {profile.location}
            </div>

            <div className="mt-5 max-w-xl space-y-3.5 text-[14.5px] leading-relaxed text-text-dim">
              {profile.bio.map((para) => (
                <p key={para}>{para}</p>
              ))}
            </div>

            <dl className="mt-5 grid gap-2">
              {education.map((e) => (
                <div
                  key={e.school}
                  className="flex flex-wrap justify-between gap-3 border-b border-dashed border-ink-borderSoft py-2 font-mono text-[12px] text-text-dim"
                >
                  <dt className="text-text">
                    {e.school} <span className="text-text-faint">— {e.program}</span>
                  </dt>
                  <dd className="flex gap-4">
                    <span>{e.period}</span>
                    <span className="text-brass">{e.stat}</span>
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-6">
              <div className="font-mono text-[11px] uppercase tracking-[0.1em] text-text-faint">
                Skills
              </div>
              <motion.div
                className="mt-3 flex flex-wrap gap-2"
                variants={listContainer}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-40px' }}
              >
                {skills.map((skill) => (
                  <motion.span
                    key={skill}
                    variants={listItem}
                    whileHover={{ y: -2, scale: 1.05 }}
                    className="rounded border border-ink-border bg-white/[0.015] px-3 py-1.5 font-mono text-[11px] text-text-dim transition-colors hover:border-brass-dim hover:text-brass"
                  >
                    {skill}
                  </motion.span>
                ))}
              </motion.div>
            </div>

            <div className="mt-6">
              <div className="font-mono text-[11px] uppercase tracking-[0.1em] text-text-faint">
                Connect
              </div>
              <motion.div
                className="mt-3 flex flex-wrap gap-2.5"
                variants={listContainer}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-40px' }}
              >
                {connectLinks.map((link) => {
                  const Icon = ICONS[link.icon]
                  return (
                    <motion.a
                      key={link.label}
                      href={link.href}
                      title={link.label}
                      aria-label={link.label}
                      target={link.href.startsWith('http') ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      variants={listItem}
                      whileHover={{ y: -3, scale: 1.08, rotate: -6 }}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-ink-border text-text-dim transition-colors hover:border-brass-dim hover:bg-brass-soft hover:text-brass"
                    >
                      <Icon size={16} />
                    </motion.a>
                  )
                })}
              </motion.div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
