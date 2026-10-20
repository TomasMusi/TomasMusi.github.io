import { meta, profile, skills, type Lang } from '../content.ts'

export const langPath: Record<Lang, string> = { cs: '/', en: '/en/' }
export const locale: Record<Lang, string> = { cs: 'cs_CZ', en: 'en_US' }

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// <head> tags for one language. Absolute-URL tags (canonical, hreflang, og:url, og:image) need the
// production origin, so they're only emitted once VITE_SITE_URL is set.
export function headTags(lang: Lang, siteUrl = ''): string {
  const site = siteUrl.replace(/\/$/, '')
  const other: Lang = lang === 'cs' ? 'en' : 'cs'
  const tags = [
    `<title>${esc(meta.title[lang])}</title>`,
    `<meta name="description" content="${esc(meta.description[lang])}" />`,
    `<meta name="robots" content="index,follow,max-image-preview:large" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${esc(profile.name)}" />`,
    `<meta property="og:title" content="${esc(meta.title[lang])}" />`,
    `<meta property="og:description" content="${esc(meta.description[lang])}" />`,
    `<meta property="og:locale" content="${locale[lang]}" />`,
    `<meta property="og:locale:alternate" content="${locale[other]}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(meta.title[lang])}" />`,
    `<meta name="twitter:description" content="${esc(meta.description[lang])}" />`,
  ]
  if (site) {
    tags.push(
      `<link rel="canonical" href="${site}${langPath[lang]}" />`,
      `<link rel="alternate" hreflang="cs" href="${site}${langPath.cs}" />`,
      `<link rel="alternate" hreflang="en" href="${site}${langPath.en}" />`,
      `<link rel="alternate" hreflang="x-default" href="${site}${langPath.cs}" />`,
      `<meta property="og:url" content="${site}${langPath[lang]}" />`,
      `<meta property="og:image" content="${site}/media/og.jpg" />`,
      `<meta property="og:image:width" content="1200" />`,
      `<meta property="og:image:height" content="630" />`,
      `<meta property="og:image:alt" content="${esc(meta.ogImageAlt[lang])}" />`,
      `<meta name="twitter:image" content="${site}/media/og.jpg" />`,
    )
  }
  tags.push(`<script type="application/ld+json">${JSON.stringify(personLd(lang, site)).replace(/</g, '\\u003c')}</script>`)
  return tags.join('\n    ')
}

function personLd(lang: Lang, site: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    jobTitle: profile.role[lang],
    description: meta.description[lang],
    email: `mailto:${profile.email}`,
    address: { '@type': 'PostalAddress', addressLocality: 'Brno', addressCountry: 'CZ' },
    worksFor: { '@type': 'Organization', name: 'HAVEL & PARTNERS' },
    alumniOf: { '@type': 'EducationalOrganization', name: 'EDUCAnet Brno' },
    knowsAbout: skills.flatMap((g) => g.items),
    sameAs: [profile.github, profile.linkedin],
    ...(site && { url: site + langPath[lang], image: `${site}/media/portrait.webp` }),
  }
}

export function sitemapXml(siteUrl: string): string {
  const site = siteUrl.replace(/\/$/, '')
  const alternates = (['cs', 'en'] as const)
    .map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${site}${langPath[l]}" />`)
    .concat(`    <xhtml:link rel="alternate" hreflang="x-default" href="${site}${langPath.cs}" />`)
    .join('\n')
  const urls = (['cs', 'en'] as const).map((l) => `  <url>\n    <loc>${site}${langPath[l]}</loc>\n${alternates}\n  </url>`).join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`
}

export function robotsTxt(siteUrl: string): string {
  const site = siteUrl.replace(/\/$/, '')
  return `User-agent: *\nAllow: /\n${site ? `\nSitemap: ${site}/sitemap.xml\n` : ''}`
}
