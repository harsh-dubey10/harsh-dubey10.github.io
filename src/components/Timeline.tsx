import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { timeline } from '../data/content'

// Map node coordinates on the 800x600 SVG canvas
const mapNodeCoords = [
  { id: 'aicte', cx: 160, cy: 460 },
  { id: 'vivada', cx: 420, cy: 300 },
  { id: 'fuss', cx: 650, cy: 150 },
]

export default function Timeline() {
  const [activeId, setActiveId] = useState(
    timeline.find((t) => t.current)?.id ?? timeline[0]?.id ?? '',
  )

  const activeIndex = timeline.findIndex((t) => t.id === activeId)
  const active = timeline[activeIndex]

  return (
    <section
      id="timeline"
      className="treasure-map-bg relative left-1/2 right-1/2 -mx-[50vw] w-screen -mt-px overflow-hidden py-16 sm:py-24 px-4 sm:px-6 select-none"
    >
      {/* 1. Full-Bleed Parchment Vignette Edge-to-Edge Shadow Overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          boxShadow:
            'inset 0 0 140px 50px rgba(60,40,20,0.65), inset 0 0 70px 25px rgba(30,20,10,0.35)',
        }}
      />

      {/* 2. Section Header matching reference site */}
      <div className="max-w-7xl mx-auto px-4 mb-8 sm:mb-12 relative z-20">
        <p className="text-xs font-mono font-bold uppercase tracking-[0.3em] mb-2 text-[#3A2A1A]">
          Journey So Far
        </p>
        <h2 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[#3A2A1A] mb-2">
          Experience
        </h2>
        <p className="text-base sm:text-lg text-[#5C4A3A] font-serif italic">
          Every stop, a story. Every role, a relic.
        </p>
        <p className="lg:hidden text-xs font-mono italic mt-2 text-[#3A2A1A]/70">
          tap a stop on the map to explore
        </p>
      </div>

      {/* 3. Interactive Treasure Map Grid Layout */}
      <div className="max-w-7xl mx-auto px-2 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_1fr] gap-8 items-center">
          {/* Left Column: Interactive SVG Treasure Map */}
          <div className="relative bg-[#F4E4C6]/60 rounded-2xl border-2 border-[#8B6F47]/30 p-4 sm:p-6 shadow-[0_8px_30px_rgba(60,40,20,0.2)]">
            <div className="relative w-full aspect-[4/3]">
              <svg
                viewBox="0 0 800 600"
                className="absolute inset-0 w-full h-full"
                preserveAspectRatio="xMidYMid meet"
              >
                {/* Decorative Map Grid Lines */}
                <g stroke="#8B6F47" strokeWidth="0.5" opacity="0.15">
                  <line x1="200" y1="0" x2="200" y2="600" strokeDasharray="4 4" />
                  <line x1="400" y1="0" x2="400" y2="600" strokeDasharray="4 4" />
                  <line x1="600" y1="0" x2="600" y2="600" strokeDasharray="4 4" />
                  <line x1="0" y1="150" x2="800" y2="150" strokeDasharray="4 4" />
                  <line x1="0" y1="300" x2="800" y2="300" strokeDasharray="4 4" />
                  <line x1="0" y1="450" x2="800" y2="450" strokeDasharray="4 4" />
                </g>

                {/* Ocean Wave Lines */}
                <g fill="none" stroke="#6B8FBF" strokeWidth="1.5" opacity="0.3">
                  <path d="M50,520 Q80,510 110,520 Q140,530 170,520" />
                  <path d="M680,480 Q710,470 740,480 Q770,490 800,480" />
                  <path d="M40,120 Q70,110 100,120 Q130,130 160,120" />
                </g>

                {/* Islands & Coastlines */}
                <path
                  d="M100,420 C180,380 260,450 320,430 C380,410 420,480 360,530 C300,580 180,540 100,490 Z"
                  fill="#EAD5B3"
                  stroke="#8B6F47"
                  strokeWidth="1.5"
                  opacity="0.5"
                />
                <path
                  d="M360,250 C440,220 520,290 580,260 C640,230 680,310 600,360 C520,410 400,360 340,310 Z"
                  fill="#EAD5B3"
                  stroke="#8B6F47"
                  strokeWidth="1.5"
                  opacity="0.5"
                />
                <path
                  d="M580,100 C660,70 740,140 780,120 C820,100 840,190 760,220 C680,250 600,190 560,140 Z"
                  fill="#EAD5B3"
                  stroke="#8B6F47"
                  strokeWidth="1.5"
                  opacity="0.5"
                />

                {/* Mountain Peaks on Map */}
                <g fill="#8B6F47" opacity="0.35">
                  <polygon points="220,440 240,400 260,440" />
                  <polygon points="240,440 255,410 270,440" />
                  <polygon points="480,280 500,240 520,280" />
                  <polygon points="700,140 720,100 740,140" />
                </g>

                {/* Trees on Map */}
                <g fill="#5C6B3A" opacity="0.4">
                  <ellipse cx="140" cy="450" rx="10" ry="6" transform="rotate(-15 140 450)" />
                  <ellipse cx="400" cy="280" rx="12" ry="7" transform="rotate(20 400 280)" />
                  <ellipse cx="620" cy="130" rx="11" ry="6" transform="rotate(-10 620 130)" />
                </g>

                {/* Compass Rose in top corner */}
                <g transform="translate(710, 80)" opacity="0.6">
                  <circle cx="0" cy="0" r="36" fill="none" stroke="#8B6F47" strokeWidth="1.5" />
                  <circle cx="0" cy="0" r="30" fill="none" stroke="#8B6F47" strokeWidth="0.5" />
                  <polygon points="0,-28 -4,-8 4,-8" fill="#8B6F47" />
                  <polygon points="0,28 -4,8 4,8" fill="#8B6F47" opacity="0.5" />
                  <polygon points="-28,0 -8,-4 -8,4" fill="#8B6F47" opacity="0.5" />
                  <polygon points="28,0 8,-4 8,4" fill="#8B6F47" opacity="0.5" />
                  <text x="0" y="-34" textAnchor="middle" fill="#8B6F47" fontSize="10" fontWeight="bold">N</text>
                  <text x="0" y="42" textAnchor="middle" fill="#8B6F47" fontSize="9">S</text>
                  <text x="42" y="3" textAnchor="middle" fill="#8B6F47" fontSize="9">E</text>
                  <text x="-42" y="3" textAnchor="middle" fill="#8B6F47" fontSize="9">W</text>
                </g>

                {/* Dotted Treasure Trail Path connecting the stops */}
                <path
                  d="M 160,460 C 260,390 320,340 420,300 C 520,260 580,200 650,150"
                  fill="none"
                  stroke="#8B6F47"
                  strokeWidth="3.5"
                  strokeDasharray="8 8"
                  opacity="0.8"
                />

                {/* Terra Incognita Parchment Label */}
                <text
                  x="520"
                  y="480"
                  fill="#8B6F47"
                  fontSize="12"
                  fontStyle="italic"
                  opacity="0.35"
                  transform="rotate(-5 520 480)"
                  fontFamily="serif"
                >
                  Terra Incognita
                </text>
              </svg>

              {/* Clickable Map Stop Nodes (explicit onClick selection) */}
              {timeline.map((entry, index) => {
                const coords = mapNodeCoords[index] || { cx: 400, cy: 300 }
                const isActive = entry.id === activeId
                const leftPct = `${(coords.cx / 800) * 100}%`
                const topPct = `${(coords.cy / 600) * 100}%`

                return (
                  <button
                    key={entry.id}
                    onClick={() => setActiveId(entry.id)}
                    className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer focus:outline-none z-20"
                    style={{ left: leftPct, top: topPct }}
                    aria-label={`Select ${entry.org}`}
                  >
                    {/* Node Badge Circle Container with Perfectly Centered Circular Glow */}
                    <div className="relative flex items-center justify-center">
                      {isActive && (
                        <>
                          <div className="absolute -inset-2.5 sm:-inset-3.5 rounded-full bg-[#FFB800]/35 animate-ping pointer-events-none" />
                          <div className="absolute -inset-3 sm:-inset-4 rounded-full bg-[#D9A54A]/30 blur-md pointer-events-none" />
                        </>
                      )}
                      <div
                        className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                          isActive
                            ? 'border-[#D9A54A] bg-[#FAF2E2] shadow-[0_0_24px_rgba(217,165,74,0.7)] scale-110'
                            : 'border-[#8B6F47]/50 bg-[#EAD5B3] hover:border-[#D9A54A] hover:scale-105'
                        }`}
                      >
                        <span
                          className={`font-display font-bold text-base sm:text-lg ${
                            isActive ? 'text-[#3A2A1A]' : 'text-[#5C4A3A]'
                          }`}
                        >
                          {entry.initial}
                        </span>
                      </div>
                    </div>

                    {/* Level Label */}
                    <span
                      className={`mt-1 font-mono text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full border transition-colors ${
                        isActive
                          ? 'bg-[#3A2A1A] text-[#D9A54A] border-[#D9A54A]'
                          : 'bg-[#EAD5B3] text-[#5C4A3A] border-[#8B6F47]/40'
                      }`}
                    >
                      Lv.{entry.level}
                    </span>

                    {/* Org Title Label Tag */}
                    <span className="mt-1 font-mono text-[10px] text-[#3A2A1A] font-bold bg-[#FAF2E2]/90 px-2 py-0.5 rounded border border-[#8B6F47]/30 whitespace-nowrap shadow-sm">
                      {entry.org.split(',')[0]}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Right Column: Vintage Parchment Relic Card */}
          <AnimatePresence mode="wait">
            {active && (
              <motion.div
                key={active.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35 }}
                className="bg-[#F2E6CE] rounded-2xl p-6 sm:p-8 border-2 border-[#8B6F47]/40 shadow-[0_16px_50px_rgba(60,40,20,0.3)] relative overflow-hidden flex flex-col min-h-[380px]"
              >
                {/* Vintage Corner Accents */}
                <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#8B6F47]/50" />
                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#8B6F47]/50" />
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#8B6F47]/50" />
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#8B6F47]/50" />

                {/* Level & Period Header */}
                <div className="flex items-center justify-between gap-3 mb-3">
                  <span className="bg-[#8B6F47]/15 text-[#5C3D1E] font-mono text-xs font-bold px-3 py-1 rounded-full border border-[#8B6F47]/30">
                    Lv. {active.level}
                  </span>
                  <span className="font-mono text-xs font-semibold text-[#5C4A3A]">
                    {active.period}
                  </span>
                </div>

                {/* Organization Name */}
                <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-[#3A2A1A] leading-tight mb-1">
                  {active.org}
                </h3>

                {/* Role Title */}
                <div className="font-mono text-sm font-bold text-[#8B6F47] mb-4">
                  {active.role}
                </div>

                {/* Divider Line */}
                <div className="w-full h-px bg-[#8B6F47]/20 mb-4" />

                {/* Description */}
                <p className="text-[#3A2A1A]/90 text-sm sm:text-base leading-relaxed mb-6 font-serif">
                  {active.description}
                </p>

                {/* Tech Tags */}
                <div className="mt-auto pt-2">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-[#8B6F47] font-bold mb-2">
                    Relic Artifacts / Skills
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {active.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-[#E5D7BC] text-[#3A2A1A] border border-[#C4A77D] font-mono text-xs px-2.5 py-1 rounded-md font-semibold"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Clean Reference Current Quest Glow Badge */}
                {active.current && (
                  <div className="inline-flex items-center gap-2 bg-[#D9A54A]/15 border border-[#D9A54A]/40 text-[#5C3D1E] font-mono text-xs font-bold px-3 py-1.5 rounded-md w-fit">
                    <span className="w-2 h-2 rounded-full bg-[#FFB800] shadow-[0_0_8px_#FFB800] animate-pulse" />
                    Current Quest
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
