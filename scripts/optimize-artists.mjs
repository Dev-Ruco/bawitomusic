import { existsSync, mkdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import sharp from 'sharp'

// O original publicado no repositório é preservado.
// As duas versões WebP servem o retrato dos artistas sem dependências externas.
const original = 'public/images/marca/Luxury Duo Portrait_ Mr Bow and Liloca_Easy-Resize.com.jpg'
const target = 'public/images/artistas'
if (!existsSync(original)) throw new Error('Falta a fotografia oficial de Mr Bow e Liloca: ' + original)
mkdirSync(target, { recursive: true })
for (const [name, width] of [['mobile', 720], ['desktop', 1200]]) {
  const destination = join(target, 'mr-bow-liloca-' + name + '.webp')
  await sharp(original).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 79, effort: 5 }).toFile(destination)
  console.log('Artistas', name, Math.round(statSync(destination).size / 1024) + ' KB')
}
