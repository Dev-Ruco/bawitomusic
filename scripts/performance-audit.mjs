/**
 * Medição Lighthouse de laboratório (não substitui Core Web Vitals de campo).
 * Produz relatórios para mobile e desktop do site de produção compilado.
 */
import lighthouse from 'lighthouse'
import { chromium } from 'playwright'
import { spawn } from 'node:child_process'
import { mkdirSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const output = 'audit-performance'
const base = 'http://127.0.0.1:4173/'
mkdirSync(output, {recursive: true})
const profile = mkdtempSync(join(tmpdir(), 'bawito-lighthouse-'))
const server = spawn(process.execPath, [
  'node_modules/vite/bin/vite.js', 'preview', '--host','127.0.0.1',
  '--port','4173','--strictPort',
], {stdio:'ignore'})
let chrome

async function ready(url, tries = 70) {
  for (let i = 0; i < tries; i++) {
    try { if ((await fetch(url)).ok) return } catch {}
    await new Promise(resolve => setTimeout(resolve, 400))
  }
  throw new Error('O serviço não ficou acessível: ' + url)
}
function score(category) {
  return category?.score === null || category?.score === undefined
    ? null : Math.round(category.score * 100)
}
const outputResults = []
try {
  await ready(base)
  chrome = spawn(chromium.executablePath(), [
    '--headless=new', '--no-sandbox', '--disable-dev-shm-usage',
    '--disable-gpu','--disable-background-networking',
    '--remote-debugging-port=9222','--remote-debugging-address=127.0.0.1',
    '--user-data-dir=' + profile,
  ], {stdio:'ignore'})
  await ready('http://127.0.0.1:9222/json/version')

  const targets = [
    {type:'mobile', site:'compilado', url:base},
    {type:'desktop', site:'compilado', url:base},
    {type:'mobile', site:'publicado', url:'https://bawitomusic.co.mz/'},
  ]
  for (const target of targets) {
    const {type} = target
    const desktop = type === 'desktop'
    const options = {
      port: 9222,
      output: 'json',
      logLevel: 'error',
      onlyCategories: ['performance','accessibility','best-practices','seo'],
      formFactor: type,
      preset: desktop ? 'desktop' : undefined,
      screenEmulation: desktop
        ? {mobile:false,width:1440,height:900,deviceScaleFactor:1,disabled:false}
        : {mobile:true,width:390,height:844,deviceScaleFactor:2,disabled:false},
      maxWaitForLoad: 45000,
    }
    let result
    try {
      result = await lighthouse(target.url, options)
      if (!result?.lhr || result.lhr.runtimeError)
        throw new Error(result?.lhr?.runtimeError?.message ?? 'sem resultado')
    } catch (error) {
      if (target.site === 'publicado') {
        console.warn('LIGHTHOUSE PUBLICADO: acesso ou medição indisponível: ' + error.message)
        outputResults.push({device:type, target:target.site, unavailable:String(error.message)})
        continue
      }
      throw error
    }
    const lhr = result.lhr
    const label = target.site === 'publicado' ? 'publicado-mobile' : type
    writeFileSync(output + '/lighthouse-' + label + '.json',
      JSON.stringify(lhr, null, 2) + '\n')
    const metrics = {}
    for (const id of ['first-contentful-paint','largest-contentful-paint','speed-index','total-blocking-time','cumulative-layout-shift']) {
      const entry = lhr.audits[id]
      metrics[id] = entry?.numericValue === undefined ? null : {
        numericValue: entry.numericValue, displayValue: entry.displayValue,
      }
    }
    const opportunities = Object.values(lhr.audits)
      .filter(a => a.details?.type === 'opportunity' && a.details.overallSavingsMs > 100)
      .sort((a,b) => (b.details.overallSavingsMs ?? 0) - (a.details.overallSavingsMs ?? 0))
      .slice(0, 8)
      .map(a => ({id:a.id,title:a.title,potentialSavingsMs:Math.round(a.details.overallSavingsMs)}))
    const summary = {
      device:type, target:target.site, url:target.url,
      scores:{
        performance:score(lhr.categories.performance),
        accessibility:score(lhr.categories.accessibility),
        bestPractices:score(lhr.categories['best-practices']),
        seo:score(lhr.categories.seo),
      },
      metrics,opportunities,
    }
    outputResults.push(summary)
    console.log('LIGHTHOUSE ' + label.toUpperCase() + ': ' + JSON.stringify(summary))
  }
  writeFileSync(output + '/resumo.json', JSON.stringify({
    measurement:'Lighthouse local lab audit: network and CPU simulation',
    note:'Estas pontuações são de laboratório, não Core Web Vitals reais dos visitantes.',
    runs:outputResults, measuredAt:new Date().toISOString(),
  },null,2)+'\n')
} finally {
  chrome?.kill('SIGTERM')
  server.kill('SIGTERM')
  try { rmSync(profile,{recursive:true,force:true,maxRetries:12,retryDelay:150}) }
  catch (error) { console.warn('Limpeza de ficheiros temporários:', error.message) }
}
