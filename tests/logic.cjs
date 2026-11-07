// VALOWISH v24 logic tests: data-loss scenarios (stale tabs, full storage, mass removal),
// weapon-type priority lists, multi-select filters, buying-plan bulk add and completion.
// Run: node tests/logic.cjs [path/to/app.js]
const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
const APP=process.argv[2]||path.join(__dirname,'../assets/app.js');
const js=fs.readFileSync(APP,'utf8');

const weapons=[
 {displayName:'Vandal',displayIcon:'',skins:[
  {uuid:'std-vandal',displayName:'Standard Vandal'},
  {uuid:'v-prime',displayName:'Prime Vandal',contentTierUuid:'t-prem',chromas:[{uuid:'c0',displayName:'Prime Vandal'},{uuid:'c1',displayName:'Prime Vandal Variant 1 Gold',fullRender:'x',streamedVideo:'https://media/c1.mp4'}],levels:[{uuid:'l1',displayName:'Prime Vandal'},{uuid:'l2',displayName:'Prime Vandal Level 2',levelItem:'EEquippableSkinLevelItem::VFX',streamedVideo:'https://media/l2.mp4'}]},
  {uuid:'v-reaver',displayName:'Reaver Vandal',contentTierUuid:'t-prem'},
  {uuid:'v-champ',displayName:'Champions Vandal',contentTierUuid:'t-excl'},
  {uuid:'v-rand',displayName:'Random Favorite Skin'}]},
 {displayName:'Phantom',skins:[{uuid:'std-phantom',displayName:'Standard Phantom'},{uuid:'p-ion',displayName:'Ion Phantom',contentTierUuid:'t-prem'},{uuid:'p-oni',displayName:'Oni Phantom',contentTierUuid:'t-excl'}]},
 {displayName:'Sheriff',skins:[{uuid:'std-sheriff',displayName:'Standard Sheriff'},{uuid:'s-ion',displayName:'Ion Sheriff',contentTierUuid:'t-prem'},{uuid:'s-sov',displayName:'Sovereign Sheriff',contentTierUuid:'t-ultra'}]},
 {displayName:'Melee',skins:[{uuid:'melee-default',displayName:'Melee'},{uuid:'m-karambit',displayName:'Reaver Karambit',contentTierUuid:'t-excl'}]},
 {displayName:'Zapper',skins:[{uuid:'z-new',displayName:'Prototype Zapper',contentTierUuid:'t-select'}]}];
const tiers=[{uuid:'t-prem',displayName:'Premium Edition'},{uuid:'t-excl',displayName:'Exclusive Edition'},{uuid:'t-ultra',displayName:'Ultra Edition'},{uuid:'t-select',displayName:'Select Edition'}];
const cards=[{uuid:'card1',displayName:'Card One'},{uuid:'card2',displayName:'Card Two'},{uuid:'card3',displayName:'Card Three'},{uuid:'card4',displayName:'Card Four'},
 {uuid:'card-vct',displayName:'VCT x 100T Card'},{uuid:'card-vct26',displayName:'VCT26 x PRX Card'},{uuid:'card-ch24',displayName:'Champions 2024 Card'},{uuid:'card-sol',displayName:'Sentinels of Light Card'},{uuid:'card-sen',displayName:'Sentinels Card'},{uuid:'card-lock',displayName:'VCT LOCK//IN Card'}];
const fakeFetch=async url=>({ok:true,async json(){return{data:url.includes('contenttiers')?tiers:url.includes('weapons')?weapons:url.includes('playercards')?cards:[]}}});

