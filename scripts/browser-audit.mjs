/**
 * Auditoria final Bawito: browser real do site compilado, responsividade,
 * interacções principais, acessibilidade automática e capturas de ecrã.
 * Nunca envia mensagens reais: window.open é interceptado no teste.
 */
import { chromium } from 'playwright'
import { spawn } from 'node:child_process'
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs'

const base = 'http://127.0.0.1:4173/'
const output = 'audit-browser'
const failures = []
const observations = []
const viewports = [320, 360, 390, 768, 1024, 1440]
const axeSource = readFileSync('node_modules/axe-core/axe.min.js', 'utf8')
mkdirSync(output, { recursive: true })

function assert(condition, description) {
  if (!condition) throw new Error(description)
}
function recordError(scope, error) {
  const message = scope + ': ' + (error?.message ?? String(error))
  failures.push(message)
  console.error('ERRO:', message)
}
function log(scope, message) {
  console.log('VERIFICADO:', scope, message)
}
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

const server = spawn(process.execPath, [
  'node_modules/vite/bin/vite.js',
  'preview', '--host', '127.0.0.1', '--port', '4173', '--strictPort',
], { stdio: ['ignore', 'pipe', 'pipe'] })

let stderr = ''
server.stderr.on('data', data => { stderr += String(data) })

async function waitForServer() {
  for (let attempt = 0; attempt < 45; attempt++) {
    try {
      const response = await fetch(base)
      if (response.ok) return
    } catch { /* a iniciar */ }
    if (server.exitCode !== null) break
    await delay(350)
  }
  throw new Error('A versão de produção não iniciou no navegador: ' + stderr.slice(-600))
}

