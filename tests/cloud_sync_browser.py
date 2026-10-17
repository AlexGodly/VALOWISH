import asyncio, json, copy, time
from pathlib import Path
from playwright.async_api import async_playwright

BACKEND={'row':None,'seq':0}
USER={'id':'test-sync-user','email':'sync@valowish.test'}
BASE=dict(wishlist=['skins:server-1'],owned=['skins:server-owned'],priority=['skins:server-1'],favorites=[],prices={},tiers={},name='CLOUD USER',vp=4321,rarityPrices={'Select':875,'Deluxe':1275,'Premium':1775,'Exclusive':2175,'Ultra':2475},history=[],undoStack=[],redoStack=[],notes={},tags={},acquired={},loadouts=[],goals=[],buyingPlans=[],priorityViews={},preferences={'density':'comfortable','reducedMotion':False,'pageSize':18,'view':'grid'})
BACKEND['row']={'data':copy.deepcopy(BASE),'updated_at':'2026-10-16T15:00:00.000Z'}

async def remote(source, query):
 op=query.get('op'); stamp=query.get('stamp'); data=query.get('data')
 if op=='select':return {'data':copy.deepcopy(BACKEND['row']),'error':None}
 if op=='update':
  if BACKEND['row'] is not None and BACKEND['row']['updated_at']==stamp:
   BACKEND['seq']+=1; new_stamp=f'2026-10-16T15:{BACKEND["seq"]//60:02}:{BACKEND["seq"]%60:02}.000Z'
   BACKEND['row']={'data':copy.deepcopy(data['data']),'updated_at':new_stamp};return {'data':{'updated_at':new_stamp},'error':None}
  return {'data':None,'error':None}
 if op=='insert':
  if BACKEND['row'] is not None:return {'data':None,'error':{'message':'duplicate key','code':'23505'}}
  BACKEND['seq']+=1;new_stamp=f'2026-10-16T15:00:{BACKEND["seq"]:02}.000Z';BACKEND['row']={'data':copy.deepcopy(data['data']),'updated_at':new_stamp};return {'data':{'updated_at':new_stamp},'error':None}
 raise Exception('unexpected remote op '+str(query))

JS=r'''(()=>{
 const user={id:'test-sync-user',email:'sync@valowish.test'};
 const cloudRow=async p=>window.remoteBackend(p);
 const db={from:function(){return {op:'select',conditions:{},payload:null,select:function(){return this},update:function(v){this.op='update';this.payload=v;return this},insert:function(v){this.op='insert';this.payload=v;return this},eq:function(k,v){this.conditions[k]=v;return this},maybeSingle:async function(){return await cloudRow({op:this.op,stamp:this.conditions.updated_at,data:this.payload})}}}};
 window.supabase={createClient:()=>({...db,auth:{getSession:async()=>({data:{session:{user}},error:null}),onAuthStateChange:()=>({data:{subscription:{unsubscribe(){}}}}),signInWithPassword:async()=>({data:{user,session:{user}},error:null}),signUp:async()=>({data:{user,session:{user}},error:null}),signOut:async()=>({error:null}),updateUser:async()=>({error:null})},functions:{invoke:async()=>({error:null})}})};
})();'''

async def fresh(browser, seed=None):
 ctx=await browser.new_context(viewport={'width':1280,'height':800})
 await ctx.expose_binding('remoteBackend',remote)
 await ctx.add_init_script(JS)
 page=await ctx.new_page()

 errors=[];page.on('pageerror',lambda e: errors.append(str(e)))
 await page.set_content('<html><head></head><body><div id="root"></div></body></html>')
 await page.evaluate("(()=>{const m=new Map();const store={getItem:k=>m.has(k)?m.get(k):null,setItem:(k,v)=>m.set(k,String(v)),removeItem:k=>m.delete(k),key:i=>[...m.keys()][i]||null,clear:()=>m.clear(),get length(){return m.size}};Object.defineProperty(window,'localStorage',{configurable:true,value:store});})()")
 if seed is not None:
  await page.evaluate("v=>localStorage.setItem('valowish_v19',JSON.stringify(v))",seed)
 await page.evaluate(JS)
 await page.evaluate("window.fetch=async()=>({ok:true,json:async()=>({data:[]})})")
 code=(Path(__file__).resolve().parent.parent/'assets/app.js').read_text()
 marker="render();ensureKind('skins');initCloud().catch(console.error);"
 assert marker in code
 code=code.replace(marker,"window.__v20={get:()=>JSON.parse(JSON.stringify(db)),set:(x)=>{db=normalized({...db,...x});save();render()},status:()=>({status:cloudStatus,message:cloudMessage,conflict:!!cloudConflict,user:cloudUser?.id,last:cloudLastSync}),sync:()=>queueCloudSync(),resolve:(choice)=>resolveCloudConflict(choice),cloudPayload:()=>payloadOf(db)};\n"+marker)
 await page.add_script_tag(content=code)
 await page.wait_for_function('window.__v20?.status()?.status=== "synced"',timeout=9000)
 return ctx,page,errors

