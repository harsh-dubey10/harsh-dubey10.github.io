import { useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown, ArrowUpRight, Github, Linkedin, Mail } from 'lucide-react'
import DynamicBackground from './DynamicBackground'
import { connectLinks } from '../data/content'
import { hasWebGL } from '../lib/webgl'

const SOCIALS = [
  { label: 'GitHub', icon: Github },
  { label: 'LinkedIn', icon: Linkedin },
  { label: 'Email', icon: Mail },
].map((s) => ({ ...s, href: connectLinks.find((l) => l.label === s.label)?.href ?? '#' }))

const EASE = [0.2, 0.7, 0.2, 1] as const
const rise = (delay: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay, ease: EASE },
})

/**
 * Landing section, on the night backdrop. The shared sketch canvas
 * (SketchWorld) draws pale-ink drawings in its margins and orbit rings
 * behind the name. Without WebGL, a 2D starfield is drawn instead.
 */
export default function Hero() {
  const [webgl] = useState(hasWebGL)
  const sectionRef = useRef<HTMLElement>(null)

  // Content lifts and fades a little faster than the camera move behind it.
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] })
  const textY = useTransform(scrollYProgress, [0, 1], [0, -140])
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const barOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0])

  return (
    <section
      ref={sectionRef}
      id="top"
      className={`relative left-1/2 right-1/2 -mx-[50vw] flex h-[100svh] min-h-[600px] w-screen flex-col items-center justify-center overflow-hidden ${
        webgl ? '' : 'bg-[#080E1C]'
      }`}
    >
      {!webgl && <DynamicBackground variant="hero" tint="gold" />}

      {/* Vignette keeps the type crisp against the sky */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(60% 50% at 50% 45%, rgba(7,11,22,0.55) 0%, rgba(7,11,22,0) 70%)' }}
      />

      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        className="relative z-20 mx-auto -mt-[4vh] w-full max-w-4xl select-none px-6 text-center"
      >
        <motion.div
          {...rise(0.1)}
          className="mb-7 flex items-center justify-center gap-4 font-mono text-[10.5px] uppercase tracking-[0.34em] text-white/65 sm:text-[11px]"
        >
          <span className="h-px w-10 bg-gradient-to-r from-transparent to-brass/70 sm:w-16" />
          Graduate researcher · M.Tech CSE
          <span className="h-px w-10 bg-gradient-to-l from-transparent to-brass/70 sm:w-16" />
        </motion.div>

        <motion.h1
          {...rise(0.2)}
          className="font-display text-[clamp(3rem,8.5vw,7.25rem)] font-extrabold leading-[0.9] tracking-[-0.015em] text-brass drop-shadow-[0_2px_30px_rgba(0,0,0,0.5)]"
        >
          Harsh Vardhan
          <br />
          <span className="text-white">Dubey</span>
        </motion.h1>

        <motion.p
          {...rise(0.4)}
          className="mx-auto mt-7 max-w-xl text-[15px] leading-relaxed text-white/80 sm:text-base"
        >
          Working in the FUSS Group at IIT Gandhinagar under Prof. Abhishek Bichhawat. I build things end to end, then
          make them work better.
        </motion.p>

        <motion.div {...rise(0.55)} className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            data-scroll-to="work"
            className="inline-flex items-center gap-2 rounded-full bg-brass px-6 py-3 font-mono text-[12px] font-semibold uppercase tracking-[0.14em] text-[#120D06] shadow-[0_8px_30px_rgba(217,165,74,0.25)] transition hover:bg-[#E8B95E] hover:shadow-[0_8px_40px_rgba(217,165,74,0.4)]"
          >
            View projects
          </button>
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/[0.05] px-6 py-3 font-mono text-[12px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-sm transition hover:border-brass/60 hover:text-brass"
          >
            Résumé <ArrowUpRight size={14} />
          </a>
        </motion.div>
      </motion.div>

      {/* Bottom meta bar: socials · location · scroll */}
      <motion.div
        style={{ opacity: barOpacity }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.9 }}
        className="absolute inset-x-0 bottom-0 z-20 pb-6 pl-6 pr-20 sm:px-10 sm:pb-8 lg:pr-24"
      >
        <div className="mx-auto flex max-w-6xl items-end justify-between gap-4 border-t border-white/10 pt-4 font-mono text-[10.5px] uppercase tracking-[0.24em] text-white/55">
          <div className="flex items-center gap-1">
            {SOCIALS.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                aria-label={label}
                className="rounded-full p-2 text-white/70 transition-colors hover:text-brass"
              >
                <Icon size={17} strokeWidth={1.75} />
              </a>
            ))}
          </div>
          <span className="hidden sm:block">Gandhinagar, India · 23.2° N 72.6° E</span>
          <button
            type="button"
            data-scroll-to="profile"
            className="group flex items-center gap-2 py-2 text-white/65 transition-colors hover:text-brass"
          >
            Scroll
            <ArrowDown size={14} className="transition-transform group-hover:translate-y-0.5" />
          </button>
        </div>
      </motion.div>
    </section>
  )
}
