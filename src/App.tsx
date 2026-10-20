import { LazyMotion, MotionConfig } from 'motion/react'
import { Contact, Footer, Skills } from './components/Contact'
import { Gallery } from './components/Gallery'
import { Hackathons } from './components/Hackathons'
import { Hero } from './components/Hero'
import { Nav } from './components/Nav'
import { Projects } from './components/Projects'
import { Stats, Work } from './components/Work'
import { ui, type Lang } from './content'
import { LangProvider, useLang } from './lib/lang'
import { MotionPrefProvider, useMotionPref } from './lib/motion-pref'

// Animation features live in a separate chunk so first paint doesn't wait on them, but the fetch
// starts as soon as this module runs instead of after the first render.
const features = import('./lib/motion-features').then((mod) => mod.default)
const loadFeatures = () => features

export default function App({ lang }: { lang: Lang }) {
  return (
    <MotionPrefProvider>
      <LangProvider initial={lang}>
        <Page />
      </LangProvider>
    </MotionPrefProvider>
  )
}

function Page() {
  const { t } = useLang()
  const { paused } = useMotionPref()
  return (
    <MotionConfig reducedMotion={paused ? 'always' : 'user'}>
      <LazyMotion features={loadFeatures} strict>
        <a href="#main" className="skip-link">
          {t(ui.skip)}
        </a>
        <Nav />
        <main id="main" tabIndex={-1}>
          <Hero />
          <Stats />
          <Work />
          <Projects />
          <Hackathons />
          <Gallery />
          <Skills />
          <Contact />
        </main>
        <Footer />
      </LazyMotion>
    </MotionConfig>
  )
}
