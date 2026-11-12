import { existsSync, statSync } from 'node:fs'
import { join } from 'node:path'
import sharp from 'sharp'
const folder='public/images/equipa'
const src=join(folder,'BAWITO-Concert-Control-Center_Easy-Resize.com.jpg')
if(!existsSync(src)) throw new Error('Imagem da secção Sobre em falta: '+src)
for(const item of [
 {name:'about-bawito-desktop.webp',width:1100,height:760},
 {name:'about-bawito-mobile.webp',width:720,height:580}
]){
 const file=join(folder,item.name)
 await sharp(src).rotate().resize(item.width,item.height,{fit:'cover',position:'centre',withoutEnlargement:true}).webp({quality:78,effort:5}).toFile(file)
 console.log('Imagem Sobre: '+item.name+' '+Math.round(statSync(file).size/1024)+' KB')
}
