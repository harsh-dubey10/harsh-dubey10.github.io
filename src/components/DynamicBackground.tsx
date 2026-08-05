import { useEffect, useRef } from 'react'

interface DynamicBackgroundProps {
  /** 'hero' is denser/brighter and mouse-interactive, 'section' is a calmer static variant. */
  variant?: 'hero' | 'section'
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

interface Spark extends Firefly {
  life: number
  maxLife: number
}

/**
 * A quiet night sky: scattered twinkling stars plus a handful of warm
 * fireflies that wander and pulse. On the hero variant, fireflies drift
 * gently toward the cursor and moving the mouse leaves a faint trail of
 * extra fireflies that fade out behind it. No connecting lines, no diagram
 * look — pure ambience. Dependency-free canvas, pauses on
 * prefers-reduced-motion and when the tab/section is off-screen.
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
    const interactive = isHero && !prefersReduced
    const starDensity = isHero ? 3200 : 6500 // px^2 per star — smaller = denser
    const fireflyDensity = isHero ? 30000 : 80000 // smaller = more fireflies

    let width = 0
    let height = 0
    let dpr = Math.min(window.devicePixelRatio || 1, 2)
    let stars: Star[] = []
    let flies: Firefly[] = []
    let sparks: Spark[] = []
    let raf = 0
    let running = true
    let t = 0

    const mouse = { x: -9999, y: -9999, active: false }
    const ATTRACT_RADIUS = 190
    const MAX_SPARKS = 45
    let lastTrailX = -9999
    let lastTrailY = -9999
    const TRAIL_MIN_DIST = 22

    function makeField() {
      const starCount = Math.max(40, Math.min(220, Math.round((width * height) / starDensity)))
      stars = Array.from({ length: starCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.1 + 0.3,
        baseAlpha: Math.random() * 0.5 + 0.35,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.8 + 0.3,
      }))

      const flyCount = Math.max(8, Math.min(26, Math.round((width * height) / fireflyDensity)))
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

    function spawnTrailSpark(x: number, y: number) {
      const angle = Math.random() * Math.PI * 2
      const speed = 0.02 + Math.random() * 0.08 // slow, floaty drift
      sparks.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.035, // slight upward float, like a firefly
        r: Math.random() * 2.6 + 0.6, // varied sizes: small glints to fuller fireflies
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.7 + 0.5,
        life: 110 + Math.random() * 70, // ~1.8s – 3s at 60fps: linger, then fade
        maxLife: 180,
      })
      if (sparks.length > MAX_SPARKS) {
        sparks.splice(0, sparks.length - MAX_SPARKS)
      }
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

    function drawFirefly(f: Firefly, alphaMul: number) {
      const pulse = 0.4 + 0.6 * Math.max(0, Math.sin(t * f.speed + f.phase))
      const glowR = f.r * 7

      const grad = ctx!.createRadialGradient(f.x, f.y, 0, f.x, f.y, glowR)
      grad.addColorStop(0, `rgba(217,165,74,${0.55 * pulse * alphaMul})`)
      grad.addColorStop(1, 'rgba(217,165,74,0)')
      ctx!.beginPath()
      ctx!.fillStyle = grad
      ctx!.arc(f.x, f.y, glowR, 0, Math.PI * 2)
      ctx!.fill()

      ctx!.beginPath()
      ctx!.fillStyle = `rgba(255,224,168,${(0.75 * pulse + 0.15) * alphaMul})`
      ctx!.arc(f.x, f.y, f.r, 0, Math.PI * 2)
      ctx!.fill()
    }

    function draw() {
      ctx!.clearRect(0, 0, width, height)

      // twinkling stars
      for (const s of stars) {
        const alpha = s.baseAlpha * (0.55 + 0.45 * Math.sin(t * s.speed + s.phase))
        ctx!.beginPath()
        ctx!.fillStyle = `rgba(231,235,243,${Math.max(alpha, 0)})`
        ctx!.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx!.fill()
      }

      // drifting, pulsing fireflies — gently drawn toward the cursor when interactive
      for (const f of flies) {
        f.vx += (Math.random() - 0.5) * 0.012
        f.vy += (Math.random() - 0.5) * 0.012

        let maxSpeed = 0.35
        if (interactive && mouse.active) {
          const dx = mouse.x - f.x
          const dy = mouse.y - f.y
          const dist = Math.hypot(dx, dy)
          if (dist < ATTRACT_RADIUS && dist > 1) {
            const pull = (1 - dist / ATTRACT_RADIUS) * 0.03
            f.vx += (dx / dist) * pull
            f.vy += (dy / dist) * pull
            maxSpeed = 0.85
          }
        }

        f.vx = Math.max(-maxSpeed, Math.min(maxSpeed, f.vx))
        f.vy = Math.max(-maxSpeed, Math.min(maxSpeed, f.vy))
        f.x += f.vx
        f.y += f.vy

        if (f.x < -20) f.x = width + 20
        if (f.x > width + 20) f.x = -20
        if (f.y < -20) f.y = height + 20
        if (f.y > height + 20) f.y = -20

        drawFirefly(f, 1)
      }

      // click-spawned sparks — hold, float, then fade
      if (sparks.length) {
        sparks = sparks.filter((s) => s.life > 0)
        for (const s of sparks) {
          s.vx *= 0.985
          s.vy *= 0.985
          s.x += s.vx
          s.y += s.vy
          s.life -= 1

          const elapsed = 1 - s.life / s.maxLife // 0 at spawn → 1 at death
          const HOLD_UNTIL = 0.4 // stay fully visible for the first 40% of its life
          let alphaMul: number
          if (elapsed < HOLD_UNTIL) {
            alphaMul = Math.min(1, elapsed / 0.08) // quick fade-in, then hold
          } else {
            alphaMul = Math.max(0, 1 - (elapsed - HOLD_UNTIL) / (1 - HOLD_UNTIL))
          }

          drawFirefly(s, alphaMul)
        }
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

    // Interactive listeners live on window (the decorative canvas wrap is
    // pointer-events-none so real hero content stays clickable). Position
    // is translated into wrap-local coordinates and only "activates" while
    // the cursor is actually over the hero area.
    function onPointerMove(e: PointerEvent) {
      const rect = wrap!.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const inside = x >= 0 && x <= rect.width && y >= 0 && y <= rect.height
      mouse.x = x
      mouse.y = y
      mouse.active = inside

      if (inside) {
        const dx = x - lastTrailX
        const dy = y - lastTrailY
        if (Math.hypot(dx, dy) > TRAIL_MIN_DIST) {
          spawnTrailSpark(x, y)
          lastTrailX = x
          lastTrailY = y
        }
      }
    }

    function onPointerLeaveWindow() {
      mouse.active = false
    }

    if (interactive) {
      window.addEventListener('pointermove', onPointerMove, { passive: true })
      window.addEventListener('pointerout', onPointerLeaveWindow, { passive: true })
    }

    return () => {
      running = false
      cancelAnimationFrame(raf)
      ro.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      if (interactive) {
        window.removeEventListener('pointermove', onPointerMove)
        window.removeEventListener('pointerout', onPointerLeaveWindow)
      }
    }
  }, [variant])

  return (
    <div ref={wrapRef} className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {/* night-sky wash */}
      <div
        className="absolute inset-0"
        style={{
          background:
            variant === 'hero'
              ? 'radial-gradient(70% 60% at 50% 0%, rgba(23,31,48,0.9), rgba(11,15,26,1) 70%)'
              : 'radial-gradient(60% 70% at 50% 100%, rgba(23,31,48,0.7), rgba(11,15,26,1) 75%)',
        }}
      />
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  )
}