// Shared "server" row for a fake Supabase account.
function cloudServer(){return{row:null}}
function fakeClient(server,user){
 const q=()=>{const st={op:'select',filters:{},payload:null};const b={
  select(){if(st.op==='select')st.op='select';return b},
  update(p){st.op='update';st.payload=p;return b},insert(p){st.op='insert';st.payload=p;return b},
  eq(k,v){st.filters[k]=v;return b},
  async maybeSingle(){const r=server.row;
   if(st.op==='select')return{data:r?{data:JSON.parse(JSON.stringify(r.data)),updated_at:r.updated_at}:null,error:null};
   if(st.op==='insert'){if(r)return{data:null,error:{code:'23505'}};server.row={data:JSON.parse(JSON.stringify(st.payload.data)),updated_at:st.payload.updated_at};return{data:{updated_at:st.payload.updated_at},error:null}}
   if(st.op==='update'){if(!r||r.updated_at!==st.filters.updated_at)return{data:null,error:null};const stamp=new Date(Date.parse(st.payload.updated_at)+(++server.tick||1)).toISOString();server.row={data:JSON.parse(JSON.stringify(st.payload.data)),updated_at:stamp};return{data:{updated_at:stamp},error:null}}}};return b};
 return{auth:{getSession:async()=>({data:{session:user?{user}:null},error:null}),onAuthStateChange(){return{}},signOut:async()=>({})},from:q};
}
// Browser-like localStorage with an optional quota (in UTF-16 chars, like real browsers).
function makeStore(quota=Infinity){const m=new Map();const size=()=>{let n=0;for(const[k,v]of m)n+=k.length+v.length;return n};
 return{map:m,getItem:k=>m.has(k)?m.get(k):null,setItem(k,v){v=String(v);const old=m.has(k)?k.length+m.get(k).length:0;if(size()-old+k.length+v.length>quota){const e=new Error('QuotaExceededError');e.name='QuotaExceededError';throw e}m.set(k,v)},removeItem:k=>m.delete(k),key:i=>[...m.keys()][i]??null,get length(){return m.size},clear:()=>m.clear(),size}}

function openTab(store,{server=null,user=null}={}){
 const timers=[];const root={innerHTML:'',addEventListener(){},querySelector(){return null}};
 const listeners={};const classes={toggle(){},add(){},remove(){}};
 const toasts={};const doc={documentElement:{classList:classes},body:{classList:classes,appendChild(e){toasts[e.id]=e}},getElementById(id){return id==='root'?root:toasts[id]||null},createElement(){return{id:'',className:'',textContent:'',hidden:false,innerHTML:''}},addEventListener(k,fn){(listeners['doc:'+k]||(listeners['doc:'+k]=[])).push(fn)},querySelector(){return null},hidden:false,activeElement:null};
 const win={scrollY:0,scrollTo(){},addEventListener(k,fn){(listeners['win:'+k]||(listeners['win:'+k]=[])).push(fn)},supabase:{createClient:()=>fakeClient(server||cloudServer(),user)}};
 const sandbox={console:{log(){},warn(){},error(){}},window:win,document:doc,localStorage:store,fetch:fakeFetch,AbortController,clearTimeout(){},setTimeout(fn){timers.push(fn);return timers.length},setInterval(){return 0},requestAnimationFrame(fn){fn()},confirm:()=>true,prompt:()=>null,Date,Math,Number,String,Array,Set,Map,JSON,Object,Promise,URL,crypto:{randomUUID:()=>'id-'+Math.random().toString(36).slice(2)},CSS:{escape:s=>s},FormData:function(f){return f.data},Blob:function(){},globalThis:null};
 sandbox.globalThis=sandbox;
 const hook=`globalThis.__t={get db(){return db},set db(v){db=v},get html(){return app.innerHTML},save,commit,toggle,render,itemById,fetchKind,priorityItems,priorityMove,priorityMatches,filteredCollection,viewPrefs,updateViewPrefs,toggleChip,skinCompletion,categoryCompletion,milestoneInfo,simPickerCandidates,addManyToPlan,activeBuyingPlan,videoLists,weaponType,weaponGroups,refreshFromOtherTabs,queueCloudSync,cloudLoss,resetSeen:()=>{seenState={}},cleanPriorityViews,esportsGroup,esportsGroups,noteCatalog,isNew,markSeen,storeDay,setTodayItems,todayCheck,storeMatters,storeSeenCount,storePage,priorityToPlan,priorityPlanItems,getFilter,discover,setPage,
 get catalog(){return catalog},get cloudStatus(){return cloudStatus},get cloudConflict(){return cloudConflict},get cloudReady(){return cloudReady},get storageFailed(){return storageFailed},
 set priorityScope(v){priorityScope=v},set priorityType(v){priorityType=v},set priorityWeapon(v){priorityWeapon=v},set simPicker(v){simPicker=v},get simPicker(){return simPicker},set kind(v){kind=v},get filter(){return filter}};`;
 const anchor="render();ensureKind('skins');initCloud().catch(console.error);";
 assert(js.includes(anchor),'test hook anchor missing');
 vm.runInNewContext(js.replace(anchor,hook+anchor),sandbox,{filename:'app.js'});
 const t=sandbox.__t;
 t.flushTimers=async()=>{for(let i=0;i<20&&timers.length;i++){const fns=timers.splice(0);for(const f of fns)f();await tick()}};
 t.fire=(k,ev={})=>{for(const fn of listeners[k]||[])fn(ev)};
 return t;
}
const tick=()=>new Promise(r=>setImmediate(r));
async function settle(t){for(let i=0;i<15;i++)await tick();await t.flushTimers();for(let i=0;i<15;i++)await tick()}
let passed=0;const test=async(name,fn)=>{await fn();passed++;console.log('  ✓',name)};

