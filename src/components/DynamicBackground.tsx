import { useEffect, useRef } from 'react'

interface DynamicBackgroundProps {
  /** 'hero' is a night skyline with hills + moon, 'section' is a calmer starfield. */
  variant?: 'hero' | 'section'
  /** Color mood for the wash + stars + fireflies. Defaults to the site's gold/night theme. */
  tint?: 'gold' | 'maroon'
  className?: string
}

interface TintTheme {
  washTop: string
  washBottom: string
  star: string // "r,g,b"
  fireflyGlow: string // "r,g,b"
  fireflyCore: string // "r,g,b"
}

const TINTS: Record<'gold' | 'maroon', TintTheme> = {
  gold: {
    washTop: 'rgba(23,31,48,0.9)',
    washBottom: 'rgba(11,15,26,1)',
    star: '231,235,243',
    fireflyGlow: '217,165,74',
    fireflyCore: '255,224,168',
  },
  maroon: {
    washTop: 'rgba(61,22,18,0.92)',
    washBottom: 'rgba(20,8,7,1)',
    star: '245,222,205',
    fireflyGlow: '224,102,58',
    fireflyCore: '255,186,140',
  },
}

interface Star {
  x: number
  y: number
  r: number
  baseAlpha: number
  phase: number
  speed: number
}

interface Firefly {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  phase: number
  speed: number
}

/**
 * A quiet night sky: scattered twinkling stars plus a handful of warm
 * fireflies that wander and pulse. The 'hero' variant adds rolling hill
 * silhouettes and a glowing moon behind the stars. `tint` swaps the wash,
 * star, and firefly colors for a different mood per section (e.g. 'maroon'
 * for Projects) while keeping the same motion. Dependency-free canvas,
 * pauses on prefers-reduced-motion and when the section is off-screen.
 */