async def main():
 async with async_playwright() as pw:
  browser=await pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
  ctx1,page1,e1=await fresh(browser)
  data1=await page1.evaluate('window.__v20.get()')
  assert data1['name']=='CLOUD USER' and data1['vp']==4321 and 'skins:server-1' in data1['wishlist'],data1
  print('PASS: Auto-restores cloud on initial saved session')
  await page1.evaluate("window.__v20.set({wishlist:['skins:server-1','skins:from-device-1']})")
  await page1.wait_for_function('window.__v20?.status()?.status==="synced"',timeout=9000)
  assert 'skins:from-device-1' in BACKEND['row']['data']['wishlist'],BACKEND['row']['data']
  print('PASS: Local changes auto-save to cloud')
  ctx2,page2,e2=await fresh(browser)
  data2=await page2.evaluate('window.__v20.get()')
  assert 'skins:from-device-1' in data2['wishlist'],data2
  print('PASS: New device restores previous device changes')
  await page2.evaluate("window.__v20.set({name:'UPDATED FROM DEVICE 2'})")
  await page2.wait_for_function('window.__v20?.status()?.status==="synced"',timeout=9000)
  await page1.evaluate("window.__v20.sync()")
  await page1.wait_for_function("window.__v20.get().name==='UPDATED FROM DEVICE 2'",timeout=9000)
  print('PASS: Existing device refresh-syncs updates from another device')
  # Simultaneous independent changes, auto-merge
  await page1.evaluate("window.__v20.set({wishlist:['skins:server-1','skins:from-device-1','skins:from-device-1b']})")
  await page2.evaluate("window.__v20.set({favorites:['skins:device-2-favorite']})")
  await page1.evaluate('window.__v20.sync()')
  await page2.evaluate('window.__v20.sync()')
  await page1.wait_for_function('window.__v20?.status()?.status==="synced"',timeout=9000)
  await page2.wait_for_function('window.__v20?.status()?.status==="synced"',timeout=9000)
  row=BACKEND['row']['data']
  assert 'skins:from-device-1b' in row['wishlist'] and 'skins:device-2-favorite' in row['favorites'],row
  print('PASS: Concurrent nonoverlapping updates auto-merge safely')
  # Concurrent conflicting edits reconcile automatically, with recovery snapshots.
  await page1.evaluate("window.__v20.set({name:'NAME FROM A'})")
  await page2.evaluate("window.__v20.set({name:'NAME FROM B'})")
  await page1.evaluate('window.__v20.sync()')
  await page2.evaluate('window.__v20.sync()')
  await page2.wait_for_function("window.__v20?.status()?.status==='synced'",timeout=10000)
  await page1.evaluate('window.__v20.sync()')
  await page1.wait_for_function("window.__v20?.status()?.status==='synced'",timeout=10000)
  assert (await page2.evaluate('window.__v20.status().conflict')) == False
  assert BACKEND['row']['data']['name'] in ['NAME FROM A','NAME FROM B']
  print('PASS: Concurrent edits reconcile automatically without manual Review Cloud')
  await page2.locator('[data-route="settings"]').first.click()
  assert await page2.locator('[data-cloud-resolve="cloud"]').count()==0
  assert 'Automatic cloud saving is on' in await page2.locator('#root').inner_text()
  print('PASS: Settings never asks for normal cloud review')
  # Local reset must not erase a stored cloud account
  before=copy.deepcopy(BACKEND['row']['data'])
  await page2.locator('[data-reset="1"]').click()
  await page2.evaluate('window.__v20.sync()')
  await page2.wait_for_function("window.__v20?.status()?.status==='synced'",timeout=7000)
  assert BACKEND['row']['data']==before,'Local-only reset erased cloud'
  assert (await page2.evaluate('window.__v20.get().name'))==before['name']
  print('PASS: Local-only reset never erases cloud data')
  # Migration: old local v19 data and an unrelated cloud record both contain nonempty collections.
  BACKEND['row']={'data':copy.deepcopy(BASE),'updated_at':'2026-10-16T15:55:00.000Z'}
  incoming=copy.deepcopy(BASE);incoming['wishlist']=['skins:older-device'];incoming['buyingPlans']=[{'id':'plan-old','name':'Old local plan','items':['skins:older-device'],'balanceOverride':None}];incoming['name']='OLD LOCAL USER'
  ctx3,page3,e3=await fresh(browser,seed=incoming)
  state3=await page3.evaluate('window.__v20.status()')
  assert state3['status']=='synced' and not state3['conflict'],state3
  merged=BACKEND['row']['data']
  assert set(merged['wishlist'])=={'skins:server-1','skins:older-device'},merged
  assert merged['name']=='CLOUD USER',merged
  assert merged['buyingPlans'][0]['id']=='plan-old',merged
  print('PASS: Old v19 device and existing cloud data automatically merge on first login')
  await page3.locator('[data-route="settings"]').first.click()
  assert await page3.locator('details.cloud-snapshot-options').count()==1
  await page3.locator('details.cloud-snapshot-options summary').click()
  assert await page3.locator('[data-restore-snapshot]').count()>=2
  print('PASS: Both automatic merge recovery snapshots are accessible without any review prompt')
  # Purchase plan edit with two independent devices, including ordering and new cosmetics.
  ctx4,page4,e4=await fresh(browser)
  await page3.evaluate("window.__v20.set({buyingPlans:[{id:'plan-old',name:'Old local plan',items:['skins:older-device','skins:server-1'],balanceOverride:1000}]})")
  await page4.evaluate("window.__v20.set({buyingPlans:[{id:'plan-old',name:'Cloud updated plan',items:['skins:older-device','skins:new-buy'],balanceOverride:2000}]})")
  await page3.evaluate('window.__v20.sync()');await page4.evaluate('window.__v20.sync()')
  await page3.wait_for_function('window.__v20.status().status==="synced"',timeout=12000)
  await page4.wait_for_function('window.__v20.status().status==="synced"',timeout=12000)
  await page3.evaluate('window.__v20.sync()')
  merged=BACKEND['row']['data'];itemIds=merged['buyingPlans'][0]['items']
  assert set(itemIds)=={'skins:older-device','skins:server-1','skins:new-buy'},merged
  print('PASS: Concurrent edits to buying plans keep all newly added cosmetics automatically')
  # Explicit local reset followed by local edits must not wipe the cloud data.
  await page3.evaluate("window.__v20.set({name:'LOCAL USER AFTER RESET'})")
  await page3.evaluate("localStorage.setItem('valowish_local_reset_v19_test-sync-user','1')")
  await page3.evaluate("window.__v20.set({wishlist:['skins:after-reset'],owned:[],priority:[]})")
  await page3.evaluate('window.__v20.sync()')
  await page3.wait_for_function('window.__v20.status().status==="synced"',timeout=12000)
  merged=BACKEND['row']['data']
  assert 'skins:after-reset' in merged['wishlist'] and 'skins:server-1' in merged['wishlist'],merged
  assert 'skins:server-owned' in merged['owned'],merged
  print('PASS: Data edited after a local reset safely auto-merges with cloud instead of wiping it')
  # v21: independently curate the same bundle on two devices; both choices must survive.
  await page3.evaluate("window.__v20.set({bundleContents:{'bundles:demo':['skin:vandal']}})")
  await page4.evaluate("window.__v20.set({bundleContents:{'bundles:demo':['skin:ghost']}})")
  await page3.evaluate('window.__v20.sync()');await page4.evaluate('window.__v20.sync()')
  await page3.wait_for_function('window.__v20.status().status==="synced"',timeout=12000)
  await page4.wait_for_function('window.__v20.status().status==="synced"',timeout=12000)
  await page3.evaluate('window.__v20.sync()')
  saved=BACKEND['row']['data']
  assert set(saved['bundleContents']['bundles:demo'])=={'skin:vandal','skin:ghost'},saved
  print('PASS: Concurrent bundle contents selections merge automatically')
  # v21: collection view filters persist through the same cloud record.
  await page3.evaluate("window.__v20.set({preferences:{...window.__v20.get().preferences,collectionViews:{favorites:{group:'intel',category:'agents',sort:'az',state:'all'}}}})")
  await page3.evaluate('window.__v20.sync()');await page4.evaluate('window.__v20.sync()')
  await page4.wait_for_function("window.__v20.get().preferences.collectionViews?.favorites?.category==='agents'",timeout=12000)
  print('PASS: Favorites category and sorting preferences synchronize across devices')
  assert not e1 and not e2 and not e3 and not e4,{'device1':e1,'device2':e2,'device3':e3,'device4':e4}
  print('PASS: No browser page errors')
  await browser.close()

if __name__=='__main__': asyncio.run(main())