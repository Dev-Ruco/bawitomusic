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
assert.ok(html.includes('rel="icon" type="image/webp" href="/images/marca/logo-bawito-header.webp"'), 'Deve ser usada a identidade oficial no favicon')
assert.ok(!html.includes('/favicon.svg') && !html.includes('/og-cover.svg'), 'Não usar símbolos gráficos inventados')
assert.ok(html.includes('og:image:alt'), 'A imagem de partilha deve ter descrição')
assert.ok(existsSync('dist/images/hero/Empty-Auditorium-Technical-Rehearsal-_1__Easy-Resize.com.jpg'), 'A fotografia de partilha deve existir')
assert.ok(existsSync('dist/images/marca/logo-bawito-header.webp'), 'O logótipo optimizado do cabeçalho não foi encontrado')
for (const imageName of ['hero-bawito-desktop.webp','hero-bawito-tablet.webp','hero-bawito-mobile.webp']) {
  assert.ok(existsSync(`dist/images/hero/${imageName}`), `Falta fotografia hero: ${imageName}`)
}
assert.ok(html.includes('Comunicação e eventos.'), 'Título do Hero em falta')
assert.ok(html.includes('Da estratégia à execução.'), 'Posicionamento do Hero em falta')
assert.ok(html.includes('Uma agência.'), 'Título Sobre em falta')
assert.ok(html.includes('Três áreas de actuação.'), 'Novo título de Serviços em falta')
const heroMarkup = html.slice(html.indexOf('<section class="hero'), html.indexOf('class="service-ribbon'))
assert.equal((heroMarkup.match(/class="btn btn-(?:primary|ghost)"/g) || []).length, 2, 'Hero deve ter dois CTAs')
assert.ok(heroMarkup.includes('href="#contactos"') && heroMarkup.includes('href="#solucoes"'), 'Destinos dos CTAs incorrectos')
assert.ok(html.includes('class="container competencies-list"'), 'Falta faixa estática')
assert.equal((html.match(/class="competency"/g) || []).length, 3, 'Faltam três competências')
const idx = id => html.indexOf('id="' + id + '"')
assert.ok(idx('inicio') < idx('sobre') && idx('sobre') < idx('servicos') && idx('servicos') < idx('solucoes') && idx('solucoes') < idx('aluguer') && idx('aluguer') < idx('artistas'), 'Ordem das secções incorrecta')
assert.ok(html.includes('A nossa missão'), 'Missão em falta')
assert.ok(html.includes('O nosso objectivo'), 'Objectivo em falta')
assert.ok(html.includes('Nos bastidores,'), 'O título do método Bawito não foi encontrado')
assert.ok(html.includes('event-production-command-center-1200.webp'), 'O método deve apresentar a nova imagem da central de produção')
assert.ok(!html.includes('alt="Equipa técnica em produção de evento: mesas de mistura, realização multicâmara e operadores numa sala iluminada."'), 'A descrição da imagem antiga não deve permanecer')
for (const size of [400, 800, 1200]) {
  assert.ok(existsSync(`dist/images/projectos/optimizadas/event-production-command-center-${size}.webp`), 'Falta imagem optimizada do método: ' + size)
}
assert.ok(!html.includes('alt="Equipa em ambiente profissional de produção de eventos, fotografia ilustrativa"'), 'A fotografia genérica não deve permanecer')
assert.equal((html.match(/class="method-stage reveal"/g) || []).length, 4, 'O método deve apresentar quatro etapas')
assert.ok(html.includes('class="method-feature reveal"'), 'A composição panorâmica do método está ausente')

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
assert.equal((html.match(/class="portfolio-card reveal"/g) || []).length, 8, 'O portefólio deve apresentar oito fotografias grandes')
assert.equal((html.match(/class="portfolio-card-media"/g) || []).length, 8, 'Faltam fotografias em destaque')
assert.equal((html.match(/class="portfolio-card-caption"/g) || []).length, 8, 'Faltam títulos fora das fotografias')
assert.ok(html.includes('class="portfolio-cards"'), 'A grelha de cartões fotográficos não existe')
assert.match(read('src/styles.css'), /\.gallery-section \.portfolio-card-media img\{[^}]*object-fit:cover/s, 'As fotografias do portefólio devem preencher integralmente os cartões')
assert.ok(html.includes('Ampliar fotografia:'), 'As fotografias devem permitir ampliação')
assert.ok(!html.includes('class="portfolio-showcase reveal"'), 'A vitrina antiga ainda aparece')
assert.ok(!html.includes('class="portfolio-thumbnails"'), 'As miniaturas antigas ainda aparecem')
assert.ok(html.includes('Conferências institucionais'), 'Portefólio de conferências em falta')
assert.ok(html.includes('mr-bow-liloca-recorte-desktop.webp'), 'Fotografia dos artistas ausente da secção de entretenimento')
assert.ok(html.includes('artist-visual artist-cutout'), 'Artistas não integrados na secção azul')
assert.ok(!html.includes('artist-photo-caption'), 'Legenda duplicada não removida')

