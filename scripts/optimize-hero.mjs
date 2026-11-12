import { existsSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import sharp from 'sharp'

// Gera variantes da fotografia ORIGINAL que foi carregada em public/images/hero.
const folder = 'public/images/hero'
const sourceName = readdirSync(folder).find(name =>
  /^Bawito-Music-/i.test(name) && /Conference-Production\.webp$/i.test(name),
)
if (!sourceName) throw new Error('Fotografia original da Bawito não encontrada em public/images/hero.')
const source = join(folder, sourceName)
if (!existsSync(source)) throw new Error(`Ficheiro em falta: ${source}`)

const variants = [
  { name: 'hero-bawito-desktop.webp', width: 1600 },
  { name: 'hero-bawito-tablet.webp', width: 1000 },
  { name: 'hero-bawito-mobile.webp', width: 700, height: 900 },
]
for (const item of variants) {
  const target = join(folder, item.name)
  const img = sharp(source).rotate()
  const resized = item.height
    ? img.resize(item.width, item.height, { fit: 'cover', position: 'centre', withoutEnlargement: true })
    : img.resize({ width: item.width, withoutEnlargement: true })
  await resized.webp({ quality: 77, effort: 5 }).toFile(target)
  console.log(`${item.name}: ${Math.round(statSync(target).size / 1024)} KB | origem: ${sourceName}`)
}
