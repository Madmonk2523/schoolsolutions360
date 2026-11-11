const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const pages=['index.html','capability-statement.html','request-a-quote.html'];
test('pages retain accessible structure, local destinations, and verified imagery',()=>{
 for(const name of pages){const html=fs.readFileSync(path.join(root,name),'utf8');assert.equal((html.match(/<h1[ >]/g)||[]).length,1);assert.match(html,/name="viewport"/);assert.match(html,/src="logo.webp"/);const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length);for(const [,href] of html.matchAll(/href="([^"]+)"/g)){if(/^[a-z]+:/i.test(href))continue;const u=new URL(href,'https://example.test/'+name);const dest=path.join(root,u.pathname.slice(1));assert.ok(fs.existsSync(dest),href);if(u.hash)assert.ok(fs.readFileSync(dest,'utf8').includes(`id="${u.hash.slice(1)}"`),href);}for(const [,attrs] of html.matchAll(/<img\s+([^>]+)>/g)){assert.match(attrs,/alt="[^"]+"/);const src=attrs.match(/src="([^"]+)"/)[1];assert.ok(fs.existsSync(path.join(root,src)));}}
});
test('decorative glyphs and em dashes are absent from page copy',()=>{for(const name of pages){const html=fs.readFileSync(path.join(root,name),'utf8');assert.doesNotMatch(html,/[↗↓→↑☰—\u{1F300}-\u{1FAFF}]/u);}});
test('school motion is bounded, supports reduced motion, and has mobile layouts',()=>{const css=fs.readFileSync(path.join(root,'style.css'),'utf8');const js=fs.readFileSync(path.join(root,'script.js'),'utf8');assert.match(css,/@keyframes check-write/);assert.match(css,/@keyframes pencil-line/);assert.match(css,/animation:none!important/);assert.match(css,/@media\(max-width:600px\)/);assert.match(js,/prefers-reduced-motion: reduce/);assert.match(js,/unobserve/);assert.doesNotMatch(css,/animation:[^;}]*infinite/);});
