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

const SOCIAL_DETAILS: Record<string, { desc: string; color: string; bgAlpha: string }> = {
  Resume: {
    desc: 'Full adventure log.',
    color: '#FFB800',
    bgAlpha: 'rgba(255, 184, 0, 0.15)',
  },
  LinkedIn: {
    desc: 'Connect professionally.',
    color: '#0A66C2',
    bgAlpha: 'rgba(10, 102, 194, 0.15)',
  },
  Email: {
    desc: 'Send a direct message.',
    color: '#FF8236',
    bgAlpha: 'rgba(255, 130, 54, 0.15)',
  },
  GitHub: {
    desc: 'Explore open-source code.',
    color: '#38BDF8',
    bgAlpha: 'rgba(56, 189, 248, 0.15)',
  },
}

export default function Contact() {
  return (
    <footer
      id="contact"
      className="relative left-1/2 right-1/2 -mx-[50vw] w-screen overflow-hidden border-t border-ink-borderSoft py-20 sm:py-28"
    >
      {/* Retained current background theme */}
      <DynamicBackground variant="section" />

      <div className="relative z-10 mx-auto w-full max-w-5xl px-6">
        {/* Header Block matching reference section */}
        <Reveal className="text-center mb-12">
          <p className="text-xs font-mono font-bold text-brass uppercase tracking-[0.3em] mb-2">
            Treasure Found
          </p>
          <h2 className="font-display font-extrabold text-4xl sm:text-5xl text-white mb-3">
            Let's Connect
          </h2>
          <p className="text-white/60 max-w-sm mx-auto text-sm sm:text-base">
            Happy to talk research, systems, or NLP.
          </p>
        </Reveal>

        {/* Reference 4-Card Grid for Resume & Social Links */}
        <Reveal delay={0.08}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5 items-stretch">
            {connectLinks.map((link) => {
              const Icon = ICONS[link.icon]
              const details = SOCIAL_DETAILS[link.label] || {
                desc: 'Connect with me.',
                color: '#FFB800',
                bgAlpha: 'rgba(255, 184, 0, 0.15)',
              }

              return (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith('http') || link.href.endsWith('.pdf') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="block group h-full"
                >
                  <div className="relative rounded-2xl border-2 border-white/10 p-5 sm:p-6 transition-all bg-white/[0.04] backdrop-blur-md text-center hover:shadow-[0_10px_35px_rgba(0,0,0,0.4)] hover:border-brass/50 hover:bg-white/[0.07] h-full flex flex-col items-center group">
                    {/* Centered Icon */}
                    <div className="flex justify-center mb-4 relative">
                      <div className="p-3.5 rounded-full bg-white/5 border border-white/10 group-hover:scale-110 transition-transform duration-300">
                        <Icon size={24} style={{ color: details.color }} />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-display font-bold text-lg sm:text-xl text-white mb-1">
                      {link.label}
                    </h3>

                    {/* Description */}
                    <p className="text-white/50 text-xs flex-1 mb-5">
                      {details.desc}
                    </p>

                    {/* Action Badge Pill */}
                    <span
                      className="inline-flex items-center gap-1 text-xs font-mono font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full transition-all group-hover:scale-105"
                      style={{
                        color: details.color,
                        backgroundColor: details.bgAlpha,
                      }}
                    >
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
        <div className="mt-16 text-center font-mono text-xs text-white/30">
          the adventure never ends. <br />
          <span className="mt-1 inline-block text-white/20">
            © {new Date().getFullYear()} Harsh Vardhan Dubey
          </span>
        </div>
      </div>
    </footer>
  )
}
