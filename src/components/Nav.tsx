import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useActiveSection } from '../hooks/useActiveSection'

const SECTIONS = [
  { id: 'profile', label: 'About' },
  { id: 'timeline', label: 'Experience' },
  { id: 'work', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
]

export default function Nav() {
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
            className={`pointer-events-auto flex items-center rounded-full border border-white/10 bg-[#0D0A08]/70 text-white shadow-[0_10px_40px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl backdrop-saturate-150 transition-[padding,margin] duration-300 ${
              scrolled ? 'mt-3 px-1.5 py-1.5' : 'mt-5 px-2 py-2'
            }`}
          >
            <div className="no-scrollbar flex items-center gap-1 overflow-x-auto">
              {SECTIONS.map((s) => {
                const isActive = active === s.id
                return (
                  <button
                    type="button"
                    key={s.id}
                    data-scroll-to={s.id}
                    aria-current={isActive ? 'true' : undefined}
                    className={`relative shrink-0 whitespace-nowrap rounded-full px-4 py-2 font-mono text-[11.5px] uppercase tracking-wide transition-colors ${
                      isActive ? 'text-brass font-medium' : 'text-white/70 hover:text-white'
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-active-pill"
                        className="absolute inset-0 rounded-full bg-brass/[0.14] ring-1 ring-inset ring-brass/45"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      />
                    )}
                    <span className="relative z-10">{s.label}</span>
                  </button>
                )
              })}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  )
}
