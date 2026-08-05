import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { timeline } from '../data/content'
import Reveal from './Reveal'

export default function Timeline() {
  const [activeId, setActiveId] = useState(
    timeline.find((t) => t.current)?.id ?? timeline[0]?.id ?? '',
  )
  const activeIndex = timeline.findIndex((t) => t.id === activeId)
  const active = timeline[activeIndex]
  const fillPercent = timeline.length > 0 ? ((activeIndex + 1) / timeline.length) * 100 : 0

  return (
    <section id="timeline" className="border-t border-ink-borderSoft py-24 sm:py-28">
      <Reveal className="mb-12">
        <div className="flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.16em] text-brass">
          <span className="h-px w-4 bg-brass-dim" /> Journey So Far
        </div>
        <h2 className="mt-3 font-display text-[clamp(30px,4vw,42px)] font-semibold text-text">
          Experience
        </h2>
        <p className="mt-2.5 max-w-md text-[15px] text-text-dim">
          Three stops so far, each logged with what actually happened there.
        </p>
        <div className="mt-3 font-mono text-[11.5px] uppercase tracking-wide text-text-faint">
          select an entry to expand it
        </div>
      </Reveal>

      <Reveal delay={0.05}>
        <div className="no-scrollbar mb-2 flex gap-4 overflow-x-auto px-0.5 pb-4 pt-1.5">
          {timeline.map((entry) => {
            const isActive = entry.id === activeId
            return (
              <button
                key={entry.id}
                onClick={() => setActiveId(entry.id)}
                className="flex shrink-0 flex-col items-center gap-2 py-1.5"
                aria-pressed={isActive}
              >
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-full border font-display text-[17px] transition-all ${
                    isActive
                      ? 'border-brass text-brass shadow-[0_0_0_4px_rgba(217,165,74,0.12),0_0_14px_1px_rgba(217,165,74,0.3)]'
                      : 'border-ink-border text-text-dim'
                  }`}
                >
                  {entry.initial}
                </span>
                <span
                  className={`font-mono text-[10.5px] ${isActive ? 'text-brass' : 'text-text-faint'}`}
                >
                  Lv.{entry.level}
                </span>
              </button>
            )
          })}
        </div>

        <div className="relative mx-2 -mt-3 mb-8 h-px bg-ink-border">
          <div
            className="absolute left-0 top-0 h-px bg-gradient-to-r from-brass-dim to-brass transition-all duration-300"
            style={{ width: `${fillPercent}%` }}
          />
        </div>

        <AnimatePresence mode="wait">
          {active && (
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="rounded-lg border border-ink-border bg-ink-surface p-8 transition-colors hover:border-brass-dim sm:p-9"
            >
              <div className="flex flex-wrap items-baseline gap-3">
                <span className="font-mono text-[11.5px] text-brass">Lv. {active.level}</span>
                <span className="font-display text-[22px] font-semibold text-text sm:text-[24px]">
                  {active.org}
                </span>
                <span className="ml-auto font-mono text-[11.5px] text-text-faint">
                  {active.period}
                </span>
              </div>
              <div className="mt-1.5 font-mono text-[12.5px] text-text-dim">{active.role}</div>
              <p className="mt-4 max-w-2xl text-[14.5px] leading-relaxed text-text-dim">
                {active.description}
              </p>
              <div className="mt-[18px] flex flex-wrap gap-2">
                {active.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded border border-ink-border px-2.5 py-1 font-mono text-[11px] text-text-faint"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              {active.current && (
                <div className="mt-4 inline-flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-wide text-brass">
                  <span className="h-1.5 w-1.5 animate-pulseDot rounded-full bg-brass" />
                  current
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-6 flex items-center gap-4 rounded-lg border border-dashed border-ink-border p-6 text-text-faint">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-dashed border-ink-border font-display text-[18px]">
            ?
          </div>
          <div>
            <div className="font-mono text-[12px] uppercase tracking-wide text-text-dim">
              What's next
            </div>
            <div className="mt-1 text-[13.5px]">Still being written.</div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
