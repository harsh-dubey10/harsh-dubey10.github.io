import { ArrowUpRight, Download, Github, Linkedin, Mail } from 'lucide-react'
import { connectLinks } from '../data/content'
import type { ConnectIcon } from '../types'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'

const ICONS: Record<ConnectIcon, typeof Mail> = {
  mail: Mail,
  linkedin: Linkedin,
  github: Github,
  download: Download,
}

const DESCRIPTIONS: Record<string, string> = {
  Resume: 'One-page PDF.',
  LinkedIn: 'Professional profile.',
  Email: 'Reach me directly.',
  GitHub: 'Code and experiments.',
}

export default function Contact() {
  return (
    <footer
      id="contact"
      className="relative left-1/2 right-1/2 -mx-[50vw] w-screen border-t border-white/[0.06] py-24 sm:py-32"
    >
      <div className="relative z-10 mx-auto w-full max-w-5xl px-6">
        {/* Header Block matching reference section */}
        <div className="mb-14">
          <SectionHeading
            align="center"
            eyebrow="04 — Get in touch"
            title="Let's connect"
            subtitle="Happy to talk research, systems, or NLP."
          />
        </div>

        {/* Reference 4-Card Grid for Resume & Social Links */}
        <Reveal delay={0.08}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5 items-stretch">
            {connectLinks.map((link) => {
              const Icon = ICONS[link.icon]
              const desc = DESCRIPTIONS[link.label] ?? ''

              return (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith('http') || link.href.endsWith('.pdf') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="block group h-full"
                >
                  <div className="relative rounded-2xl border border-white/10 p-5 sm:p-6 transition-all bg-[#0D1220]/70 backdrop-blur-xl text-center shadow-[0_20px_60px_rgba(0,0,0,0.4)] hover:-translate-y-1 hover:border-brass/45 h-full flex flex-col items-center group">
                    {/* Centered Icon */}
                    <div className="flex justify-center mb-4 relative">
                      <div className="p-3.5 rounded-full bg-brass/10 border border-brass/30 text-brass group-hover:scale-110 transition-transform duration-300">
                        <Icon size={22} strokeWidth={1.75} />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-display font-bold text-lg sm:text-xl text-white mb-1">
                      {link.label}
                    </h3>

                    {/* Description */}
                    <p className="text-white/70 text-xs flex-1 mb-5">
                      {desc}
                    </p>

                    {/* Action Badge Pill */}
                    <span className="inline-flex items-center gap-1 rounded-full border border-white/15 px-3.5 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-white/90 transition-colors group-hover:border-brass/60 group-hover:text-brass">
                      {link.action}
                      <ArrowUpRight size={13} />
                    </span>
                  </div>
                </a>
              )
            })}
          </div>
        </Reveal>

        {/* Footer copyright note */}
        <div className="mt-16 pb-16 text-center font-mono text-xs leading-relaxed text-white/60 sm:pb-0">
          © {new Date().getFullYear()} Harsh Vardhan Dubey · Gandhinagar, India
        </div>
      </div>
    </footer>
  )
}
