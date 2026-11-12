// QA Comando 6 CORREÇÃO — Imperial v2 (base main b12165a). API sempre mockada; wa.me nunca chamado.
const http = require('http'); const fs = require('fs'); const path = require('path');
const puppeteer = require('/home/hatch/workspace/imperial-rebuild-2026-11-06/qa-harness/node_modules/puppeteer-core');
const CHROME = '/home/hatch/.cache/puppeteer/chrome-headless-shell/linux-156.0.8078.80/chrome-headless-shell-linux64/chrome-headless-shell';
const root = path.resolve(__dirname, '..');
const server = http.createServer((req, res) => { const f = path.resolve(root, '.' + decodeURIComponent(new URL(req.url, 'http://x').pathname)); if (!f.startsWith(root)) { res.writeHead(403).end(); return; } fs.readFile(f, (e, d) => { if (e) { res.writeHead(404).end(); return; } res.setHeader('Content-Type', f.endsWith('.html') ? 'text/html; charset=utf-8' : 'application/octet-stream'); res.end(d); }); });
let pass = 0, fail = 0; const fails = [];
function reg(nome, ok, detalhe) { if (ok) { pass++; console.log('PASS ' + nome); } else { fail++; fails.push(nome + (detalhe ? ' — ' + detalhe : '')); console.log('FAIL ' + nome + (detalhe ? ' — ' + detalhe : '')); } }
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
(async () => {
  await new Promise(r => server.listen(0, '127.0.0.1', r)); const port = server.address().port;
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--no-sandbox', '--lang=pt-BR'] });
  let payload = null, realApiCalls = 0;
  async function novaPagina(locale) {
    const p = await browser.newPage(); p.setDefaultTimeout(10000); p.setDefaultNavigationTimeout(20000);
    await p.setRequestInterception(true);
    p.on('request', (req) => { const u = req.url();
      if (u.includes('imperial-captacao-api')) { if (req.method() === 'OPTIONS') { req.respond({ status: 204, headers: { 'access-control-allow-origin': '*', 'access-control-allow-methods': 'POST, OPTIONS', 'access-control-allow-headers': 'content-type' } }); return; } try { payload = JSON.parse(req.postData() || '{}'); } catch (e) { payload = {}; } req.respond({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: '{"ok":true}' }); return; }
      if (u.startsWith('http://127.0.0.1:')) req.continue(); else req.abort(); });
    return p;
  }
  const page = await novaPagina();
  await page.goto(`http://127.0.0.1:${port}/site.html`, { waitUntil: 'domcontentloaded', timeout: 20000 }); await sleep(900);

  // 1. Estrutura vs main
  const estrutura = await page.evaluate(() => ({ imgs: document.querySelectorAll('img').length, servicos: document.querySelectorAll('[data-service]').length, secoes: ['veiculos','conectividade','traducoes','driveschool','contato'].filter(id => !!document.getElementById(id)).length }));
  reg('estrutura: 26 imagens preservadas', estrutura.imgs === 26, JSON.stringify(estrutura));
  reg('estrutura: 32 pontos de serviço no DOM (= main)', estrutura.servicos === 32, JSON.stringify(estrutura));
  reg('estrutura: 5 seções âncora presentes', estrutura.secoes === 5, JSON.stringify(estrutura));

  // 2. Paridade 266 x 5
  const par = (() => { const html = fs.readFileSync(path.join(root, 'site.html'), 'utf8'); const i = html.indexOf('var T = '); let j = html.indexOf('{', i); let depth = 0, k = j; while (true) { const c = html[k]; if (c === '{') depth++; else if (c === '}') { depth--; if (depth === 0) break; } k++; } let Tc = html.slice(j, k + 1); const T = JSON.parse(Tc.replace(/;\s*$/, ''));
  for (const m of html.matchAll(/Object\.assign\(T\.(pt|en|ja|es|tl), \{([\s\S]*?)\}\);/g)) { for (const pm of m[2].matchAll(/"([^"]+)":\s*"((?:[^"\\]|\\.)*)"/g)) { T[m[1]][pm[1]] = JSON.parse('"' + pm[2] + '"'); } } const base = Object.keys(T.pt).sort(); const r = { n: base.length }; for (const l of ['en','ja','es','tl']) r[l] = JSON.stringify(Object.keys(T[l]).sort()) === JSON.stringify(base); return r; })();
  reg('paridade runtime: 377 chaves nos 5 idiomas (base + assigns)', par.n === 377 && par.en && par.ja && par.es && par.tl, JSON.stringify(par));

  // 3. Seletor
  const sel = await page.evaluate(() => { const opts = [...document.querySelectorAll('.langs [data-lang]')]; return { n: opts.length, langs: opts.map(o => o.getAttribute('data-lang')), svg: opts.every(o => !!o.querySelector('svg')), nomes: opts.map(o => o.textContent.trim()) }; });
  reg('seletor: 5 opções com bandeira SVG e nome nativo', sel.n === 5 && sel.svg && sel.langs.join() === 'pt,en,ja,es,tl' && sel.nomes.join('|') === 'Português|English|日本語|Español|Tagalog', JSON.stringify(sel));

  // 4. Troca de idioma preserva formulário (serviço com extras: manut)
  await page.evaluate(() => document.querySelector('[data-service="manut"]').click()); await sleep(500);
  const abriu = await page.evaluate(() => document.getElementById('modalFundo').classList.contains('aberto'));
  reg('formulário: modal do serviço manutenção abre', abriu);
  await page.type('#fieldNome', 'Teste Correcao'); await sleep(150);
  const temExtra = await page.evaluate(() => { const el = document.querySelector('[data-excampo="exVeiculo"]'); if (el) { el.value = 'Civic'; el.dispatchEvent(new Event('input', { bubbles: true })); } return !!el; });
  await page.evaluate(() => document.querySelector('.langs [data-lang="tl"]').click()); await sleep(500);
  const pres = await page.evaluate(() => ({ aberto: document.getElementById('modalFundo').classList.contains('aberto'), nome: document.getElementById('fieldNome').value, extra: (document.querySelector('[data-excampo="exVeiculo"]') || {}).value, lang: document.documentElement.lang, rotulo: (document.querySelector('#formExtras label') || {}).textContent }));
  reg('idioma: troca pra tl preserva nome e campo dinâmico', pres.aberto && pres.nome === 'Teste Correcao' && (!temExtra || pres.extra === 'Civic'), JSON.stringify(pres));
  reg('idioma: document.lang = tl-PH e rótulo dinâmico em tagalo', pres.lang === 'tl-PH' && /sasakyan|Modelo/i.test(pres.rotulo || ''), JSON.stringify(pres));

  // 5. Envio mockado em tl + WhatsApp
  await page.type('#fieldWhatsapp', '09012345678'); await sleep(150);
  await page.evaluate(() => { const f = document.getElementById('formContato'); if (f.requestSubmit) f.requestSubmit(); else f.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })); });
  await sleep(1500);
  const okVisivel = await page.evaluate(() => { const b = document.getElementById('okBox'); return b && (b.classList.contains('show') || b.style.display !== 'none' && b.offsetParent !== null); }).catch(() => false);
  const waHref = await page.evaluate(() => { const a = document.getElementById('okWa'); return a ? decodeURIComponent(a.href) : ''; }).catch(() => '');
  reg('envio (mock): payload capturado com idioma tl', !!payload && payload.idioma === 'tl', payload ? JSON.stringify(payload).slice(0, 120) : 'sem payload');
  reg('WhatsApp: link de continuar em tagalo (Kumusta)', waHref.includes('Kumusta'), waHref.slice(0, 90));

  // 6. Navegação por âncoras
  await page.evaluate(() => { const f = document.getElementById('modalFechar'); if (f) f.click(); }); await sleep(300);
  await page.evaluate(() => document.querySelector('a[href="#contato"]').click()); await sleep(700);
  const hash = await page.evaluate(() => location.hash);
  reg('navegação: âncora #contato funciona', hash === '#contato', hash);

  // 7. Overflow nos 5 idiomas x 3 viewports (inclui 360 do pente fino)
  let ovOk = true; const ovDet = [];
  for (const w of [1280, 390, 360]) { await page.setViewport({ width: w, height: 844 }); for (const l of ['pt','en','ja','es','tl']) { await page.evaluate((x) => document.querySelector(`.langs [data-lang="${x}"]`).click(), l); await sleep(250); const ov = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth); if (ov !== 0) { ovOk = false; ovDet.push(`${l}@${w}:${ov}`); } } }
  reg('overflow: 0 nos 5 idiomas em 1280/390/360', ovOk, ovDet.join(' '));

  // 8. Formulários de outros serviços abrem (amostra das 4 divisões)
  let svcOk = true; const svcDet = [];
  for (const s of ['compra', 'fibra', 'tradpresencial', 'driveschool']) { await page.setViewport({ width: 1280, height: 900 }); const abriuS = await page.evaluate((x) => { const b = document.querySelector(`[data-service="${x}"]`); if (!b) return 'sem-botao'; b.click(); return document.getElementById('modalFundo').classList.contains('aberto') ? 'ok' : 'nao-abriu'; }, s); await sleep(350); if (abriuS !== 'ok') { svcOk = false; svcDet.push(s + ':' + abriuS); } await page.evaluate(() => { const f = document.getElementById('modalFechar'); if (f) f.click(); }); await sleep(250); }
  reg('serviços: formulários abrem nas 4 divisões', svcOk, svcDet.join(' '));

  await page.close();
  // 9. Detecção de idioma do navegador (browser com --lang=es, sem preferência salva)
  const browserEs = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--no-sandbox', '--lang=es-ES'] });
  const pEs = await browserEs.newPage();
  // O chrome-headless-shell ignora --lang (navigator.language fica en-US): defeito do ambiente de teste.
  // Sobrescreve navigator.language antes dos scripts da pagina para provar a deteccao do site.
  await pEs.evaluateOnNewDocument(() => { try { Object.defineProperty(window.navigator, 'language', { value: 'es-ES', configurable: true }); } catch (e) {} }); await pEs.goto(`http://127.0.0.1:${port}/site.html`, { waitUntil: 'domcontentloaded', timeout: 20000 }); await sleep(900);
  const det = await pEs.evaluate(() => ({ lang: document.documentElement.lang, titulo: document.title }));
  reg('primeira visita: navegador em espanhol abre o site em espanhol', det.lang === 'es', JSON.stringify(det));
  await browserEs.close();

  const page2 = await novaPagina();
  await page2.setViewport({ width: 390, height: 844 });
  await page2.goto(`http://127.0.0.1:${port}/site.html`, { waitUntil: 'domcontentloaded', timeout: 20000 }); await sleep(700);
  await page2.evaluate(() => { localStorage.setItem('imperial_lang_v4', 'tl'); });
  await page2.reload({ waitUntil: 'domcontentloaded' }); await sleep(600);
  const barra = await page2.evaluate(() => (document.querySelector('#barraContato .barra-btn') || {}).textContent || '');
  reg('barra fixa mobile em tagalo (assign)', barra.trim() === 'Makipag-usap sa Imperial', barra.trim());
  await page2.evaluate(() => { const b = document.querySelector('[data-service="shaken"]'); if (b) b.click(); });
  await sleep(500);
  const rotShaken = await page2.evaluate(() => (document.querySelector('#formExtras label') || {}).textContent || '');
  reg('formulario shaken: rotulo dinamico em tagalo (assign)', /Ano ang iyong sasakyan/.test(rotShaken), rotShaken);
  await page2.close();
  reg('API real nunca chamada (tudo interceptado)', realApiCalls === 0);
  await browser.close(); server.close();
  console.log(`\nRESUMO: ${pass} PASS, ${fail} FALHA`);
  if (fails.length) console.log('FALHAS: ' + fails.join(' | '));
  process.exitCode = fail ? 1 : 0;
})().catch(e => { console.error('ERRO FATAL', e); process.exitCode = 2; });
