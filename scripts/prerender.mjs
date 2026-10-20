// Renders the app to static HTML for both languages (`/` and `/en/`), so crawlers and link previews
// see real content without running JS. Runs after `vite build` + the SSR build into dist-ssr/.
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'

const ssr = await import('../dist-ssr/entry-server.js')
const template = await readFile('dist/index.html', 'utf8')
const site = ssr.siteUrl.replace(/\/$/, '')
if (site && !/^https?:\/\/[^\s"'<>]+$/.test(site)) throw new Error(`VITE_SITE_URL is not a valid URL: ${site}`)

const pages = { cs: 'dist/index.html', en: 'dist/en/index.html' }
for (const [lang, file] of Object.entries(pages)) {
  // Function replacements, so a `$&` etc. in the content can't be read as a replacement pattern.
  const html = template
    .replace('<html lang="cs">', `<html lang="${lang}">`)
    .replace('<!--app-head-->', () => ssr.headTags(lang, site))
    .replace('<!--app-html-->', () => ssr.render(lang))
  await mkdir(file.slice(0, file.lastIndexOf('/')), { recursive: true })
  await writeFile(file, html)
}

await writeFile('dist/robots.txt', ssr.robotsTxt(site))
if (site) {
  await writeFile('dist/sitemap.xml', ssr.sitemapXml(site))
} else {
  console.warn(
    '\n⚠ VITE_SITE_URL is not set (see .env) — canonical, hreflang, og:image and sitemap.xml were skipped.\n',
  )
}

await rm('dist-ssr', { recursive: true, force: true })
console.log(`prerendered ${Object.values(pages).join(', ')}`)
