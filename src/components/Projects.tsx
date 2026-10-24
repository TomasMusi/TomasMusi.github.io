import { m, useInView, useScroll, useTransform } from 'motion/react'
import { useId, useRef, useState } from 'react'
import { projects, ui, type Project } from '../content'
import { useLang } from '../lib/lang'
import { inView, reveal, stagger } from '../lib/motion'
import { useMotionPref } from '../lib/motion-pref'
import { Chip, SectionHead } from './Section'

const GRID = 10 // graph spans -GRID..GRID on both axes

// Interactive y = kx + q plot — a tiny taste of what Lineárium teaches.
function LinearPlayground() {
  const { lang } = useLang()
  const [k, setK] = useState(0.8)
  const [q, setQ] = useState(1)
  const kId = useId()
  const qId = useId()
  const size = 220
  const toPx = (v: number) => ((v + GRID) / (GRID * 2)) * size
  const x1 = -GRID
  const x2 = GRID
  const line = { x1: toPx(x1), y1: size - toPx(k * x1 + q), x2: toPx(x2), y2: size - toPx(k * x2 + q) }
  const fmt = (n: number) => (n >= 0 ? `+ ${n.toFixed(1)}` : `− ${Math.abs(n).toFixed(1)}`)

  return (
    <div className="playground">
      <svg viewBox={`0 0 ${size} ${size}`} className="playground__plot" role="img" aria-label={`y = ${k.toFixed(1)}x ${fmt(q)}`}>
        {Array.from({ length: GRID * 2 + 1 }, (_, i) => (
          <g key={i} className={i === GRID ? 'axis' : 'grid'}>
            <line x1={(i / (GRID * 2)) * size} x2={(i / (GRID * 2)) * size} y1={0} y2={size} />
            <line y1={(i / (GRID * 2)) * size} y2={(i / (GRID * 2)) * size} x1={0} x2={size} />
          </g>
        ))}
        <m.line
          className="playground__line"
          animate={line}
          transition={{ type: 'spring', stiffness: 220, damping: 26 }}
          initial={false}
        />
        <m.circle
          className="playground__dot"
          r={4.5}
          cx={toPx(0)}
          animate={{ cy: size - toPx(q) }}
          transition={{ type: 'spring', stiffness: 220, damping: 26 }}
          initial={false}
        />
      </svg>
      <div className="playground__controls">
        <p className="playground__formula mono" aria-live="polite" aria-atomic="true">
          y = <b>{k.toFixed(1)}</b>x <b>{fmt(q)}</b>
        </p>
        <label htmlFor={kId} className="mono">
          k {lang === 'cs' ? '(směrnice)' : '(slope)'}
        </label>
        <input id={kId} type="range" min={-3} max={3} step={0.1} value={k} onChange={(e) => setK(+e.target.value)} />
        <label htmlFor={qId} className="mono">
          q {lang === 'cs' ? '(posun)' : '(offset)'}
        </label>
        <input id={qId} type="range" min={-6} max={6} step={0.5} value={q} onChange={(e) => setQ(+e.target.value)} />
      </div>
    </div>
  )
}

// Expanding radio signal rings around a satellite that orbits a planet.
function SignalViz() {
  const { t } = useLang()
  const ref = useRef<HTMLDivElement>(null)
  const visible = useInView(ref)
  // Infinite CSS animations are paused while scrolled away.
  return (
    <div ref={ref} className={`signal ${visible ? '' : 'is-idle'}`} aria-hidden>
      <div className="signal__planet" />
      <div className="signal__orbit">
        <div className="signal__sat">
          <span className="signal__panel" />
          <span className="signal__body" />
          <span className="signal__panel" />
        </div>
      </div>
      {[0, 1, 2, 3].map((i) => (
        <span key={i} className="signal__ring" style={{ animationDelay: `${i * 0.8}s` }} />
      ))}
      <span className="signal__label mono">{t(ui.signalLabel)}</span>
    </div>
  )
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const { t } = useLang()
  const { still } = useMotionPref()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [60, -60])

  return (
    <m.article
      ref={ref}
      id={project.id}
      className={`project project--${project.accent}`}
      initial="hidden"
      whileInView="visible"
      viewport={inView}
      variants={stagger()}
    >
      <div className="project__text">
        <m.p className="eyebrow mono" variants={reveal}>
          {String(index + 1).padStart(2, '0')} · {t(project.kicker)}
        </m.p>
        <m.h3 className="project__name" variants={reveal}>
          {project.name}
        </m.h3>
        <m.p className="project__summary" variants={reveal}>
          {t(project.summary)}
        </m.p>
        {project.body.map((b, i) => (
          <m.p key={i} className="muted" variants={reveal}>
            {t(b)}
          </m.p>
        ))}
        <m.ul className="highlights" role="list" variants={reveal}>
          {project.highlights.map((h, i) => (
            <li key={i}>{t(h)}</li>
          ))}
        </m.ul>
        <m.ul className="chips" role="list" variants={reveal}>
          {project.tech.map((tech) => (
            <Chip key={tech}>{tech}</Chip>
          ))}
          <li className="mono muted project__period">{t(project.period)}</li>
        </m.ul>
      </div>
      {/* Remounted when motion is turned off so no scroll offset lingers. */}
      <m.div key={String(still)} className="project__visual" style={still ? undefined : { y }}>
        {project.id === 'linearium' ? <LinearPlayground /> : <SignalViz />}
      </m.div>
    </m.article>
  )
}

