const fs=require('fs'),vm=require('vm'),assert=require('assert');
const js=fs.readFileSync(__dirname+'/../assets/app.js','utf8');
const store=new Map(), seed={wishlist:['skin-vandal1','bundles:bundle-1'],owned:['skin-vandal2'],priority:['skin-vandal1','bundles:bundle-1'],prices:{'skin-vandal1':1775,'bundles:bundle-1':4350},name:'TESTER',vp:2000,loadouts:[]};
store.set('valowish_v15',JSON.stringify(seed));
const callbacks={}, docCallbacks={},root={innerHTML:'',addEventListener(k,fn){callbacks[k]=fn},querySelector(){return null}};
const classes={toggle(){}},toasts={};
const doc={documentElement:{classList:classes},body:{classList:classes,appendChild(e){toasts[e.id]=e}},getElementById(id){return id==='root'?root:toasts[id]||null},createElement(){return {id:'',className:'',textContent:'',hidden:false}},addEventListener(k,fn){docCallbacks[k]=fn}};
const weapons=[{displayName:'Vandal',skins:[{uuid:'skin-vandal1',displayName:'Prime Vandal',contentTierUuid:'p',displayIcon:''},{uuid:'skin-vandal2',displayName:'Reaver Vandal',displayIcon:''}]}];
const bundles=[{uuid:'bundle-1',displayName:'Kuronami Bundle'},{uuid:'bundle-2',displayName:'Reaver Bundle'}];
const fakeFetch=async url=>({ok:true,async json(){return {data:url.includes('contenttiers')?[]:url.includes('bundles')?bundles:url.includes('weapons')?weapons:[]}}});
const fakeClient={auth:{getSession:async()=>({data:{session:null}}),onAuthStateChange(){return{}}}};
const sandbox={console,window:{scrollY:0,scrollTo(){},supabase:{createClient:()=>fakeClient}},document:doc,localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v),removeItem:k=>store.delete(k)},fetch:fakeFetch,AbortController,clearTimeout(){},setTimeout(fn){return 1},requestAnimationFrame(fn){fn()},confirm:()=>true,prompt:()=>null,Date,Math,Number,String,Array,Set,Map,JSON,Object,Promise,URL,crypto:{randomUUID:()=>('test-'+Math.random())},CSS:{escape:s=>s},FormData:function(f){return f.data},globalThis:null};
sandbox.globalThis=sandbox;
const exposed=`globalThis.__test={get db(){return db},get html(){return app.innerHTML},addToSimulator,activeBuyingPlan,simPrice,vpSummary,buyingMetrics,buyingMove,setPage,render,card,itemById,priorityItems,simPickerModal,save,fetchKind,get priorityScope(){return priorityScope},set priorityScope(v){priorityScope=v},get priorityWeapon(){return priorityWeapon},set priorityWeapon(v){priorityWeapon=v}};`;
const run=js.replace("render();ensureKind('skins');initCloud().catch(console.error);",exposed+"render();ensureKind('skins');initCloud().catch(console.error);");
assert(run.includes(exposed),'test export injection failed');
vm.runInNewContext(run,sandbox,{filename:'app.js'});
(async()=>{
await new Promise(r=>setImmediate(r));
const t=sandbox.__test;
assert(store.get('valowish_v18'),'prior v15 data migrated to v18');
assert.strictEqual(t.db.wishlist.length,2);
assert.strictEqual(t.itemById('skin-vandal1').name,'Prime Vandal');
// Bundle metadata is fetched from a secondary category.
await t.fetchKind('bundles');
let vp=t.vpSummary(t.db.priority);
assert.strictEqual(vp.required,6125,'Priority VP includes custom bundle + skin price');
assert.strictEqual(vp.remaining,4125);
assert.strictEqual(vp.unknown,0);
assert(t.card(t.itemById('skin-vandal1'),'priority').includes('data-sim-add="skin-vandal1"'));
assert(t.card(t.itemById('skin-vandal1'),'wishlist').includes('data-sim-add="skin-vandal1"'));
// Auto-create active plan; prevent duplicate additions.
t.addToSimulator('skin-vandal1');t.addToSimulator('skin-vandal1');
assert.strictEqual(t.activeBuyingPlan().items.length,1);
t.addToSimulator('bundles:bundle-1');
assert.deepStrictEqual(Array.from(t.activeBuyingPlan().items),['skin-vandal1','bundles:bundle-1']);
let m=t.buyingMetrics(t.activeBuyingPlan());
assert.strictEqual(m.total,6125);
assert.strictEqual(m.remaining,4125);
assert.strictEqual(m.rows[1].cumulative,6125);
t.buyingMove('bundles:bundle-1',0);
assert.strictEqual(t.activeBuyingPlan().items[0],'bundles:bundle-1');
t.setPage('simulator');
assert(t.html.includes('Buying Simulator')&&t.html.includes('PURCHASE ORDER'));
assert(t.html.includes('6,125 VP'),'simulator total visible');
// Per-plan budget never modifies real db.vp.
t.activeBuyingPlan().balanceOverride=7000;t.save();m=t.buyingMetrics(t.activeBuyingPlan());
assert.strictEqual(m.left,875);assert.strictEqual(t.db.vp,2000);
// Unknown bundle price must never be silently assumed free.
delete t.db.prices['bundles:bundle-1'];m=t.buyingMetrics(t.activeBuyingPlan());
assert.strictEqual(m.unknown,1);assert.strictEqual(m.total,1775);
assert(t.simPrice(t.itemById('bundles:bundle-1')).known===false);
t.render();assert(t.html.includes('PRICE UNKNOWN'));
// Owned items have zero additional planned VP.
t.addToSimulator('skin-vandal2');m=t.buyingMetrics(t.activeBuyingPlan());assert.strictEqual(m.owned,1);assert.strictEqual(m.total,1775);
// Non-destructive core data unchanged.
assert.strictEqual(t.db.owned.length,1);assert.strictEqual(t.db.priority.length,2);
// Scope-specific Priority totals work using v17 priority framework.
t.priorityScope='skins';t.render();let ids=t.priorityItems();assert.strictEqual(ids.length,1);assert.strictEqual(t.vpSummary(ids).required,1775);
// Create second plan through UI form event.
const form={id:'new-buying-plan',data:new Map([['planName','Dream Plan']])};
callbacks.submit({preventDefault(){},target:form});
assert.strictEqual(t.db.buyingPlans.length,2);assert.strictEqual(t.activeBuyingPlan().name,'Dream Plan');assert.strictEqual(t.activeBuyingPlan().items.length,0);
assert(JSON.parse(store.get('valowish_v18')).buyingPlans.length===2);
console.log('PASS: v18 local-data migration, priority VP, wishlist & priority add actions, duplicate protection, plan totals, independent reorder, custom budget, unknown prices, owned exclusions, multiple plans, and local persistence.');
})().catch(e=>{console.error(e);process.exitCode=1});