import { AnimatePresence, m, useInView } from 'motion/react'
import { useRef, useState } from 'react'
import { education, profile, skills, ui } from '../content'
import { useLang } from '../lib/lang'
import { inView, motionTokens, reveal, stagger } from '../lib/motion'
import { useMotionPref } from '../lib/motion-pref'
import { GitHubIcon, LinkedInIcon } from './Hero'
import { Chip, SectionHead } from './Section'

export function Skills() {
  const { t } = useLang()
  const { paused } = useMotionPref()
  const all = skills.flatMap((s) => s.items)
  const marqueeRef = useRef<HTMLDivElement>(null)
  const marqueeVisible = useInView(marqueeRef)
  return (
    <section id="skills" className="section">
      <div className="container">
        <SectionHead index="05" title={t(ui.sections.skills)} />
      </div>
      <div ref={marqueeRef} className={`marquee ${marqueeVisible && !paused ? '' : 'is-idle'}`} aria-hidden>
        <div className="marquee__track">
          {[...all, ...all].map((s, i) => (
            <span key={i}>
              {s}
              <i>✦</i>
            </span>
          ))}
        </div>
      </div>
      <m.div className="skills container" initial="hidden" whileInView="visible" viewport={inView} variants={stagger()}>
        {skills.map((g) => (
          <m.div key={g.group.en} className="skills__group" variants={reveal}>
            <h3 className="mono">{t(g.group)}</h3>
            <ul className="chips" role="list">
              {g.items.map((s) => (
                <Chip key={s}>{s}</Chip>
              ))}
            </ul>
          </m.div>
        ))}
      </m.div>

      <m.div className="about container" initial="hidden" whileInView="visible" viewport={inView} variants={stagger()}>
        <m.div variants={reveal}>
          <h3 className="mono">{t(ui.sections.about)}</h3>
          <p className="about__text">{t(profile.about)}</p>
        </m.div>
        <m.div variants={reveal}>
          <h3 className="mono">{t(ui.education)}</h3>
          <p>
            <strong>{t(education.field)}</strong>
            <br />
            <span className="muted">{t(education.school)}</span>
            <br />
            <span className="mono muted">{t(education.period)}</span>
          </p>
        </m.div>
      </m.div>
    </section>
  )
}

export function Contact() {
  const { t } = useLang()
  const [status, setStatus] = useState<'idle' | 'copied' | 'failed'>('idle')

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setStatus('copied')
      setTimeout(() => setStatus('idle'), 1800)
    } catch {
      setStatus('failed')
    }
  }
  const copied = status === 'copied'

  return (
    <section id="contact" className="section contact container">
      <SectionHead index="06" title={t(ui.sections.contact)} />
      <m.div initial="hidden" whileInView="visible" viewport={inView} variants={stagger()}>
        <m.p className="contact__text" variants={reveal}>
          {t(ui.contactText)}
        </m.p>
        <m.a href={`mailto:${profile.email}`} className="contact__email" variants={reveal}>
          {profile.email}
        </m.a>
        <m.div className="contact__row" variants={reveal}>
          <m.button
            type="button"
            className="btn btn--primary"
            onClick={copy}
            whileTap={{ scale: motionTokens.scale.press }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <m.span
                key={copied ? 'y' : 'n'}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: motionTokens.duration.fast }}
              >
                {copied ? (
                  <>
                    <span aria-hidden>✓</span> {t(ui.copied)}
                  </>
                ) : (
                  t(ui.copy)
                )}
              </m.span>
            </AnimatePresence>
          </m.button>
          <a href={profile.cv} download className="btn">
            {t(ui.downloadCv)} <span aria-hidden>↓</span>
          </a>
          <a href={profile.github} target="_blank" rel="noreferrer" className="icon-link" aria-label={`GitHub (${t(ui.newTab)})`}>
            <GitHubIcon />
          </a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer" className="icon-link" aria-label={`LinkedIn (${t(ui.newTab)})`}>
            <LinkedInIcon />
          </a>
        </m.div>
        {/* Kept outside the button so the announcement doesn't depend on the swap animation. */}
        <p role="status" className={status === 'failed' ? 'contact__error' : 'sr-only'}>
          {status === 'copied' ? t(ui.copied) : status === 'failed' ? t(ui.copyFailed) : ''}
        </p>
      </m.div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="footer container mono muted">
      {/* The year comes from build time in the prerendered HTML. */}
      <span suppressHydrationWarning>
        © {new Date().getFullYear()} {profile.name}
      </span>
    </footer>
  )
}
