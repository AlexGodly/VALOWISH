const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const ts=require('/opt/nvm/versions/node/v22.16.0/lib/node_modules/typescript');
const root=path.resolve(__dirname,'..');let jsFiles=0;
function walk(folder){for(const entry of fs.readdirSync(folder,{withFileTypes:true})){
 const f=path.join(folder,entry.name);if(entry.isDirectory()){walk(f);continue}
 if(!/\.(tsx?|jsx?)$/.test(f))continue;jsFiles++;
 const source=fs.readFileSync(f,'utf8'),file=ts.createSourceFile(f,source,ts.ScriptTarget.Latest,true,f.endsWith('.tsx')?ts.ScriptKind.TSX:ts.ScriptKind.TS);
 assert.equal(file.parseDiagnostics.length,0,`TypeScript syntax invalid: ${f}`);
 const re=/(?:from\s*|import\s*)['"](\.{1,2}\/[^'"]+)['"]/g;for(const match of source.matchAll(re)){
  const base=path.resolve(path.dirname(f),match[1]);assert([base,base+'.ts',base+'.tsx',base+'.js',path.join(base,'index.ts'),path.join(base,'index.tsx')].some(n=>fs.existsSync(n)),`Missing import ${match[1]} in ${f}`)
 }
 }}
walk(path.join(root,'src'));
for(const f of ['index.html','vite.config.ts','public/favicon.png','.github/workflows/pages.yml','src/styles/main.css','src/lib/catalog.ts','src/lib/storage.ts','src/lib/cloud.ts','README.md'])assert(fs.existsSync(path.join(root,f)),`Missing ${f}`);
const c=fs.readFileSync(path.join(root,'src/lib/catalog.ts'),'utf8');for(const k of ['skins','bundles','playercards','playertitles','buddies','sprays','flexes','agents','maps','gamemodes','seasons','events'])assert(c.includes(k));
const v=fs.readFileSync(path.join(root,'vite.config.ts'),'utf8');assert(v.includes("base: '/VALOWISH/'"));
const wf=fs.readFileSync(path.join(root,'.github/workflows/pages.yml'),'utf8');assert(wf.includes('dist'));assert(wf.includes('npm install'));
console.log(`PASS: ${jsFiles} source TS/TSX files parsed; local imports resolve; 12 catalogs, assets and GitHub Pages config present`);
