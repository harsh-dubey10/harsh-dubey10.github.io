import Contact from './components/Contact'
import Gallery from './components/Gallery'
import Hero from './components/Hero'
import Nav from './components/Nav'
import Profile from './components/Profile'
import Timeline from './components/Timeline'
import Work from './components/Work'

export default function App() {
  return (
    <div className="relative">
      <Nav />
      <main className="mx-auto max-w-rail px-7">
        <Hero />
        <Profile />
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