// Wide layout for projects with a real screenshot: image on top, story left, step-by-step flow right.
function FeatureProjectCard({ project, index }: { project: Project; index: number }) {
  const { t } = useLang()
  const { still } = useMotionPref()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 30%'] })
  const scale = useTransform(scrollYProgress, [0, 1], [0.92, 1])
  const image = project.image!

  return (
    <m.article
      ref={ref}
      id={project.id}
      className={`project project--feature project--${project.accent}`}
      initial="hidden"
      whileInView="visible"
      viewport={inView}
      variants={stagger()}
    >
      <m.div key={String(still)} className="project__shot" style={still ? undefined : { scale }}>
        <img
          src={`/media/${image.src}.webp`}
          srcSet={`/media/${image.src}-sm.webp 800w, /media/${image.src}.webp 1600w`}
          sizes="(max-width: 1200px) 100vw, 1100px"
          alt={t(image.alt)}
          width={1600}
          height={900}
          loading="lazy"
          decoding="async"
        />
      </m.div>
      <div className="project__cols">
        <div className="project__text">
          <m.p className="eyebrow mono" variants={reveal}>
            {String(index + 1).padStart(2, '0')} · {t(project.kicker)}
          </m.p>
          <m.h3 className="project__name" variants={reveal}>
            {project.name}
          </m.h3>
          <m.p className="project__summary" variants={reveal}>
            {t(project.summary)}
          </m.p>
          {project.body.map((b, i) => (
            <m.p key={i} className="muted" variants={reveal}>
              {t(b)}
            </m.p>
          ))}
        </div>
        <div>
          {project.steps && (
            <>
              <m.h4 className="steps__title mono" variants={reveal}>
                {t(ui.howItWorks)}
              </m.h4>
              <m.ol className="steps" role="list" variants={stagger()}>
                {project.steps.map((step, i) => (
                  <m.li key={i} variants={reveal}>
                    <span className="steps__num mono">{String(i + 1).padStart(2, '0')}</span>
                    <div>
                      <strong>{t(step.title)}</strong>
                      <p className="muted">{t(step.text)}</p>
                    </div>
                  </m.li>
                ))}
              </m.ol>
            </>
          )}
          <m.ul className="highlights" role="list" variants={reveal}>
            {project.highlights.map((h, i) => (
              <li key={i}>{t(h)}</li>
            ))}
          </m.ul>
          <m.ul className="chips" role="list" variants={reveal}>
            {project.tech.map((tech) => (
              <Chip key={tech}>{tech}</Chip>
            ))}
            <li className="mono muted project__period">{t(project.period)}</li>
          </m.ul>
        </div>
      </div>
    </m.article>
  )
}

export function Projects() {
  const { t } = useLang()
  return (
    <section id="projects" className="section container">
      <SectionHead index="02" title={t(ui.sections.projects)} />
      <div className="projects">
        {projects.map((p, i) =>
          p.image ? (
            <FeatureProjectCard key={p.id} project={p} index={i} />
          ) : (
            <ProjectCard key={p.id} project={p} index={i} />
          ),
        )}
      </div>
    </section>
  )
}
