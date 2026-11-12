import { readFileSync, existsSync, readdirSync } from 'node:fs'
import { strict as assert } from 'node:assert'
import sharp from 'sharp'

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
assert.ok(html.includes('id="aluguer"'), 'Secção de aluguer em falta')
assert.ok(html.includes('Ar condicionado vertical'), 'Ar condicionado vertical em falta')
assert.ok(html.includes('Geradores industriais'), 'Geradores industriais em falta')
for (const name of [
  'tendas-480.webp', 'tendas-820.webp',
  'geradores-480.webp', 'geradores-820.webp',
  'palcos-480.webp', 'palcos-820.webp',
  'ecras-480.webp', 'ecras-820.webp',
  'sanitarios-480.webp', 'sanitarios-820.webp',
  'ar-condicionado-vertical.webp'
]) assert.ok(existsSync('dist/images/aluguer/' + name), 'Fotografia de aluguer em falta: ' + name)
assert.equal((html.match(/class="rental-card reveal"/g) || []).length, 6, 'A secção de aluguer deve apresentar exactamente seis cartões')
assert.ok(html.includes('Ecrãs LED e Monitores'), 'O aluguer de ecrãs está ausente')
assert.ok(html.includes('Sanitários Móveis para Eventos'), 'O aluguer de sanitários está ausente')
assert.ok(html.includes('PROJECTOS &amp; REALIZAÇÕES') || html.includes('PROJECTOS & REALIZAÇÕES'), 'Portefólio não identificado')
assert.equal((html.match(/class="gallery-item reveal"/g) || []).length, 8, 'O portefólio deve ter oito imagens locais')
assert.ok(html.includes('Conferências institucionais'), 'Portefólio de conferências em falta')
assert.ok(html.includes('mr-bow-liloca-desktop.webp'), 'Fotografia dos artistas ausente da secção de entretenimento')
assert.ok(html.includes('artist-visual artist-cutout'), 'Artistas não integrados na secção azul')
assert.ok(!html.includes('artist-photo-caption'), 'Legenda duplicada não removida')

assert.ok(html.includes('mr-bow-liloca-mobile.webp'), 'Versão móvel dos artistas ausente')
for (const variant of ['mobile','desktop']) {
  assert.ok(existsSync('dist/images/artistas/mr-bow-liloca-' + variant + '.webp'), 'Imagem dos artistas não encontrada: ' + variant)
}
assert.ok(html.includes('Conhecer Mr Bow') && html.includes('Conhecer Liloca'), 'Ligações aos artistas ausentes')
for (const variant of ['mobile', 'desktop']) {
  const metadata = await sharp('dist/images/artistas/mr-bow-liloca-' + variant + '.webp').metadata()
  assert.ok(metadata.hasAlpha, 'A fotografia dos artistas deve ter fundo transparente: ' + variant)
}

assert.ok(html.includes('Grandes palcos'), 'Portefólio de palcos em falta')
assert.ok(!html.includes('A galeria de projectos reais será actualizada'), 'Texto antigo do portefólio detectado')
for (const id of ["conferencias-institucionais","eventos-empresariais","bastidores-tecnicos","reunioes-direccao","cerimonias-publicas","tendas-e-estruturas","espectaculos-ao-vivo","grandes-palcos"]) {
  for (const width of [400, 800, 1200])
    assert.ok(existsSync('dist/images/projectos/optimizadas/' + id + '-' + width + '.webp'), 'Imagem optimizada em falta: ' + id + '-' + width)
}

assert.ok(!html.includes('Aluguer — Mesas e mobiliário'), 'Equipamento removido ainda aparece no site')

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
