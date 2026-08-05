import { motion } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import DynamicBackground from './DynamicBackground'
import { profile } from '../data/content'
import { useTypewriter } from '../hooks/useTypewriter'

export default function Hero() {
  const typed = useTypewriter(profile.roles)

  return (
    <section
      id="top"
      className="relative left-1/2 right-1/2 -mx-[50vw] flex min-h-[90vh] w-screen flex-col justify-center overflow-hidden py-16"
    >
      <DynamicBackground variant="hero" />
      <div className="relative z-10 mx-auto w-full max-w-rail px-7">
        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display text-[clamp(48px,9vw,104px)] font-semibold leading-[0.98] text-text"
        >
          {profile.name}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-6 h-7 font-mono text-[15px] text-brass sm:text-[17px]"
        >
          <span>{typed}</span>
          <span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] animate-blink bg-brass align-middle" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <a
            href="#profile"
            className="inline-flex items-center gap-2 rounded-sm border border-brass bg-brass px-6 py-3 font-mono text-[13px] uppercase tracking-wide text-ink transition-transform hover:-translate-y-0.5"
          >
            venture forth <ArrowDown size={14} />
          </a>
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-sm border border-ink-border px-6 py-3 font-mono text-[13px] uppercase tracking-wide text-text-dim transition-colors hover:border-brass-dim hover:text-text"
          >
            Resume
          </a>
        </motion.div>
      </div>
    </section>
  )
}
