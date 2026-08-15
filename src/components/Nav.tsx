import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useActiveSection } from '../hooks/useActiveSection'

const SECTIONS = [
  { id: 'profile', label: 'About' },
  { id: 'timeline', label: 'Journey' },
  { id: 'work', label: 'Quests' },
  { id: 'contact', label: 'Connect' },
]

interface NavProps {
  onReplayIntro?: () => void
}

export default function Nav({ onReplayIntro }: NavProps = {}) {
  const active = useActiveSection(SECTIONS.map((s) => s.id))
  const [scrolled, setScrolled] = useState(false)
  const [visible, setVisible] = useState(false)

  // Shrinks the pill slightly once the page has scrolled a bit.
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Only show the pill once the hero ("top") section has fully scrolled
  // out of view, matching the reference site's behaviour.
  useEffect(() => {
    const hero = document.getElementById('top')
    if (!hero) {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0 },
    )
    observer.observe(hero)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4">
      <AnimatePresence>
        {visible && (
          <motion.nav
            layout
            initial={{ opacity: 0, y: -16, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className={`pointer-events-auto flex items-center rounded-full border border-neutral-200/80 bg-white/95 text-neutral-900 shadow-[0_8px_30px_rgba(0,0,0,0.15)] backdrop-blur-xl transition-[padding,margin] duration-300 ${
              scrolled ? 'mt-3 px-1.5 py-1.5' : 'mt-5 px-2 py-2'
            }`}
          >
            <div className="no-scrollbar flex items-center gap-1 overflow-x-auto">
              {SECTIONS.map((s) => {
                const isActive = active === s.id
                return (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className={`relative shrink-0 whitespace-nowrap rounded-full px-4 py-2 font-mono text-[11.5px] uppercase tracking-wide transition-colors ${
                      isActive ? 'text-white font-medium' : 'text-neutral-600 hover:text-black'
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-active-pill"
                        className="absolute inset-0 rounded-full bg-black shadow-sm"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      />
                    )}
                    <span className="relative z-10">{s.label}</span>
                  </a>
                )
              })}
              {onReplayIntro && (
                <button
                  type="button"
                  onClick={onReplayIntro}
                  className="relative shrink-0 rounded-full p-1.5 text-neutral-400 hover:text-purple-600 transition-colors"
                  title="Replay Dragon Intro"
                  aria-label="Replay Dragon Intro"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3z" />
                  </svg>
                </button>
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  )
}
