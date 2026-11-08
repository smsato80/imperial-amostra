# CHANGELOG — Site de demonstração Imperial Select

Formato: data, commit, o que mudou. Histórico de publicações e pontos de restauração em `RELEASES.md`.

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
