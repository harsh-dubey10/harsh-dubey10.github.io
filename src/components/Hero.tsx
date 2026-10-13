import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowUpRight, Github, Linkedin, Mail } from 'lucide-react'
import Campfire from './Campfire'
import DynamicBackground from './DynamicBackground'
import { connectLinks, profile } from '../data/content'
import { useTypewriter } from '../hooks/useTypewriter'
import { hasWebGL } from '../lib/webgl'

// three.js is split into its own chunk so it never blocks first paint.
const HeroScene = lazy(() => import('./HeroScene'))

const PORTRAIT_SRC = '/portrait.webp'

const SOCIALS = [
  { label: 'GitHub', icon: Github },
  { label: 'LinkedIn', icon: Linkedin },
  { label: 'Email', icon: Mail },
].map((s) => ({ ...s, href: connectLinks.find((l) => l.label === s.label)?.href ?? '#' }))

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: [0.2, 0.7, 0.2, 1] },
})

export default function Hero() {
  const typed = useTypewriter(profile.roles, { startFull: true })
  const [webgl, setWebgl] = useState(hasWebGL)
  // With WebGL the portrait is drawn (and assembled) in the scene; the <img>
  // is only a fallback, shown if the scene never reports ready.
  const [sceneReady, setSceneReady] = useState(false)
  const [fallbackPortrait, setFallbackPortrait] = useState(!webgl)
  const sectionRef = useRef<HTMLElement>(null)
  const campfireRef = useRef<HTMLDivElement>(null)
  const portraitRef = useRef<HTMLDivElement>(null)

  const onWebglUnsupported = useCallback(() => {
    setWebgl(false)
    setFallbackPortrait(true)
  }, [])
  const onSceneReady = useCallback(() => setSceneReady(true), [])

  useEffect(() => {
    if (!webgl || sceneReady) return
    const t = setTimeout(() => setFallbackPortrait(true), 4000)
    return () => clearTimeout(t)
  }, [webgl, sceneReady])

  // Scroll-out choreography: text lifts away faster than the scene behind it.
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] })
  const textY = useTransform(scrollYProgress, [0, 1], [0, -160])
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const sceneY = useTransform(scrollYProgress, [0, 1], [0, 90])
  const cueOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0])

  const showImg = fallbackPortrait && !sceneReady

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative left-1/2 right-1/2 -mx-[50vw] h-[100svh] min-h-[640px] w-screen overflow-hidden bg-[#080E1C]"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#080E1C] via-[#0B1222] to-[#0A0F1A]" />

      {/* Sky wash, moon and hills; the 2D starfield only runs as a no-WebGL fallback */}
      <DynamicBackground variant="hero" tint="gold" particles={!webgl} />

      {/* Warm pool of firelight behind the portrait */}
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 h-[60%] w-[110%] -translate-x-1/2 lg:left-[72%] lg:w-[55%]"
        style={{
          background:
            'radial-gradient(ellipse at 50% 85%, rgba(255,130,54,0.22) 0%, rgba(217,165,74,0.07) 42%, transparent 70%)',
        }}
      />

      {/* WebGL: stars, meteors, fireflies, portrait, halo and embers */}
      {webgl && (
        <motion.div style={{ y: sceneY }} className="pointer-events-none absolute inset-0 z-[11]">
          <Suspense fallback={null}>
            <HeroScene
              emitterRef={campfireRef}
              portraitRef={portraitRef}
              portraitSrc={PORTRAIT_SRC}
              onReady={onSceneReady}
              onUnsupported={onWebglUnsupported}
            />
          </Suspense>
        </motion.div>
      )}

      <div className="relative z-20 mx-auto grid h-full max-w-6xl grid-rows-[minmax(0,1fr),auto] items-center gap-4 px-6 pb-10 pt-20 lg:grid-cols-[1.05fr,0.95fr] lg:grid-rows-1 lg:gap-8 lg:pb-0 lg:pt-0">
        {/* Portrait slot — the scene fits the cut-out into this box */}
        <motion.div
          style={{ y: sceneY }}
          className="relative order-1 h-full max-h-[46svh] min-h-[220px] w-full lg:order-2 lg:h-[76svh] lg:max-h-[720px] lg:self-end"
        >
          <div ref={portraitRef} className="absolute inset-x-0 bottom-[6%] top-0">
            {showImg && (
              <img
                src={PORTRAIT_SRC}
                alt={profile.name}
                className="h-full w-full object-contain object-bottom [mask-image:linear-gradient(to_top,transparent,black_20%)]"
              />
            )}
          </div>
          <div
            ref={campfireRef}
            className="absolute bottom-0 left-1/2 h-24 w-28 -translate-x-1/2 lg:h-32 lg:w-40"
          >
            <Campfire className="h-full w-full drop-shadow-[0_0_24px_rgba(255,130,54,0.55)]" />
          </div>
        </motion.div>

        {/* Name, role and calls to action */}
        <motion.div
          style={{ y: textY, opacity: textOpacity }}
          className="order-2 text-center lg:order-1 lg:text-left"
        >
          <motion.p
            {...rise(0.1)}
            className="mb-4 font-mono text-[11px] uppercase tracking-[0.28em] text-white/60 sm:text-xs lg:mb-6"
          >
            M.Tech CSE · IIT Gandhinagar
          </motion.p>

          <motion.h1
            {...rise(0.2)}
            className="font-display text-[clamp(2.75rem,7.4vw,6.75rem)] font-extrabold leading-[0.9] text-brass drop-shadow-[0_0_30px_rgba(255,130,54,0.2)]"
          >
            Harsh Vardhan
            <br />
            <span className="text-white">Dubey</span>
          </motion.h1>

          <motion.div {...rise(0.35)} className="mt-4 h-6 font-mono text-sm text-brass/90 sm:text-base lg:mt-6">
            <span>{typed}</span>
            <span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] animate-blink bg-brass align-middle" />
          </motion.div>

          <motion.p
            {...rise(0.45)}
            className="mx-auto mt-4 hidden max-w-md text-[15px] leading-relaxed text-white/70 sm:block lg:mx-0"
          >
            I build things end to end — from distributed multi-agent systems to NLP pipelines for Hindi.
          </motion.p>

          <motion.div
            {...rise(0.55)}
            className="mt-6 flex flex-wrap items-center justify-center gap-3 lg:mt-8 lg:justify-start"
          >
            <a
              href="#work"
              className="inline-flex items-center gap-2 rounded-full bg-brass px-5 py-2.5 font-mono text-[12px] font-semibold uppercase tracking-[0.12em] text-[#120D06] shadow-[0_8px_30px_rgba(217,165,74,0.25)] transition hover:bg-[#E8B95E] hover:shadow-[0_8px_40px_rgba(217,165,74,0.4)]"
            >
              View projects
            </a>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/[0.04] px-5 py-2.5 font-mono text-[12px] font-semibold uppercase tracking-[0.12em] text-white backdrop-blur-sm transition hover:border-brass/60 hover:text-brass"
            >
              Résumé <ArrowUpRight size={14} />
            </a>
            <span className="mx-1 hidden h-6 w-px bg-white/15 sm:block" />
            <div className="flex items-center gap-1">
              {SOCIALS.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="rounded-full p-2.5 text-white/70 transition-colors hover:bg-white/[0.06] hover:text-brass"
                >
                  <Icon size={18} strokeWidth={1.75} />
                </a>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.a
        href="#profile"
        style={{ opacity: cueOpacity }}
        className="absolute bottom-6 left-8 z-30 hidden flex-col items-center gap-2 text-white/60 transition-colors hover:text-brass lg:flex"
        aria-label="Scroll to about"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] [writing-mode:vertical-rl]">Scroll</span>
        <span className="relative h-12 w-px overflow-hidden bg-white/15">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-scrollCue bg-brass" />
        </span>
      </motion.a>
    </section>
  )
}
