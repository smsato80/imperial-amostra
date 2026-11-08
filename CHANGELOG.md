# CHANGELOG — Site de demonstração Imperial Select

Formato: data, commit, o que mudou. Histórico de publicações e pontos de restauração em `RELEASES.md`.

## 2026-11-08 — Hero em WebP + Voltar na 4ª etapa (commit e6db1dd)
- Hero otimizado com autorização expressa do Minoru: WebP q92 (286.718 bytes) gerado do PNG oficial, mesmas dimensões (1672×941), enquadramento, cores, reflexos e logomarcas; comparação visual lado a lado em 1440px e 390px e zoom na área do carro/loja sem diferença perceptível (PSNR 34,9 dB). O PNG original (2.015.055 bytes, SHA-256 b8850578…) permanece no repositório como backup e é o fallback do <picture> e do image-set da faixa de reflexo.
- Botão Voltar corrigido: a regra de exibição cobria só as etapas 2 e 3; agora cobre também a 4ª, sem mudança de design. Verificado com cliques reais (visibilidade + retorno até a etapa 1) em fibra (4 etapas), shaken e compra (3 etapas).
- Desempenho medido localmente (servidor de desenvolvimento, throttling simulado do Lighthouse mobile, antes × depois nas mesmas condições): Performance 64 → 71; LCP simulado 22,0s → 10,5s; Acessibilidade 100, Boas práticas 96, SEO 100 e CLS 0 mantidos. Arquivo do hero: −85,8%.
- Testes: 45/45 (desktop) + 39/39 (mobile) + suíte do Voltar, tudo com mock de rede identificado. GA4 não configurado; nenhum envio real ao AIOS.

## 2026-11-08 — Refinamento mobile premium (commit 8ecd3c5)
- Formulários mobile: validação inline sem nenhum alert() — WhatsApp validado (Japão 10/11 dígitos começando com 0; Brasil com DDD ou +55; internacional 7–15 dígitos), e-mail opcional validado quando preenchido, erro exibido junto ao campo (destaque + texto) com foco no primeiro erro. Etapas em blocos de ~3 perguntas (shaken/manuais ganharam 3ª etapa); modal limitado à altura útil da tela, inclusive em telas curtas (667px) e paisagem.
- Divisões no celular: cards horizontais (foto oficial à esquerda, nome/descrição/Conhecer à direita), ~146px cada; seção caiu de ~1.900px para ~995px no 390px.
- Barra fixa de contato no celular ("Falar com a Imperial") com safe-area, some com formulário/lightbox abertos e não encobre o rodapé; header mobile compacto (64px).
- Lightbox com zoom ao tocar na arte; galeria 2 colunas no celular; QR menor; espaçamentos de seção reduzidos no mobile; prefers-reduced-motion respeitado.
- Medição de conversão instrumentada via dataLayer (service_click, form_start, form_step, form_submit_success, form_submit_error, whatsapp_click) com serviço e idioma, sem nenhum dado pessoal. Nenhuma ferramenta de analytics está conectada ainda.
- Acessibilidade: aria-label nos botões de ampliar (atualiza com o idioma) e alvo de toque do FAQ da Drive School ≥24px. Lighthouse local (servidor de desenvolvimento): Acessibilidade 100, Boas práticas 96, SEO 100, CLS 0; Performance 66–70 limitada pelo PNG oficial do hero (2,0 MB) sob throttling simulado — arquivo protegido, troca por WebP depende de autorização.
- Testes: 39/39 mobile (8 larguras, 5 alturas, paisagem, PT/JA, validação, analytics) + 45/45 de regressão desktop, tudo com mock de rede identificado.

## 2026-11-08 — Ajuste fino final (commit 600e174)
- WhatsApp com máscara automática ao digitar: Japão 090-6464-0042 (3-4-4) e Brasil (11 98765-4321 ou +55 11 98765-4321). No envio, o payload leva só os dígitos. Frase de ajuda abaixo do rótulo removida.
- Campo E-mail (opcional) novo no formulário, enviado como campo próprio do payload quando preenchido.
- Formulário sem rolagem interna: desktop em grade compacta de 3 colunas (Enviar visível em 1366×768 e 1440×900 em todos os serviços testados); celular com wizard de etapas curtas (blocos de ~3 perguntas, até 4 etapas nos formulários longos), com indicador e preservação de dados.
- Conectividade em duas colunas no desktop: imagem inteira na proporção original de um lado, cards de Fibra/Torre/Pocket do outro; no celular empilha.
- Traduções: flyer saiu da página e entrou no modal — clicar em um serviço abre o formulário com a arte ao lado (ampliável em lightbox sem resetar o que foi digitado).
- Veículos: flyers dentro de painel com título "Serviços e valores".
- Contato em 3 colunas: telefone grande + licença do Rodrigo logo abaixo (só "Rodrigo Tanaka", sem PORTO), endereço/horários e CTAs no meio, QR Code ao lado. Licença aparece uma única vez na página; rodapé voltou a 3 colunas, sem licença.
- Drive School intocado. Testes: 45/45 aprovados em navegador real (mock de rede identificado).