assert.ok(html.includes('mr-bow-liloca-recorte-mobile.webp'), 'Versão móvel dos artistas ausente')
for (const variant of ['mobile','desktop']) {
  assert.ok(existsSync('dist/images/artistas/mr-bow-liloca-recorte-' + variant + '.webp'), 'Imagem dos artistas não encontrada: ' + variant)
}
assert.ok(html.includes('Conhecer Mr Bow') && html.includes('Conhecer Liloca'), 'Ligações aos artistas ausentes')
for (const variant of ['mobile', 'desktop']) {
  const metadata = await sharp('dist/images/artistas/mr-bow-liloca-recorte-' + variant + '.webp').metadata()
  assert.ok(metadata.hasAlpha, 'A fotografia dos artistas deve ter fundo transparente: ' + variant)
  const { data: pixels, info } = await sharp('dist/images/artistas/mr-bow-liloca-recorte-' + variant + '.webp').ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  let transparentPixels = 0
  for (let i = 3; i < pixels.length; i += info.channels) if (pixels[i] === 0) transparentPixels++
  assert.ok(transparentPixels / (info.width * info.height) > 0.14, 'Fundo não removido da fotografia dos artistas: ' + variant)
}

assert.ok(html.includes('Grandes palcos'), 'Portefólio de palcos em falta')
assert.ok(!html.includes('A galeria de projectos reais será actualizada'), 'Texto antigo do portefólio detectado')
for (const id of ["conferencias-institucionais","eventos-empresariais","bastidores-tecnicos","reunioes-direccao","cerimonias-publicas","tendas-e-estruturas","espectaculos-ao-vivo","grandes-palcos"]) {
  for (const width of [400, 800, 1200])
    assert.ok(existsSync('dist/images/projectos/optimizadas/' + id + '-' + width + '.webp'), 'Imagem optimizada em falta: ' + id + '-' + width)
}

assert.ok(!html.includes('Aluguer — Mesas e mobiliário'), 'Equipamento removido ainda aparece no site')

assert.ok(html.includes('Comunicação &amp; Marcas') || html.includes('Comunicação & Marcas'), 'Área de comunicação não encontrada')
assert.ok(html.includes('Eventos &amp; Coordenação') || html.includes('Eventos & Coordenação'), 'Área de eventos não encontrada')
assert.ok(html.includes('Audiovisual &amp; Transmissões') || html.includes('Audiovisual & Transmissões'), 'Área audiovisual não encontrada')
assert.equal((html.match(/class="service-option"/g) || []).length, 6, 'Devem existir seis serviços seleccionáveis')
assert.equal((html.match(/class="service-area service-area-/g) || []).length, 3, 'Devem existir três grupos de serviços')
assert.ok(html.includes('Solicitar proposta integrada'), 'Falta acção para proposta integrada')
assert.ok(!html.includes('class="service-illustration"'), 'Ilustrações repetitivas não devem ocupar os cartões')
const illustrations = readdirSync('dist/illustrations/servicos').filter(name => name.endsWith('.svg'))
assert.equal(illustrations.length, 10, 'O catálogo deve ter 10 ilustrações SVG locais')
for (const name of ['about-bawito-desktop.webp','about-bawito-mobile.webp']) {
 assert.ok(existsSync('dist/images/equipa/'+name),'Imagem Sobre não encontrada: '+name)
}
assert.ok(html.includes('logo-bawito-header.webp'), 'O logótipo do cabeçalho não está presente no HTML')
assert.ok(html.includes('class="footer-brand"'), 'A secção de texto do rodapé não foi encontrada')
assert.ok(html.includes('Abrir o pedido no WhatsApp'), 'O formulário deve oferecer alternativa ao WhatsApp')
assert.ok(read('src/App.tsx').includes("menuNavRef.current?.querySelectorAll"), 'Falta controlo de foco no menu')
assert.ok(read('src/App.tsx').includes('phoneDigits.length < 9'), 'Falta validação do telefone')
assert.ok(!html.includes('brand-symbol'), 'O logótipo inventado não deve surgir no site')
assert.ok(!html.includes('brand-words'), 'A marca fictícia não deve ser desenhada com HTML')
const footerMarkup = html.slice(html.indexOf('<footer'), html.indexOf('</footer>') + '</footer>'.length)
assert.ok(!footerMarkup.includes('<img') && !footerMarkup.includes('class="brand'), 'O rodapé não deve apresentar nenhum logótipo')

const assets = readdirSync('dist/assets')
assert.ok(assets.some(name => name.endsWith('.css')), 'CSS em falta')
assert.ok(assets.some(name => name.endsWith('.js')), 'JavaScript em falta')
console.log('Qualidade técnica verificada: HTML, SEO, sitemap, robots e recursos.');
