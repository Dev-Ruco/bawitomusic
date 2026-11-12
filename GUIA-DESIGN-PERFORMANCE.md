# Bawito Music & Serviços — Regras de design, experiência e desempenho

Este guia deve ser considerado em **todas as alterações futuras** ao website.

## 1. Posicionamento e comunicação
- Empresa moçambicana de produção técnica e gestão de eventos, com prioridade à vertente corporativa.
- Comunicação clara, sóbria e persuasiva. O utilizador deve identificar os serviços e conseguir pedir um orçamento sem esforço.
- Português europeu, ortografia anterior ao Acordo de 1990.
- Fotografias ilustrativas devem ser explicitamente identificadas até serem substituídas por trabalhos reais. Nunca inventar clientes, testemunhos, prémios ou indicadores.

## 2. Sistema visual
- Azul-marinho profundo `#071629` para superfícies de contraste; azul `#138bc4` para elementos de marca; ciano `#48c4f4` para acções primárias.
- Fundos claros para leitura prolongada; evitar excesso de efeitos, gradientes e ornamentos.
- Tipografia: Manrope em títulos e DM Sans em textos; hierarquia H1 > H2 > H3 e espaçamentos coerentes.
- Fotografia de alta qualidade, focada na experiência de eventos corporativos, equipamentos e operações técnicas.
- Componentes reutilizáveis, texto responsivo e consistência de cantos, espaçamentos, estados e ícones.

## 3. Mobile-first e acessibilidade
- Testar larguras de 320, 360, 390, 620, 768, 1024 e 1440 px antes de publicar.
- Sem deslocação horizontal acidental; contrastes equivalentes a WCAG AA e foco visível em todos os controlos.
- Alvos tácteis com dimensão mínima próxima de 44 x 44 px; campos de formulário legíveis (16 px no iOS).
- Menus com fecho por Escape; legendas significativas, títulos únicos, labels de formulários e nomes acessíveis para botões.
- Preferência `prefers-reduced-motion` sempre respeitada.

## 4. Animação e interacção
- Usar movimento apenas para explicar transições, indicar selecção e orientar atenção.
- Dar preferência a `opacity` e `transform`, evitar animações que alterem dimensões e provoquem layout shift.
- Transições de interface normalmente entre 150–450 ms; revelar elementos de forma subtil.
- A página deve continuar legível sem JavaScript e sem animações.

## 5. Desempenho
- Meta de campo nos Core Web Vitals, percentil 75: LCP <= 2,5 s, INP <= 200 ms, CLS <= 0,1. Metas, não métricas medidas.
- Carregar a imagem LCP cedo e com prioridade; o Hero não pode usar lazy loading.
- Fotografias em WebP/AVIF quando disponível, com `srcSet`, `sizes`, `width`, `height` e lazy loading abaixo da primeira dobra.
- Evitar dependências novas sem benefício claro; não bloquear carregamento com bibliotecas de animação pesadas.
- Rever o volume de JavaScript, CSS, imagens e fontes após cada intervenção.

## 6. SEO técnico
- URL canónica em HTTPS, título descritivo e meta description relevante em cada página.
- HTML pré-renderizado para conteúdo indexável, dados estruturados válidos e sitemap actualizado.
- Um H1 claro por página, títulos H2/H3 coerentes, navegação por âncoras e alt text descritivo.
- Metadados Open Graph com URL absoluta; idealmente capa JPG/PNG 1200x630 para redes sociais.
- Testar indexação no Google Search Console e submeter sitemap após lançamento.

## 7. Qualidade e publicação
- Compilar TypeScript/Vite e validar `npm run check:site`; testar imagem Docker/Nginx.
- Validar visualmente experiências móveis e desktop e o percurso de conversão antes de anunciar melhorias em produção.
- O repositório principal é `Dev-Ruco/bawitomusic`, ramo `main`; publicação via Coolify.
- Nunca alterar DNS, e-mail, infra-estrutura do servidor ou integrações comerciais sem necessidade e validação do âmbito.
