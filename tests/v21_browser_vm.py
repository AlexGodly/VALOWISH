from playwright.sync_api import sync_playwright
from pathlib import Path
import json
app=Path('/mnt/data/valowish_v21/assets/app.js').read_text()
css=Path('/mnt/data/valowish_v21/assets/main.css').read_text()
fixture={
 'bundles':[{'uuid':'bundle-uuid','displayName':'Kuronami','description':'A collection','verticalPromoImage':'https://example.com/bundle.png'}],
 'weapons':[{'uuid':'weapon-uuid','displayName':'Vandal','skins':[{'uuid':'skin-uuid','displayName':'Kuronami Vandal','displayIcon':'https://example.com/skin.png','chromas':[],'levels':[]}]}],
 'playercards':[{'uuid':'card-uuid','displayName':'Kuronami Card','largeArt':'https://example.com/card.png'}],
 'agents':[{'uuid':'agent-uuid','displayName':'Fade','displayIcon':'https://example.com/fade.png'}],
 'contenttiers':[]}
init='''(data)=>{
 const store=data||{};
 Object.defineProperty(window,'localStorage',{configurable:true,value:{
 getItem:k=>Object.hasOwn(store,k)?store[k]:null,setItem:(k,v)=>store[k]=v,removeItem:k=>delete store[k],key:i=>Object.keys(store)[i],get length(){return Object.keys(store).length}
 }});
 window.__getStore=()=>store;
 window.supabase={createClient:()=>({auth:{getSession:async()=>({data:{session:null},error:null}),onAuthStateChange:()=>{} }})};
 const fake=window.__catalog;
 window.fetch=async (url)=>({ok:true,json:async()=>({data:fake[String(url).split('/v1/')[1]?.split('?')[0]]||[]})});
}'''
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for mobile in [False,True]:
  ctx=b.new_context(viewport={'width':375 if mobile else 1440,'height':812 if mobile else 900});page=ctx.new_page();errs=[]
  page.on('pageerror',lambda e:errs.append(str(e)))
  def setup(stored=None):
   page.set_content('<!doctype html><html><head></head><body><div id="root"></div></body></html>')
   page.add_style_tag(content=css)
   page.evaluate('window.__catalog = '+json.dumps(fixture))
   page.evaluate(init,stored or {})
   page.add_script_tag(content=app)
   page.wait_for_timeout(130)
  def route(key):
   if mobile and key=='favorites':
    page.locator('[data-route="more"]').first.click()
    page.locator('.more-grid [data-route="favorites"]').click()
   elif mobile:
    page.locator('.mobile-nav [data-route="'+key+'"]').click()
   else:
    page.locator('.side-nav [data-route="'+key+'"]').click()
  setup()
  assert page.locator('.side-nav [data-route="favorites"]').count()==1
  route('discover');page.locator('[data-kind="bundles"]').first.click();page.wait_for_timeout(90)
  assert page.locator('[data-detail="bundles:bundle-uuid"]').count()>0,'bundle card missing'
  page.locator('[data-detail="bundles:bundle-uuid"]').first.click()
  assert page.locator('h2').filter(has_text='Kuronami').count()>0,'bundle details missing'
  assert page.locator('[data-bundle-picker-open]').count()>0
  for bucket in ['favorites','wishlist','owned']:
   page.locator('[data-toggle="'+bucket+'"][data-item="bundles:bundle-uuid"]').first.click()
  page.locator('[data-bundle-picker-open]').first.click();page.wait_for_timeout(120)
  page.locator('[data-bundle-content="skin-uuid"]').last.click()
  page.locator('[data-bundle-picker-close]').first.click()
  assert page.locator('.bundle-item-grid .ready-card').count()==1
  page.locator('[data-bundle-back]').first.click()
  route('favorites')
  page.locator('[data-collection-category="bundles"]').first.click()
  assert page.locator('[data-detail="bundles:bundle-uuid"]').count()>0
  page.locator('[data-collection-group="intel"]').first.click()
  assert page.locator('[data-collection-category="agents"]').count()>0
  route('discover');page.locator('[data-kind="agents"]').first.click();page.wait_for_timeout(70)
  page.locator('[data-toggle="favorites"][data-item="agents:agent-uuid"]').first.click()
  route('favorites')
  assert page.locator('[data-detail="agents:agent-uuid"]').count()>0
  page.locator('[data-collection-group="cosmetic"]').first.click()
  page.locator('[data-collection-category="bundles"]').first.click()
  page.locator('#collection-sort').select_option('az')
  page.locator('#collection-state').select_option('owned')
  assert page.locator('.collection-results').inner_text().startswith('1 matching')
  stored=page.evaluate('window.__getStore()')
  assert json.loads(stored['valowish_v21'])['bundleContents']['bundles:bundle-uuid']==['skin-uuid']
  assert set(json.loads(stored['valowish_v21'])['favorites'])=={'agents:agent-uuid','bundles:bundle-uuid'}
  # persist through fresh in-page JS app startup (equivalent to reload, no navigations allowed in sandbox)
  page.close();page=ctx.new_page();setup(stored)
  route('favorites')
  assert page.locator('#collection-state').input_value()=='owned'
  assert page.locator('[data-detail="bundles:bundle-uuid"]').count()>0
  overflow=page.evaluate('document.documentElement.scrollWidth - document.documentElement.clientWidth')
  if overflow>6: print('OVERFLOW',overflow,page.evaluate('Array.from(document.querySelectorAll("body *")).filter(e=>e.getBoundingClientRect().right>innerWidth+3).slice(0,15).map(e=>[e.tagName,e.className?.toString().slice(0,60),Math.floor(e.getBoundingClientRect().right)] )'))
  assert overflow<=6, f'horizontal overflow {overflow}'
  assert not errs,errs
  page.screenshot(path='/mnt/data/VALOWISH_v21_'+('mobile' if mobile else 'desktop')+'.png')
  print('PASS', 'mobile' if mobile else 'desktop', 'bundle actions, picker, curated contents, cosmetic/intel favorites, preferences persistence, reload')
  ctx.close()
 b.close()