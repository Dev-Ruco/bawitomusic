import { existsSync, mkdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import sharp from 'sharp'

// Imagens locais do portefólio: nunca modificar os originais fornecidos.
// As três versões são usadas pelo srcSet para reduzir transferência no mobile.
const base = 'public/images/projectos'
const output = join(base, 'optimizadas')
mkdirSync(output, { recursive: true })
const photos = [
  {
    "id": "conferencias-institucionais",
    "name": "Formal Conference Beneath Blue Drapery_Easy-Resize.com.jpg"
  },
  {
    "id": "eventos-empresariais",
    "name": "Maputo CAE Business Summit Conference_Easy-Resize.com.jpg"
  },
  {
    "id": "bastidores-tecnicos",
    "name": "Behind the Scenes at Réveillon 2025–2026_Easy-Resize.com.jpg"
  },
  {
    "id": "reunioes-direccao",
    "name": "GFM Executive Conference in Mozambique_Easy-Resize.com.jpg"
  },
  {
    "id": "cerimonias-publicas",
    "name": "Moçambique 59_ Ceremony Under the Canopy_Easy-Resize.com.jpg"
  },
  {
    "id": "tendas-e-estruturas",
    "name": "Outdoor Event Tent with Symmetrical Seating_Easy-Resize.com.jpg"
  },
  {
    "id": "espectaculos-ao-vivo",
    "name": "Vibrant Concert Stage with LED Backdrop_Easy-Resize.com.jpg"
  },
  {
    "id": "grandes-palcos",
    "name": "estrura de palo bawito music_Easy-Resize.com.jpg"
  },
  {
    "id": "event-production-command-center",
    "name": "Event Production Command Center.png"
  }
]
for (const photo of photos) {
  const source = join(base, photo.name)
  if (!existsSync(source)) throw new Error('Fotografia do portefólio não encontrada: ' + source)
  for (const width of [400, 800, 1200]) {
    const dest = join(output, photo.id + '-' + width + '.webp')
    await sharp(source).rotate().resize({ width, withoutEnlargement: true })
      .webp({ quality: width === 1200 ? 79 : 75, effort: 5 }).toFile(dest)
    console.log('Portefólio', photo.id, width, Math.round(statSync(dest).size / 1024) + ' KB')
  }
}
