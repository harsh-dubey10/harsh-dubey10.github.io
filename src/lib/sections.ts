/** Page sections in scroll order; index 0 is the hero. */
export const SECTION_IDS = ['top', 'profile', 'timeline', 'work', 'contact'] as const

/**
 * Continuous position through the page in "sections": 0 on the hero, 1 once
 * About fills the screen, 1.5 halfway into Experience, and so on. Each step
 * runs as the next section's top travels from the bottom of the viewport to
 * the top, which is exactly when the visible transition happens.
 */
export function sectionProgress(): number {
  const vh = window.innerHeight
  let s = 0
  for (let k = 1; k < SECTION_IDS.length; k++) {
    const el = document.getElementById(SECTION_IDS[k])
    if (!el) continue
    const top = el.getBoundingClientRect().top
    s += Math.min(Math.max((vh - top) / vh, 0), 1)
  }
  return s
}

/** Sections with a light (parchment) background. */
export const LIGHT_SECTIONS = new Set([2])
