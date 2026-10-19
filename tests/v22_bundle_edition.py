"""Standalone desktop/mobile smoke test for v22 bundle ownership and edition filters."""
from playwright.sync_api import sync_playwright
from pathlib import Path
import json
root=Path(__file__).resolve().parent.parent
app=(root/'assets/app.js').read_text()
css=(root/'assets/main.css').read_text()
fixture={
'bundles':[{'uuid':'bundle-uuid','displayName':'Kuronami','verticalPromoImage':'https://example.com/bundle.png'}],
'weapons':[{'uuid':'weapon-uuid','displayName':'Vandal','skins':[
 {'uuid':'skin-premium','displayName':'Kuronami Vandal','contentTierUuid':'tier-premium','displayIcon':'https://example.com/premium.png'},
 {'uuid':'skin-select','displayName':'Kuronami Other Vandal','contentTierUuid':'tier-select','displayIcon':'https://example.com/select.png'}]}],
'contenttiers':[{'uuid':'tier-premium','displayName':'Premium Edition'},{'uuid':'tier-select','displayName':'Select Edition'}],
'playercards':[], 'buddies':[], 'agents':[]}
init='''(data)=>{const store=data||{};Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>Object.hasOwn(store,k)?store[k]:null,setItem:(k,v)=>store[k]=v,removeItem:k=>delete store[k],key:i=>Object.keys(store)[i],get length(){return Object.keys(store).length}}});window.__getStore=()=>store;window.supabase={createClient:()=>({auth:{getSession:async()=>({data:{session:null},error:null}),onAuthStateChange:()=>{}}})};window.fetch=async url=>({ok:true,json:async()=>({data:window.__catalog[String(url).split('/v1/')[1]?.split('?')[0]]||[]})});}'''
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for mobile in (False,True):
  ctx=browser.new_context(viewport={'width':360 if mobile else 1366,'height':740 if mobile else 850})
  page=ctx.new_page();err=[];page.on('pageerror',lambda e:err.append(str(e)))
  def init_page(store=None):
   page.set_content('<html><head></head><body><div id="root"></div></body></html>')
   page.add_style_tag(content=css)
   page.evaluate('window.__catalog = '+json.dumps(fixture))
   page.evaluate(init,store)
   page.add_script_tag(content=app)
   page.wait_for_timeout(200)
  def route(route):
   if mobile and route in ('favorites','priority','locker','wishlist'):
    if page.locator('.mobile-nav [data-route="'+route+'"]').count(): page.locator('.mobile-nav [data-route="'+route+'"]').click()
    else:
     page.locator('[data-route="more"]').first.click()
     page.locator('.more-grid [data-route="'+route+'"]').click()
   elif mobile: page.locator('.mobile-nav [data-route="'+route+'"]').click()
   else: page.locator('.side-nav [data-route="'+route+'"]').click()
  init_page()
  route('discover')
  page.locator('[data-filter="edition"]').select_option('Premium Edition')
  page.wait_for_timeout(100)
  assert page.locator('.ready-cards .ready-card').count()==1,'premium filter must show one skin'
  assert 'Kuronami Vandal' in page.locator('.ready-cards .ready-card').inner_text()
  page.locator('[data-filter="edition"]').select_option('Select Edition')
  assert page.locator('.ready-cards .ready-card').count()==1,'select filter must show one skin'
  page.locator('[data-filterclear]').click()
  assert page.locator('.ready-cards .ready-card').count()==2,'clear edition filter restores both'
  page.locator('[data-kind="bundles"]').first.click();page.wait_for_timeout(160)
  card=page.locator('.ready-card.type-bundles')
  assert card.count()==1
  assert '0 / 0' in card.locator('.bundle-progress').inner_text()
  assert card.locator('progress').get_attribute('value')=='0'
  page.locator('[data-detail="bundles:bundle-uuid"]').first.click()
  assert '0 / 0' in page.locator('.bundle-feature .bundle-progress').inner_text()
  page.locator('[data-bundle-picker-open]').first.click();page.wait_for_timeout(140)
  page.locator('[data-bundle-content="skin-premium"]').last.click()
  page.locator('[data-bundle-content="skin-select"]').last.click()
  page.locator('[data-bundle-picker-close]').first.click()
  assert '0 / 2' in page.locator('.bundle-feature .bundle-progress').inner_text()
  assert page.locator('.bundle-feature .bundle-progress progress').get_attribute('max')=='2'
  page.locator('.bundle-item-grid [data-toggle="owned"][data-item="skin-premium"]').first.click()
  assert '1 / 2' in page.locator('.bundle-feature .bundle-progress').inner_text()
  assert page.locator('.bundle-feature .bundle-progress progress').get_attribute('value')=='1'
  page.locator('[data-toggle="owned"][data-item="bundles:bundle-uuid"]').first.click()
  assert '1 / 2' in page.locator('.bundle-feature .bundle-progress').inner_text(),'bundle own cannot mark all contents'
  page.locator('.bundle-item-grid [data-toggle="owned"][data-item="skin-select"]').first.click()
  assert '2 / 2' in page.locator('.bundle-feature .bundle-progress').inner_text()
  page.locator('[data-bundle-back]').first.click()
  assert '2 / 2' in page.locator('.ready-card.type-bundles .bundle-progress').inner_text()
  route('locker');page.wait_for_timeout(180)
  assert page.locator('#collection-edition').count()==1
  page.locator('#collection-edition').select_option('Premium Edition')
  assert page.locator('.ready-cards .ready-card.type-skins').count()==1
  assert 'Kuronami Vandal' in page.locator('.ready-cards .ready-card.type-skins').inner_text()
  store=page.evaluate('window.__getStore()')
  assert json.loads(store['valowish_v22'])['bundleContents']['bundles:bundle-uuid']==['skin-premium','skin-select']
  assert json.loads(store['valowish_v22'])['preferences']['collectionViews']['locker']['edition']=='Premium Edition'
  page.close();page=ctx.new_page();init_page(store);route('locker');page.wait_for_timeout(120)
  assert page.locator('#collection-edition').input_value()=='Premium Edition'
  assert page.locator('.ready-cards .ready-card.type-skins').count()==1
  overflow=page.evaluate('document.documentElement.scrollWidth-document.documentElement.clientWidth')
  assert overflow<=6, f'horizontal overflow {overflow} px'
  assert not err,err
  print('PASS', 'mobile' if mobile else 'desktop','— edition filters, bundle progress, individual ownership, reload, mobile width')
  ctx.close()
 browser.close()
