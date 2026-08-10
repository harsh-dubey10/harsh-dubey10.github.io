import { achievements, connectLinks, education, profile, skills } from '../data/content'
import DynamicBackground from './DynamicBackground'
import Reveal from './Reveal'

function WallTorch({ className = '' }: { className?: string }) {
  return (
    <div className={`pointer-events-none ${className}`}>
      {/* Ambient flame glow */}
      <div
        className="torch-glow-anim absolute -top-8 left-1/2 -translate-x-1/2 w-40 h-48 pointer-events-none rounded-full"
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(255,130,54,0.28) 0%, rgba(255,184,0,0.09) 50%, transparent 75%)',
        }}
      />
      {/* Dual Torch SVG */}
      <svg viewBox="0 0 80 100" className="w-14 lg:w-16 h-auto drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
        <rect x="28" y="58" width="24" height="5" rx="1.5" fill="#3A302A" />
        <rect x="32" y="62" width="16" height="3" rx="1" fill="#2E2622" />
        <g transform="rotate(-25 40 60)">
          <rect x="37" y="30" width="6" height="35" rx="2" fill="#5C4A3A" />
          <rect x="36" y="28" width="8" height="5" rx="1.5" fill="#4A3A2E" />
          <rect x="36.5" y="42" width="7" height="2" rx="0.5" fill="#4A3A2E" opacity="0.7" />
          <rect x="36.5" y="48" width="7" height="2" rx="0.5" fill="#4A3A2E" opacity="0.5" />
          <path
            d="M40,6 C43,13 50,20 48,27 C47,30 44,31 40,31 C36,31 33,30 32,27 C30,20 37,13 40,6Z"
            fill="#FF8236"
            className="torch-flame-1"
          />
          <path
            d="M40,12 C42,16 47,22 46,27 C45,29 43,30 40,30 C37,30 35,29 34,27 C33,22 38,16 40,12Z"
            fill="#FFB800"
            className="torch-flame-2"
          />
          <path
            d="M40,18 C41,21 44,24 43,27 C43,28 41,29 40,29 C39,29 37,28 37,27 C36,24 39,21 40,18Z"
            fill="#FFF0D0"
            className="torch-flame-3"
          />
        </g>
        <g transform="rotate(25 40 60)">
          <rect x="37" y="30" width="6" height="35" rx="2" fill="#5C4A3A" />
          <rect x="36" y="28" width="8" height="5" rx="1.5" fill="#4A3A2E" />
          <rect x="36.5" y="42" width="7" height="2" rx="0.5" fill="#4A3A2E" opacity="0.7" />
          <rect x="36.5" y="48" width="7" height="2" rx="0.5" fill="#4A3A2E" opacity="0.5" />
          <path
            d="M40,6 C43,13 50,20 48,27 C47,30 44,31 40,31 C36,31 33,30 32,27 C30,20 37,13 40,6Z"
            fill="#FF8236"
            className="torch-flame-1"
          />
          <path
            d="M40,12 C42,16 47,22 46,27 C45,29 43,30 40,30 C37,30 35,29 34,27 C33,22 38,16 40,12Z"
            fill="#FFB800"
            className="torch-flame-2"
          />
          <path
            d="M40,18 C41,21 44,24 43,27 C43,28 41,29 40,29 C39,29 37,28 37,27 C36,24 39,21 40,18Z"
            fill="#FFF0D0"
            className="torch-flame-3"
          />
        </g>
      </svg>
    </div>
  )
}

