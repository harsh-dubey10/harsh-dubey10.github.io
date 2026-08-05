import Achievements from './components/Achievements'
import Contact from './components/Contact'
import Gallery from './components/Gallery'
import Hero from './components/Hero'
import Nav from './components/Nav'
import Profile from './components/Profile'
import ScrollProgress from './components/ScrollProgress'
import Timeline from './components/Timeline'
import Work from './components/Work'

export default function App() {
  return (
    <div className="relative">
      <ScrollProgress />
      <Nav />
      <main className="mx-auto max-w-rail px-7">
        <Hero />
        <Profile />
        <Achievements />
        <Timeline />
        <Work />
        <Gallery />
      </main>
      <div className="mx-auto max-w-rail px-7">
        <Contact />
      </div>
    </div>
  )
}
