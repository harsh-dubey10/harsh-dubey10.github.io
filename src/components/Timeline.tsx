import { Suspense, lazy, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { hasWebGL } from '../lib/webgl'

// three.js stays in its own lazily loaded chunk.
const PaperTear = lazy(() => import('./PaperTear'))

// Color accents matching the reference treasure map
const CURRENT_BG = 'rgba(26,122,109,0.15)'
const CURRENT_BORDER = '#1A7A6D'
const CURRENT_COLOR = '#1A7A6D'

// Experience stops, oldest first.
const MAP_STOPS = [
  {
    id: 'aicte',
    company: 'AICTE Idea Lab',
    role: 'Student Ambassador',
    period: 'Oct 2022 — May 2024',
    level: 19,
    description:
      'Provided technical assistance and guidance to students working with Arduino Uno, 3D printers, CNC machines, and other fabrication tools. Promoted design thinking and assisted in technical problem-solving and project execution.',
    tech: ['Arduino', '3D Printing', 'Mentorship', 'CNC'],
        current: false,
    url: 'https://www.bitdurg.ac.in/',
  },
  {
    id: 'vivada',
    company: 'Vivada',
    role: 'Software Engineering Intern',
    period: 'Apr 2024 — Jul 2024',
    level: 21,
    description:
      'Applied data-driven experimentation and iterative prototyping, reducing abandonment by 25%. Collaborated with cross-functional teams to evaluate design improvements and optimize user engagement.',
    tech: ['Experimentation', 'Prototyping', 'Analytics', 'React'],
        current: false,
    url: 'https://vivadaindia.com/',
  },
  {
    id: 'fuss',
    company: 'FUSS Group',
    role: 'M.Tech Researcher, advised by Prof. Abhishek Bichhawat',
    period: '2025 — Present',
    level: 23,
    description:
      'Researching within the FUSS Group at IIT Gandhinagar under Prof. Abhishek Bichhawat, focusing on formal methods, systems performance, web security, and compilers.',
    tech: ['Formal Methods', 'Systems', 'Security', 'Compilers'],
        current: true,
    url: 'https://iitgn.ac.in/',
  },
]

// Display order: latest first.
const CARD_INDICES = [2, 1, 0]

const INK = '#3A2A1A'
const SEPIA = '#8B6F47'

/** A stop on the rule: the company initial in a ring, highlighted when current. */
function Marker({ letter, current }: { letter: string; current: boolean }) {
  return (
    <div
      className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 font-display text-lg font-bold"
      style={
        current
          ? { background: '#EAF3EF', borderColor: CURRENT_BORDER, color: CURRENT_COLOR, boxShadow: `0 0 0 6px ${CURRENT_BG}` }
          : { background: '#5C4A3A', borderColor: SEPIA, color: '#FFF8F0' }
      }
    >
      {letter}
    </div>
  )
}

export default function Timeline() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const [webgl] = useState(hasWebGL)

  return (
    <section
      id="timeline"
      ref={sectionRef}
      className={`relative left-1/2 right-1/2 -mx-[50vw] w-screen -mt-px overflow-clip pb-36 sm:pb-40 ${
        webgl ? '' : 'treasure-map-bg'
      }`}
    >
      {/* The parchment: a WebGL sheet with torn top and bottom edges, pinned
          to the viewport while the section scrolls past it. Below the bottom
          tear, the same grained paper as Projects shows through. */}
      {webgl && <div aria-hidden="true" className="paper-bg pointer-events-none absolute inset-x-0 bottom-0 h-1/2" />}
      {webgl ? (
        <div className="pointer-events-none sticky top-0 z-0 -mb-[100vh] h-screen w-full">
          <Suspense fallback={null}>
            <PaperTear targetRef={sectionRef} top bottom sheet="paper" seed={11} className="h-full w-full" />
          </Suspense>
        </div>
      ) : (
        <div
          className="pointer-events-none absolute inset-0 z-10"
          style={{ boxShadow: 'inset 0 0 120px 40px rgba(60,40,20,0.7), inset 0 0 60px 20px rgba(30,20,10,0.4)' }}
        />
      )}

      <div className="relative z-[35] mx-auto max-w-4xl px-6 pt-28 sm:pt-36">
        {/* Header */}
        <p className="mb-3 font-mono text-xs font-medium uppercase tracking-[0.3em]" style={{ color: '#7A5E38' }}>
          02 — Journey so far
        </p>
        <h2 className="mb-2 font-display text-4xl font-bold sm:text-5xl lg:text-6xl" style={{ color: INK }}>
          Experience
        </h2>
        <p className="text-lg italic" style={{ color: '#5C4A3A' }}>
          Every stop, a story. Every role, a relic.
        </p>

        {/* Timeline: a ruled line with a stop for each role, latest first */}
        <ol className="relative mt-14 sm:mt-16">
          {/* The rule, running from "What's next?" to the first stop */}
          <span
            aria-hidden="true"
            className="absolute bottom-6 left-6 top-6 w-px"
            style={{ backgroundImage: `linear-gradient(${SEPIA}99 50%, transparent 50%)`, backgroundSize: '1px 10px' }}
          />

          {/* What's next */}
          <li className="relative flex items-center gap-5 pb-10 sm:gap-8">
            <div
              className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-dashed font-display text-xl font-bold"
              style={{ borderColor: `${SEPIA}99`, color: SEPIA, background: '#F6EAD3' }}
            >
              ?
            </div>
            <p className="font-display text-lg italic" style={{ color: SEPIA }}>
              What's next?
            </p>
          </li>

          {CARD_INDICES.map((idx, i) => {
            const stop = MAP_STOPS[idx]
            return (
              <motion.li
                key={stop.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: i * 0.06, ease: [0.2, 0.7, 0.2, 1] }}
                className="relative flex gap-5 pb-10 last:pb-0 sm:gap-8"
              >
                <div className="flex flex-col items-center pt-1">
                  <Marker letter={stop.company[0]} current={stop.current} />
                </div>

                <article
                  className="flex-1 rounded-xl border p-5 transition-shadow duration-300 hover:shadow-[0_14px_40px_rgba(60,40,20,0.14)] sm:p-6"
                  style={{ background: '#FFF8F0E6', borderColor: '#D4B89680' }}
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <h3 className="font-display text-xl font-bold sm:text-2xl" style={{ color: INK }}>
                      {stop.company}
                      {stop.current && (
                        <span className="ml-2 align-middle text-[11px] font-normal italic" style={{ color: CURRENT_COLOR }}>
                          current
                        </span>
                      )}
                    </h3>
                    <span className="font-mono text-xs" style={{ color: SEPIA }}>
                      {stop.period}
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-semibold sm:text-[15px]" style={{ color: '#5C4A3A' }}>
                    {stop.role}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed sm:text-[15px]" style={{ color: `${INK}CC` }}>
                    {stop.description}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap gap-1.5">
                      {stop.tech.map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-[#D4B896] bg-[#F4E3C3] px-2.5 py-0.5 text-[11px] font-medium"
                          style={{ color: INK }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <span className="flex items-center gap-3">
                      <span className="rounded-full bg-[#8B6F47]/10 px-2 py-0.5 text-[10px] font-bold text-[#7A5E38]">
                        Lv. {stop.level}
                      </span>
                      {stop.url && (
                        <a
                          href={stop.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold hover:underline"
                          style={{ color: SEPIA }}
                        >
                          Visit <ArrowUpRight size={13} />
                        </a>
                      )}
                    </span>
                  </div>
                </article>
              </motion.li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
