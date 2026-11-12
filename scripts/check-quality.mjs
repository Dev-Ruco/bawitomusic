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
assert.ok(existsSync('dist/images/marca/logo-bawito-header.webp'), 'O logótipo optimizado do cabeçalho não foi encontrado')
for (const imageName of ['hero-bawito-desktop.webp','hero-bawito-tablet.webp','hero-bawito-mobile.webp']) {
  assert.ok(existsSync(`dist/images/hero/${imageName}`), `Falta fotografia hero: ${imageName}`)
}
assert.ok(html.includes('Produção técnica'), 'Título principal do Hero em falta')
assert.ok(html.includes('Estratégia, comunicação'), 'Título Sobre em falta')
assert.ok(html.includes('A nossa missão'), 'Missão em falta')
assert.ok(html.includes('O nosso objectivo'), 'Objectivo em falta')
assert.ok(html.includes('Comunicação e marketing'), 'Falta o serviço de comunicação')
assert.ok(html.includes('Estratégia e activação de marcas'), 'Falta estratégia e activação')
assert.ok(html.includes('/illustrations/servicos/comunicacao.svg'), 'SVG de comunicação não referenciado')
const illustrations = readdirSync('dist/illustrations/servicos').filter(name => name.endsWith('.svg'))
assert.equal(illustrations.length, 10, 'O catálogo deve ter 10 ilustrações SVG locais')
for (const name of ['about-bawito-desktop.webp','about-bawito-mobile.webp']) {
 assert.ok(existsSync('dist/images/equipa/'+name),'Imagem Sobre não encontrada: '+name)
}
assert.ok(html.includes('logo-bawito-header.webp'), 'O logótipo do cabeçalho não está presente no HTML')
const assets = readdirSync('dist/assets')
assert.ok(assets.some(name => name.endsWith('.css')), 'CSS em falta')
assert.ok(assets.some(name => name.endsWith('.js')), 'JavaScript em falta')
console.log('Qualidade técnica verificada: HTML, SEO, sitemap, robots e recursos.');
