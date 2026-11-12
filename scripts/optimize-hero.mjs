import { existsSync, mkdirSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import sharp from 'sharp'

// Original fotográfico e logótipo são ficheiros distintos: nunca misturar imagens.
const folder = 'public/images/hero'
const allImages = readdirSync(folder).filter(name => /\.(jpe?g|png|webp|avif)$/i.test(name))
const generated = /^hero-bawito-(desktop|tablet|mobile)\.webp$/i
const isLogo = name => /(logo|logotipo|logotype|waveform|marca)/i.test(name)
const photographs = allImages.filter(name => !generated.test(name) && !isLogo(name))
const photo =
  photographs.find(name => /^hero-original\.(jpe?g|png|webp|avif)$/i.test(name)) ||
  photographs.find(name => /(auditorium|conference|conferencia|conferência|palco|cenário|cenario|rehearsal)/i.test(name)) ||
  (photographs.length === 1 ? photographs[0] : null)

if (!photo) {
  throw new Error(`Fotografia do Hero não identificada. Ficheiros: ${allImages.join(', ')}. Renomeie o ficheiro desejado para hero-original.jpg ou hero-original.webp.`)
}
const srcPhoto = join(folder, photo)
for (const variant of [
  { name: 'hero-bawito-desktop.webp', width: 1600 },
  { name: 'hero-bawito-tablet.webp', width: 1000 },
  { name: 'hero-bawito-mobile.webp', width: 700, height: 900 },
]) {
  const target = join(folder, variant.name)
  const pipeline = sharp(srcPhoto).rotate()
  const resized = variant.height
    ? pipeline.resize(variant.width, variant.height, { fit: 'cover', position: 'centre', withoutEnlargement: true })
    : pipeline.resize({ width: variant.width, withoutEnlargement: true })
  await resized.webp({ quality: 78, effort: 5 }).toFile(target)
  console.log(`Hero ${variant.name}: ${Math.round(statSync(target).size / 1024)} KB, original: ${photo}`)
}

// A imagem azul sobre fundo branco permanece na biblioteca e é transformada
// em versão compacta para a navegação; nunca é usada como fundo do Hero.
const logo = allImages.find(name => /^BAWITO-Blue-Waveform-Logo\.(jpe?g|png|webp|avif)$/i.test(name)) ||
  allImages.find(name => /(logo|logotipo|logotype|waveform)/i.test(name))
if (!logo) throw new Error('Logótipo azul em falta. Carregue BAWITO-Blue-Waveform-Logo.webp na pasta public/images/hero.')
const logoFolder = 'public/images/marca'
mkdirSync(logoFolder, { recursive: true })
const logoOutput = join(logoFolder, 'logo-bawito-header.webp')
await sharp(join(folder, logo))
  .rotate()
  .flatten({ background: '#ffffff' })
  .trim({ background: '#ffffff', threshold: 15 })
  .resize({ width: 420, withoutEnlargement: true })
  .webp({ quality: 85, effort: 5 })
  .toFile(logoOutput)
console.log(`Logótipo para o header: ${Math.round(statSync(logoOutput).size / 1024)} KB, origem: ${logo}`)
