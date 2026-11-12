# MEMORY — site-didas-powerbi

> Memória de programador do projeto. Lê isto no começo de cada sessão em vez de reabrir o PDF.
> Fonte: `Projeto_Site_Comercial_DIDAS_Power_BI.pdf` (lido em 2026-11-11).

## O que é
Site comercial **one-page** da **DIDAS** ("Gestão que vira decisão.") para vender projetos de **Power BI** para PMEs.
Objetivo: canal comercial que gera **leads qualificados** via formulário de diagnóstico + WhatsApp.

## ARQUITETURA ATUAL (2026-11-11, refator anti-slop)
**Multi-página** (não é mais one-page). Páginas: `index.html` (início/hero), `desafio.html`, `solucao.html`, `processo.html`, `contato.html`. Header/footer duplicados em cada página; nav ativa por `aria-current` (JS via pathname). Seleção de desafios passa entre páginas via `localStorage` (`didas_desafios`); `contato.html` pré-marca os checkboxes.
**Design system novo** (`styles.css`): tema escuro chapado (ink `#0B0A12`, painel `#14111F`), **roxo `#782CFE` como acento ÚNICO e sólido** (sem gradiente decorativo, sem blobs de fundo, sem glass/backdrop-blur). Tipografia **Space Grotesk** (display, escala editorial) + **Inter** (corpo). Raios variados (--r-xs/sm/md, pill só em tags). Dados em verde/vermelho funcionais. Favicon = `assets/img/favicon.webp` (ícone glossy); logo header = `didas-logo.webp` (wordmark).
Componentes: `.device` (painel/KPIs), `.ledger` (desafios numerados), `.caps` (capacidades numeradas), `.steps` (etapas), `.tabs`, `.form`. Form continua **STUB** (M3 = PHP/MySQL).

