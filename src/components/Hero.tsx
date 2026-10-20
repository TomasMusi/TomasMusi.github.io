import { m, useInView, useMotionValue, useSpring, useTransform } from 'motion/react'
import { useRef } from 'react'
import { profile, ui } from '../content'
import { useLang } from '../lib/lang'
import { motionTokens } from '../lib/motion'
import { useMotionPref } from '../lib/motion-pref'

// A sampled sine wave doubles as a nod to Lineárium (functions) and YSpace (radio signals).
function wavePath(width: number, height: number, cycles: number, amp: number) {
  const pts: string[] = []
  for (let x = 0; x <= width; x += 6) {
    const y = height / 2 + Math.sin((x / width) * Math.PI * 2 * cycles) * amp * (0.35 + (x / width) * 0.65)
    pts.push(`${x === 0 ? 'M' : 'L'}${x},${y.toFixed(1)}`)
  }
  return pts.join(' ')
}

const letter = {
  hidden: { y: '110%' },
  visible: (i: number) => ({
    y: '0%',
    transition: { delay: 0.35 + i * 0.04, duration: motionTokens.duration.slower, ease: motionTokens.easing.out },
  }),
}

export function Hero() {
  const { t } = useLang()
  const { still } = useMotionPref()
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 60, damping: 18 })
  const sy = useSpring(my, { stiffness: 60, damping: 18 })
  const portraitX = useTransform(sx, (v) => v * 14)
  const portraitY = useTransform(sy, (v) => v * 14)
  const waveX = useTransform(sx, (v) => v * -24)

  const rect = useRef<DOMRect | null>(null)
  const portraitRef = useRef<HTMLDivElement>(null)
  const portraitVisible = useInView(portraitRef)

  // Mouse-only parallax. The rect is cached on enter so pointermove never forces a layout read.
  const onEnter = (e: React.PointerEvent<HTMLElement>) => {
    rect.current = e.currentTarget.getBoundingClientRect()
  }
  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    if (still || e.pointerType !== 'mouse') return
    const r = (rect.current ??= e.currentTarget.getBoundingClientRect())
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }
  const onLeave = () => {
    rect.current = null
    mx.set(0)
    my.set(0)
  }

  const [first, last] = profile.name.split(' ')

  return (
    <section id="top" className="hero" onPointerEnter={onEnter} onPointerMove={onMove} onPointerLeave={onLeave}>
      <m.svg className="hero__wave" viewBox="0 0 1440 400" preserveAspectRatio="none" style={{ x: waveX }} aria-hidden>
        {[0, 1, 2].map((i) => (
          <m.path
            key={i}
            d={wavePath(1440, 400, 2.5 + i * 0.75, 120 - i * 34)}
            fill="none"
            stroke={i === 0 ? 'var(--accent)' : 'var(--line-strong)'}
            strokeWidth={i === 0 ? 2 : 1}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2.4, delay: 0.2 + i * 0.25, ease: motionTokens.easing.smooth }}
          />
        ))}
      </m.svg>

      <div className="hero__inner container">
        <div className="hero__text">
          <m.p
            className="eyebrow"
            initial={{ opacity: 0, y: motionTokens.distance.sm }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: motionTokens.duration.slow }}
          >
            <span className="dot dot--live" aria-hidden /> {t(ui.available)} · {t(profile.location)}
          </m.p>

          <h1 className="hero__name">
            <span className="sr-only">{profile.name}</span>
            {[first, last].map((word, w) => (
              <span key={word} className="hero__line" aria-hidden>
                {[...word].map((ch, i) => (
                  <span key={i} className="hero__clip">
                    <m.span
                      className={w === 1 ? 'hero__char hero__char--accent' : 'hero__char'}
                      variants={letter}
                      initial="hidden"
                      animate="visible"
                      custom={w * first.length + i}
                    >
                      {ch}
                    </m.span>
                  </span>
                ))}
              </span>
            ))}
          </h1>

          <m.div
            // Transform-only entrance: the intro paragraph is the LCP element, so it must never start at opacity 0.
            initial={{ y: motionTokens.distance.md }}
            animate={{ y: 0 }}
            transition={{ delay: 0.5, duration: motionTokens.duration.slow, ease: motionTokens.easing.smooth }}
          >
            <p className="hero__role mono">{t(profile.role)}</p>
            <p className="hero__intro">{t(profile.intro)}</p>
            <div className="hero__cta">
              <m.a
                href="#contact"
                className="btn btn--primary"
                whileHover={{ scale: motionTokens.scale.pop }}
                whileTap={{ scale: motionTokens.scale.press }}
              >
                {t(ui.contactMe)} <span aria-hidden>→</span>
              </m.a>
              <m.a
                href={profile.cv}
                download
                className="btn"
                whileHover={{ scale: motionTokens.scale.pop }}
                whileTap={{ scale: motionTokens.scale.press }}
              >
                {t(ui.downloadCv)} <span aria-hidden>↓</span>
              </m.a>
              <a href={profile.github} target="_blank" rel="noreferrer" className="icon-link" aria-label={`GitHub (${t(ui.newTab)})`}>
                <GitHubIcon />
              </a>
              <a href={profile.linkedin} target="_blank" rel="noreferrer" className="icon-link" aria-label={`LinkedIn (${t(ui.newTab)})`}>
                <LinkedInIcon />
              </a>
            </div>
          </m.div>
        </div>

        <m.div
          ref={portraitRef}
          className={`hero__portrait ${portraitVisible ? '' : 'is-idle'}`}
          style={{ x: portraitX, y: portraitY }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: motionTokens.duration.slower, ease: motionTokens.easing.out }}
        >
          <div className="orbit orbit--outer" aria-hidden>
            <span className="orbit__sat" />
          </div>
          <div className="orbit orbit--inner" aria-hidden>
            <span className="orbit__sat orbit__sat--mint" />
          </div>
          <img
            src="/media/portrait.webp"
            srcSet="/media/portrait-sm.webp 360w, /media/portrait.webp 600w"
            sizes="(max-width: 960px) 220px, 310px"
            alt={t(ui.portraitAlt)}
            width={600}
            height={600}
            fetchPriority="high"
            decoding="async"
          />
        </m.div>
      </div>

      <m.a
        href="#work"
        className="hero__scroll mono"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        aria-label={`scroll — ${t(ui.scroll)}`}
      >
        <span className="hero__scroll-line" aria-hidden />
        scroll
      </m.a>
    </section>
  )
}

export function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden>
      <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  )
}

export function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    </svg>
  )
}
