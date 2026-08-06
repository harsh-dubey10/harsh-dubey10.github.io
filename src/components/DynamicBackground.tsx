import { useEffect, useRef } from 'react'

interface DynamicBackgroundProps {
  /** 'hero' is a night skyline with hills + moon, 'profile' is torchlight, 'section' is a calm starfield. */
  variant?: 'hero' | 'section' | 'profile'
  className?: string
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

interface Torch {
  x: number // relative 0–1
  y: number // relative 0–1
  seed: number
}

interface Ember {
  x: number
  y: number
  vy: number
  vx: number
  r: number
  life: number
  maxLife: number
  torch: number
}

/**
 * Layered scene backgrounds:
 *  - hero: night sky with twinkling stars, drifting fireflies, rolling hill
 *    silhouettes and a glowing moon.
 *  - section: a calmer starfield + fireflies (no hills/moon).
 *  - profile: flickering torchlight with rising embers, for the character
 *    sheet card.
 * Dependency-free canvas, pauses on prefers-reduced-motion and when the
 * section is off-screen.
 */
export default function DynamicBackground({ variant = 'section', className = '' }: DynamicBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isHero = variant === 'hero'
    const isProfile = variant === 'profile'
    const starDensity = isHero ? 3200 : 6500 // px^2 per star — smaller = denser
    const fireflyDensity = isHero ? 42000 : 80000

    let width = 0
    let height = 0
    let dpr = Math.min(window.devicePixelRatio || 1, 2)
    let stars: Star[] = []
    let flies: Firefly[] = []
    let torches: Torch[] = []
    let embers: Ember[] = []
    let raf = 0
    let running = true
    let t = 0

    function spawnEmber(torchIndex: number): Ember {
      const torch = torches[torchIndex]
      return {
        x: torch.x * width + (Math.random() - 0.5) * 10,
        y: torch.y * height,
        vx: (Math.random() - 0.5) * 0.15,
        vy: -(Math.random() * 0.35 + 0.25),
        r: Math.random() * 1.2 + 0.6,
        life: 0,
        maxLife: Math.random() * 60 + 60,
        torch: torchIndex,
      }
    }

    function makeField() {
      if (isProfile) {
        torches = [
          { x: 0.09, y: 0.14, seed: Math.random() * 100 },
          { x: 0.91, y: 0.14, seed: Math.random() * 100 },
        ]
        embers = []
        torches.forEach((_, i) => {
          for (let n = 0; n < 8; n++) embers.push(spawnEmber(i))
        })
        return
      }

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

    function drawStarsAndFireflies() {
      for (const s of stars) {
        const alpha = s.baseAlpha * (0.55 + 0.45 * Math.sin(t * s.speed + s.phase))
        ctx!.beginPath()
        ctx!.fillStyle = `rgba(231,235,243,${Math.max(alpha, 0)})`
        ctx!.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx!.fill()
      }

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
        grad.addColorStop(0, `rgba(217,165,74,${0.55 * pulse})`)
        grad.addColorStop(1, 'rgba(217,165,74,0)')
        ctx!.beginPath()
        ctx!.fillStyle = grad
        ctx!.arc(f.x, f.y, glowR, 0, Math.PI * 2)
        ctx!.fill()

        ctx!.beginPath()
        ctx!.fillStyle = `rgba(255,224,168,${0.75 * pulse + 0.15})`
        ctx!.arc(f.x, f.y, f.r, 0, Math.PI * 2)
        ctx!.fill()
      }
    }

    function drawTorches() {
      torches.forEach((torch) => {
        const tx = torch.x * width
        const ty = torch.y * height

        // layered flicker: a slow sway plus a fast jitter, unique per torch
        const flicker =
          0.7 +
          0.18 * Math.sin(t * 3.1 + torch.seed) +
          0.12 * Math.sin(t * 7.3 + torch.seed * 2) +
          0.08 * (Math.random() - 0.5)
        const clamped = Math.max(0.35, Math.min(1.15, flicker))

        const glowR = Math.min(width, height * 2.2) * 0.4 * clamped
        const grad = ctx!.createRadialGradient(tx, ty, 0, tx, ty, glowR)
        grad.addColorStop(0, `rgba(255,170,90,${0.32 * clamped})`)
        grad.addColorStop(0.35, `rgba(217,165,74,${0.16 * clamped})`)
        grad.addColorStop(1, 'rgba(217,165,74,0)')
        ctx!.beginPath()
        ctx!.fillStyle = grad
        ctx!.arc(tx, ty, glowR, 0, Math.PI * 2)
        ctx!.fill()

        // flame core
        const coreR = 3.2 * clamped
        const coreGrad = ctx!.createRadialGradient(tx, ty, 0, tx, ty, coreR)
        coreGrad.addColorStop(0, `rgba(255,236,200,${0.9 * clamped})`)
        coreGrad.addColorStop(0.6, `rgba(255,170,90,${0.7 * clamped})`)
        coreGrad.addColorStop(1, 'rgba(255,170,90,0)')
        ctx!.beginPath()
        ctx!.fillStyle = coreGrad
        ctx!.arc(tx, ty, coreR, 0, Math.PI * 2)
        ctx!.fill()
      })

      for (let k = embers.length - 1; k >= 0; k--) {
        const e = embers[k]
        e.life += 1
        e.x += e.vx
        e.y += e.vy
        e.vy -= 0.001

        const lifeRatio = e.life / e.maxLife
        const alpha = Math.max(0, 1 - lifeRatio) * 0.8

        ctx!.beginPath()
        ctx!.fillStyle = `rgba(255,196,120,${alpha})`
        ctx!.arc(e.x, e.y, e.r, 0, Math.PI * 2)
        ctx!.fill()

        if (e.life >= e.maxLife) {
          embers[k] = spawnEmber(e.torch)
        }
      }
    }

    function draw() {
      ctx!.clearRect(0, 0, width, height)
      if (isProfile) {
        drawTorches()
      } else {
        drawStarsAndFireflies()
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
  }, [variant])

  return (
    <div ref={wrapRef} className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {/* base wash */}
      <div
        className="absolute inset-0"
        style={{
          background:
            variant === 'hero'
              ? 'radial-gradient(70% 60% at 50% 0%, rgba(23,31,48,0.9), rgba(11,15,26,1) 70%)'
              : variant === 'profile'
                ? 'radial-gradient(120% 90% at 50% 0%, rgba(23,31,48,0.55), rgba(11,15,26,0) 65%)'
                : 'radial-gradient(60% 70% at 50% 100%, rgba(23,31,48,0.7), rgba(11,15,26,1) 75%)',
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
