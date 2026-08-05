import { galleryImages } from '../data/content'
import Reveal from './Reveal'

export default function Gallery() {
  return (
    <section id="gallery" className="border-t border-ink-borderSoft py-24 sm:py-28">
      <Reveal className="mb-12">
        <div className="flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.16em] text-brass">
          <span className="h-px w-4 bg-brass-dim" /> Field Journal
        </div>
        <h2 className="mt-3 font-display text-[clamp(30px,4vw,42px)] font-semibold text-text">
          Gallery
        </h2>
        <p className="mt-2.5 max-w-md text-[15px] text-text-dim">Snapshots from along the way.</p>
      </Reveal>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {galleryImages.map((img, i) => (
          <Reveal
            key={img.src + i}
            delay={i * 0.06}
            className={`group overflow-hidden rounded-lg border border-ink-border bg-ink-surface transition-all hover:-translate-y-1 hover:border-brass-dim hover:shadow-[0_20px_40px_-25px_rgba(217,165,74,0.25)] ${
              i % 5 === 0 ? 'col-span-2 row-span-2' : ''
            }`}
          >
            <div className="relative h-full min-h-[160px] w-full overflow-hidden">
              <img
                src={img.src}
                alt={img.caption}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/85 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
                <span className="font-mono text-[11px] text-text-dim">{img.caption}</span>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      {galleryImages.length < 3 && (
        <p className="mt-6 font-mono text-[11.5px] text-text-faint">
          add more photos to <code className="text-text-dim">public/</code> and list them in{' '}
          <code className="text-text-dim">src/data/content.ts → galleryImages</code> to fill out the grid.
        </p>
      )}
    </section>
  )
}
