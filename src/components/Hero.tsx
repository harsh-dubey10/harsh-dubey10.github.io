import { useState } from 'react'
import { motion } from 'framer-motion'
import DynamicBackground from './DynamicBackground'
import { profile } from '../data/content'
import { useTypewriter } from '../hooks/useTypewriter'

const eyeSpots = [
  { id: 1, left: '2%', bottom: '38%', gap: '5px', size: 'w-[5px] h-[4px]', color: '#FF4422', shadow: '0 0 5px #FF4422' },
  { id: 2, left: '6%', bottom: '52%', gap: '8px', size: 'w-[7px] h-[5px]', color: '#FFB800', shadow: '0 0 8px #FFB800' },
  { id: 3, left: '11%', bottom: '42%', gap: '5px', size: 'w-[5px] h-[4px]', color: '#FF6B18', shadow: '0 0 5px #FF6B18' },
  { id: 4, left: '16%', bottom: '55%', gap: '5px', size: 'w-[5px] h-[4px]', color: '#FF4422', shadow: '0 0 5px #FF4422' },
  { id: 5, left: '21%', bottom: '40%', gap: '8px', size: 'w-[7px] h-[5px]', color: '#FFB800', shadow: '0 0 8px #FFB800' },
  { id: 6, left: '26%', bottom: '50%', gap: '5px', size: 'w-[5px] h-[4px]', color: '#FF6B18', shadow: '0 0 5px #FF6B18' },
  { id: 7, left: '31%', bottom: '44%', gap: '8px', size: 'w-[7px] h-[5px]', color: '#FF4422', shadow: '0 0 8px #FF4422' },
  { id: 8, left: '36%', bottom: '55%', gap: '5px', size: 'w-[5px] h-[4px]', color: '#FFB800', shadow: '0 0 5px #FFB800' },
  { id: 9, left: '41%', bottom: '42%', gap: '5px', size: 'w-[5px] h-[4px]', color: '#FF6B18', shadow: '0 0 5px #FF6B18' },
  { id: 10, left: '55%', bottom: '48%', gap: '5px', size: 'w-[5px] h-[4px]', color: '#FF4422', shadow: '0 0 5px #FF4422' },
  { id: 11, left: '60%', bottom: '40%', gap: '8px', size: 'w-[7px] h-[5px]', color: '#FFB800', shadow: '0 0 8px #FFB800' },
  { id: 12, left: '65%', bottom: '54%', gap: '5px', size: 'w-[5px] h-[4px]', color: '#FF6B18', shadow: '0 0 5px #FF6B18' },
  { id: 13, left: '70%', bottom: '42%', gap: '5px', size: 'w-[5px] h-[4px]', color: '#FF4422', shadow: '0 0 5px #FF4422' },
  { id: 14, left: '75%', bottom: '52%', gap: '8px', size: 'w-[7px] h-[5px]', color: '#FFB800', shadow: '0 0 8px #FFB800' },
  { id: 15, left: '80%', bottom: '40%', gap: '5px', size: 'w-[5px] h-[4px]', color: '#FF6B18', shadow: '0 0 5px #FF6B18' },
  { id: 16, left: '85%', bottom: '50%', gap: '8px', size: 'w-[7px] h-[5px]', color: '#FF4422', shadow: '0 0 8px #FF4422' },
  { id: 17, left: '90%', bottom: '42%', gap: '5px', size: 'w-[5px] h-[4px]', color: '#FFB800', shadow: '0 0 5px #FFB800' },
  { id: 18, left: '95%', bottom: '52%', gap: '5px', size: 'w-[5px] h-[4px]', color: '#FF6B18', shadow: '0 0 5px #FF6B18' },
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
      <div className="absolute inset-0 -z-0 bg-gradient-to-b from-[#080E1C] via-[#0B1420] to-[#0E1A16]" />

      {/* 2. Dynamic starfield background canvas */}
      <DynamicBackground variant="hero" tint="gold" />

      {/* 3. Hero Title & Dynamic Typewriter Tagline Block */}
      <div className="relative z-10 -mt-[14vh] mx-auto max-w-5xl select-none px-6 text-center">
        <motion.button
          onClick={onReplayIntro}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="group mb-6 inline-flex cursor-pointer items-center text-xs font-medium uppercase tracking-[0.3em] text-white/35 transition-colors hover:text-brass sm:text-sm"
          title="Replay Dragon Intro"
        >
          <span>a new quest begins</span>
        </motion.button>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-display text-5xl font-extrabold leading-[0.88] text-brass drop-shadow-[0_0_40px_rgba(255,130,54,0.3)] sm:text-7xl md:text-8xl lg:text-9xl mb-4"
        >
          Harsh Vardhan<br />
          <span className="text-white">Dubey</span>
        </motion.h1>

        {/* Dynamic typewriter tagline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mt-4 h-7 font-mono text-sm text-brass/90 sm:text-base"
        >
          <span>{typed}</span>
          <span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] animate-blink bg-brass align-middle" />
        </motion.div>
      </div>

      {/* 4. "VENTURE FORTH" Orientation Link placed above campfire */}
      <div className="absolute bottom-[20%] z-20">
        <a href="#profile" className="group flex cursor-pointer flex-col items-center gap-2">
          <div className="flex flex-col items-center gap-2">
            <span className="font-mono text-[10px] font-medium uppercase tracking-[0.25em] text-white/40 transition-colors group-hover:text-brass sm:text-[11px]">
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
        className="pointer-events-none absolute z-[6]"
        style={{
          left: '50%',
          bottom: '-5%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '450px',
          background:
            'radial-gradient(ellipse at 50% 70%, rgba(255,130,54,0.18) 0%, rgba(255,184,0,0.07) 38%, transparent 68%)',
        }}
      />

      {/* 6. Multi-Layered Jungle Landscape Silhouette + Depth Container */}
      <div
        onMouseEnter={() => setHoveredMountain(true)}
        onMouseLeave={() => setHoveredMountain(false)}
        className="jungle-landscape-container pointer-events-none absolute bottom-0 left-0 w-full select-none z-10"
      >
        {/* Base Ground Fill */}
        <div className="absolute bottom-0 left-0 h-[18%] w-full bg-[#1A1710]" />

        {/* Floating Fireflies */}
        <div className="pointer-events-none absolute inset-0 z-10">
          <div className="firefly firefly-d0 absolute h-1.5 w-1.5 rounded-full bg-gold/80 shadow-[0_0_6px_#FFB800]" style={{ left: '18%', bottom: '45%' }} />
          <div className="firefly firefly-d1 absolute h-1 w-1 rounded-full bg-gold/60 shadow-[0_0_4px_#FFB800]" style={{ left: '35%', bottom: '55%' }} />
          <div className="firefly firefly-d2 absolute h-1.5 w-1.5 rounded-full bg-gold/70 shadow-[0_0_6px_#FFB800]" style={{ left: '55%', bottom: '40%' }} />
          <div className="firefly firefly-d3 absolute h-1 w-1 rounded-full bg-gold/50 shadow-[0_0_4px_#FFB800]" style={{ left: '72%', bottom: '50%' }} />
          <div className="firefly firefly-d4 absolute h-1.5 w-1.5 rounded-full bg-gold/60 shadow-[0_0_5px_#FFB800]" style={{ left: '85%', bottom: '42%' }} />
          <div className="firefly firefly-d5 absolute h-1 w-1 rounded-full bg-gold/70 shadow-[0_0_4px_#FFB800]" style={{ left: '8%', bottom: '38%' }} />
          <div className="firefly firefly-d6 absolute h-1 w-1 rounded-full bg-gold/50 shadow-[0_0_4px_#FFB800]" style={{ left: '45%', bottom: '60%' }} />
        </div>

        {/* Silhouette Layer 1: Distant Misty Mountains (#15221A & #112018) */}
        <svg viewBox="0 0 1440 500" className="absolute bottom-0 h-full w-full" preserveAspectRatio="xMidYMax slice">
          <path d="M0,320 C60,280 100,220 180,240 C260,260 300,180 400,200 C500,220 540,160 640,180 C740,200 780,140 880,170 C980,200 1020,150 1100,175 C1180,200 1220,160 1300,190 C1380,220 1420,180 1440,200 L1440,500 L0,500Z" fill="#15221A" />
          <path d="M0,360 C80,330 140,270 240,290 C340,310 380,240 500,260 C620,280 660,220 780,240 C900,260 940,210 1060,235 C1180,260 1220,210 1340,240 C1400,255 1440,230 1440,240 L1440,500 L0,500Z" fill="#112018" opacity="0.8" />
        </svg>

        {/* Silhouette Layer 2: Mid-range Green Ridge (#0E1A0E) */}
        <svg viewBox="0 0 1440 500" className="absolute bottom-0 h-[90%] w-full" preserveAspectRatio="xMidYMax slice">
          <path d="M0,400 L0,300 C50,280 100,250 160,265 C220,280 260,240 330,235 C400,230 440,260 510,248 C580,236 620,210 700,220 C780,230 820,200 900,195 C980,190 1020,220 1100,210 C1180,200 1220,180 1300,195 C1380,210 1420,195 1440,200 L1440,500 L0,500Z" fill="#0E1A0E" />
        </svg>

        {/* Silhouette Layer 3: Dark Pine & Canopy Forest (#051403) */}
        <svg viewBox="0 0 1440 500" className="absolute bottom-0 h-[72%] w-full" preserveAspectRatio="xMidYMax slice">
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

        {/* Silhouette Layer 4: Mountain Ridge Slope (#051403) */}
        <svg viewBox="0 0 1440 400" className="absolute bottom-0 h-[78%] w-full" preserveAspectRatio="none">
          <path d="M0,400 L0,310 C30,295 70,270 120,280 C170,290 200,255 260,248 C320,241 350,265 410,253 C470,241 510,260 570,248 C630,236 670,215 740,225 C810,235 840,208 910,200 C980,192 1010,220 1080,210 C1150,200 1190,180 1260,192 C1330,204 1380,188 1440,198 L1440,400Z" fill="#051403" />
        </svg>

        {/* Silhouette Layer 5: Foreground Rolling Bushes (#091408), Integrated Campfire, Charcoal & Grass Tufts */}
        <svg viewBox="0 0 1440 500" className="absolute bottom-0 h-[65%] w-full" preserveAspectRatio="xMidYMax slice">
          <rect x="0" y="440" width="1440" height="60" fill="#1A1710" />
          <ellipse cx="-20" cy="420" rx="65" ry="28" fill="#091408" />
          <ellipse cx="50" cy="418" rx="58" ry="26" fill="#091408" />
          <ellipse cx="110" cy="422" rx="62" ry="27" fill="#091408" />
          <ellipse cx="170" cy="416" rx="55" ry="25" fill="#091408" />
          <ellipse cx="225" cy="420" rx="60" ry="28" fill="#091408" />
          <ellipse cx="285" cy="418" rx="56" ry="26" fill="#091408" />
          <ellipse cx="340" cy="422" rx="62" ry="27" fill="#091408" />
          <ellipse cx="400" cy="417" rx="58" ry="25" fill="#091408" />
          <ellipse cx="455" cy="421" rx="55" ry="26" fill="#091408" />
          <ellipse cx="515" cy="419" rx="60" ry="28" fill="#091408" />
          <ellipse cx="575" cy="422" rx="56" ry="25" fill="#091408" />
          <ellipse cx="630" cy="417" rx="58" ry="27" fill="#091408" />
          <ellipse cx="810" cy="418" rx="60" ry="26" fill="#091408" />
          <ellipse cx="870" cy="421" rx="55" ry="28" fill="#091408" />
          <ellipse cx="930" cy="417" rx="62" ry="25" fill="#091408" />
          <ellipse cx="990" cy="420" rx="58" ry="27" fill="#091408" />
          <ellipse cx="1050" cy="418" rx="56" ry="26" fill="#091408" />
          <ellipse cx="1110" cy="422" rx="60" ry="28" fill="#091408" />
          <ellipse cx="1170" cy="416" rx="55" ry="25" fill="#091408" />
          <ellipse cx="1230" cy="420" rx="62" ry="27" fill="#091408" />
          <ellipse cx="1290" cy="418" rx="58" ry="26" fill="#091408" />
          <ellipse cx="1350" cy="421" rx="56" ry="28" fill="#091408" />
          <ellipse cx="1410" cy="417" rx="60" ry="25" fill="#091408" />
          <ellipse cx="1460" cy="420" rx="65" ry="27" fill="#091408" />

          {/* Campfire Glow Ellipses */}
          <ellipse cx="720" cy="442" rx="120" ry="18" fill="#FF8236" opacity="0.08" />
          <ellipse cx="720" cy="442" rx="70" ry="10" fill="#FF8236" opacity="0.14" />

          {/* Campfire Logs */}
          <line x1="672" y1="440" x2="768" y2="432" stroke="#5C3D1E" strokeWidth="9" strokeLinecap="round" />
          <line x1="668" y1="431" x2="772" y2="440" stroke="#5C3D1E" strokeWidth="9" strokeLinecap="round" />
          <line x1="690" y1="444" x2="750" y2="444" stroke="#4A3018" strokeWidth="8" strokeLinecap="round" />
          <circle cx="672" cy="440" r="5" fill="#4A3018" />
          <circle cx="768" cy="432" r="5" fill="#4A3018" />
          <circle cx="668" cy="431" r="4.5" fill="#4A3018" />
          <circle cx="772" cy="440" r="4.5" fill="#4A3018" />

          {/* Campfire Flame Layers */}
          <ellipse className="campfire-glow" cx="720" cy="420" rx="30" ry="8" fill="#FF8236" opacity="0.15" />
          <path className="campfire-flame-1" d="M720,394 C730,406 750,420 747,434 C744,440 734,444 720,444 C706,444 696,440 693,434 C690,420 710,406 720,394Z" fill="#FF8236" />
          <path className="campfire-flame-2" d="M720,402 C728,411 743,423 740,434 C738,439 730,442 720,442 C710,442 702,439 700,434 C697,423 712,411 720,402Z" fill="#FFB800" />
          <path className="campfire-flame-3" d="M720,410 C726,416 736,425 734,434 C733,438 727,440 720,440 C713,440 707,438 706,434 C704,425 714,416 720,410Z" fill="#FFD966" />
          <path className="campfire-flame-4" d="M720,418 C724,423 730,428 729,434 C728,437 725,439 720,439 C715,439 712,437 711,434 C710,428 716,423 720,418Z" fill="#FFF0D0" />

          {/* Charcoal on ground */}
          <ellipse cx="685" cy="442" rx="6" ry="3.5" fill="#2D2D2D" opacity="0.4" />
          <ellipse cx="755" cy="441" rx="5" ry="3" fill="#2D2D2D" opacity="0.35" />
          <ellipse cx="695" cy="446" rx="4" ry="2.5" fill="#2D2D2D" opacity="0.3" />
          <ellipse cx="748" cy="445" rx="5" ry="2.5" fill="#2D2D2D" opacity="0.3" />

          {/* Grass Tufts */}
          <path d="M60,440 L55,425 L65,440" fill="#1A1710" opacity="0.6" />
          <path d="M300,438 L295,422 L305,438" fill="#1A1710" opacity="0.5" />
          <path d="M580,439 L575,426 L585,439" fill="#1A1710" opacity="0.5" />
          <path d="M900,437 L895,423 L905,437" fill="#1A1710" opacity="0.6" />
          <path d="M1150,438 L1145,424 L1155,438" fill="#1A1710" opacity="0.5" />
          <path d="M1350,439 L1345,425 L1355,439" fill="#1A1710" opacity="0.6" />
        </svg>

        {/* Floating Rising Ember Sparks over the Campfire */}
        <div className="pointer-events-none absolute bottom-0 left-1/2 z-20 h-[30%] w-32 -translate-x-1/2">
          <div className="ember ember-d0 absolute h-1.5 w-1.5 rounded-full bg-[#FF6B35] shadow-[0_0_6px_#FF6B35]" style={{ left: '46%', bottom: '20%' }} />
          <div className="ember ember-d1 absolute h-2 w-2 rounded-full bg-[#FF8236] shadow-[0_0_8px_#FF8236]" style={{ left: '52%', bottom: '18%' }} />
          <div className="ember ember-d2 absolute h-1.5 w-1.5 rounded-full bg-[#FFB800] shadow-[0_0_6px_#FFB800]" style={{ left: '44%', bottom: '22%' }} />
          <div className="ember ember-d3 absolute h-2.5 w-2.5 rounded-full bg-[#FF4422] shadow-[0_0_10px_#FF4422]" style={{ left: '54%', bottom: '15%' }} />
          <div className="ember ember-d4 absolute h-1.5 w-1.5 rounded-full bg-[#FFB800] shadow-[0_0_6px_#FFB800]" style={{ left: '48%', bottom: '24%' }} />
          <div className="ember ember-d5 absolute h-2 w-2 rounded-full bg-[#FF6B35] shadow-[0_0_8px_#FF6B35]" style={{ left: '50%', bottom: '19%' }} />
        </div>

        {/* 18 Creature Eyes across Foreground Bushes with Hover Interaction */}
        <div
          className="pointer-events-auto absolute bottom-0 left-0 w-full z-[12] cursor-default"
          style={{ height: '32%' }}
        >
          {eyeSpots.map((spot) => (
            <div
              key={spot.id}
              className={`absolute flex items-center transition-opacity duration-300 ${
                hoveredMountain ? '!opacity-100' : 'opacity-0'
              }`}
              style={{
                left: spot.left,
                bottom: spot.bottom,
                gap: spot.gap,
              }}
            >
              <div
                className={`${spot.size} rounded-full`}
                style={{
                  backgroundColor: spot.color,
                  boxShadow: spot.shadow,
                }}
              />
              <div
                className={`${spot.size} rounded-full`}
                style={{
                  backgroundColor: spot.color,
                  boxShadow: spot.shadow,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
