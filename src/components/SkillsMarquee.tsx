import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { skills } from '../data/content'

const ROW_A = ['Formal Methods', 'Distributed Systems', 'Web Security', 'Compilers', 'LLM Agents']
const ROW_B = skills.filter((s) => !ROW_A.includes(s))

function Row({ words, outlined }: { words: string[]; outlined: boolean }) {
  // Repeat so the band never runs out while it slides.
  const items = [...words, ...words, ...words]
  return (
    <div className="flex shrink-0 items-center gap-8 pr-8 sm:gap-12 sm:pr-12">
      {items.map((w, i) => (
        <span key={`${w}-${i}`} className="flex items-center gap-8 sm:gap-12">
          <span
            className={`whitespace-nowrap font-display text-4xl font-bold sm:text-6xl lg:text-7xl ${
              outlined
                ? 'text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.28)]'
                : 'text-white/[0.85]'
            }`}
          >
            {w}
          </span>
          <span className="h-2 w-2 rotate-45 bg-brass/70" />
        </span>
      ))}
    </div>
  )
}

/** Two bands of focus areas that slide in opposite directions as you scroll. */
export default function SkillsMarquee() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const xA = useTransform(scrollYProgress, [0, 1], ['0%', '-28%'])
  const xB = useTransform(scrollYProgress, [0, 1], ['-28%', '0%'])

  return (
    <div
      ref={ref}
      aria-label={`Focus areas: ${[...ROW_A, ...ROW_B].join(', ')}`}
      className="relative left-1/2 right-1/2 -mx-[50vw] w-screen overflow-hidden border-t border-white/[0.06] py-16 sm:py-24 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"
    >
      <div aria-hidden="true" className="space-y-4 sm:space-y-6">
        <motion.div style={{ x: xA }} className="flex">
          <Row words={ROW_A} outlined={false} />
        </motion.div>
        <motion.div style={{ x: xB }} className="flex">
          <Row words={ROW_B} outlined />
        </motion.div>
      </div>
    </div>
  )
}
