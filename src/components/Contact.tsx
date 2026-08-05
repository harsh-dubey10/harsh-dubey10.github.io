import { ArrowUpRight, Download, Github, Linkedin, Mail } from 'lucide-react'
import DynamicBackground from './DynamicBackground'
import { connectLinks } from '../data/content'
import type { ConnectIcon } from '../types'
import Reveal from './Reveal'

const ICONS: Record<ConnectIcon, typeof Mail> = {
  mail: Mail,
  linkedin: Linkedin,
  github: Github,
  download: Download,
}

export default function Contact() {
  return (
    <footer
      id="contact"
      className="relative left-1/2 right-1/2 -mx-[50vw] w-screen overflow-hidden border-t border-ink-borderSoft py-24 sm:py-28"
    >
      <DynamicBackground variant="section" />
      <div className="relative z-10 mx-auto w-full max-w-rail px-7">
        <Reveal className="text-center">
          <div className="flex items-center justify-center gap-2 font-mono text-[12px] uppercase tracking-[0.16em] text-brass">
            <span className="h-px w-4 bg-brass-dim" /> Treasure Found
          </div>
          <h2 className="mt-3 font-display text-[clamp(30px,5vw,46px)] font-semibold text-text">
            Let's Connect
          </h2>
          <p className="mt-2.5 text-[15px] text-text-dim">Happy to talk research, systems, or NLP.</p>
        </Reveal>

        <Reveal delay={0.08} className="mt-12 overflow-hidden rounded-lg border border-ink-border">
          <div className="grid grid-cols-1 gap-px bg-ink-border sm:grid-cols-2">
            {connectLinks.map((link) => {
              const Icon = ICONS[link.icon]
              return (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="group flex flex-col gap-1.5 bg-ink-surface p-6 transition-colors hover:bg-ink-raised"
                >
                  <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wide text-text-faint">
                    <Icon
                      size={14}
                      className="text-brass transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6"
                    />
                    {link.label}
                  </span>
                  <span className="flex items-center justify-between font-display text-[19px] text-text transition-transform group-hover:translate-x-1">
                    {link.action}
                    <ArrowUpRight size={16} className="text-brass" />
                  </span>
                </a>
              )
            })}
          </div>
        </Reveal>

        <div className="mt-14 text-center font-mono text-[12px] text-text-faint">
          © {new Date().getFullYear()} Harsh Vardhan Dubey
        </div>
      </div>
    </footer>
  )
}
