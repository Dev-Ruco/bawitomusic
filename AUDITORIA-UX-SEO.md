# Auditoria inicial — Bawito Music & Serviços

## Objectivo
Oferecer uma experiência profissional, rápida e acessível em dispositivos móveis e computadores, sem sobrecarregar a página com animações.

## Melhorias aplicadas
- Imagem do Hero com tamanhos diferentes para telemóveis e computadores; prioridade de carregamento no HTML.
- Fotografias abaixo da primeira dobra com srcSet, sizes, lazy loading, descodificação assíncrona e dimensões declaradas.
- Conteúdo legível sem JavaScript; movimentos discretos e respeito pelas preferências de movimento reduzido.
- Destaque da secção activa na navegação e fecho do menu móvel pela tecla Escape.
- Filtros da galeria com deslocação horizontal e áreas de toque superiores no telemóvel.
- Texto móvel mais legível e campos de formulário com tamanho de letra que evita zoom involuntário no iOS.
- URL canónica, OG URL absoluto, sitemap, robots e dados estruturados de empresa e serviços.
- Validação nativa de formulário e alternativa de abertura do WhatsApp.

## A confirmar em produção
- Testar PageSpeed Insights e Core Web Vitals em campo, separando Mobile e Desktop.
- Confirmar carregamento e direitos de utilização de todas as fotografias de Unsplash; substituir por fotografias próprias.
- Confirmar contactos e dados institucionais; logótipo final.
- Medir taxas de cliques nos pedidos de orçamento com consentimento e ferramenta de analítica apropriada.
- Registar o domínio no Google Search Console, submeter sitemap e validar indexação.
- Validar acessibilidade e interacções com utilizadores reais, inclusive teclado e leitores de ecrã.
- A actual imagem Open Graph é SVG: substituir por JPG/PNG 1200x630 para pré-visualização em redes sociais mais compatível.

## Indicadores de referência
Google recomenda LCP <=2,5 s, INP <=200 ms e CLS <=0,1 no percentil 75 das visitas. Estes limites são objectivos, **não medições** do website.
