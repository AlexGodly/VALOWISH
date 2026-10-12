from playwright.sync_api import sync_playwright
from pathlib import Path
import json
root=Path(__file__).resolve().parents[1]
css=(root/'assets/main.css').read_text();js=(root/'assets/app.js').read_text()
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for width in [320,375,768,1000,1440]:
  page=b.new_page(viewport={'width':width,'height':850})
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content('<div id="root"></div>')
  page.add_style_tag(content=css)
  page.evaluate('''window.__mem={'valowish_v13':JSON.stringify({name:'TESTUSER',vp:900,wishlist:['vandal-1'],owned:['vandal-1'],priority:[],history:[]})};Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:(k)=>window.__mem[k]||null,setItem:(k,v)=>window.__mem[k]=v,removeItem:(k)=>delete window.__mem[k]}});window.fetch=()=>Promise.reject(Error('offline'));void 0''' )
  page.evaluate(js)
  page.wait_for_timeout(220)
  assert 'COMMAND CENTER' in page.locator('body').inner_text().upper()
  assert json.loads(page.evaluate('window.__mem.valowish_v15'))['name']=='TESTUSER'
  assert json.loads(page.evaluate('window.__mem.valowish_v15'))['wishlist']==['vandal-1']
  assert page.locator('.startup').count()==0
  assert not errors,errors
  overflow=page.evaluate('document.documentElement.scrollWidth>innerWidth+1')
  assert not overflow,f'{width}px overflows'
  page.locator('button[data-route="locker"]:visible').first.click()
  assert page.locator('.ready-card').count()==1
  page.close()
  print('PASS offline + legacy migration + locker at',width)
 b.close()
