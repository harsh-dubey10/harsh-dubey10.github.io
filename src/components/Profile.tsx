import { achievements, connectLinks, education, profile, skills } from '../data/content'
import DynamicBackground from './DynamicBackground'
import Reveal from './Reveal'

export default function Profile() {
  return (
    <section id="profile" className="relative border-t border-ink-borderSoft py-24 sm:py-28">
      <DynamicBackground variant="profile" />
      <Reveal className="relative z-10 mb-12">
        <div className="flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.16em] text-brass">
          <span className="h-px w-4 bg-brass-dim" /> About
        </div>
        <h2 className="mt-3 font-display text-[clamp(30px,4vw,42px)] font-semibold text-text">
          Character Sheet
        </h2>
      </Reveal>

      <Reveal
        delay={0.05}
        className="relative z-10 overflow-hidden rounded-lg border border-ink-border bg-gradient-to-b from-ink-surface to-ink-raised transition-colors hover:border-brass-dim"
      >
        {/* equal-split photo / bio */}
        <div className="grid sm:grid-cols-2">
          <div className="relative min-h-[280px] border-b border-ink-border sm:min-h-[420px] sm:border-b-0 sm:border-r">
            <img
              src="/profile.jpg"
              alt={profile.name}
              className="absolute inset-0 h-full w-full object-cover object-[50%_22%]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-surface/90 via-transparent to-transparent" />
            <span className="absolute right-4 top-4 rounded-full border border-brass-dim bg-ink/80 px-3.5 py-1.5 font-mono text-[12px] tracking-wide text-brass backdrop-blur-sm">
              {profile.level}
            </span>
          </div>

          <div className="p-8 sm:p-10">
            <div className="font-display text-[28px] font-semibold text-text">{profile.name}</div>
            <div className="mt-1 font-mono text-[12px] tracking-wide text-text-dim">
              {profile.location}
            </div>

            <div className="mt-6 max-w-xl space-y-4 text-[15px] leading-relaxed text-text-dim">
              {profile.bio.map((para) => (
                <p key={para}>{para}</p>
              ))}
            </div>

            <dl className="mt-6 grid gap-2">
              {education.map((e) => (
                <div
                  key={e.school}
                  className="flex flex-wrap justify-between gap-3 border-b border-dashed border-ink-borderSoft py-2.5 font-mono text-[12.5px] text-text-dim"
                >
                  <dt className="text-text">
                    {e.school} <span className="text-text-faint">— {e.program}</span>
                  </dt>
                  <dd className="flex gap-4">
                    <span>{e.period}</span>
                    <span className="text-brass">{e.stat}</span>
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-7">
              <div className="font-mono text-[11.5px] uppercase tracking-[0.1em] text-text-faint">
                Skills
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded border border-ink-border bg-white/[0.015] px-3 py-1.5 font-mono text-[11.5px] text-text-dim transition-all hover:-translate-y-0.5 hover:border-brass-dim hover:text-brass"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-7">
              <div className="font-mono text-[11.5px] uppercase tracking-[0.1em] text-text-faint">
                Connect
              </div>
              <div className="mt-3 flex flex-wrap gap-3">
                {connectLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    className="rounded border border-ink-border px-4 py-2 font-mono text-[12px] text-text-dim transition-all hover:-translate-y-0.5 hover:border-brass-dim hover:bg-brass-soft hover:text-brass"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* achievements — plain divided list, two columns on larger screens */}
        <div className="border-t border-ink-border px-8 py-8 sm:px-10">
          <div className="font-mono text-[11.5px] uppercase tracking-[0.1em] text-text-faint">
            Achievements Unlocked
          </div>
          <div className="mt-4 grid gap-x-10 sm:grid-cols-2">
            {achievements.map((a, i) => (
              <div
                key={a.title}
                className={`flex items-start gap-4 py-3.5 ${
                  i < achievements.length - (achievements.length % 2 === 0 ? 2 : 1)
                    ? 'border-b border-ink-borderSoft'
                    : ''
                }`}
              >
                <span className="mt-0.5 inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-full border border-brass-dim bg-brass-soft px-3 py-1 text-center font-mono text-[11px] leading-none text-brass">
                  {a.tag}
                </span>
                <div className="min-w-0">
                  <div className="text-[13.5px] font-medium leading-snug text-text">{a.title}</div>
                  <div className="mt-0.5 font-mono text-[10.5px] text-text-faint">{a.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  )
}
