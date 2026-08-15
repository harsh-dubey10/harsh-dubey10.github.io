import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

interface DragonIntroProps {
  onDone: () => void
  onVideoStart?: () => void
}

const PURPLE_FLAME_COLORS = ['#4e03ff', '#7b2fff', '#a855f7', '#6d28d9', '#c084fc']

interface FlameParticle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  size: number
  color: string
}

export default function DragonIntro({ onDone, onVideoStart }: DragonIntroProps) {
  const [phase, setPhase] = useState<'splash' | 'video'>('splash')
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const particlesRef = useRef<FlameParticle[]>([])
  const mousePosRef = useRef<{ x: number; y: number } | null>(null)
  const rafRef = useRef<number>(0)
  const isDoneRef = useRef(false)

  const handleFinish = useCallback(() => {
    if (isDoneRef.current) return
    isDoneRef.current = true
    onDone()
  }, [onDone])

  // Hide default cursor and prevent scroll during intro
  useEffect(() => {
    const originalCursor = document.body.style.cursor
    const originalOverflow = document.body.style.overflow
    document.body.style.cursor = 'none'
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.cursor = originalCursor
      document.body.style.overflow = originalOverflow
    }
  }, [])

  // Preload video
  useEffect(() => {
    const video = videoRef.current
    if (video) {
      video.load()
    }
  }, [])

  // Purple flame canvas particle system
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const spawnFlames = (clientX: number, clientY: number, count = 8, upwardForce = 3) => {
      for (let i = 0; i < count; i++) {
        const color = PURPLE_FLAME_COLORS[Math.floor(Math.random() * PURPLE_FLAME_COLORS.length)]
        particlesRef.current.push({
          x: clientX + (Math.random() - 0.5) * 16,
          y: clientY + (Math.random() - 0.5) * 16,
          vx: (Math.random() - 0.5) * 1.6,
          vy: -(Math.random() * upwardForce + 1.2),
          life: 1,
          size: Math.random() * 8 + 3,
          color,
        })
      }
    }

    const onMouseMove = (e: MouseEvent) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY }
      spawnFlames(e.clientX, e.clientY, 7, 3)
    }

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0]
        mousePosRef.current = { x: touch.clientX, y: touch.clientY }
        spawnFlames(touch.clientX, touch.clientY, 8, 3.2)
      }
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })

    let tick = 0
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      tick++

      // Filter dying particles
      particlesRef.current = particlesRef.current.filter((p) => p.life > 0.02)

      // Draw all purple flame particles
      for (const p of particlesRef.current) {
        p.x += p.vx
        p.y += p.vy
        p.vy *= 0.97
        p.vx *= 0.99
        p.life -= 0.022

        const currentSize = Math.max(0.1, p.size * p.life)
        ctx.save()
        ctx.globalAlpha = Math.max(0, p.life)
        ctx.shadowBlur = 20
        ctx.shadowColor = p.color
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, currentSize, 0, 2 * Math.PI)
        ctx.fill()
        ctx.restore()
      }

      rafRef.current = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('touchmove', onTouchMove)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  // Handle click anywhere
  const handleClick = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (phase !== 'splash') return

      // Spawn burst of purple flame particles at click location
      const clientX = 'clientX' in e ? e.clientX : e.touches[0]?.clientX || window.innerWidth / 2
      const clientY = 'clientY' in e ? e.clientY : e.touches[0]?.clientY || window.innerHeight / 2

      for (let i = 0; i < 45; i++) {
        const angle = Math.random() * Math.PI * 2
        const speed = Math.random() * 7 + 2
        const color = PURPLE_FLAME_COLORS[Math.floor(Math.random() * PURPLE_FLAME_COLORS.length)]
        particlesRef.current.push({
          x: clientX,
          y: clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 2.5,
          life: 1.2,
          size: Math.random() * 10 + 4,
          color,
        })
      }

      setPhase('video')
      const video = videoRef.current
      if (!video) {
        handleFinish()
        return
      }

      const safetyTimer = setTimeout(() => {
        handleFinish()
      }, 12000)

      video
        .play()
        .then(() => {
          onVideoStart?.()
        })
        .catch(() => {
          clearTimeout(safetyTimer)
          handleFinish()
        })

      video.onended = () => {
        clearTimeout(safetyTimer)
        handleFinish()
      }
    },
    [phase, handleFinish, onVideoStart],
  )

  // Keyboard shortcut to skip intro
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        handleFinish()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [handleFinish])

  return (
    <motion.div
      className="fixed inset-0 z-[200] select-none overflow-hidden bg-[#080E1C] cursor-none"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      onClick={handleClick}
      onTouchStart={handleClick}
      style={{ cursor: 'none' }}
    >
      {/* Background layer */}
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: phase === 'video' ? 0.2 : 1 }}
        transition={{ duration: 0.4 }}
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(32, 16, 68, 0.95) 0%, rgba(13, 15, 28, 0.98) 60%, #080E1C 100%)',
        }}
      />

      {/* Dragon Aura Radial Glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(123, 47, 255, 0.16) 0%, transparent 65%)',
        }}
      />

      {/* Splash UI: Just 'Click anywhere to enter' without any title */}
      <AnimatePresence>
        {phase === 'splash' && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center cursor-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.4 }}
            style={{ cursor: 'none' }}
          >
            <motion.div
              className="flex flex-col items-center gap-3"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
            >
              <motion.p
                animate={{ opacity: [0.35, 0.9, 0.35] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                className="font-mono text-xs sm:text-sm font-medium tracking-[0.22em] text-white/75 uppercase"
                style={{
                  textShadow: '0 0 14px rgba(123, 47, 255, 0.7), 0 0 28px rgba(78, 3, 255, 0.45)',
                }}
              >
                Click anywhere to enter
              </motion.p>
              <motion.div
                animate={{ scaleX: [0.3, 1, 0.3], opacity: [0.25, 0.7, 0.25] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                className="h-[1.5px] w-14 sm:w-20 bg-gradient-to-r from-transparent via-[#7b2fff] to-transparent shadow-[0_0_10px_#7b2fff]"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dragon Video Transition Layer */}
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: phase === 'video' ? 1 : 0 }}
        transition={{ duration: 0.15 }}
        style={{ pointerEvents: 'none', mixBlendMode: 'screen' }}
      >
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          src="/assets/videos/dragon-transition.mp4"
          muted
          playsInline
          preload="auto"
        />
      </motion.div>

      {/* Canvas for Purple Flame Particles */}
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-10" />
    </motion.div>
  )
}
