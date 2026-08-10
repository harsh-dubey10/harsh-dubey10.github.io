import { motion, type Variants } from 'framer-motion'
import { achievements } from '../data/content'
import Reveal from './Reveal'

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 22, scale: 0.94 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.34, 1.56, 0.64, 1] },
  }),
}

export default function Achievements() {
  return (
    <section id="achievements" className="border-t border-ink-borderSoft py-24 sm:py-28">
      <Reveal className="mb-10">
        <div className="flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.16em] text-brass">
          <span className="h-px w-4 bg-brass-dim" /> Trophies
        </div>
        <h2 className="mt-3 font-display text-[clamp(30px,4vw,42px)] font-semibold text-text">
          Achievements Unlocked
        </h2>
      </Reveal>

      <div className="grid gap-4 sm:grid-cols-2">
        {achievements.map((a, i) => (
          <motion.div
            key={a.title}
            custom={i}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            variants={cardVariants}
            whileHover={{ y: -6, scale: 1.015 }}
            className="flex items-start gap-4 rounded-lg border border-ink-border bg-ink-surface p-5 transition-colors hover:border-brass-dim hover:bg-ink-raised"
          >
            <span className="mt-0.5 inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-full border border-brass-dim bg-brass-soft px-3 py-1 text-center font-mono text-[11px] leading-none text-brass">
              {a.tag}
            </span>
            <div className="min-w-0">
              <div className="text-[14px] font-medium leading-snug text-text">{a.title}</div>
              <div className="mt-1 font-mono text-[11px] text-text-faint">{a.date}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
