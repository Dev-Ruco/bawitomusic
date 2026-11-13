# Portefólio Bawito — imagens do projecto

Esta secção utiliza **oito fotografias carregadas em `public/images/projectos`**, substituindo fotografias genéricas da antiga galeria. Os títulos descrevem o tipo de trabalho ou ambiente presente, sem atribuir contratos, clientes ou resultados que não foram confirmados.

O script `scripts/optimize-projects.mjs` conserva os originais e cria WebP locais a 400, 800 e 1200 píxeis para utilização através de `srcSet` e `sizes`. Os ficheiros derivados ficam em `public/images/projectos/optimizadas` e são gerados em `npm run build` e `npm run dev`.

## Mapeamento
- **Conferências institucionais** — `Formal Conference Beneath Blue Drapery_Easy-Resize.com.jpg`
- **Encontros empresariais** — `Maputo CAE Business Summit Conference_Easy-Resize.com.jpg`
- **Bastidores da produção** — `Behind the Scenes at Réveillon 2025–2026_Easy-Resize.com.jpg`
- **Reuniões de direcção** — `GFM Executive Conference in Mozambique_Easy-Resize.com.jpg`
- **Cerimónias institucionais** — `Moçambique 59_ Ceremony Under the Canopy_Easy-Resize.com.jpg`
- **Montagem de tendas** — `Outdoor Event Tent with Symmetrical Seating_Easy-Resize.com.jpg`
- **Espectáculos ao vivo** — `Vibrant Concert Stage with LED Backdrop_Easy-Resize.com.jpg`
- **Grandes palcos** — `estrura de palo bawito music_Easy-Resize.com.jpg`

## Interface
- Galeria de cartões fotográficos amplos: duas colunas no desktop e uma coluna no telemóvel, com legendas fora das fotografias.
- Filtros por conferências, produção/montagem e espectáculos.
- Ampliação com navegação anterior/seguinte, teclas Escape e setas.
- Animações suaves com suporte para `prefers-reduced-motion`, foco visível e descrição alternativa de todas as fotografias.

As fotografias incluem imagens tratadas digitalmente. Antes de apresentar a autoria ou participação da Bawito num projecto específico, confirmar autorização e correspondência com os registos da empresa.

## Apresentação visual (Novembro 2026 — cartões fotográficos)

A galeria apresenta as oito fotografias de forma imediata, sem a antiga vitrina de fotografia única e miniaturas. No desktop, os cartões ficam em duas colunas amplas; no telemóvel, uma coluna com fotografias à largura do conteúdo. As imagens usam `object-fit:contain` para manter o enquadramento original, versões WebP 400/800/1200, `srcSet`/`sizes` e carregamento progressivo. Os títulos aparecem sob as fotografias, nunca sobre o evento. Clique ou teclado abrem a ampliação com navegação anterior/seguinte. Os filtros originais continuam disponíveis e as animações respeitam `prefers-reduced-motion`.
