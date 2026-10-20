import type { Transition, Variants } from 'motion/react'

export const motionTokens = {
  duration: { fast: 0.18, normal: 0.32, slow: 0.6, slower: 0.9 },
  easing: {
    smooth: [0.22, 1, 0.36, 1] as [number, number, number, number],
    out: [0.16, 1, 0.3, 1] as [number, number, number, number],
  },
  distance: { sm: 8, md: 16, lg: 32, xl: 64 },
  scale: { press: 0.97, subtle: 0.98, pop: 1.03 },
  stagger: { tight: 0.05, normal: 0.08 },
}

export const springs: Record<'snappy' | 'gentle' | 'soft', Transition> = {
  snappy: { type: 'spring', stiffness: 420, damping: 30 },
  gentle: { type: 'spring', stiffness: 160, damping: 24 },
  soft: { type: 'spring', stiffness: 80, damping: 20 },
}

export const reveal: Variants = {
  hidden: { opacity: 0, y: motionTokens.distance.lg },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: motionTokens.duration.slow, ease: motionTokens.easing.smooth },
  },
}

export const stagger = (delay = 0): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: motionTokens.stagger.normal, delayChildren: delay } },
})

export const inView = { once: true, margin: '-80px' } as const