export default function DynamicBackground({
  variant = 'section',
  tint = 'gold',
  className = '',
}: DynamicBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const theme = TINTS[tint]

  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isHero = variant === 'hero'
    const starDensity = isHero ? 3200 : 6500 // px^2 per star — smaller = denser
    const fireflyDensity = isHero ? 42000 : 80000

    let width = 0
    let height = 0
    let dpr = Math.min(window.devicePixelRatio || 1, 2)
    let stars: Star[] = []
    let flies: Firefly[] = []
    let raf = 0
    let running = true
    let t = 0

    function makeField() {
      const starCount = Math.max(40, Math.min(220, Math.round((width * height) / starDensity)))
      stars = Array.from({ length: starCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * (isHero ? height * 0.72 : height),
        r: Math.random() * 1.1 + 0.3,
        baseAlpha: Math.random() * 0.5 + 0.35,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.8 + 0.3,
      }))

      const flyCount = Math.max(5, Math.min(18, Math.round((width * height) / fireflyDensity)))
      flies = Array.from({ length: flyCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.4 + 1.4,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.6 + 0.4,
      }))
    }

    function resize() {
      const rect = wrap!.getBoundingClientRect()
      width = rect.width
      height = rect.height
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas!.width = width * dpr
      canvas!.height = height * dpr
      canvas!.style.width = `${width}px`
      canvas!.style.height = `${height}px`
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      makeField()
    }

    function draw() {
      ctx!.clearRect(0, 0, width, height)

      // twinkling stars
      for (const s of stars) {
        const alpha = s.baseAlpha * (0.55 + 0.45 * Math.sin(t * s.speed + s.phase))
        ctx!.beginPath()
        ctx!.fillStyle = `rgba(${theme.star},${Math.max(alpha, 0)})`
        ctx!.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx!.fill()
      }

      // drifting, pulsing fireflies
      for (const f of flies) {
        f.vx += (Math.random() - 0.5) * 0.012
        f.vy += (Math.random() - 0.5) * 0.012
        f.vx = Math.max(-0.35, Math.min(0.35, f.vx))
        f.vy = Math.max(-0.35, Math.min(0.35, f.vy))
        f.x += f.vx
        f.y += f.vy

        if (f.x < -20) f.x = width + 20
        if (f.x > width + 20) f.x = -20
        if (f.y < -20) f.y = height + 20
        if (f.y > height + 20) f.y = -20

        const pulse = 0.4 + 0.6 * Math.max(0, Math.sin(t * f.speed + f.phase))
        const glowR = f.r * 7

        const grad = ctx!.createRadialGradient(f.x, f.y, 0, f.x, f.y, glowR)
        grad.addColorStop(0, `rgba(${theme.fireflyGlow},${0.55 * pulse})`)
        grad.addColorStop(1, `rgba(${theme.fireflyGlow},0)`)
        ctx!.beginPath()
        ctx!.fillStyle = grad
        ctx!.arc(f.x, f.y, glowR, 0, Math.PI * 2)
        ctx!.fill()

        ctx!.beginPath()
        ctx!.fillStyle = `rgba(${theme.fireflyCore},${0.75 * pulse + 0.15})`
        ctx!.arc(f.x, f.y, f.r, 0, Math.PI * 2)
        ctx!.fill()
      }
    }

    function step() {
      if (!running) return
      t += 0.016
      draw()
      raf = requestAnimationFrame(step)
    }

    resize()

    if (prefersReduced) {
      draw()
      running = false
    } else {
      step()
    }

    const ro = new ResizeObserver(() => resize())
    ro.observe(wrap)

    const onVisibility = () => {
      if (document.hidden) {
        running = false
        cancelAnimationFrame(raf)
      } else if (!prefersReduced) {
        running = true
        step()
      }
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      ro.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [variant, tint])

  return (
    <div ref={wrapRef} className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {/* base wash */}
      <div
        className="absolute inset-0"
        style={{
          background:
            variant === 'hero'
              ? `radial-gradient(70% 60% at 50% 0%, ${theme.washTop}, ${theme.washBottom} 70%)`
              : `radial-gradient(60% 70% at 50% 100%, ${theme.washTop}, ${theme.washBottom} 75%)`,
        }}
      />

      {variant === 'hero' && (
        <>
          {/* moon */}
          <div
            className="absolute animate-moonGlow rounded-full"
            style={{
              top: '9%',
              right: '11%',
              width: 'clamp(56px, 8vw, 92px)',
              height: 'clamp(56px, 8vw, 92px)',
              background:
                'radial-gradient(circle at 35% 32%, #F7EFD9 0%, #EBDFBB 38%, #D9C692 70%, #C9B37E 100%)',
              boxShadow: '0 0 60px 18px rgba(238,225,180,0.28), 0 0 140px 50px rgba(217,165,74,0.10)',
            }}
          >
            <div
              className="absolute inset-0 rounded-full opacity-70 mix-blend-multiply"
              style={{
                background:
                  'radial-gradient(circle at 68% 62%, rgba(160,145,105,0.55) 0%, rgba(160,145,105,0) 22%), radial-gradient(circle at 30% 70%, rgba(160,145,105,0.4) 0%, rgba(160,145,105,0) 16%), radial-gradient(circle at 55% 30%, rgba(160,145,105,0.35) 0%, rgba(160,145,105,0) 14%)',
              }}
            />
          </div>

          {/* rolling hills — far to near, layered for depth */}
          <svg
            className="absolute bottom-0 left-0 h-[42%] w-full"
            viewBox="0 0 1200 400"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0,260 C150,200 300,290 480,240 C660,190 800,260 1000,220 C1100,200 1160,230 1200,220 L1200,400 L0,400 Z"
              fill="#141B2C"
              opacity="0.75"
            />
            <path
              d="M0,320 C180,270 320,330 520,300 C700,275 860,330 1040,295 C1120,280 1160,300 1200,290 L1200,400 L0,400 Z"
              fill="#0F1524"
              opacity="0.9"
            />
            <path
              d="M0,370 C200,335 380,375 560,350 C760,322 900,368 1080,345 C1140,336 1170,350 1200,345 L1200,400 L0,400 Z"
              fill="#0B0F1A"
            />
          </svg>
        </>
      )}

      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  )
}