export default function Profile() {
  return (
    <section
      id="profile"
      className="relative left-1/2 right-1/2 -mx-[50vw] w-screen overflow-hidden py-20 lg:py-28 px-6 min-h-screen flex flex-col justify-center border-t border-[#3E2B20] bg-[#130D0A]"
    >
      {/* 1. Dynamic starfield & firefly canvas background */}
      <DynamicBackground variant="section" tint="gold" />

      {/* 2. Atmospheric warm brown cave wash gradient matching shubhamgl.com */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background:
            'radial-gradient(ellipse at 50% 45%, rgba(38, 24, 18, 0.85) 0%, rgba(12, 8, 6, 0.98) 100%)',
        }}
      />

      {/* 3. Campfire / Central warm ambient glow behind cards */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[600px] pointer-events-none z-[2]"
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(255, 130, 54, 0.16) 0%, rgba(217, 165, 74, 0.05) 45%, transparent 70%)',
        }}
      />

      {/* 4. Full-bleed Hanging Vines SVG Overlay */}
      <svg
        className="absolute inset-0 w-full h-full z-[5] pointer-events-none"
        preserveAspectRatio="xMidYMid meet"
        viewBox="0 0 1200 800"
      >
        <g className="vine-group">
          <path
            d="M100,0 Q95,50 110,100 Q120,150 105,200 Q95,240 112,280"
            fill="none"
            stroke="#2D5016"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <ellipse cx="100" cy="55" rx="6" ry="3.5" fill="#2D5016" opacity="0.75" transform="rotate(-25 100 55)" />
          <ellipse cx="115" cy="120" rx="6" ry="3.5" fill="#2D5016" opacity="0.75" transform="rotate(20 115 120)" />
          <ellipse cx="100" cy="195" rx="6" ry="3.5" fill="#2D5016" opacity="0.75" transform="rotate(-15 100 195)" />
          <ellipse cx="110" cy="260" rx="6" ry="3.5" fill="#2D5016" opacity="0.75" transform="rotate(25 110 260)" />
        </g>
        <g className="vine-group">
          <path
            d="M1080,0 Q1090,50 1075,105 Q1065,150 1085,200 Q1095,245 1078,285"
            fill="none"
            stroke="#1A3A0A"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <ellipse cx="1085" cy="55" rx="6" ry="3.5" fill="#1A3A0A" opacity="0.75" transform="rotate(20 1085 55)" />
          <ellipse cx="1070" cy="115" rx="6" ry="3.5" fill="#1A3A0A" opacity="0.75" transform="rotate(-15 1070 115)" />
          <ellipse cx="1088" cy="210" rx="6" ry="3.5" fill="#1A3A0A" opacity="0.75" transform="rotate(25 1088 210)" />
          <ellipse cx="1080" cy="270" rx="6" ry="3.5" fill="#1A3A0A" opacity="0.75" transform="rotate(-20 1080 270)" />
        </g>
        <g className="vine-group">
          <path
            d="M0,120 Q40,125 75,160 Q100,195 85,240 Q70,275 90,310"
            fill="none"
            stroke="#2D5016"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <ellipse cx="45" cy="130" rx="6" ry="3.5" fill="#2D5016" opacity="0.75" transform="rotate(10 45 130)" />
          <ellipse cx="85" cy="175" rx="6" ry="3.5" fill="#2D5016" opacity="0.75" transform="rotate(35 85 175)" />
          <ellipse cx="80" cy="250" rx="6" ry="3.5" fill="#2D5016" opacity="0.75" transform="rotate(15 80 250)" />
        </g>
        <g className="vine-group">
          <path
            d="M1200,150 Q1160,155 1130,185 Q1110,215 1125,260 Q1140,295 1120,330"
            fill="none"
            stroke="#1A3A0A"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <ellipse cx="1155" cy="160" rx="6" ry="3.5" fill="#1A3A0A" opacity="0.75" transform="rotate(-10 1155 160)" />
          <ellipse cx="1120" cy="200" rx="6" ry="3.5" fill="#1A3A0A" opacity="0.75" transform="rotate(-35 1120 200)" />
        </g>
      </svg>

      {/* Main Content Wrapper */}
      <div className="relative z-20 mx-auto w-full max-w-5xl">
        {/* Wall Torches accurately anchored to outer margins of max-w-5xl cards */}
        <WallTorch className="absolute top-[220px] -left-12 lg:-left-20 z-30 hidden md:block" />
        <WallTorch className="absolute top-[220px] -right-12 lg:-right-20 z-30 hidden md:block" />

        {/* Section Header */}
        <Reveal className="mb-8 text-center sm:text-left">
          <p className="text-xs font-mono font-medium text-[#D9A54A] uppercase tracking-[0.3em] mb-2">
            About
          </p>
          <h2 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-white mb-1">
            Character Sheet
          </h2>
        </Reveal>

        {/* Two-Column Grid Replicating shubhamgl.com Exactly */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* Left Column: Character Avatar / Image Card */}
          <Reveal delay={0.05} className="h-full">
            <div className="relative rounded-xl overflow-hidden border-2 border-[#D9A54A]/40 shadow-[0_8px_40px_rgba(0,0,0,0.7)] aspect-square w-full group transition-all duration-300 hover:border-[#D9A54A] hover:shadow-[0_12px_50px_rgba(217,165,74,0.3)]">
              <img
                src="/profile.PNG"
                alt={profile.name}
                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(to top, rgba(19,13,10,0.92) 0%, rgba(19,13,10,0.45) 40%, transparent 100%)',
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 p-5 pointer-events-none flex items-end justify-between">
                <div>
                  <h3 className="font-display font-bold text-2xl text-white leading-tight">
                    {profile.name}
                  </h3>
                  <p className="text-white/80 font-mono text-xs uppercase tracking-widest mt-0.5">
                    Explorer · M.Tech, IIT Gandhinagar
                  </p>
                </div>
                <span className="font-display font-bold text-lg text-[#D9A54A] border border-[#D9A54A]/50 bg-[#1C1410]/85 backdrop-blur-md px-3.5 py-1 rounded-lg shadow-lg">
                  {profile.level}
                </span>
              </div>
              <div
                className="absolute inset-0 pointer-events-none rounded-xl"
                style={{
                  background:
                    'linear-gradient(165deg, rgba(217,165,74,0.14) 0%, transparent 35%)',
                }}
              />
            </div>
          </Reveal>

          {/* Right Column: Bio, Education, Skills, and Connect Links (bg-mortar theme) */}
          <Reveal delay={0.1} className="h-full">
            <div className="bg-[#1C1410]/95 backdrop-blur-md rounded-xl p-6 sm:p-7 border border-[#3E2B20] shadow-2xl h-full flex flex-col justify-between hover:border-[#D9A54A]/40 transition-colors">
              <div>
                <div className="text-white/85 text-[14.5px] leading-relaxed mb-4 space-y-3">
                  {profile.bio.map((para) => (
                    <p key={para}>{para}</p>
                  ))}
                </div>

                {/* Education Pills */}
                <div className="flex flex-col gap-2 mb-4">
                  {education.map((e) => (
                    <div
                      key={e.school}
                      className="flex flex-wrap items-center justify-between gap-2 bg-[#D9A54A]/10 border border-[#D9A54A]/30 rounded-lg px-3.5 py-2"
                    >
                      <span className="text-white text-xs font-semibold">
                        🎓 {e.school} ({e.program})
                      </span>
                      {(e.period || e.stat) && (
                        <span className="text-[#D9A54A] text-[11px] font-mono font-medium">
                          {[e.period, e.stat].filter(Boolean).join(' · ')}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                <div className="w-full h-px bg-white/[0.10] my-4" />

                {/* Skills */}
                <div>
                  <p className="text-xs font-mono font-medium text-[#D9A54A] uppercase tracking-[0.3em] mb-3">
                    Skills
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-1 text-xs text-white/90 bg-[#2A1E18] border border-[#4A3528] rounded font-mono font-medium hover:border-[#D9A54A] hover:text-[#D9A54A] transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="w-full h-px bg-white/[0.10] my-4" />

                {/* Connect */}
                <div>
                  <p className="text-xs font-mono font-medium text-[#D9A54A] uppercase tracking-[0.3em] mb-3">
                    Connect
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    {connectLinks.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        target={link.href.startsWith('http') ? '_blank' : undefined}
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 bg-[#D9A54A]/15 border border-[#D9A54A]/35 text-[#D9A54A] text-[12px] px-3.5 py-1.5 rounded-md hover:bg-[#D9A54A]/25 transition-colors font-mono"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <div className="w-full h-px bg-white/[0.10] mt-5 mb-3" />
                <p className="text-white/60 font-mono text-[11px] text-center">
                  Loves systems · Loves building · Loves research
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Achievements Unlocked Section */}
        <Reveal delay={0.15} className="mt-12">
          <p className="text-xs font-mono font-medium text-[#D9A54A] uppercase tracking-[0.3em] mb-6">
            Achievements Unlocked
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {achievements.map((a) => (
              <div key={a.title} className="group flex flex-col items-center cursor-default">
                <div className="relative mb-2">
                  <div
                    className="absolute -inset-2 rounded-full blur-lg transition-all duration-300 group-hover:-inset-4 group-hover:blur-xl"
                    style={{ background: 'rgba(217,165,74,0.25)', opacity: 0.6 }}
                  />
                  <div
                    className="absolute -inset-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md"
                    style={{ background: '#D9A54A' }}
                  />
                  <div
                    className="relative w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
                    style={{
                      borderColor: 'rgba(217,165,74,0.45)',
                      background: 'rgba(217,165,74,0.15)',
                    }}
                  >
                    <div
                      className="w-12 h-12 rounded-full bg-[#1C1410] border flex items-center justify-center text-center p-1"
                      style={{ borderColor: 'rgba(217,165,74,0.45)' }}
                    >
                      <span
                        className="font-mono font-bold text-[11px] leading-tight"
                        style={{ color: '#D9A54A' }}
                      >
                        {a.tag}
                      </span>
                    </div>
                  </div>
                  <div
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1.5 rounded-b-full transition-transform duration-300 group-hover:scale-125"
                    style={{ background: 'rgba(217,165,74,0.45)' }}
                  />
                </div>
                <p className="text-white text-[12px] text-center font-medium leading-tight mt-1 transition-colors duration-300 group-hover:text-[#D9A54A]">
                  {a.title}
                </p>
                <p className="text-[#D9A54A]/60 text-[10px] font-mono text-center mt-0.5">
                  {a.date}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
