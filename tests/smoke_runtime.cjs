/** Smoke-test ordered browser scripts against a lightweight DOM stub (not a browser E2E test). */
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const files=[...html.matchAll(/<script[^>]*src="\.\/(.*?)"/g)].map(x=>x[1]);
class El{
  constructor(id){this.id=id;this.value=id==='ownershipFilter'||id==='browseStatus'?'all':'';this.textContent='';this.innerHTML='';this.classList={add(){},remove(){},toggle(){},contains(){return false}};this.dataset={};this.hidden=false;this.style={};}
  addEventListener(){} querySelector(){return new El('sub')} querySelectorAll(){return []}
  insertAdjacentHTML(where,html){this.innerHTML+=html}
  setAttribute(){} removeAttribute(){}
  focus(){} click(){} contains(){return false} closest(){return null}
}
const elements=new Map();const el=id=>{if(!elements.has(id))elements.set(id,new El(id));return elements.get(id)};
const document={
  getElementById:el,querySelector:selector=>selector==='#priority .gun'?Object.assign(new El('gun'),{value:'All Weapons'}):new El('selector'),
  querySelectorAll:()=>[],addEventListener(){},createElement:tag=>new El(tag),
  head:{append(tag){setTimeout(()=>tag.onerror?.(new Error('CDN blocked in test')),0)}}
};
const store=new Map();const localStorage={getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,String(v)),removeItem:k=>store.delete(k)};
const fake={data:[{displayName:'Vandal',skins:Array.from({length:110},(_,i)=>({uuid:`skin-${i}`,displayName:`Test Vandal ${i}`,displayIcon:`https://images.invalid/${i}.png`,chromas:[]}))}]};
const errors=[];
const context={document,localStorage,innerWidth:1300,scrollY:0,location:{protocol:'https:'},
  console:{log(){},warn(){},error:(...a)=>errors.push(a.map(String).join(' '))},
  fetch:async()=>({ok:true,json:async()=>fake}),
  AbortController,Date,Math,URL,JSON,Map,Set,Number,String,Array,Object,Promise,
  confirm:()=>true,alert(){},Blob,scrollTo(){},setTimeout,clearTimeout,
  requestAnimationFrame:fn=>fn(),
};context.window=context;context.globalThis=context;
vm.createContext(context);
for(let f of files){try{vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),context,{filename:f})}catch(e){throw new Error(`Startup failed in ${f}: ${e.stack}`)}}
setTimeout(()=>{
  const evalJs=s=>vm.runInContext(s,context);
  try{
    assert.equal(evalJs('skins.length'),110);
    assert.equal((el('browseCards').innerHTML.match(/class="card"/g)||[]).length,36);
    evalJs('goPage("browse",2)');assert.equal(evalJs('pageIndex.browse'),2);
    evalJs('showPage("wishlist"); showPage("browse")');assert.equal(evalJs('pageIndex.browse'),2);
    evalJs('toggleWish("skin-0")');assert.equal(evalJs('db.wishlist.length'),1);
    evalJs('showPage("wishlist")');assert.equal((el('wishCards').innerHTML.match(/class="card"/g)||[]).length,1);
    evalJs('db.wishlist=skins.slice(0,90).map(s=>s.uuid);save()');
    assert.equal((el('wishCards').innerHTML.match(/class="card"/g)||[]).length,36);
    evalJs('toggleOwned("skin-0"); showPage("locker")');assert.equal((el('lockerCards').innerHTML.match(/class="card"/g)||[]).length,1);
    evalJs('showPage("settings")');assert.equal(evalJs('currentPage'),'settings');
    assert.equal(errors.length,0,JSON.stringify(errors));
    console.log('PASS runtime smoke: 110 catalog skins, 36-card pagination, page memory, wishlist, owned Locker and Settings, nonblocking cloud outage');
    process.exit(0);
  }catch(e){console.error(e.stack);console.error('captured:',errors);process.exit(1)}
},170);
