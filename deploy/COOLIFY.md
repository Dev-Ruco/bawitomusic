# Publicar a Bawito Music no servidor com Coolify

Este projecto já contém um `Dockerfile` que compila React/Vite com Node.js 22 e executa o website estático através do Nginx na porta **80**. Não necessita de Supabase, variáveis de ambiente ou de expor novas portas do servidor.

## Passos rápidos

1. Abrir o painel do **Coolify** e seleccionar o servidor/projecto pretendido.
2. Escolher **+ New > Public Repository** (ou o repositório através da GitHub App, se já estiver ligada).
3. Indicar `https://github.com/Dev-Ruco/bawitomusic`, ramo `main`.
4. Seleccionar **Build Pack / Build Strategy: Dockerfile**.
5. Definir **Base Directory:** `/` e **Dockerfile Location:** `Dockerfile` (ou `/Dockerfile` caso a interface peça um caminho absoluto).
6. Nas definições de rede, definir **Ports Exposes = 80**. Não configurar um novo mapeamento público de portas: o proxy do Coolify trata do tráfego.
7. Usar primeiro o domínio de teste gerado pelo Coolify e escolher **Deploy**.
8. Abrir o endereço atribuído. Deverá aparecer a página “Bawito Music & Serviços”.

## Domínio próprio

Depois de testar, acrescentar o domínio pretendido em **Domains**, com HTTPS. No DNS do domínio, criar/ajustar o registo A para apontar ao IP público do servidor do Coolify. Activar HTTPS no Coolify. Não reutilizar domínios ou portas já atribuídos a outros serviços.

## Actualizações

Quando alterar o ramo `main` no GitHub, usar **Redeploy** no Coolify; se a integração GitHub estiver configurada com deploy automático, a actualização será desencadeada automaticamente.

## Verificações e resolução de problemas

- **Build failed:** abrir **Deployments > Logs** e confirmar se a compilação `npm run build` terminou.
- **Bad Gateway / 502:** confirmar que a porta interna configurada é `80` e que o container está saudável.
- **Página em branco:** confirmar a existência de `index.html`, `assets/` e analisar os erros no browser.
- **404 em rotas internas:** o ficheiro `deploy/nginx.conf` já contém fallback de SPA para `index.html`.
- **SSL pendente:** confirmar o registo DNS, o estado do proxy do Coolify e que as portas 80/443 estão acessíveis.
- **Teste de saúde:** `https://<dominio>/healthz` deve devolver `ok`.

O website é uma aplicação estática; não é necessário criar uma base de dados ou guardar ficheiros persistentes.

**Nota:** confirmar que os contactos, logótipo e fotografias institucionais estão correctos antes de divulgar o website.
