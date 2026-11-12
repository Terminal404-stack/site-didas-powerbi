# DIDAS — Site Comercial (Power BI)

Site one-page para apresentar e vender projetos de Power BI da **DIDAS**.
_"Gestão que vira decisão."_

## Stack
- **Front:** HTML5, CSS3, JavaScript puro
- **Back:** PHP (handler do formulário de leads)
- **Banco:** MySQL (armazenamento de leads)

## Estrutura (planejada)
```
site-didas-powerbi/
├── index.html            # one-page, 5 seções
├── assets/
│   ├── css/styles.css    # tokens de cor + layout responsivo
│   ├── js/main.js        # navegação, cards→form, dashboard demo
│   └── img/              # logo, mascote, prévias (placeholders)
├── api/
│   ├── config.php        # conexão PDO (MySQL) — NÃO versionar credenciais
│   └── submit-lead.php   # valida, anti-spam, grava, envia e-mail
├── sql/
│   └── schema.sql        # tabela `leads`
├── MEMORY.md             # memória do projeto (resumo do PDF + estado)
└── README.md
```

## Marcos
| Marco | Entrega |
|-------|---------|
| **M1 — Começo** ✅ | Pasta, estrutura, memória, README |
| **M2 — Início** | HTML das 5 seções + CSS base + schema MySQL + conexão PHP |
| **M3 — Meio** | JS interativo + back-end do formulário + WhatsApp |
| **M4 — Fim** | Segurança, acessibilidade, SEO, verificação final |

## Rodar localmente (a partir do M2)
```bash
php -S localhost:8000
```
Banco: importar `sql/schema.sql` no MySQL e preencher `api/config.php`.

> Projeto de conceito. Materiais da marca, número de WhatsApp, e-mail e política de privacidade são pendências do cliente (marcados como `TODO: cliente`).
