import { motion } from 'framer-motion'

interface SectionHeadingProps {
  eyebrow: string
  title: string
  subtitle?: string
  align?: 'left' | 'center'
}

const EASE = [0.2, 0.7, 0.2, 1] as const

/** Eyebrow + display title whose words rise into place as it scrolls in. */
export default function SectionHeading({ eyebrow, title, subtitle, align = 'left' }: SectionHeadingProps) {
  const centered = align === 'center'
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
      className={centered ? 'text-center' : 'text-left'}
    >
      <motion.p
        variants={{ hidden: { opacity: 0, x: centered ? 0 : -12 }, show: { opacity: 1, x: 0 } }}
        transition={{ duration: 0.6, ease: EASE }}
        className={`mb-3 flex items-center gap-3 font-mono text-xs font-medium uppercase tracking-[0.3em] text-brass ${centered ? 'justify-center' : ''}`}
      >
        <motion.span
          variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1 } }}
          transition={{ duration: 0.7, ease: EASE }}
          className="h-px w-8 origin-left bg-brass/70"
        />
        {eyebrow}
      </motion.p>

      <h2 className="font-display text-4xl font-bold leading-[1.05] text-white sm:text-5xl lg:text-6xl">
        {title.split(' ').map((word, i) => (
          <span key={`${word}-${i}`} className="inline-block overflow-hidden pb-[0.12em] align-bottom">
            <motion.span
              className="inline-block"
              variants={{ hidden: { y: '110%' }, show: { y: 0 } }}
              transition={{ duration: 0.8, delay: 0.08 + i * 0.07, ease: EASE }}
            >
              {word}
              {' '}
            </motion.span>
          </span>
        ))}
      </h2>

      {subtitle && (
        <motion.p
          variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
          className={`mt-4 max-w-2xl text-base text-white/70 sm:text-lg ${centered ? 'mx-auto' : ''}`}
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  )
}
