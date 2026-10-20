import { AnimatePresence, m } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { gallery, ui } from '../content'
import { useLang } from '../lib/lang'
import { inView, motionTokens, springs } from '../lib/motion'
import { SectionHead } from './Section'

function Lightbox({ index, onClose, onStep }: { index: number; onClose: () => void; onStep: (d: number) => void }) {
  const { t } = useLang()
  const dialogRef = useRef<HTMLDivElement>(null)
  const photo = gallery[index]
  const position = `${String(index + 1).padStart(2, '0')} / ${String(gallery.length).padStart(2, '0')}`

  // Warm the cache for the neighbours so stepping doesn't show an empty frame.
  useEffect(() => {
    for (const d of [1, -1]) new Image().src = `/media/${gallery[(index + d + gallery.length) % gallery.length].src}.webp`
  }, [index])

  useEffect(() => {
    const prevFocus = document.activeElement as HTMLElement | null
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    // The dialog is portalled to <body>, so the whole page behind it can go inert.
    const background = [...document.querySelectorAll<HTMLElement>('#root > *')]
    for (const el of background) el.inert = true
    dialogRef.current?.querySelector<HTMLButtonElement>('.lightbox__close')?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') onStep(1)
      else if (e.key === 'ArrowLeft') onStep(-1)
      else if (e.key === 'Tab' && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>('button')
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      for (const el of background) el.inert = false
      document.body.style.overflow = prevOverflow
      prevFocus?.focus()
    }
  }, [onClose, onStep])

  return createPortal(
    <m.div
      className="lightbox"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: motionTokens.duration.normal }}
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={t(ui.galleryDialog)}
        className="lightbox__panel"
        onClick={(e) => e.stopPropagation()}
      >
        <AnimatePresence mode="wait">
          <m.figure
            key={photo.src}
            initial={{ opacity: 0, scale: motionTokens.scale.press, y: motionTokens.distance.sm }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: motionTokens.scale.press, y: -motionTokens.distance.sm }}
            transition={springs.gentle}
          >
            <img src={`/media/${photo.src}.webp`} alt={t(photo.alt)} decoding="async" />
            <figcaption className="mono" aria-hidden>
              {position} — {t(photo.alt)}
            </figcaption>
          </m.figure>
        </AnimatePresence>
        <p className="sr-only" aria-live="polite" aria-atomic="true">
          {position}: {t(photo.alt)}
        </p>
        <button type="button" className="lightbox__btn lightbox__prev" onClick={() => onStep(-1)} aria-label={t(ui.prev)}>
          ←
        </button>
        <button type="button" className="lightbox__btn lightbox__next" onClick={() => onStep(1)} aria-label={t(ui.next)}>
          →
        </button>
        <button type="button" className="lightbox__btn lightbox__close" onClick={onClose} aria-label={t(ui.close)}>
          ✕
        </button>
      </div>
    </m.div>,
    document.body,
  )
}

export function Gallery() {
  const { t } = useLang()
  const [open, setOpen] = useState<number | null>(null)
  const close = useCallback(() => setOpen(null), [])
  const step = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + gallery.length) % gallery.length)), [])

  return (
    <section id="gallery" className="section container">
      <SectionHead index="04" title={t(ui.sections.gallery)} aside={<span className="mono muted">{t(ui.galleryAside)}</span>} />
      <ul className="gallery" role="list">
        {gallery.map((p, i) => (
          <m.li
            key={p.src}
            className={p.tall ? 'is-tall' : ''}
            initial={{ opacity: 0, y: motionTokens.distance.lg, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={inView}
            transition={{ duration: motionTokens.duration.slow, ease: motionTokens.easing.smooth, delay: (i % 3) * 0.08 }}
          >
            <button type="button" onClick={() => setOpen(i)} aria-haspopup="dialog">
              <img
                src={`/media/${p.src}-sm.webp`}
                alt={t(p.alt)}
                loading="lazy"
                decoding="async"
                width={p.tall ? 480 : 720}
                height={p.tall ? 720 : 480}
              />
              <span className="gallery__caption" aria-hidden>
                {t(p.alt)}
              </span>
            </button>
          </m.li>
        ))}
      </ul>
      <AnimatePresence>{open !== null && <Lightbox key="lightbox" index={open} onClose={close} onStep={step} />}</AnimatePresence>
    </section>
  )
}
