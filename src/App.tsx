import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Contact from './components/Contact'
import DragonIntro from './components/DragonIntro'
import Hero from './components/Hero'
import Nav from './components/Nav'
import Profile from './components/Profile'
import TalkToMe from './components/TalkToMe'
import Timeline from './components/Timeline'
import Work from './components/Work'

export default function App() {
  const [introDone, setIntroDone] = useState(false)

  return (
    <div className="relative">
      <AnimatePresence>
        {!introDone && <DragonIntro onDone={() => setIntroDone(true)} />}
      </AnimatePresence>

      <Nav onReplayIntro={() => setIntroDone(false)} />
      <TalkToMe />
      <main className="mx-auto max-w-rail px-7">
        <Hero onReplayIntro={() => setIntroDone(false)} />
        <Profile />
        <Timeline />
        <Work />
      </main>
      <div className="mx-auto max-w-rail px-7">
        <Contact />
      </div>
    </div>
  )
}

