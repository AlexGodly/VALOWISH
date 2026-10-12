const fs=require('fs'),path=require('path'),assert=require('assert');
const root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
for(const file of ['assets/app.js','assets/main.css','assets/favicon.png','assets/favicon-64.png'])assert(fs.existsSync(path.join(root,file)),file+' missing');
for(const f of ['assets/app.js','assets/main.css','assets/favicon-64.png'])assert(html.includes('./'+f),'index missing '+f);
assert(!html.includes('src/main.tsx'),'Browser must not load raw TypeScript');
assert(!html.includes('/VALOWISH/assets'),'Use relative paths to support repo path');
for(const route of ['home','discover','wishlist','locker','priority','loadouts','planner','insights','history','settings'])assert(fs.readFileSync(path.join(root,'assets/app.js'),'utf8').includes("'"+route+"'"),'Missing route '+route);
console.log('PASSED: static assets, relative paths, no TSX runtime, 10 routes');
