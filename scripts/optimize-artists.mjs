import { existsSync, mkdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import sharp from 'sharp'

// Usar a imagem carregada pelo cliente e preservá-la intacta em public/images/marca.
// O original é JPG com fundo branco. Removemos apenas o branco ligado às margens
// para conservar brancos internos (dentes, reflexos dos óculos, jóias e costuras).
const original = 'public/images/marca/Mr Bow and Liloca Glam Cutout_Easy-Resize.com.jpg'
const target = 'public/images/artistas'
if (!existsSync(original)) throw new Error('Fotografia dos artistas em falta: ' + original)
mkdirSync(target, { recursive: true })

const { data, info } = await sharp(original).rotate().ensureAlpha().raw().toBuffer({ resolveWithObject: true })
const { width, height, channels } = info
const area = width * height
const visited = new Uint8Array(area)
const queue = new Int32Array(area)
let start = 0, end = 0

function nearWhite(pixel) {
  const offset = pixel * channels
  const red = data[offset], green = data[offset + 1], blue = data[offset + 2]
  const lightest = Math.max(red, green, blue)
  const darkest = Math.min(red, green, blue)
  // Limite conservador: os tons de pele e a roupa não são confundidos com branco.
  return darkest >= 215 && lightest - darkest <= 37
}
function enqueue(pixel) {
  if (!visited[pixel] && nearWhite(pixel)) {
    visited[pixel] = 1
    queue[end++] = pixel
  }
}
for (let x = 0; x < width; x++) {
  enqueue(x)
  enqueue((height - 1) * width + x)
}
for (let y = 0; y < height; y++) {
  enqueue(y * width)
  enqueue(y * width + width - 1)
}
while (start < end) {
  const pixel = queue[start++]
  const x = pixel % width
  const y = Math.floor(pixel / width)
  if (x > 0) enqueue(pixel - 1)
  if (x + 1 < width) enqueue(pixel + 1)
  if (y > 0) enqueue(pixel - width)
  if (y + 1 < height) enqueue(pixel + width)
}
if (end < area * 0.08) throw new Error('O fundo branco da fotografia não foi identificado; verificar o ficheiro.')

for (let i = 0; i < area; i++) {
  if (!visited[i]) continue
  const offset = i * channels
  const light = Math.min(data[offset], data[offset + 1], data[offset + 2])
  // Transparência gradual na franja anti-alias (JPEG), sem halo branco.
  const alpha = Math.max(0, Math.min(255, Math.round((249 - light) / 31 * 255)))
  if (alpha === 0) {
    data[offset] = data[offset + 1] = data[offset + 2] = 0
    data[offset + 3] = 0
  } else if (alpha < 255) {
    const fraction = alpha / 255
    for (let channel = 0; channel < 3; channel++)
      data[offset + channel] = Math.max(0, Math.min(255, Math.round((data[offset + channel] - 255 * (1 - fraction)) / fraction)))
    data[offset + 3] = alpha
  }
}

for (const [name, size] of [['mobile', 720], ['desktop', 1200]]) {
  const destination = join(target, 'mr-bow-liloca-' + name + '.webp')
  await sharp(data, { raw: { width, height, channels: 4 } })
    .resize({ width: size, withoutEnlargement: true })
    .webp({ quality: 80, alphaQuality: 100, effort: 5 })
    .toFile(destination)
  console.log('Artistas sem fundo', name, Math.round(statSync(destination).size / 1024) + ' KB')
}
