import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { build } from 'esbuild'
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

// Generate crawlable HTML with the same React component used in the browser.
// Keep temporary build files in the project so bare imports resolve in node_modules.
const temp = mkdtempSync(resolve('.prerender-'))
const output = join(temp, 'App.mjs')
try {
  await build({
    entryPoints: [resolve('src/App.tsx')],
    outfile: output,
    bundle: true,
    platform: 'node',
    format: 'esm',
    packages: 'external',
    target: 'node22',
    jsx: 'automatic',
    logLevel: 'warning',
  })
  const { default: App } = await import(pathToFileURL(output).href)
  const staticHtml = renderToString(createElement(App))
  const page = readFileSync('dist/index.html', 'utf8')
  if (!page.includes('<div id="root"></div>')) {
    throw new Error('Não foi possível encontrar o elemento root para pré-renderizar.')
  }
  writeFileSync('dist/index.html', page.replace('<div id="root"></div>', `<div id="root">${staticHtml}</div>`))
  console.log('Pré-renderização concluída: conteúdo institucional e serviços presentes no HTML.')
} finally {
  rmSync(temp, { recursive: true, force: true })
}
