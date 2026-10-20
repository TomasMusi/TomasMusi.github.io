import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App.tsx'
import type { Lang } from './content'

export { headTags, robotsTxt, sitemapXml } from './lib/head'

export const siteUrl: string = import.meta.env.VITE_SITE_URL ?? ''

export function render(lang: Lang) {
  return renderToString(
    <StrictMode>
      <App lang={lang} />
    </StrictMode>,
  )
}
