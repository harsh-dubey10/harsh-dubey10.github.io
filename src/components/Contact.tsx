import { ArrowUpRight, Download, Github, Linkedin, Mail } from 'lucide-react'
import { connectLinks } from '../data/content'
import type { ConnectIcon } from '../types'
import Reveal from './Reveal'

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
      className="paper-bg relative left-1/2 right-1/2 -mx-[50vw] w-screen py-24 sm:py-32"
    >
      <div className="relative z-[35] mx-auto w-full max-w-5xl px-6">
        {/* Header Block matching reference section */}
        <Reveal className="text-center mb-12">
          <p className="mb-3 font-mono text-xs font-medium uppercase tracking-[0.3em] text-[#8A5A12]">
            04 — Get in touch
          </p>
          <h2 className="font-display font-extrabold text-4xl sm:text-5xl text-[#15130F] mb-3">
            Let's connect
          </h2>
          <p className="text-[#5A564E] max-w-sm mx-auto text-sm sm:text-base">
            Happy to talk research and systems.
          </p>
        </Reveal>

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
                  <div className="relative rounded-2xl border border-[#D8D2C5] p-5 sm:p-6 transition-all bg-[#F7F5F0] text-center shadow-[0_1px_2px_rgba(40,30,15,0.06),0_12px_32px_rgba(40,30,15,0.06)] hover:-translate-y-1 hover:border-[#B9A27A] h-full flex flex-col items-center group">
                    {/* Centered Icon */}
                    <div className="flex justify-center mb-4 relative">
                      <div className="p-3.5 rounded-full bg-[#EFE6D4] border border-[#D9C49A] text-[#8A5A12] group-hover:scale-110 transition-transform duration-300">
                        <Icon size={22} strokeWidth={1.75} />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-display font-bold text-lg sm:text-xl text-[#15130F] mb-1">
                      {link.label}
                    </h3>

                    {/* Description */}
                    <p className="text-[#5A564E] text-xs flex-1 mb-5">
                      {desc}
                    </p>

                    {/* Action Badge Pill */}
                    <span className="inline-flex items-center gap-1 rounded-full border border-[#15130F]/80 px-3.5 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-[#15130F] transition-colors group-hover:bg-[#15130F] group-hover:text-[#F7F5F0]">
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
        <div className="mt-16 pb-16 text-center font-mono text-xs leading-relaxed text-[#6B665D] sm:pb-0">
          © {new Date().getFullYear()} Harsh Vardhan Dubey · Gandhinagar, India
        </div>
      </div>
    </footer>
  )
}