let browser
try {
  await waitForServer()
  browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] })
  for (const width of viewports) {
    const isMobile = width <= 430
    const context = await browser.newContext({
      viewport: { width, height: isMobile ? 780 : 900 },
      deviceScaleFactor: 1,
      reducedMotion: 'reduce',
      isMobile,
      hasTouch: isMobile,
    })
    const page = await context.newPage()
    const pageErrors = []
    page.on('pageerror', error => pageErrors.push(error.message))
    page.on('response', response => {
      if (response.url().startsWith(base) && response.status() >= 400)
        pageErrors.push(response.status() + ' ' + response.url())
    })
    await page.addInitScript(() => {
      window.__waAudit = []
      window.open = url => { window.__waAudit.push(String(url)); return null }
      window.__lcpAudit = 0
      try {
        new PerformanceObserver(list => {
          const entries = list.getEntries()
          if (entries.length) window.__lcpAudit = entries.at(-1).startTime
        }).observe({ type: 'largest-contentful-paint', buffered: true })
      } catch { /* medição não suportada */ }
    })
    try {
      await page.goto(base, { waitUntil: 'domcontentloaded', timeout: 30000 })
      await page.locator('#hero-title').waitFor()
      const h1Count = await page.locator('h1').count()
      assert(h1Count === 1, 'O site deve ter um único H1 (encontrados ' + h1Count + ')')
      const missingSections = []
      for (const id of ['inicio','sobre','servicos','solucoes','aluguer','artistas','contactos']) {
        if (await page.locator('#' + id).count() !== 1) missingSections.push(id)
      }
      assert(missingSections.length === 0, 'Secções em falta: ' + missingSections.join(', '))
      const horizontalOverflow = await page.evaluate(() => {
        const doc = document.documentElement
        return Math.max(doc.scrollWidth, document.body.scrollWidth) - doc.clientWidth
      })
      if (horizontalOverflow > 2) {
        const offenders = await page.evaluate(() => [...document.querySelectorAll('body *')].filter(element => {
          const rect = element.getBoundingClientRect()
          const style = getComputedStyle(element)
          return style.display !== 'none' &&
            (rect.right > document.documentElement.clientWidth + 2 || rect.left < -2) &&
            rect.width > 0
        }).slice(0, 25).map(element => ({
          tag: element.tagName.toLowerCase(),
          className: typeof element.className === 'string' ? element.className.slice(0, 90) : '',
          id: element.id,
          left: Math.round(element.getBoundingClientRect().left),
          right: Math.round(element.getBoundingClientRect().right),
          width: Math.round(element.getBoundingClientRect().width),
        })))
        console.error('OVERFLOW ' + width + 'px:', JSON.stringify(offenders))
        failures.push(width + 'px: deslocação horizontal de ' + horizontalOverflow + 'px')
      }
      const heroLinks = await page.locator('.hero-buttons a').count()
      assert(heroLinks === 2, 'O Hero deve apresentar dois percursos')
      await page.locator('#inicio').screenshot({
        path: output + '/hero-' + width + '.png', animations: 'disabled',
      })

      if (isMobile) {
        const menu = page.getByRole('button', { name: 'Abrir menu' })
        assert(await menu.isVisible(), 'Botão de menu não visível em mobile')
        await menu.click()
        assert(await page.locator('#main-navigation').isVisible(), 'O menu não abriu')
        await page.keyboard.press('Escape')
        assert(!(await page.locator('#main-navigation').isVisible()), 'Escape não fechou o menu')
      }

      await page.locator('#solucoes').scrollIntoViewIfNeeded()
      assert(await page.locator('.portfolio-card').count() === 8, 'O portefólio deve conter oito projectos')
      if (width === 390 || width === 1440)
        await page.locator('#solucoes').screenshot({ path: output + '/portfolio-' + width + '.png', animations: 'disabled' })
      await page.getByRole('button', { name: 'Conferências', exact: true }).click()
      assert(await page.locator('.portfolio-card').count() === 3, 'O filtro Conferências está incorrecto')
      await page.locator('.portfolio-card-button').first().click()
      assert(await page.locator('.portfolio-lightbox').isVisible(), 'A fotografia não foi ampliada')
      await page.keyboard.press('Escape')
      assert(!(await page.locator('.portfolio-lightbox').count()), 'Escape não fechou a fotografia')

      await page.locator('#aluguer').scrollIntoViewIfNeeded()
      assert(await page.locator('.rental-card').count() === 6, 'O aluguer deve conter seis categorias')
      await page.locator('.rental-card').first().click()
      assert(await page.locator('.quote-selection-list li').count() === 1, 'O equipamento não foi adicionado ao pedido')
      assert(await page.locator('.rental-card[data-selected="true"]').count() === 1, 'A selecção não foi reflectida no cartão')

      await page.locator('.service-option').first().click()
      assert(await page.locator('.quote-selection-list li').count() === 2, 'O serviço não foi integrado no pedido')

      await page.locator('.quote-form input[autocomplete="name"]').fill('Cliente Teste')
      await page.locator('.quote-form input[autocomplete="tel"]').fill('841234567')
      await page.locator('.quote-form textarea').fill('Gostaria de receber uma proposta para uma conferência empresarial em Maputo.')
      await page.getByRole('button', { name: 'Preparar pedido no WhatsApp' }).click()
      const url = await page.evaluate(() => window.__waAudit.at(-1))
      assert(url?.startsWith('https://wa.me/258843000002?text='), 'A mensagem não foi preparada para o número comercial')
      const message = new URL(url).searchParams.get('text')
      assert(message.includes('Nome: Cliente Teste'), 'O nome não foi incluído na mensagem')
      assert(message.includes('Serviços pretendidos:'), 'Os serviços escolhidos não foram incluídos')
      assert(!message.includes('Local:'), 'Campo opcional vazio foi enviado')
      assert(await page.locator('.form-whatsapp-fallback').isVisible(), 'Falta a alternativa de abertura do WhatsApp')
      await page.getByRole('button', { name: 'Limpar selecção' }).click()
      assert(await page.locator('.quote-selection-list li').count() === 0, 'A limpeza da selecção falhou')
      if (width === 390 || width === 1440) {
        await page.locator('#contactos').screenshot({ path: output + '/contactos-' + width + '.png', animations: 'disabled' })
        await page.locator('#artistas').screenshot({ path: output + '/artistas-' + width + '.png', animations: 'disabled' })
      }
      await page.addScriptTag({ content: axeSource })
      const accessibility = width === 390 || width === 1440
        ? await page.evaluate(async () => {
            const result = await window.axe.run(document, {
              runOnly: { type: 'tag', values: ['wcag2a','wcag2aa','wcag21a','wcag21aa'] },
            })
            return result.violations.map(v => ({
              id: v.id, impact: v.impact, description: v.description,
              nodes: v.nodes.slice(0, 3).map(n => n.target.join(' ')),
            }))
          })
        : []
      const lcp = await page.evaluate(() => window.__lcpAudit || null)
      observations.push({
        width, localBuild: true, horizontalOverflowPx: horizontalOverflow,
        images: await page.locator('img').count(), h1Count, pageErrors,
        lcpUnthrottledMs: lcp, accessibility,
      })
      assert(pageErrors.length === 0, 'Erros de carregamento/JavaScript: ' + pageErrors.join('; '))
      log(width + 'px', 'navegação, filtros, galeria, aluguer e pedido WhatsApp aprovados')
      if (accessibility.length) {
        console.log('ACESSIBILIDADE ' + width + 'px: ' +
          accessibility.map(v => v.id + ' (' + v.impact + ')').join(', '))
        console.log('ACESSIBILIDADE DETALHE ' + width + 'px: ' + JSON.stringify(accessibility))
      }
    } catch (error) {
      recordError(width + 'px', error)
      try {
        await page.screenshot({ path: output + '/falha-' + width + '.png', fullPage: false })
      } catch { /* sem ecrã */ }
    } finally {
      await context.close()
    }
  }

  // A versão pública é avaliada separadamente e não bloqueia os testes locais.
  const liveContext = await browser.newContext({
    viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true,
    reducedMotion: 'reduce',
  })
  const livePage = await liveContext.newPage()
  try {
    const response = await livePage.goto('https://bawitomusic.co.mz/', {
      waitUntil: 'domcontentloaded', timeout: 25000,
    })
    const liveTitle = await livePage.title()
    const liveHero = await livePage.locator('#hero-title').textContent()
    await livePage.screenshot({
      path: output + '/publicado-mobile-390.png', animations: 'disabled',
    })
    observations.push({
      live: true, status: response.status(), title: liveTitle, h1: liveHero,
      currentForm: await livePage.locator('text=Preparar pedido no WhatsApp').count() > 0,
    })
    console.log('VERSÃO PUBLICADA: acesso confirmado — ' + liveTitle)
  } catch (error) {
    observations.push({ live: false, reason: String(error.message).slice(0, 350) })
    console.warn('VERSÃO PUBLICADA: não acessível a partir deste executor; a auditoria local continua válida')
  } finally {
    await liveContext.close()
  }
} catch (error) {
  recordError('infraestrutura', error)
} finally {
  if (browser) await browser.close()
  server.kill('SIGTERM')
  writeFileSync(output + '/relatorio.json', JSON.stringify({
    generatedAt: new Date().toISOString(),
    source: 'Website Bawito, compilação local + tentativa de consulta pública',
    results: observations, failures,
    caveat: 'LCP sem limitação de rede/CPU não equivale a Core Web Vitals reais.',
  }, null, 2) + '\n')
}
console.log('AUDITORIA:', observations.length + ' resultados; ' + failures.length + ' falhas')
if (failures.length) process.exitCode = 1
