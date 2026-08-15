import { useState } from 'react'
import { motion } from 'framer-motion'
import DynamicBackground from './DynamicBackground'
import { profile } from '../data/content'
import { useTypewriter } from '../hooks/useTypewriter'

const eyeSpots = [
  { id: 1, left: '4%', bottom: '38%', color: '#FF4422', size: 'w-[7px] h-[5px]', delay: '0s' },
  { id: 2, left: '10%', bottom: '52%', color: '#FFB800', size: 'w-[8px] h-[6px]', delay: '1.2s' },
  { id: 3, left: '18%', bottom: '42%', color: '#FF6B18', size: 'w-[7px] h-[5px]', delay: '2.4s' },
  { id: 4, left: '25%', bottom: '55%', color: '#FF4422', size: 'w-[7px] h-[5px]', delay: '0.8s' },
  { id: 5, left: '32%', bottom: '40%', color: '#FFB800', size: 'w-[8px] h-[6px]', delay: '1.8s' },
  { id: 6, left: '68%', bottom: '44%', color: '#FFB800', size: 'w-[8px] h-[6px]', delay: '1.4s' },
  { id: 7, left: '76%', bottom: '52%', color: '#FF6B18', size: 'w-[7px] h-[5px]', delay: '2.8s' },
  { id: 8, left: '84%', bottom: '42%', color: '#FF4422', size: 'w-[8px] h-[6px]', delay: '0.5s' },
  { id: 9, left: '91%', bottom: '50%', color: '#FFB800', size: 'w-[7px] h-[5px]', delay: '2.1s' },
]

interface HeroProps {
  onReplayIntro?: () => void
}