## CRÉDITO TERMINAL404 + ADMIN FRONT (2026-11-11)
**Terminal404** = agência que desenvolve (CNPJ **51.745.368/0001-10**, site **https://www.terminal404.com.br/**, logo `assets/img/terminal404.webp`). Nas 5 páginas: crédito fixo no canto inf. esquerdo (`.site-credit`, some no mobile <620px) + linha no rodapé "Desenvolvido por Terminal404 · CNPJ · WhatsApp <#wa-text>". **WhatsApp = TODO** (número não informado); fonte única `WHATSAPP_NUMERO` em `main.js` → quando preenchido, alimenta o botão do site E o `#wa-text` do rodapé (decisão: mesmo número no botão).
**Crédito final:** UM só — "por Terminal404" (logo + link) **estático** no rodapé (não é mais fixed/flutuante). Removido o "Desenvolvido por Terminal404". CNPJ + WhatsApp numa `.credit-meta` no rodapé. (`.site-credit` em `styles.css`.)
**REGRA DE BACKEND (próxima rodada, decisão do usuário):** login/cadastro **só para e-mails do domínio da empresa** (`@terminal404.com.br`). Validar no servidor (não só no front). Mostrada no `login.html`, `cadastro.html` e `configuracoes.html`.
**Painel admin = SÓ FRONT (mock), sem backend ainda** (decisão do usuário: front primeiro). Painel com **sidebar** (Visão geral / Leads / Configurações) + `admin.css` + `admin.js` (sidebar ativa, filtro, busca, drawer). Páginas: `login.html` + `cadastro.html` (auth, regra de domínio), `index.html` (dashboard: stats + gráfico leads/dia + últimos leads), `leads.html` (tabela com busca + filtro + **drawer** de detalhe), `configuracoes.html` (conta, domínio permitido, WhatsApp do site). Tudo mock. Ícones SVG (sem emoji). Reaproveita tokens do `styles.css`.
**PRÓXIMA RODADA (backend):** `sql/schema.sql`, `api/config.php`+`config.local.php`, `api/submit-lead.php`, login real (sessão/password_hash/CSRF), gravar+listar leads do MySQL, wiring do form (hoje STUB). Vai pra **hospedagem** → entregar + DEPLOY.md.

## Stack (fixa, decidida pelo cliente)
- Front: **HTML5 + CSS3 + JavaScript puro** (sem framework)
- Back: **PHP** (handler do formulário)
- Banco: **MySQL** (tabela de leads)
- Formato: one-page, 5 seções com âncoras, menu fixo, responsivo, acessível.

## Identidade visual (PALETA FINAL — tema escuro, substitui a do PDF)
Cliente entregou logo oficial (`assets/img/didas-logo.webp`) + paleta dark em 2026-11-11:
- Roxo principal `#782CFE` · Roxo profundo `#5416C8` · Violeta luminoso `#B34BFF`
- Fundo escuro `#0C0928` · Superfície `#15102D` · Branco `#FFFFFF`
- Fontes: **Sora** (títulos) + **Inter** (corpo), via Google Fonts.
- Tipografia sem serifa, cards de cantos moderados, ícones lineares, muito espaço em branco.
- Movimento com moderação (entradas curtas, transições suaves). Mascote: lontra, uso pontual.
- Evitar: fotos genéricas, jargão "data-driven" em excesso, promessas de faturamento, CTAs competindo.
- Tokens CSS em `assets/css/styles.css` (`:root`).

## As 5 seções (navegação por âncora na mesma página)
1. **INÍCIO** — Hero. "Seu negócio não precisa de mais planilhas. Precisa enxergar o que elas estão tentando mostrar." Botões: *Quero avaliar minha gestão* (→ seção 5), *Entenda como funciona* (→ seção 4). Prévia visual de dashboard (dados fictícios, marcar "demonstração").
2. **O QUE ESTÁ POR TRÁS DOS NÚMEROS?** — Identificação do problema. 4 cards de desafios clicáveis (Dados espalhados, Relatórios que consomem tempo, Indicadores sem contexto, Gestão no retrovisor). Seleção atualiza frase e é transferida ao formulário (seção 5).
3. **A SOLUÇÃO DIDAS** — Benefícios: Mapeamento, Organização de indicadores, Painéis personalizados, Acesso, Evolução. Dashboard demo com abas/filtros (Comercial, Financeiro, Operação) com base fictícia.
4. **DA INFORMAÇÃO À DECISÃO** — Processo em 5 etapas (Conversa/Diagnóstico, Mapeamento, Planejamento, Desenvolvimento/Validação, Entrega). Timeline vertical (mobile) / horizontal (desktop), detalhe ao clique. CTA → seção 5.
5. **VAMOS OLHAR PARA A SUA GESTÃO?** — Conversão. Formulário + WhatsApp.

## Formulário (seção 5) → PHP → MySQL
Campos: Nome* | Empresa/segmento* | E-mail ou WhatsApp* (um dos dois) | Principal desafio* (seleção múltipla, pré-preenchido pelos cards da seção 2) | Como organiza os dados hoje? (lista + opcional) | Mensagem (livre).
Comportamento: validação de campos, **proteção anti-spam** (honeypot + rate limit), confirmação na própria página, registro no MySQL + envio por e-mail comercial. Aviso de privacidade/consentimento (LGPD).
WhatsApp: botão com mensagem pré-preenchida, número oficial configurável.

## Pendências do cliente (placeholders até receber)
Logo vetor/PNG · número WhatsApp oficial · e-mail comercial · exemplos de dashboard/cases · escopo/serviços · política de privacidade. Marcar no código como `TODO: cliente`.

## Critérios de aceite (fim = M4)
5 seções completas · navegação e CTAs ok em mobile/desktop · formulário envia e grava · WhatsApp abre contato certo · textos/imagens revisados · eventos de conversão medindo · política de privacidade acessível.

## Marcos (economia de token / não esquecer)
- **M1 — Começo** ✅ pasta, estrutura, memória, README.
- **M2 — Início** esqueleto HTML5 das 5 seções + CSS base (tokens de cor) + `schema.sql` (tabela leads) + `config.php` (conexão PDO). Skill: `mysql-backend`.
- **M3 — Meio** JS (navegação ativa, cards→form, dashboard demo com abas) + `submit-lead.php` (validação, anti-spam, insert, e-mail) + WhatsApp + integração front↔back. Skills: `code-implementation`, `frontend-design`/`taste-skill`.
- **M4 — Fim** segurança (prepared statements, honeypot, escape), acessibilidade, SEO/meta, revisão e verificação. Skills: `owasp-security`, `security-code-review`.

## Estado atual
**M1 + front-end completo (M2/M3 front) concluídos.** Arquivos: `index.html`, `assets/css/styles.css`, `assets/js/main.js`, `assets/img/didas-logo.webp`.
Front-end entrega: 5 seções, nav ativa, menu mobile, cards→form sincronizados, dashboard demo com abas, timeline expansível, form com validação JS (regra e-mail-ou-WhatsApp + honeypot + consentimento), WhatsApp (`WHATSAPP_NUMERO` vazio = TODO cliente). **Envio do form é STUB** (não posta em lugar nenhum ainda).
**Próximo: M3 back-end** — `api/submit-lead.php` (validação server-side, prepared statements, anti-spam, e-mail), `sql/schema.sql`, `api/config.php` (PDO), e trocar o stub do `main.js` por `fetch` POST. **M4** = segurança/a11y/SEO/revisão final.
**Revisão aplicada (design + acessibilidade, 2 agentes):** timeline virou `<button aria-expanded aria-controls>` + detalhe com `hidden` (semântica/teclado); formulário ganhou resumo de erros `role="alert"` com foco, `aria-invalid`/`aria-describedby`, e corrigido o bug do texto de erro de contato; contraste AA (gradiente dos botões `--grad-cta` fim #9B3BF0, WhatsApp #157a3f, selo `#D4A5FF`, bordas de controle `--borda-campo` .4); `scroll-padding-top`, `.sr-only`, `[hidden]!important`, `aria-current` na nav, `.js` gate no reveal, Escape fecha menu, Home/End nas abas, cor semântica dos deltas de KPI.

**Deferido p/ M4 (polish, não-crítico):** consolidar escala tipográfica em tokens; conector contínuo + nós na timeline mobile; sr-only por delta de KPI; validação de dígitos mínimos no WhatsApp; padronizar altura dos gráficos; honeypot com `inert`. Nota: a confirmação "Recebemos suas informações" é o texto final pretendido, mas hoje o envio é STUB (vira verdade no M3).

Pendências do cliente: número WhatsApp, e-mail comercial, favicon quadrado, política de privacidade.
