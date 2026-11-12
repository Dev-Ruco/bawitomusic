import { existsSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import sharp from 'sharp'

// Procura automaticamente a nova imagem original carregada no GitHub.
// Aceita JPG, JPEG, PNG, WebP e AVIF; exclui as variantes produzidas neste script.
const folder = 'public/images/hero'
const generated = /^hero-bawito-(desktop|tablet|mobile)\.webp$/i
const originals = readdirSync(folder)
  .filter(name => /\.(jpg|jpeg|png|webp|avif)$/i.test(name) && !generated.test(name))
  .sort((a, b) => a.localeCompare(b))

if (originals.length === 0) {
  throw new Error('Nenhuma imagem encontrada em public/images/hero. Carregue a fotografia, confirme o Commit changes no ramo main e volte a compilar.')
}

const marked = originals.find(name => /^hero-original\.(jpg|jpeg|png|webp|avif)$/i.test(name))
if (originals.length > 1 && !marked) {
  throw new Error(`Existem várias imagens originais (${originals.join(', ')}). Indique a escolhida renomeando-a para hero-original.webp, ou deixe apenas uma imagem original na pasta.`)
}

const sourceName = marked || originals[0]
const source = join(folder, sourceName)
if (!existsSync(source)) throw new Error(`Ficheiro em falta: ${source}`)

const variants = [
  { name: 'hero-bawito-desktop.webp', width: 1600 },
  { name: 'hero-bawito-tablet.webp', width: 1000 },
  { name: 'hero-bawito-mobile.webp', width: 700, height: 900 },
]

for (const item of variants) {
  const target = join(folder, item.name)
  const resized = item.height
    ? sharp(source).rotate().resize(item.width, item.height, { fit: 'cover', position: 'centre', withoutEnlargement: true })
    : sharp(source).rotate().resize({ width: item.width, withoutEnlargement: true })
  await resized.webp({ quality: 77, effort: 5 }).toFile(target)
  console.log(`${item.name}: ${Math.round(statSync(target).size / 1024)} KB | origem: ${sourceName}`)
}