export default function Hero({ onReplayIntro }: HeroProps) {
  const typed = useTypewriter(profile.roles)
  const [hoveredMountain, setHoveredMountain] = useState(false)

  return (
    <section
      id="top"
      className="relative left-1/2 right-1/2 -mx-[50vw] flex h-screen w-screen flex-col items-center justify-center overflow-hidden bg-[#080E1C]"
    >
      {/* 1. Deep night background gradient wash */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#080E1C] via-[#0B1420] to-[#0D2416] -z-0" />

      {/* 2. Dynamic starfield background canvas */}
      <DynamicBackground variant="hero" tint="gold" />

      {/* 3. Hero Title & Dynamic Typewriter Tagline Block */}
      <div className="relative z-10 text-center px-6 -mt-[14vh] max-w-5xl mx-auto select-none">
        <motion.button
          onClick={onReplayIntro}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-white/35 hover:text-brass transition-colors text-xs sm:text-sm tracking-[0.3em] uppercase mb-6 inline-flex items-center cursor-pointer group"
          title="Replay Dragon Intro"
        >
          <span>a new quest begins</span>
        </motion.button>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-display font-extrabold text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-brass leading-[0.88] mb-4 drop-shadow-[0_0_30px_rgba(255,130,54,0.25)]"
        >
          Harsh Vardhan<br />
          <span className="text-white">Dubey</span>
        </motion.h1>

        {/* Preserved dynamic typewriter tagline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mt-4 h-7 font-mono text-sm sm:text-base text-brass/90"
        >
          <span>{typed}</span>
          <span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] animate-blink bg-brass align-middle" />
        </motion.div>
      </div>

      {/* 4. "VENTURE FORTH" Orientation Link placed ABOVE campfire flame */}
      <div className="absolute bottom-[24%] sm:bottom-[26%] z-20">
        <a href="#profile" className="flex flex-col items-center gap-1.5 cursor-pointer group">
          <div className="flex flex-col items-center gap-1.5">
            <span className="text-[10px] sm:text-[11px] tracking-[0.25em] uppercase text-white/50 font-mono font-medium group-hover:text-brass transition-colors">
              venture forth
            </span>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="animate-bounce">
              <path
                d="M9 3 L9 13 M4 9 L9 14 L14 9"
                stroke="#FF8236"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </a>
      </div>

      {/* 5. Campfire Ambient Radial Glow */}
      <div
        className="absolute z-[6] pointer-events-none"
        style={{
          left: '50%',
          bottom: '-3%',
          transform: 'translateX(-50%)',
          width: '650px',
          height: '420px',
          background:
            'radial-gradient(ellipse at 50% 75%, rgba(255,130,54,0.22) 0%, rgba(255,184,0,0.08) 40%, transparent 70%)',
        }}
      />

      {/* 6. Multi-Layered Green Slopes & Mountain Landscape Container */}
      <div
        onMouseEnter={() => setHoveredMountain(true)}
        onMouseLeave={() => setHoveredMountain(false)}
        className="jungle-landscape-container group absolute bottom-0 left-0 w-full select-none z-10 cursor-pointer"
      >
        {/* Base Green Ground Bar */}
        <div className="absolute bottom-0 left-0 w-full h-[18%] bg-[#0D2E14]" />

        {/* Fireflies floating over green mountains */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div className="firefly firefly-d0 absolute w-1.5 h-1.5 rounded-full bg-gold/80 shadow-[0_0_6px_#FFB800]" style={{ left: '18%', bottom: '45%' }} />
          <div className="firefly firefly-d1 absolute w-1 h-1 rounded-full bg-gold/60 shadow-[0_0_4px_#FFB800]" style={{ left: '35%', bottom: '55%' }} />
          <div className="firefly firefly-d2 absolute w-1.5 h-1.5 rounded-full bg-gold/70 shadow-[0_0_6px_#FFB800]" style={{ left: '55%', bottom: '40%' }} />
          <div className="firefly firefly-d3 absolute w-1 h-1 rounded-full bg-gold/50 shadow-[0_0_4px_#FFB800]" style={{ left: '72%', bottom: '50%' }} />
          <div className="firefly firefly-d4 absolute w-1.5 h-1.5 rounded-full bg-gold/60 shadow-[0_0_5px_#FFB800]" style={{ left: '85%', bottom: '42%' }} />
          <div className="firefly firefly-d5 absolute w-1 h-1 rounded-full bg-gold/70 shadow-[0_0_4px_#FFB800]" style={{ left: '8%', bottom: '38%' }} />
          <div className="firefly firefly-d6 absolute w-1 h-1 rounded-full bg-gold/50 shadow-[0_0_4px_#FFB800]" style={{ left: '45%', bottom: '60%' }} />
        </div>

        {/* Mountain Layer 1 (#15221A & #112018) */}
        <svg viewBox="0 0 1440 500" className="absolute bottom-0 w-full h-full pointer-events-none" preserveAspectRatio="xMidYMax slice">
          <path d="M0,320 C60,280 100,220 180,240 C260,260 300,180 400,200 C500,220 540,160 640,180 C740,200 780,140 880,170 C980,200 1020,150 1100,175 C1180,200 1220,160 1300,190 C1380,220 1420,180 1440,200 L1440,500 L0,500Z" fill="#15221A" />
          <path d="M0,360 C80,330 140,270 240,290 C340,310 380,240 500,260 C620,280 660,220 780,240 C900,260 940,210 1060,235 C1180,260 1220,210 1340,240 C1400,255 1440,230 1440,240 L1440,500 L0,500Z" fill="#112018" opacity="0.8" />
        </svg>

        {/* Green Mountain Layer 2 (#0E1A0E) */}
        <svg viewBox="0 0 1440 500" className="absolute bottom-0 w-full h-[90%] pointer-events-none" preserveAspectRatio="xMidYMax slice">
          <path d="M0,400 L0,300 C50,280 100,250 160,265 C220,280 260,240 330,235 C400,230 440,260 510,248 C580,236 620,210 700,220 C780,230 820,200 900,195 C980,190 1020,220 1100,210 C1180,200 1220,180 1300,195 C1380,210 1420,195 1440,200 L1440,500 L0,500Z" fill="#0E1A0E" />
        </svg>

        {/* Green Forest Trees Layer 3 (#051403) */}
        <svg viewBox="0 0 1440 500" className="absolute bottom-0 w-full h-[72%] pointer-events-none" preserveAspectRatio="xMidYMax slice">
          <ellipse cx="80" cy="365" rx="90" ry="55" fill="#051403" />
          <ellipse cx="200" cy="370" rx="80" ry="50" fill="#051403" />
          <ellipse cx="350" cy="362" rx="85" ry="52" fill="#051403" />
          <ellipse cx="500" cy="368" rx="78" ry="48" fill="#051403" />
          <ellipse cx="650" cy="365" rx="82" ry="50" fill="#051403" />
          <ellipse cx="800" cy="370" rx="88" ry="52" fill="#051403" />
          <ellipse cx="950" cy="363" rx="80" ry="48" fill="#051403" />
          <ellipse cx="1100" cy="368" rx="85" ry="50" fill="#051403" />
          <ellipse cx="1250" cy="365" rx="82" ry="52" fill="#051403" />
          <ellipse cx="1400" cy="370" rx="90" ry="55" fill="#051403" />
          <rect x="0" y="420" width="1440" height="80" fill="#051403" />
        </svg>

        {/* Green Mountain Ridge Layer 4 (#081E0C) */}
        <svg viewBox="0 0 1440 400" className="absolute bottom-0 w-full h-[78%] pointer-events-none" preserveAspectRatio="none">
          <path d="M0,400 L0,310 C30,295 70,270 120,280 C170,290 200,255 260,248 C320,241 350,265 410,253 C470,241 510,260 570,248 C630,236 670,215 740,225 C810,235 840,208 910,200 C980,192 1010,220 1080,210 C1150,200 1190,180 1260,192 C1330,204 1380,188 1440,198 L1440,400Z" fill="#081E0C" />
        </svg>

        {/* Foreground Green Slopes & Bushes Layer 5 (#123E1B & #0D2E14) */}
        <svg viewBox="0 0 1440 500" className="absolute bottom-0 w-full h-[65%] pointer-events-none" preserveAspectRatio="xMidYMax slice">
          <rect x="0" y="440" width="1440" height="60" fill="#0D2E14" />
          <ellipse cx="-20" cy="420" rx="65" ry="28" fill="#123E1B" />
          <ellipse cx="50" cy="418" rx="58" ry="26" fill="#123E1B" />
          <ellipse cx="110" cy="422" rx="62" ry="27" fill="#123E1B" />
          <ellipse cx="170" cy="416" rx="55" ry="25" fill="#123E1B" />
          <ellipse cx="225" cy="420" rx="60" ry="28" fill="#123E1B" />
          <ellipse cx="285" cy="418" rx="56" ry="26" fill="#123E1B" />
          <ellipse cx="340" cy="422" rx="62" ry="27" fill="#123E1B" />
          <ellipse cx="400" cy="417" rx="58" ry="25" fill="#123E1B" />
          <ellipse cx="455" cy="421" rx="55" ry="26" fill="#123E1B" />
          <ellipse cx="515" cy="419" rx="60" ry="28" fill="#123E1B" />
          <ellipse cx="575" cy="422" rx="56" ry="25" fill="#123E1B" />
          <ellipse cx="630" cy="417" rx="58" ry="27" fill="#123E1B" />
          <ellipse cx="810" cy="418" rx="60" ry="26" fill="#123E1B" />
          <ellipse cx="870" cy="421" rx="55" ry="28" fill="#123E1B" />
          <ellipse cx="930" cy="417" rx="62" ry="25" fill="#123E1B" />
          <ellipse cx="990" cy="420" rx="58" ry="27" fill="#123E1B" />
          <ellipse cx="1050" cy="418" rx="56" ry="26" fill="#123E1B" />
          <ellipse cx="1110" cy="422" rx="60" ry="28" fill="#123E1B" />
          <ellipse cx="1170" cy="416" rx="55" ry="25" fill="#123E1B" />
          <ellipse cx="1230" cy="420" rx="62" ry="27" fill="#123E1B" />
          <ellipse cx="1290" cy="418" rx="58" ry="26" fill="#123E1B" />
          <ellipse cx="1350" cy="421" rx="56" ry="28" fill="#123E1B" />
          <ellipse cx="1410" cy="417" rx="60" ry="25" fill="#123E1B" />
          <ellipse cx="1460" cy="420" rx="65" ry="27" fill="#123E1B" />
        </svg>

        {/* Dynamic Glowing Forest Eyes across Green Bushes */}
        <div className="absolute bottom-0 left-0 w-full h-[60%] z-[15] pointer-events-auto">
          {eyeSpots.map((spot) => (
            <div
              key={spot.id}
              className={`absolute flex items-center gap-[6px] transition-all duration-300 creature-eyes ${
                hoveredMountain ? '!opacity-100 scale-125' : ''
              }`}
              style={{ left: spot.left, bottom: spot.bottom, animationDelay: spot.delay }}
            >
              <div
                className={`${spot.size} rounded-full`}
                style={{
                  backgroundColor: spot.color,
                  boxShadow: `0 0 8px ${spot.color}, 0 0 14px ${spot.color}`,
                }}
              />
              <div
                className={`${spot.size} rounded-full`}
                style={{
                  backgroundColor: spot.color,
                  boxShadow: `0 0 8px ${spot.color}, 0 0 14px ${spot.color}`,
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* 7. Dynamic Campfire Element */}
      <div className="absolute bottom-[5%] sm:bottom-[7%] left-1/2 -translate-x-1/2 z-15 pointer-events-none flex flex-col items-center">
        <div className="relative w-36 sm:w-44 h-28 sm:h-36 overflow-visible">
          {/* Floating Rising Ember Sparks */}
          <div className="ember ember-d0 absolute rounded-full w-1.5 h-1.5 bg-[#FF6B35] shadow-[0_0_6px_#FF6B35]" style={{ left: '46%', bottom: '40%' }} />
          <div className="ember ember-d1 absolute rounded-full w-2 h-2 bg-[#FF8236] shadow-[0_0_8px_#FF8236]" style={{ left: '52%', bottom: '38%' }} />
          <div className="ember ember-d2 absolute rounded-full w-1.5 h-1.5 bg-[#FFB800] shadow-[0_0_6px_#FFB800]" style={{ left: '44%', bottom: '42%' }} />
          <div className="ember ember-d3 absolute rounded-full w-2.5 h-2.5 bg-[#FF4422] shadow-[0_0_10px_#FF4422]" style={{ left: '54%', bottom: '35%' }} />
          <div className="ember ember-d4 absolute rounded-full w-1.5 h-1.5 bg-[#FFB800] shadow-[0_0_6px_#FFB800]" style={{ left: '48%', bottom: '44%' }} />
          <div className="ember ember-d5 absolute rounded-full w-2 h-2 bg-[#FF6B35] shadow-[0_0_8px_#FF6B35]" style={{ left: '50%', bottom: '39%' }} />

          {/* Campfire SVG */}
          <svg viewBox="0 0 160 160" className="w-full h-full drop-shadow-[0_0_20px_rgba(255,130,54,0.6)]">
            {/* Campfire glow base */}
            <ellipse cx="80" cy="130" rx="60" ry="14" fill="#FF8236" opacity="0.25" className="campfire-glow" />
            <ellipse cx="80" cy="130" rx="35" ry="8" fill="#FFB800" opacity="0.35" />

            {/* Firewood logs */}
            <line x1="45" y1="132" x2="115" y2="124" stroke="#5C3D1E" strokeWidth="8" strokeLinecap="round" />
            <line x1="42" y1="123" x2="118" y2="132" stroke="#5C3D1E" strokeWidth="8" strokeLinecap="round" />
            <line x1="55" y1="135" x2="105" y2="135" stroke="#4A3018" strokeWidth="7" strokeLinecap="round" />
            <circle cx="45" cy="132" r="4" fill="#4A3018" />
            <circle cx="115" cy="124" r="4" fill="#4A3018" />
            <circle cx="42" cy="123" r="3.5" fill="#4A3018" />
            <circle cx="118" cy="132" r="3.5" fill="#4A3018" />

            {/* Dynamic flames */}
            <ellipse className="campfire-glow" cx="80" cy="115" rx="18" ry="6" fill="#FF8236" opacity="0.3" />
            <path
              className="campfire-flame-1"
              d="M80,45 C92,68 112,98 107,120 C102,129 90,135 80,135 C70,135 58,129 53,120 C48,98 68,68 80,45Z"
              fill="#FF8236"
            />
            <path
              className="campfire-flame-2"
              d="M80,60 C90,78 104,102 100,118 C97,126 88,131 80,131 C72,131 63,126 60,118 C56,102 70,78 80,60Z"
              fill="#FFB800"
            />
            <path
              className="campfire-flame-3"
              d="M80,75 C88,88 96,108 94,118 C92,124 86,128 80,128 C74,128 68,124 66,118 C64,108 72,88 80,75Z"
              fill="#FFD966"
            />
            <path
              className="campfire-flame-4"
              d="M80,90 C84,98 90,112 88,118 C87,122 84,125 80,125 C76,125 73,122 72,118 C70,112 76,98 80,90Z"
              fill="#FFF0D0"
            />

            {/* Charcoal on ground */}
            <ellipse cx="58" cy="133" rx="5" ry="3" fill="#2D2D2D" opacity="0.6" />
            <ellipse cx="102" cy="131" rx="4" ry="2.5" fill="#2D2D2D" opacity="0.5" />
            <ellipse cx="68" cy="136" rx="3.5" ry="2" fill="#2D2D2D" opacity="0.4" />
            <ellipse cx="92" cy="135" rx="4" ry="2" fill="#2D2D2D" opacity="0.4" />
          </svg>
        </div>
      </div>
    </section>
  )
}
