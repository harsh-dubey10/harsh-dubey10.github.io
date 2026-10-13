/** Illustrated campfire: crossed logs and four layered, flickering flames. */
export default function Campfire({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 160" className={className} aria-hidden="true">
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
  )
}
