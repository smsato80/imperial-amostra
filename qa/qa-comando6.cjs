const http = require('http');
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const puppeteer = require('/home/hatch/workspace/imperial-rebuild-2026-11-06/qa-harness/node_modules/puppeteer-core');
const root = path.resolve(__dirname, '..');
const chrome = '/home/hatch/.cache/puppeteer/chrome-headless-shell/linux-156.0.8078.80/chrome-headless-shell-linux64/chrome-headless-shell';
const server = http.createServer((req, res) => {
  const file = path.resolve(root, '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname));
  if (!file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
  fs.readFile(file, (err, data) => { if (err) { res.writeHead(404).end(); return; } res.setHeader('Content-Type', ({'.html':'text/html; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml'})[path.extname(file)] || 'application/octet-stream'); res.end(data); });
});
(async () => {
  let browser; let failed = false; let payload;
  async function block(name, fn) { try { await fn(); console.log('PASS ' + name); } catch (e) { failed = true; console.error('FAIL ' + name + ': ' + e.message); } }
  try {
    await new Promise((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolve); });
    browser = await puppeteer.launch({executablePath: chrome, headless: true, args: ['--no-sandbox']});
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on('request', req => {
      const url = req.url();
      if (url.startsWith('https://imperial-captacao-api.vercel.app/api/captar')) { if (req.method() === 'OPTIONS') { req.respond({status: 204, headers: {'access-control-allow-origin':'*','access-control-allow-methods':'POST, OPTIONS','access-control-allow-headers':'content-type'}}); return; } try { payload = JSON.parse(req.postData() || '{}'); } catch (e) { payload = {}; } req.respond({status: 200, contentType: 'application/json', headers: {'access-control-allow-origin':'*'}, body: '{"ok":true}'}); }
      else if (url.startsWith('http://127.0.0.1:')) req.continue();
      else req.abort();
    });
    await page.goto(`http://127.0.0.1:${server.address().port}/site.html`, {waitUntil:'load'});
    await block('paridade dos dicionários', async () => {
      const dictionaries = await page.evaluate(() => { const source = document.querySelector('script:not([src])').textContent; return Function('return (' + source.match(/var T = ([\s\S]*?);\s*var SERVICE_NAME_KEY/)[1] + ')')(); });
      const keys = Object.keys(dictionaries.pt).sort(); assert.equal(keys.length, 258); for (const lang of ['en','ja','es','tl']) assert.deepStrictEqual(Object.keys(dictionaries[lang]).sort(), keys);
    });
    await block('seletor de cinco idiomas', async () => { const options = await page.$$eval('.langs button[data-lang]', els => els.map(e => [e.dataset.lang, !!e.querySelector('svg'), e.textContent.trim()])); assert.deepStrictEqual(options.map(x => x[0]), ['pt','en','ja','es','tl']); for (const [i, name] of ['Português','English','日本語','Español','Tagalog'].entries()) { assert(options[i][1]); assert(options[i][2].includes(name)); } });
    await block('troca de idioma preserva formulário', async () => { await page.evaluate(() => document.querySelector('[data-service="manut"]').click()); await page.type('#fieldNome', 'Teste'); await page.type('[data-excampo="exModelo"]', 'Civic'); await page.evaluate(() => document.querySelector('[data-lang="tl"]').click()); assert(await page.$eval('#modalFundo', e => e.classList.contains('aberto'))); assert.equal(await page.$eval('#fieldNome', e => e.value), 'Teste'); assert.equal(await page.$eval('[data-excampo="exModelo"]', e => e.value), 'Civic'); assert.equal(await page.evaluate(() => document.documentElement.lang), 'tl-PH'); assert.equal(await page.$eval('#formExtras label', e => e.textContent), 'Modelo ng sasakyan'); });
    await block('envio em tagalo com API simulada', async () => { await page.type('#fieldWhatsapp', '09012345678'); await page.$eval('#formContato', e => e.requestSubmit()); await page.waitForSelector('#okBox.show'); assert.equal(payload.idioma, 'tl'); assert(decodeURIComponent(await page.$eval('#okWa', e => e.href)).includes('Kumusta')); });
    await block('sem overflow horizontal', async () => { await page.$eval('#modalFechar', e => e.click()); for (const width of [390,1280]) for (const lang of ['es','tl']) { await page.setViewport({width,height:800}); await page.evaluate(l => document.querySelector(`[data-lang="${l}"]`).click(), lang); const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth); assert.equal(overflow, 0, `${lang} ${width}px: ${overflow}px`); } });
  } catch (e) { failed = true; console.error('FAIL preparação: ' + e.stack); }
  finally { if (browser) await browser.close(); server.close(); process.exitCode = failed ? 1 : 0; }
})();
