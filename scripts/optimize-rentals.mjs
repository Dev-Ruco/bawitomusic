import { existsSync, mkdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import sharp from 'sharp'

// Fotografias originais carregadas pela Bawito: preservá-las.
// Gerar variantes leves para dispositivos móveis e desktop.
const originalFolder = 'public/images/servicos'
const outputFolder = 'public/images/aluguer'
mkdirSync(outputFolder, { recursive: true })
const sources = [
  { name: 'tendas', source: 'Golden-Hour Garden Marquee_Easy-Resize.com.jpg' },
  { name: 'geradores', source: 'Golden-Hour Bawito Event Generators_Easy-Resize.com.jpg' },
  { name: 'palcos', source: 'Bawito Music Sunset Stage_Easy-Resize.com.jpg' },
  { name: 'ecras', source: 'Telas_bawito music.jpg' },
  { name: 'sanitarios', source: 'Casa de banho movel bawito music_Easy-Resize.com.jpg' }
]
for (const item of sources) {
  const original = join(originalFolder, item.source)
  if (!existsSync(original)) throw new Error('Fotografia de aluguer em falta: ' + original)
  for (const width of [480, 820]) {
    const output = join(outputFolder, item.name + '-' + width + '.webp')
    await sharp(original).rotate().resize({ width, withoutEnlargement: true })
      .webp({ quality: 76, effort: 5 }).toFile(output)
    console.log(item.name + ' ' + width + 'px: ' + Math.round(statSync(output).size / 1024) + ' KB')
  }
}
const ac = join(outputFolder, 'ar-condicionado-vertical.webp')
if (!existsSync(ac)) throw new Error('Fotografia do ar condicionado vertical em falta: ' + ac)
console.log('Ar condicionado: ' + Math.round(statSync(ac).size / 1024) + ' KB')