(async()=>{
console.log('VALOWISH v24 logic tests');

await test('stale tab without a storage event cannot erase another tab\'s additions',async()=>{
 const store=makeStore();store.setItem('valowish_v22',JSON.stringify({wishlist:['v-prime'],owned:[],priority:[]}));
 const A=openTab(store),B=openTab(store);await settle(A);await settle(B);
 B.toggle('wishlist','v-reaver');B.toggle('wishlist','p-ion');B.toggle('owned','s-ion');
 // Tab A never received a storage event (e.g. frozen in the background) and now makes its own edit.
 A.toggle('favorites','v-champ');
 const saved=JSON.parse(store.getItem('valowish_v22'));
 for(const id of ['v-prime','v-reaver','p-ion'])assert(saved.wishlist.includes(id),'wishlist lost '+id);
 assert(saved.owned.includes('s-ion'),'owned lost');assert(saved.favorites.includes('v-champ'),'A edit lost');
 assert(A.db.wishlist.includes('v-reaver'),'tab A adopted other tab data');
});

await test('stale tab removing an item keeps the other tab\'s additions and the removal',async()=>{
 const store=makeStore();store.setItem('valowish_v22',JSON.stringify({wishlist:['v-prime','v-reaver'],owned:[],priority:[]}));
 const A=openTab(store),B=openTab(store);await settle(A);await settle(B);
 B.toggle('wishlist','p-oni');A.toggle('wishlist','v-reaver');
 const w=JSON.parse(store.getItem('valowish_v22')).wishlist;
 assert(w.includes('p-oni')&&w.includes('v-prime')&&!w.includes('v-reaver'),JSON.stringify(w));
});

await test('stale signed-in tab no longer pushes old data over the cloud copy',async()=>{
 const store=makeStore(),server=cloudServer(),user={id:'u1',email:'a@b.c'};
 store.setItem('valowish_v22',JSON.stringify({wishlist:['v-prime'],owned:[],priority:[]}));
 const A=openTab(store,{server,user});await settle(A);
 const B=openTab(store,{server,user});await settle(B);
 assert(server.row,'cloud row created');
 B.toggle('wishlist','v-reaver');B.toggle('wishlist','p-ion');B.toggle('owned','v-champ');await settle(B);
 assert(server.row.data.wishlist.includes('p-ion'),'B synced');
 // A is stale and runs its periodic sync without any edit (the v23 behaviour wiped B's changes here).
 await A.queueCloudSync();await settle(A);
 const cloudWish=server.row.data.wishlist;
 assert(cloudWish.includes('v-reaver')&&cloudWish.includes('p-ion'),'cloud kept B additions: '+JSON.stringify(cloudWish));
 assert(server.row.data.owned.includes('v-champ'),'cloud kept owned');
 assert(A.db.wishlist.includes('p-ion'),'stale tab caught up');
});

await test('a sync that would remove most of the cloud data stops and keeps both copies',async()=>{
 const server=cloudServer(),user={id:'u2'},ids=['v-prime','v-reaver','v-champ','p-ion','p-oni','s-ion','s-sov','m-karambit','z-new','playercards:card1','playercards:card2','playercards:card3'];
 const store1=makeStore();store1.setItem('valowish_v22',JSON.stringify({wishlist:ids,owned:[],priority:[]}));
 const A=openTab(store1,{server,user});await settle(A);assert.strictEqual(server.row.data.wishlist.length,12);
 // Simulate a device whose local copy got emptied while its sync baseline survived.
 const raw=JSON.parse(store1.getItem('valowish_v22'));raw.wishlist=[];store1.setItem('valowish_v22',JSON.stringify(raw));
 const C=openTab(store1,{server,user});await settle(C);
 C.toggle('favorites','v-prime');await settle(C);
 assert.strictEqual(server.row.data.wishlist.length,12,'cloud wishlist untouched');
 assert.strictEqual(C.cloudStatus,'conflict');assert(/would remove/.test(C.cloudConflict.reason));
 assert([...store1.map.keys()].some(k=>k.includes('before-large-removal-cloud')),'cloud copy snapshotted');
});

await test('full browser storage: old catalog caches are cleared and saves keep working',async()=>{
 const store=makeStore(5_000_000);
 store.setItem('valowish_v22',JSON.stringify({wishlist:['v-prime'],owned:[],priority:[]}));
 store.setItem('valowish_catalog_v15_skins',JSON.stringify({time:Date.now(),items:'x'.repeat(3_400_000)}));
 store.setItem('valowish_catalog_v15_playercards',JSON.stringify({time:Date.now(),items:'x'.repeat(1_500_000)}));
 let threw=false;try{store.setItem('probe','y'.repeat(200_000))}catch{threw=true}assert(threw,'precondition: storage full');
 const A=openTab(store);await settle(A);
 assert(!store.getItem('valowish_catalog_v15_skins'),'legacy catalog cache removed');
 for(let i=0;i<40;i++)A.toggle('wishlist','playercards:card'+(i%4+1));A.toggle('owned','v-reaver');
 assert(JSON.parse(store.getItem('valowish_v22')).owned.includes('v-reaver'),'latest change persisted');
 assert(!A.storageFailed);
 assert(store.size()<1_000_000,'catalog no longer stored in localStorage');
});

await test('when storage really is full the user is warned instead of silently losing data',async()=>{
 const store=makeStore(Infinity);store.setItem('valowish_v22',JSON.stringify({wishlist:[],owned:[],priority:[]}));
 const A=openTab(store);await settle(A);
 store.setItem=()=>{const e=new Error('QuotaExceededError');e.name='QuotaExceededError';throw e};
 A.toggle('wishlist','v-prime');A.render();
 assert(A.storageFailed,'failure flagged');assert(A.html.includes('COULD NOT SAVE'),'banner shown');
});

await test('removing an item before the catalog loads keeps saved per-weapon orders',async()=>{
 const store=makeStore();store.setItem('valowish_v22',JSON.stringify({wishlist:['v-prime','v-reaver','v-champ'],owned:[],priority:['v-prime','v-reaver','v-champ'],priorityViews:{'weapon:Vandal':['v-champ','v-reaver','v-prime'],'type:rifles':['v-reaver','v-champ','v-prime']}}));
 const A=openTab(store);delete A.catalog.skins; // metadata unknown
 const views=A.cleanPriorityViews(['v-prime','v-reaver']);
 assert.deepStrictEqual([...views['weapon:Vandal']],['v-reaver','v-prime']);assert.deepStrictEqual([...views['type:rifles']],['v-reaver','v-prime']);
});

const store=makeStore();store.setItem('valowish_v22',JSON.stringify({wishlist:['v-prime','v-reaver','v-champ','p-ion','p-oni','s-sov','m-karambit','z-new','playercards:card1'],owned:['p-oni','s-ion','playercards:card2'],priority:['s-sov','v-prime','p-ion','v-champ','v-reaver','p-oni'],priorityViews:{},preferences:{collectionViews:{wishlist:{edition:'Exclusive Edition'}}}}));
const T=openTab(store);await settle(T);await T.fetchKind('skins');await T.fetchKind('playercards');

await test('weapon types: classes resolve and new weapons go to OTHER, not Melee',async()=>{
 assert.strictEqual(T.weaponType('Vandal'),'rifles');assert.strictEqual(T.weaponType('Sheriff'),'sidearms');assert.strictEqual(T.weaponType('Melee'),'melee');assert.strictEqual(T.weaponType('Zapper'),'other');
 const groups=T.weaponGroups();assert(!groups.find(g=>g.key==='melee').weapons.includes('Zapper'));assert(groups.find(g=>g.key==='other').weapons.includes('Zapper'));
});

await test('priority by weapon type: independent ranked lists seeded from Global order',async()=>{
 T.priorityScope='type';T.priorityType='rifles';
 assert.deepStrictEqual([...T.priorityItems()],['v-prime','p-ion','v-champ','v-reaver','p-oni']);
 T.priorityMove('p-oni',0);
 assert.deepStrictEqual([...T.priorityItems()],['p-oni','v-prime','p-ion','v-champ','v-reaver']);
 T.priorityScope='global';assert.deepStrictEqual([...T.priorityItems()],['s-sov','v-prime','p-ion','v-champ','v-reaver','p-oni'],'global untouched');
 T.priorityScope='weapon';T.priorityWeapon='Vandal';assert.deepStrictEqual([...T.priorityItems()],['v-prime','v-champ','v-reaver'],'weapon list untouched');
 T.priorityScope='type';T.priorityType='sidearms';assert.deepStrictEqual([...T.priorityItems()],['s-sov']);
 T.priorityScope='global';
});

await test('multi-select filters: old single edition migrates; editions and types combine',async()=>{
 assert.deepStrictEqual([...T.viewPrefs('wishlist').editions],['Exclusive Edition'],'v22 edition migrated');
 assert.deepStrictEqual([...T.filteredCollection('wishlist')].sort(),['m-karambit','p-oni','v-champ']);
 T.setPage('wishlist');T.toggleChip('collection','editions','Ultra Edition');
 assert.deepStrictEqual([...T.filteredCollection('wishlist')].sort(),['m-karambit','p-oni','s-sov','v-champ']);
 T.toggleChip('collection','weapons','Vandal');assert.deepStrictEqual([...T.filteredCollection('wishlist')],['v-champ']);
 T.toggleChip('collection','weapons','Sheriff');assert.deepStrictEqual([...T.filteredCollection('wishlist')].sort(),['s-sov','v-champ']);
 T.toggleChip('collection','weapons','',['Vandal','Phantom']);assert.deepStrictEqual([...T.viewPrefs('wishlist').weapons].sort(),['Phantom','Sheriff','Vandal'],'group chip selects whole class');
 T.toggleChip('collection','weapons','',['Vandal','Phantom']);assert.deepStrictEqual([...T.viewPrefs('wishlist').weapons],['Sheriff'],'group chip again clears class');
 T.toggleChip('collection','editions','');T.toggleChip('collection','weapons','');assert.strictEqual(T.filteredCollection('wishlist').length,9);
});

await test('discover chips filter the catalog',async()=>{
 T.kind='skins';T.setPage('discover');T.toggleChip('discover','weapons','Sheriff');T.toggleChip('discover','editions','Ultra Edition');
 assert(T.html.includes('Sovereign Sheriff')&&!T.html.includes('Ion Sheriff')&&!T.html.includes('Prime Vandal'),'discover filtered');
 T.toggleChip('discover','editions','Ultra Edition');assert(T.html.includes('Ion Sheriff'));
});

await test('buying plan picker: filters, sort, multi-select bulk add without duplicates',async()=>{
 T.simPicker={source:'wishlist',category:'all',query:'',page:1,weapon:'all',editions:['Premium Edition'],types:[],status:'all',priceMin:'',priceMax:'',sort:'az',selected:[],filtersOpen:true};
 assert.deepStrictEqual([...T.simPickerCandidates().map(x=>x.id)],['p-ion','v-prime','v-reaver']);
 T.simPicker.status='hide-owned';T.simPicker.editions=[];T.simPicker.sort='price-desc';
 const ids=T.simPickerCandidates().map(x=>x.id);assert(!ids.includes('p-oni'),'owned hidden');
 assert.strictEqual(T.addManyToPlan(['v-prime','v-reaver','s-sov']),3);assert.strictEqual(T.addManyToPlan(['v-prime','p-ion']),1);
 assert.deepStrictEqual([...T.activeBuyingPlan().items],['v-prime','v-reaver','s-sov','p-ion']);
 T.simPicker.status='not-planned';assert(!T.simPickerCandidates().some(x=>x.id==='v-prime'));
 T.simPicker=null;
});

await test('old single weapon / weapon-type selections convert to weapon names',async()=>{
 T.db.preferences.collectionViews={...T.db.preferences.collectionViews,locker:{weapon:'Ghost',types:['rifles']}};
 assert.deepStrictEqual([...T.viewPrefs('locker').weapons].sort(),['Bulldog','Ghost','Guardian','Phantom','Vandal','Warden']);
});

await test('priority list → new buying plan keeps exact items and rank order',async()=>{
 const before=T.db.buyingPlans.length;
 T.setPage('priority');T.priorityScope='weapon';T.priorityWeapon='Vandal';
 T.db.priorityViews={...T.db.priorityViews,'weapon:Vandal':['v-reaver','v-champ','v-prime']};
 T.priorityToPlan();
 let p=T.activeBuyingPlan();assert.strictEqual(T.db.buyingPlans.length,before+1);
 assert.strictEqual(p.name,'Priority · Vandal');assert.deepStrictEqual([...p.items],['v-reaver','v-champ','v-prime']);
 T.priorityScope='global';T.priorityToPlan();p=T.activeBuyingPlan();
 assert.strictEqual(p.name,'Priority · Global');assert.deepStrictEqual([...p.items],['s-sov','v-prime','p-ion','v-champ','v-reaver'],'owned p-oni left out, order kept');
 T.priorityScope='weapon';T.priorityWeapon='Vandal';T.priorityToPlan();assert.strictEqual(T.activeBuyingPlan().name,'Priority · Vandal (2)');
 T.priorityScope='type';T.priorityType='rifles';T.priorityToPlan();assert.strictEqual(T.activeBuyingPlan().name,'Priority · Rifles');
 T.priorityScope='global';
});

await test('videos: variant and level streams are kept and labelled',async()=>{
 const v=T.videoLists(T.itemById('v-prime'));
 assert.strictEqual(v.variants.length,1);assert.strictEqual(v.variants[0].ref,2);assert.strictEqual(v.levels.length,1);assert(v.levels[0].label.includes('LEVEL 2')&&v.levels[0].label.includes('VFX'));
});

await test('completion: per category, type and weapon; defaults toggle; milestones',async()=>{
 const c=T.skinCompletion({editions:[],types:[],includeDefaults:false});
 const rifles=c.types.find(t=>t.key==='rifles'),vandal=rifles.weapons.find(w=>w.weapon==='Vandal');
 assert.deepStrictEqual([vandal.owned,vandal.total],[0,3],'standard + random excluded');
 assert.deepStrictEqual([rifles.owned,rifles.total],[1,5]);
 const melee=c.types.find(t=>t.key==='melee');assert.strictEqual(melee.total,1,'default melee excluded');
 const withDefaults=T.skinCompletion({editions:[],types:[],includeDefaults:true});
 const v2=withDefaults.types.find(t=>t.key==='rifles').weapons.find(w=>w.weapon==='Vandal');assert.deepStrictEqual([v2.owned,v2.total],[1,4]);
 const excl=T.skinCompletion({editions:['Exclusive Edition'],types:[],includeDefaults:true});assert.deepStrictEqual([excl.owned,excl.total],[1,3]);
 assert.deepStrictEqual(Object.assign({},T.categoryCompletion('playercards')),{owned:1,total:10,loaded:true});
 const m=T.milestoneInfo(7,41);assert.strictEqual(m.reached,10);assert.strictEqual(m.next,25);assert.strictEqual(m.need,4);
 assert.strictEqual(T.milestoneInfo(41,41).reached,100);
 T.setPage('insights');assert(T.html.includes('COMPLETION BY WEAPON TYPE')&&T.html.includes('HOW MUCH OF VALORANT YOU OWN'));
});

await test('esports items are grouped by event/team and lookalikes are ignored',async()=>{
 const g=id=>T.esportsGroup(T.itemById(id));
 assert.strictEqual(g('playercards:card-vct'),'100 Thieves');assert.strictEqual(g('playercards:card-vct26'),'Paper Rex');assert.strictEqual(g('playercards:card-ch24'),'Champions 2024');
 assert.strictEqual(g('v-champ'),'Champions 2021');assert.strictEqual(g('playercards:card-lock'),'VCT LOCK//IN');assert.strictEqual(g('playercards:card-sen'),'Sentinels');
 assert.strictEqual(g('playercards:card-sol'),'','Sentinels of Light is not esports');assert.strictEqual(g('v-prime'),'');
 const names=T.esportsGroups().map(x=>x.name);assert.strictEqual(names[0],'Champions 2024','newest Champions first');
 T.setPage('esports');assert(T.html.includes('ALL ESPORTS ITEMS'));
});

await test('new cosmetics: first load is the baseline, later additions are flagged until marked seen',async()=>{
 T.catalog.playercards=T.catalog.playercards.filter(x=>x.id!=='playercards:card4');
 T.resetSeen();
 T.noteCatalog('playercards');assert(!T.isNew('playercards:card1'));
 await T.fetchKind('playercards',true);assert(T.isNew('playercards:card4'),'card4 added later is new');assert(!T.isNew('playercards:card1'));
 T.markSeen(null);assert(!T.isNew('playercards:card4'));
});

await test('daily store check: today\'s 4 skins, wanted matches and history',async()=>{
 assert.strictEqual(T.storeDay(Date.UTC(2026,10,7,23,59)),'2026-11-07');assert.strictEqual(T.storeDay(Date.UTC(2026,10,8,0,1)),'2026-11-08');
 T.setTodayItems(['v-prime','p-oni','v-rand-none','s-ion']);
 assert.deepStrictEqual([...T.todayCheck().items],['v-prime','p-oni','v-rand-none','s-ion']);
 assert(T.storeMatters('v-prime'),'wishlisted+priority');assert(!T.storeMatters('p-oni'),'owned does not matter');assert(!T.storeMatters('s-ion'));
 T.setPage('store');assert(T.html.includes('YOU WANT'),'summary shows wanted');
 T.db.preferences.storeChecks.push({date:'2026-11-01',items:['v-prime','','','']});assert.strictEqual(T.storeSeenCount('v-prime'),2);
 T.setTodayItems(['','','','']);assert.strictEqual(T.todayCheck(),null);
});

console.log(`\n${passed} passed`);
})().catch(e=>{console.error('FAILED:',e);process.exit(1)});
