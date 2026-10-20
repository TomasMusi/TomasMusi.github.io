import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import { headTags } from './src/lib/head.ts'

// Inline the (small) stylesheet into index.html so first paint doesn't wait on an extra request.
function inlineCss(): Plugin {
  return {
    name: 'inline-css',
    apply: 'build',
    enforce: 'post',
    generateBundle(_, bundle) {
      const html = Object.values(bundle).find((f) => f.fileName === 'index.html')
      if (!html || html.type !== 'asset') return
      let source = String(html.source)
      for (const file of Object.values(bundle)) {
        if (file.type !== 'asset' || !file.fileName.endsWith('.css')) continue
        const tag = new RegExp(`<link rel="stylesheet"[^>]*href="/${file.fileName}"[^>]*>`)
        if (!tag.test(source)) continue
        source = source.replace(tag, () => `<style>${String(file.source)}</style>`)
        delete bundle[file.fileName]
      }
      html.source = source
    },
  }
}

// Preload the fonts the hero paints with. Their file names are hashed, so they can only be found here.
// latin-ext is included for Bricolage because the name in the h1 ("Tomáš") needs it.
const preloadedFonts = [/bricolage-grotesque-latin-wght-normal/, /bricolage-grotesque-latin-ext-wght-normal/, /geist-latin-wght-normal/]

function preloadFonts(): Plugin {
  return {
    name: 'preload-fonts',
    apply: 'build',
    enforce: 'post',
    generateBundle(_, bundle) {
      const html = Object.values(bundle).find((f) => f.fileName === 'index.html')
      if (!html || html.type !== 'asset') return
      const links = Object.keys(bundle)
        .filter((name) => name.endsWith('.woff2') && preloadedFonts.some((re) => re.test(name)))
        .map((name) => `<link rel="preload" as="font" type="font/woff2" href="/${name}" crossorigin />`)
      html.source = String(html.source).replace('<!--app-head-->', `<!--app-head-->\n    ${links.join('\n    ')}`)
    },
  }
}

// Dev server: fill the head the same way scripts/prerender.mjs does for production.
function devHead(siteUrl: string): Plugin {
  return {
    name: 'dev-head',
    apply: 'serve',
    transformIndexHtml(html, ctx) {
      const lang = /^\/en(\/|$)/.test(ctx.originalUrl ?? ctx.path) ? 'en' : 'cs'
      return html.replace('<html lang="cs">', `<html lang="${lang}">`).replace('<!--app-head-->', () => headTags(lang, siteUrl))
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), inlineCss(), preloadFonts(), devHead(loadEnv(mode, process.cwd(), 'VITE_').VITE_SITE_URL ?? '')],
}))