## 2026-11-08 — Refinamento premium (commit 61d5c3e)
- Divisões: quatro cards em uma única linha no desktop largo (cards de ~296 px, foto 16:9), 2×2 no intermediário, empilhado no celular. Seção inteira com 709 px em 1366×768 (antes 1.506 px).
- Banners panorâmicos das seções com altura compacta (300 px desktop, 240/180 px nas telas menores), sem dominar a tela.
- Flyers viraram vitrine: miniatura proporcional sem cortes, nome do serviço, botão Ampliar e CTA próprio. Clicar na arte abre lightbox com a arte ORIGINAL integral (PNGs originais do Drive no repositório, carregados só na ampliação); dentro do lightbox, o CTA abre o formulário do serviço. Escape fecha e devolve o foco.
- Formulários: modal de 840 px no desktop com campos em duas colunas e inputs alinhados; Interesse virou selo compacto somente leitura. No celular, formulários longos ganham 2 etapas (identificação → detalhes) com indicador, voltar sem perder dados e Enter avançando de etapa; formulários simples seguem em etapa única. Payload, validações e placeholders preservados.
- Rodapé institucional em 4 colunas (marca, divisões, contato, licença); a seção isolada da licença saiu e a licença do Rodrigo Tanaka entrou compacta no rodapé, legível e identificada como pessoal.
- Botão "Voltar à apresentação" do modo vitrine (index) discreto: escuro translúcido com borda dourada, menor e semi-transparente até o foco/hover.
- Testes: 39/39 aprovados em navegador real (mock de rede identificado), incluindo divisões em 1366×768/1600×900/1920×1080, lightbox, etapas mobile com payload íntegro e regressões do seguro/SUV.

## 2026-11-08 — Correção complementar (commit a8a6b07)
- Área institucional: Rodrigo Tanaka identificado com a licença comercial japonesa （古物商許可証， 静岡県公安委員会, 第49128A000725号, 交付 令和6年3月1日), apresentada como licença pessoal do responsável, com divulgação autorizada pelo titular.
- 10 imagens oficiais do Drive incorporadas em WebP no próprio repositório: banners das quatro divisões e flyers de Shaken, Manutenção, Seguro, Leilão/Financiamento e Traduções. Imagem, título e botão de cada serviço abrem o mesmo formulário.
- Formulários dinâmicos por serviço no modal existente: geral, shaken, manutenção, seguro (vencimento condicional), financiamento (com aviso de estimativa), leilão, compra/busca (tipo pré-selecionado pela categoria clicada), entrega (novo), traduções (serviço pré-selecionado), conectividade e Drive School.
- Placeholder da mensagem próprio por serviço em PT/EN/JA; sem herança de texto entre serviços; troca de idioma preserva os dados digitados; campo Interesse somente leitura.
- Textos do formulário corrigidos para produção (removidos os textos de "prévia/simulação" herdados da cópia de testes).
- UX do modal: ajuda do WhatsApp abaixo do rótulo, alvos de toque maiores, espaçamento consistente.
- Testes: 45/45 aprovados em navegador real (mock de rede identificado), 5 larguras sem overflow, payloads conferidos, zero erros de JavaScript.

## 2026-11-08 — Revisão consolidada publicada (commit 1dcde12)
- index.html e site.html da Entrega Consolidada: idioma preserva campos preenchidos, resposta atrasada do formulário não sobrescreve formulário reaberto, foco e armadilha de Tab do modal, títulos japoneses com quebra por expressão, hero novo (hero-imperial-sem-textos.png + imperial-logo-oficial-drive.jpg).
- Textos de produção do AIOS restaurados no index; removida a trava da cópia de prévia.

## 2026-11-07 — Fotos de categorias definitivas (commit 7496ec6)
- Kei = Honda N-BOX Custom Turbo, Compactos = Toyota Yaris Hybrid, Família = Toyota Voxy ZS Kirameki II, Sedans = Toyota Prius Z 2023 (Wikimedia Commons CC0), SUV preservado (Pexels 4250866).
