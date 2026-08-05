import { useActiveSection } from '../hooks/useActiveSection'
import { useScrolled } from '../hooks/useScrolled'

const SECTIONS = [
  { id: 'profile', label: 'About' },
  { id: 'achievements', label: 'Trophies' },
  { id: 'timeline', label: 'Journey' },
  { id: 'work', label: 'Quests' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'contact', label: 'Connect' },
]

export default function Nav() {
  const active = useActiveSection(SECTIONS.map((s) => s.id))
  const scrolled = useScrolled(24)

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-colors duration-300 ${
        scrolled
          ? 'border-ink-borderSoft bg-ink/75 backdrop-blur-md'
          : 'border-transparent bg-transparent backdrop-blur-0'
      }`}
    >
      <div className="mx-auto flex max-w-rail items-center justify-between px-7 py-4">
        <a
          href="#top"
          className="shrink-0 pr-6 font-morva text-[22px] tracking-wide text-brass transition-colors hover:text-text sm:text-[26px]"
        >
          Harsh
        </a>

        <nav className="no-scrollbar flex gap-7 overflow-x-auto font-mono text-[12.5px] tracking-wide">
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={`relative pb-1 uppercase transition-colors ${
                active === s.id ? 'text-brass' : 'text-text-dim hover:text-brass'
              }`}
            >
              {s.label}
              <span
                className={`absolute -bottom-px left-0 h-px bg-brass transition-all duration-300 ${
                  active === s.id ? 'right-0' : 'right-full'
                }`}
              />
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}
