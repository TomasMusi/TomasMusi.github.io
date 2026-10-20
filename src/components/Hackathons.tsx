import { m, useMotionValue, useScroll, useTransform, type MotionValue } from 'motion/react'
import { useRef, useState } from 'react'
import { awards, juniorHack, rakathon, ui } from '../content'
import { useLang } from '../lib/lang'
import { inView, motionTokens, reveal, stagger } from '../lib/motion'
import { useMotionPref } from '../lib/motion-pref'
import { SectionHead } from './Section'

const stack = [
  { src: 'pitch-2', rotate: -6, x: -18 },
  { src: 'teamwork', rotate: 4, x: 22 },
  { src: 'finalists', rotate: -2, x: 0 },
]

function PhotoStack() {
  const { t } = useLang()
  const { still } = useMotionPref()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] })
  const spread = useTransform(scrollYProgress, [0, 1], [0, 1])
  const fannedOut = useMotionValue(1)

  // One description for the whole stack; the individual photos are decorative.
  // With motion off the stack is shown already fanned out (remounted so no scroll-driven value lingers).
  return (
    <div className="stack" ref={ref} role="img" aria-label={t(ui.photoStack)}>
      {stack.map((p, i) => (
        <StackPhoto key={`${p.src}-${still}`} {...p} i={i} spread={still ? fannedOut : spread} />
      ))}
    </div>
  )
}

function StackPhoto({
  src,
  rotate,
  x,
  i,
  spread,
}: {
  src: string
  rotate: number
  x: number
  i: number
  spread: MotionValue<number>
}) {
  const r = useTransform(spread, [0, 1], [0, rotate])
  const tx = useTransform(spread, [0, 1], [0, x * 4])
  const ty = useTransform(spread, [0, 1], [40, i * 18])
  return (
    <m.img
      className="stack__photo"
      src={`/media/${src}-sm.webp`}
      alt=""
      loading="lazy"
      decoding="async"
      style={{ rotate: r, x: tx, y: ty, zIndex: i }}
      whileHover={{ scale: 1.04, rotate: 0, zIndex: 10 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
    />
  )
}

function Video() {
  const { t } = useLang()
  const ref = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)

  const play = () => {
    const v = ref.current
    if (!v) return
    v.controls = true
    // The play button unmounts once playing, so hand focus to the (now focusable) video.
    v.focus()
    setPlaying(true)
    v.play().catch(() => {
      // Autoplay refused (e.g. power saving) — the native controls are already showing.
    })
  }

  return (
    <m.figure className="video" variants={reveal}>
      <div className="video__frame">
        <video
          ref={ref}
          src="/media/att-hackathon.mp4"
          poster="/media/att-poster.webp"
          preload="none"
          playsInline
          width={432}
          height={790}
          aria-label={t(ui.videoLabel)}
        />
        {!playing && (
          <m.button
            type="button"
            className="video__play"
            onClick={play}
            aria-label={t(ui.playVideo)}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: motionTokens.scale.press }}
          >
            <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden>
              <path d="M8 5v14l11-7z" fill="currentColor" />
            </svg>
          </m.button>
        )}
      </div>
      <figcaption className="mono">{t(ui.videoCaption)}</figcaption>
    </m.figure>
  )
}

export function Hackathons() {
  const { t } = useLang()
  return (
    <section id="hackathons" className="section container">
      <SectionHead index="03" title={t(ui.sections.hackathons)} />

      <m.div className="feature" initial="hidden" whileInView="visible" viewport={inView} variants={stagger()}>
        <div className="feature__text">
          <m.p className="eyebrow mono" variants={reveal}>
            <span className="dot" aria-hidden /> Rakathon 2026 · PillGaze
          </m.p>
          <m.h3 variants={reveal}>{t(rakathon.title)}</m.h3>
          {rakathon.body.map((b, i) => (
            <m.p key={i} className="muted" variants={reveal}>
              {t(b)}
            </m.p>
          ))}
          <m.p className="team mono" variants={reveal}>
            {t(ui.team)}: {rakathon.team}
          </m.p>
          <m.a href="#pillsken" className="btn feature__link" variants={reveal}>
            {t(ui.moreAbout)} <span aria-hidden>→</span>
          </m.a>
        </div>
        <PhotoStack />
      </m.div>

      <m.div className="feature feature--reverse" initial="hidden" whileInView="visible" viewport={inView} variants={stagger()}>
        <Video />
        <div className="feature__text">
          <m.p className="eyebrow mono" variants={reveal}>
            <span className="dot dot--mint" aria-hidden /> AT&T · 2025
          </m.p>
          <m.h3 variants={reveal}>{t(juniorHack.title)}</m.h3>
          <m.p className="muted" variants={reveal}>
            {t(juniorHack.body)}
          </m.p>
          <m.p className="team mono" variants={reveal}>
            {t(ui.team)}: {juniorHack.team}
          </m.p>

          <m.ul className="awards" role="list" variants={stagger(0.1)}>
            {awards.map((a) => (
              <m.li key={a.name} variants={reveal}>
                <span className="awards__name">{a.name}</span>
                <span className="awards__result">{a.result ? t(a.result) : ''}</span>
                <span className="mono muted">{a.year ?? ''}</span>
              </m.li>
            ))}
          </m.ul>
        </div>
      </m.div>
    </section>
  )
}
