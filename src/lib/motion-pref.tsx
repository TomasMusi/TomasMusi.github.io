import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

// `still` = the OS asks for reduced motion OR the visitor hit the pause button (WCAG 2.2.2).
// Both start false and are read after mount, so the prerendered HTML hydrates without mismatches.
type Ctx = { paused: boolean; togglePaused: () => void; still: boolean }

const MotionPrefContext = createContext<Ctx | null>(null)

export function MotionPrefProvider({ children }: { children: ReactNode }) {
  const [paused, setPaused] = useState(false)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    try {
      setPaused(localStorage.getItem('motion') === 'off')
    } catch {
      // storage unavailable — keep animations on
    }
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    document.documentElement.dataset.motion = paused ? 'off' : 'on'
  }, [paused])

  const togglePaused = () =>
    setPaused((p) => {
      try {
        localStorage.setItem('motion', p ? 'on' : 'off')
      } catch {
        // ignore
      }
      return !p
    })

  return (
    <MotionPrefContext.Provider value={{ paused, togglePaused, still: paused || reduced }}>{children}</MotionPrefContext.Provider>
  )
}

export function useMotionPref() {
  const ctx = useContext(MotionPrefContext)
  if (!ctx) throw new Error('useMotionPref must be used inside MotionPrefProvider')
  return ctx
}
