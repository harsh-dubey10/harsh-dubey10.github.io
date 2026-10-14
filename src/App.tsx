import { Suspense, lazy, useState } from 'react'
import Contact from './components/Contact'
import Hero from './components/Hero'
import Nav from './components/Nav'
import Profile from './components/Profile'
import TalkToMe from './components/TalkToMe'
import Timeline from './components/Timeline'
import Work from './components/Work'
import { useSmoothScroll } from './hooks/useSmoothScroll'
import { hasWebGL } from './lib/webgl'

// three.js lives in its own chunk, loaded after first paint.
const SketchWorld = lazy(() => import('./components/SketchWorld'))

export default function App() {
  const [webgl] = useState(hasWebGL)
  useSmoothScroll()

  return (
    <div className="relative">
      {/* Night backdrop behind the hero and About; later sections paint their own paper. */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 bg-[#0A0F1C]" />
      <Nav />
      <TalkToMe />
      <main className="relative z-[1] mx-auto max-w-rail px-7">
        {webgl && (
          <Suspense fallback={null}>
            <SketchWorld />
          </Suspense>
        )}
        <Hero />
        <Profile />
        <Timeline />
        <Work />
        <Contact />
      </main>
    </div>
  )
}
