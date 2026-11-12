# Hero — Bawito Music & Serviços

Fonte: a imagem original carregada pelo utilizador em `public/images/hero/Bawito-Music-_-Serviços-Conference-Production.webp`, encontrada pelo script independentemente da normalização dos acentos no nome. O original é preservado.

**Título:** Produção técnica para eventos corporativos.

**Descrição:** Soluções integradas de som, iluminação, telas LED, transmissão em directo e coordenação técnica para conferências, eventos empresariais e institucionais.

**CTAs:** Solicitar orçamento → `#contactos`; Conhecer serviços → `#servicos`.

No desktop, a fotografia ocupa todo o fundo, com texto conciso à esquerda e gradação suave para legibilidade. No telemóvel, a imagem é recortada ao centro para mostrar o palco e o posto técnico; o texto fica em baixo. São geradas variantes WebP para cada tamanho de ecrã com Sharp em `prebuild` e `predev`, sem alterar o ficheiro original. Não há elementos decorativos a disputar atenção no Hero, nem botão flutuante do WhatsApp enquanto a secção inicial está activa. Animação única, suave, desactivável pelo utilizador.

A fotografia é ilustrativa/sintética e não deve ser identificada como registo de evento efectivamente realizado.

## Actualização da imagem

Basta colocar uma imagem JPG, PNG, WebP ou AVIF em `public/images/hero/` e confirmar `Commit changes` no ramo `main`. Com apenas uma imagem original na pasta, `npm run build` detecta-a automaticamente; com vários originais, usar o nome `hero-original.webp`. O website continua a produzir três versões WebP sem alterar o ficheiro de origem.
