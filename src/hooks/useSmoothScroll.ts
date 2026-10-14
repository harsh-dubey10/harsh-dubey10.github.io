import { useEffect } from 'react'
import Lenis from 'lenis'
import { prefersReducedMotion } from '../lib/webgl'

/**
 * Inertial smooth scrolling (Lenis), plus in-page navigation: any element
 * with `data-scroll-to="<section id>"` glides to that section. Those are
 * buttons rather than #anchors, so the browser shows no URL preview on
 * hover. Under prefers-reduced-motion, navigation jumps instead.
 */
export function useSmoothScroll() {
  useEffect(() => {
    const reduced = prefersReducedMotion()
    const lenis = reduced ? null : new Lenis({ lerp: 0.07, smoothWheel: true })

    let raf = 0
    if (lenis) {
      raf = requestAnimationFrame(function loop(time) {
        lenis.raf(time)
        raf = requestAnimationFrame(loop)
      })
    }

    const onClick = (e: MouseEvent) => {
      const trigger = (e.target as Element | null)?.closest?.('[data-scroll-to]')
      const id = trigger?.getAttribute('data-scroll-to')
      const target = id ? document.getElementById(id) : null
      if (!target) return
      e.preventDefault()
      if (lenis) lenis.scrollTo(target, { duration: 1.4 })
      else target.scrollIntoView()
    }
    document.addEventListener('click', onClick)

    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('click', onClick)
      lenis?.destroy()
    }
  }, [])
}
