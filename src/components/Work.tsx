import { m, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { awards, jobs, projects, skills, ui } from '../content'
import { useLang } from '../lib/lang'
import { inView, motionTokens, reveal, stagger } from '../lib/motion'
import { useMotionPref } from '../lib/motion-pref'
import { Counter, SectionHead } from './Section'

export function Stats() {
  const { t } = useLang()
  const items = [
    { value: <Counter to={jobs.length} />, label: t(ui.stats.years) },
    { value: <Counter to={awards.length} />, label: t(ui.stats.hacks) },
    { value: <Counter to={projects.length} />, label: t(ui.stats.projects) },
    { value: <Counter to={skills.flatMap((g) => g.items).length} />, label: t(ui.stats.tech) },
  ]
  return (
    <m.ul className="stats container" role="list" initial="hidden" whileInView="visible" viewport={inView} variants={stagger()}>
      {items.map((s, i) => (
        <m.li key={i} variants={reveal}>
          <span className="stats__value">
            {s.value}
          </span>
          <span className="stats__label">{s.label}</span>
        </m.li>
      ))}
    </m.ul>
  )
}

export function Work() {
  const { t } = useLang()
  const { still } = useMotionPref()
  const ref = useRef<HTMLOListElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 60%'] })
  const fill = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <section id="work" className="section container">
      <SectionHead index="01" title={t(ui.sections.work)} />
      <ol className="timeline" role="list" ref={ref}>
        {/* With motion off the line is simply drawn in full. */}
        {still ? (
          <span className="timeline__fill" aria-hidden />
        ) : (
          <m.span className="timeline__fill" style={{ scaleY: fill }} aria-hidden />
        )}
        {jobs.map((job) => (
          <m.li
            key={job.company}
            className="timeline__item"
            initial="hidden"
            whileInView="visible"
            viewport={inView}
            variants={stagger()}
          >
            <span className={`timeline__node ${job.current ? 'is-current' : ''}`} aria-hidden />
            <m.div className="timeline__meta" variants={reveal}>
              <span className="mono">{t(job.period)}</span>
              <span className="muted">{t(job.kind)}</span>
            </m.div>
            <m.div className="timeline__body" variants={reveal}>
              <h3>
                {t(job.role)} <span className="at" aria-hidden>@</span>
                <span className="sr-only"> {t(ui.at)} </span> <span className="company">{job.company}</span>
              </h3>
              <ul className="bullets" role="list">
                {job.points.map((p, i) => (
                  <li key={i}>{t(p)}</li>
                ))}
              </ul>
              <m.ul className="chips" role="list" variants={stagger(0.1)}>
                {job.tech.map((tech) => (
                  <m.li
                    key={tech}
                    className="chip"
                    variants={{
                      hidden: { opacity: 0, scale: 0.8 },
                      visible: { opacity: 1, scale: 1, transition: { duration: motionTokens.duration.normal } },
                    }}
                  >
                    {tech}
                  </m.li>
                ))}
              </m.ul>
            </m.div>
          </m.li>
        ))}
      </ol>
    </section>
  )
}
