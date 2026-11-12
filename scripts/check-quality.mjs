import { readFileSync, existsSync, readdirSync } from 'node:fs'
import { strict as assert } from 'node:assert'

const read = path => readFileSync(path, 'utf8')
const html = read('dist/index.html')
const robots = read('dist/robots.txt')
const sitemap = read('dist/sitemap.xml')
for (const fragment of [
  '<html lang="pt-MZ">',
  'rel="canonical" href="https://bawitomusic.co.mz/"',
  'property="og:url"',
  'application/ld+json',
  'name="description"',
  'fetchpriority="high"',
  '<h1',
  'id="contactos"',
  'Eventos corporativos',
]) assert.ok(html.includes(fragment), `Falta elemento SEO/performance: ${fragment}`)
assert.ok(robots.includes('Sitemap: https://bawitomusic.co.mz/sitemap.xml'))
assert.ok(sitemap.includes('<loc>https://bawitomusic.co.mz/</loc>'))
assert.ok(existsSync('dist/favicon.svg'))
const assets = readdirSync('dist/assets')
assert.ok(assets.some(name => name.endsWith('.css')), 'CSS em falta')
assert.ok(assets.some(name => name.endsWith('.js')), 'JavaScript em falta')
console.log('Qualidade técnica verificada: HTML, SEO, sitemap, robots e recursos.');
