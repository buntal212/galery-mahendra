export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const siteUrl = String(config.public.siteUrl).replace(/\/+$/, '')
  const urls = new Set<string>([`${siteUrl}/`])
  const apiBase = String(config.public.apiBase).replace(/\/+$/, '')

  try {
    for (let page = 1; page <= 1999; page += 1) {
      const response = await $fetch(`${apiBase}/catalog/products`, { query: { page } })

      for (const product of response.data || []) {
        const slug = String(product.slug || '')
        const indexable = product.indexable

        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) continue
        if (
          indexable === false ||
          indexable === 0 ||
          (typeof indexable === 'string' && ['0', 'false'].includes(indexable.toLowerCase()))
        ) continue

        const detailUrl = `${siteUrl}/products/${encodeURIComponent(slug)}`
        const canonicalUrl = String(product.canonical_url || '').trim()

        if (canonicalUrl) {
          try {
            const parsedCanonical = new URL(canonicalUrl)
            if (parsedCanonical.origin !== siteUrl) continue
            urls.add(parsedCanonical.toString())
            continue
          } catch {
            // Ignore malformed product canonical URLs and use the slug URL.
          }
        }

        urls.add(detailUrl)
      }

      if (!response.next_page_url) break
    }
  } catch {
    // Keep the home page available in the sitemap if the catalog API is temporarily down.
  }

  const escapeXml = (value: string) => value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
  const entries = [...urls]
    .map((url) => `<url><loc>${escapeXml(url)}</loc></url>`)
    .join('')

  setResponseHeader(event, 'content-type', 'application/xml; charset=utf-8')
  setResponseHeader(event, 'cache-control', 'public, max-age=300, s-maxage=900')

  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}</urlset>`
})
