import { existsSync, mkdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import sharp from 'sharp'

// Original carregado pelo cliente: manter intacto.
// Fundo branco conectado às margens + áreas brancas isoladas são removidos.
// O recorte é suavizado para eliminar halos JPEG sem remodelar os artistas.
const original = 'public/images/marca/Mr Bow and Liloca Glam Cutout_Easy-Resize.com.jpg'
const target = 'public/images/artistas'
if (!existsSync(original)) throw new Error('Falta a fotografia de Mr Bow e Liloca: ' + original)
mkdirSync(target, { recursive: true })
const { data, info } = await sharp(original).rotate().ensureAlpha().raw().toBuffer({ resolveWithObject: true })
const { width, height, channels } = info
const area = width * height
const background = new Uint8Array(area)
const queue = new Int32Array(area)
let first = 0, last = 0

function isWhite(pixel) {
  const offset = pixel * channels
  const r = data[offset], g = data[offset + 1], b = data[offset + 2]
  return Math.min(r, g, b) >= 198 && Math.max(r, g, b) - Math.min(r, g, b) <= 53
}
function addBackground(pixel) {
  if (!background[pixel] && isWhite(pixel)) {
    background[pixel] = 1
    queue[last++] = pixel
  }
}
function neighbours(pixel, fn) {
  const x = pixel % width, y = Math.floor(pixel / width)
  if (x > 0) fn(pixel - 1)
  if (x < width - 1) fn(pixel + 1)
  if (y > 0) fn(pixel - width)
  if (y < height - 1) fn(pixel + width)
}
// Remove primeiro o fundo branco que toca nas quatro margens.
for (let x = 0; x < width; x++) {
  addBackground(x)
  addBackground((height - 1) * width + x)
}
for (let y = 0; y < height; y++) {
  addBackground(y * width)
  addBackground(y * width + width - 1)
}
while (first < last) {
  const pixel = queue[first++]
  neighbours(pixel, addBackground)
}
// Remove espaços brancos interiores de dimensão significativa,
// como o espaço entre o braço e o corpo, sem apagar dentes ou reflexos dos óculos.
const scanned = new Uint8Array(area)
let removedIslands = 0
for (let pixel = 0; pixel < area; pixel++) {
  if (background[pixel] || scanned[pixel] || !isWhite(pixel)) continue
  let count = 0, processed = 0
  queue[count++] = pixel
  scanned[pixel] = 1
  while (processed < count) {
    const current = queue[processed++]
    neighbours(current, next => {
      if (!scanned[next] && !background[next] && isWhite(next)) {
        scanned[next] = 1
        queue[count++] = next
      }
    })
  }
  if (count > area * 0.0015) {
    removedIslands += 1
    for (let i = 0; i < count; i++) background[queue[i]] = 1
  }
}
let backgroundPixels = 0
const edgeDepth = new Uint8Array(area)
let edge = []
for (let pixel = 0; pixel < area; pixel++) {
  if (!background[pixel]) continue
  backgroundPixels++
  const offset = pixel * channels
  data[offset] = 0
  data[offset + 1] = 0
  data[offset + 2] = 0
  data[offset + 3] = 0
  neighbours(pixel, next => {
    if (!background[next] && !edgeDepth[next]) {
      edgeDepth[next] = 1
      edge.push(next)
    }
  })
}
if (backgroundPixels < area * 0.1 || backgroundPixels > area * 0.8)
  throw new Error('Recorte fora do intervalo esperado; verificar fotografia original')

// Recua a orla um píxel e faz transição gradual mais dois píxeis para dentro.
// As cores dos píxeis contíguos são descontaminadas do branco JPEG.
for (let level = 1; level <= 3; level++) {
  const nextLayer = []
  for (const pixel of edge) {
    const offset = pixel * channels
    const alpha = level === 1 ? 0 : level === 2 ? 148 : 226
    data[offset + 3] = alpha
    if (level === 1) {
      data[offset] = data[offset + 1] = data[offset + 2] = 0
    } else {
      const spill = level === 2 ? 0.23 : 0.08
      for (let c = 0; c < 3; c++)
        data[offset + c] = Math.max(0, Math.min(255,
          Math.round((data[offset + c] - 255 * spill) / (1 - spill))))
    }
    if (level < 3) neighbours(pixel, candidate => {
      if (!background[candidate] && !edgeDepth[candidate]) {
        edgeDepth[candidate] = level + 1
        nextLayer.push(candidate)
      }
    })
  }
  edge = nextLayer
}
for (const [name, size] of [['mobile', 720], ['desktop', 1200]]) {
  const file = join(target, 'mr-bow-liloca-recorte-' + name + '.webp')
  await sharp(data, { raw: { width, height, channels: 4 } })
    .resize({ width: size, withoutEnlargement: true })
    .webp({ quality: 80, alphaQuality: 100, effort: 5 })
    .toFile(file)
  console.log('Artistas recortados', name, Math.round(statSync(file).size / 1024) + ' KB')
}
console.log('Fundo removido:', Math.round(backgroundPixels / area * 100) + '%; áreas interiores:', removedIslands)
