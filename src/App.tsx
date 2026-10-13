import { Suspense, lazy, useState } from 'react'
import Contact from './components/Contact'
import Hero from './components/Hero'
import Nav from './components/Nav'
import Profile from './components/Profile'
import ScrollProgress from './components/ScrollProgress'
import SkillsMarquee from './components/SkillsMarquee'
import TalkToMe from './components/TalkToMe'
import Timeline from './components/Timeline'
import Work from './components/Work'
import { hasWebGL } from './lib/webgl'

// three.js lives in its own chunk, loaded after first paint.
const SiteScene = lazy(() => import('./components/SiteScene'))

export default function App() {
  const [webgl] = useState(hasWebGL)

  return (
    <div className="relative">
      {webgl && (
        <Suspense fallback={null}>
          <SiteScene />
        </Suspense>
      )}
      <ScrollProgress />
      <Nav />
      <TalkToMe />
      <main className="relative z-[1] mx-auto max-w-rail px-7">
        <Hero />
        <Profile />
        <SkillsMarquee />
        <Timeline />
        <Work />
      </main>
      <div className="relative z-[1] mx-auto max-w-rail px-7">
        <Contact />
      </div>
    </div>
  )
}
