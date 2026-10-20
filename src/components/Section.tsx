import { m, useInView, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { inView, motionTokens, reveal } from '../lib/motion'

export function SectionHead({ index, title, aside }: { index: string; title: string; aside?: ReactNode }) {
  return (
    <m.div className="section-head" initial="hidden" whileInView="visible" viewport={inView} variants={reveal}>
      <span className="section-head__index mono">{index}</span>
      <h2>{title}</h2>
      <m.span
        className="section-head__rule"
        aria-hidden
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={inView}
        transition={{ duration: motionTokens.duration.slower, ease: motionTokens.easing.smooth, delay: 0.15 }}
      />
      {aside}
    </m.div>
  )
}

// Plain rAF counter — keeps motion's imperative animate() out of the bundle.
export function Counter({ to, duration = 1200 }: { to: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const seen = useInView(ref, { once: true })
  const reduce = useReducedMotion()
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!seen) return
    if (reduce) {
      setValue(to)
      return
    }
    let frame = 0
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      setValue(Math.round(to * (1 - Math.pow(1 - p, 3))))
      if (p < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [seen, reduce, to, duration])

  return <span ref={ref}>{value}</span>
}

// Always rendered inside a `<ul className="chips" role="list">`.
export function Chip({ children }: { children: ReactNode }) {
  return <li className="chip">{children}</li>
}
