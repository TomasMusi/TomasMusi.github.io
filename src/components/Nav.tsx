import { m, useScroll, useSpring } from 'motion/react'
import { useEffect, useState } from 'react'
import { langNames, ui } from '../content'
import { useLang } from '../lib/lang'
import { motionTokens } from '../lib/motion'
import { useMotionPref } from '../lib/motion-pref'
import { langPath } from '../lib/head'

const links = ['work', 'projects', 'hackathons', 'gallery', 'contact'] as const

export function Nav() {
  const { lang, setLang, t } = useLang()
  const { paused, togglePaused, still } = useMotionPref()
  const { scrollYProgress } = useScroll()
  const smooth = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 })
  const [active, setActive] = useState<string>('')
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id)
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    for (const id of links) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }
    return () => {
      window.removeEventListener('scroll', onScroll)
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false)
        document.querySelector<HTMLButtonElement>('.nav__menu-btn')?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  return (
    <m.header
      className={`nav ${scrolled ? 'nav--scrolled' : ''}`}
      initial={{ y: -motionTokens.distance.xl, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: motionTokens.duration.slow, ease: motionTokens.easing.out, delay: 0.2 }}
    >
      {/* Remount on toggle so the spring's last value doesn't linger. */}
      <m.div key={still ? 'still' : 'live'} className="nav__progress" style={{ scaleX: still ? scrollYProgress : smooth }} aria-hidden />
      <a href="#top" className="nav__logo" aria-label="TM — Tomáš Musil">
        <span className="nav__logo-mark">TM</span>
      </a>
      <nav aria-label={t(ui.primaryNav)}>
        <button
          type="button"
          className="nav__menu-btn"
          aria-expanded={menuOpen}
          aria-controls="nav-links"
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span className="nav__menu-icon" aria-hidden />
          {t(ui.menu)}
        </button>
        <ul id="nav-links" role="list" className={`nav__links ${menuOpen ? 'is-open' : ''}`}>
          {links.map((id) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className={active === id ? 'is-active' : ''}
                aria-current={active === id ? 'location' : undefined}
                onClick={() => setMenuOpen(false)}
              >
                <span className="nav__pill" aria-hidden />
                <span className="nav__label">{t(ui.nav[id])}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="nav__tools">
        <button
          type="button"
          className="motion-toggle"
          aria-pressed={paused}
          aria-label={t(ui.pauseMotion)}
          title={t(ui.pauseMotion)}
          onClick={togglePaused}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden>
            {paused ? <path d="M8 5v14l11-7z" /> : <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />}
          </svg>
        </button>
        <div className="lang" role="group" aria-label={t(ui.language)}>
          {(['cs', 'en'] as const).map((l) => (
            <a
              key={l}
              href={langPath[l]}
              hrefLang={l}
              lang={l}
              aria-current={lang === l ? 'true' : undefined}
              onClick={(e) => {
                e.preventDefault()
                setLang(l)
              }}
            >
              {/* The accessible name must contain the visible "CS"/"EN" (WCAG 2.5.3). */}
              {l.toUpperCase()}
              <span className="sr-only"> — {langNames[l]}</span>
            </a>
          ))}
        </div>
      </div>
    </m.header>
  )
}
