# Bawito Music & Serviços

Website institucional da **Bawito Music & Serviços**, com foco em soluções integradas para eventos corporativos, produção técnica, audiovisuais e gestão artística em Moçambique.

## Executar localmente

Requer Node.js 20.19+ ou 22.12+.

```bash
npm install
npm run dev
```

Para gerar a versão de produção:

```bash
npm run build
npm run preview
```

## Tecnologia

- React 18, TypeScript e Vite 6
- CSS responsivo, sem dependências de um serviço de estilos
- Lucide React para iconografia
- Formulário de orçamento que constrói uma mensagem personalizada no WhatsApp

## Organização

- `src/App.tsx` — secções, navegação, serviços, galeria ilustrativa e formulário
- `src/styles.css` — sistema visual e adaptação a telemóveis
- `public/favicon.svg` e `public/og-cover.svg` — identidade provisória em SVG

## Configurar para lançamento

1. Substituir as imagens ilustrativas por fotografias próprias e licenciadas de eventos e equipamentos da Bawito. As imagens actuais são referências visuais externas; não representam necessariamente trabalhos da empresa.
2. Validar o telefone comercial `+258 84 300 0002`, o e-mail `comercial@bawitomusic.co.mz` e a morada da Malhangalene.
3. Substituir o logótipo vectorial tipográfico provisório pelo ficheiro oficial.
4. Associar domínio, configurar a imagem Open Graph final e adicionar uma URL canónica assim que o website for publicado.
5. Opcionalmente, integrar o formulário com um backend autenticado e protecções anti-spam. Actualmente, não grava pedidos nem finge submetê-los: abre o WhatsApp com a mensagem pronta.

## Publicar

A ligação do repositório à Vercel ou a outra plataforma de alojamento estático permite usar `npm run build` e publicar a pasta `dist/`. Em rotas internas, configurar fallback para `index.html` caso sejam adicionadas páginas.

## Conteúdo

Textos em português europeu, respeitando a ortografia anterior ao Acordo Ortográfico de 1990.
