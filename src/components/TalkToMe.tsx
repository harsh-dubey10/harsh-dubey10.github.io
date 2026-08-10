import { motion } from 'framer-motion'

export default function TalkToMe() {
  return (
    <motion.a
      href="mailto:harsh.dubey@iitgn.ac.in"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      aria-label="Talk to me"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 group select-none focus:outline-none"
    >
      {/* "Talk to me" Tooltip Badge */}
      <span className="bg-[#1C1410] border border-[#D9A54A]/50 text-[#D9A54A] font-mono text-xs font-bold px-3 py-1.5 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0 pointer-events-none whitespace-nowrap">
        Talk to me
      </span>

      {/* Clean Circular Feather Button matching reference site (No square blur artifacts) */}
      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#1C1410] border-2 border-[#D9A54A] text-[#D9A54A] flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.6),0_0_15px_rgba(217,165,74,0.35)] group-hover:scale-110 group-hover:border-[#FFB800] group-hover:text-[#FFB800] group-hover:shadow-[0_0_25px_rgba(255,184,0,0.6)] transition-all duration-300">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-6 h-6 transform -rotate-12 group-hover:-rotate-45 transition-transform duration-300"
        >
          <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L3 13.5V21h7.5L20.24 12.24z" />
          <line x1="16" y1="8" x2="2" y2="22" />
          <line x1="17.5" y1="15" x2="9" y2="15" />
        </svg>
      </div>
    </motion.a>
  )
}
