import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { meta, type Lang, type T } from '../content'
import { langPath, locale } from './head'

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (v: T) => string }

const LangContext = createContext<Ctx | null>(null)

// The URL is the single source of truth: `/` is Czech, `/en/` is English (both prerendered).
export function langFromPath(path: string): Lang {
  return /^\/en(\/|$)/.test(path) ? 'en' : 'cs'
}

export function LangProvider({ initial, children }: { initial: Lang; children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initial)

  useEffect(() => {
    const onPop = () => setLangState(langFromPath(location.pathname))
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
    applyMeta(lang)
  }, [lang])

  const setLang = (l: Lang) => {
    if (l === lang) return
    history.pushState(null, '', langPath[l] + location.hash)
    setLangState(l)
  }

  return <LangContext.Provider value={{ lang, setLang, t: (v) => v[lang] }}>{children}</LangContext.Provider>
}

export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be used inside LangProvider')
  return ctx
}

// Client-side language switch: keep the tags a user (or a share) can see in sync without a reload.
export function applyMeta(lang: Lang) {
  document.title = meta.title[lang]
  const set = (selector: string, value: string) => document.head.querySelector(selector)?.setAttribute('content', value)
  for (const s of ['meta[name="description"]', 'meta[property="og:description"]', 'meta[name="twitter:description"]']) {
    set(s, meta.description[lang])
  }
  set('meta[property="og:title"]', meta.title[lang])
  set('meta[name="twitter:title"]', meta.title[lang])
  set('meta[property="og:locale"]', locale[lang])
  set('meta[property="og:locale:alternate"]', locale[lang === 'cs' ? 'en' : 'cs'])
  set('meta[property="og:image:alt"]', meta.ogImageAlt[lang])
  const canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (canonical) {
    canonical.href = new URL(langPath[lang], canonical.href).href
    set('meta[property="og:url"]', canonical.href)
  }
}
