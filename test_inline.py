from playwright.sync_api import sync_playwright
from pathlib import Path
import json
root=Path('/mnt/data/VALOWISH_v15_READY')
css=(root/'assets/main.css').read_text()
js=(root/'assets/app.js').read_text()
weapons=[]
for weapon in ['Outlaw','Bandit','Warden','Vandal','Phantom']:
    weapons.append({'displayName':weapon,'skins':[{'uuid':f'{weapon.lower()}-{n}','displayName':f'{weapon} Elite {n}','displayIcon':'','contentTierUuid':'tier-premium','levels':[],'chromas':[{'uuid':f'{weapon}-{n}-v','displayName':'Chroma','fullRender':'https://example.com/none.png'}]} for n in range(1,10)]})
fetchjs='''window.fetch=async function(url){const u=String(url), data= u.includes('contenttiers')?[{uuid:'tier-premium',displayName:'Premium Edition',displayIcon:''}]:u.includes('/weapons')?MWEAPONS:[{uuid:'agent1',displayName:'Test Agent',displayIcon:'',description:'Agent'}];return {ok:true,status:200,json:async()=>({data})}}'''.replace('MWEAPONS',json.dumps(weapons))
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 def setup(page):
    errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
    page.set_content('<html><head></head><body><div id="root"></div></body></html>')
    page.add_style_tag(content=css)
    page.evaluate('''window.__mem={};Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:(k)=>window.__mem[k]||null,setItem:(k,v)=>window.__mem[k]=v,removeItem:(k)=>delete window.__mem[k]}})''')
    page.evaluate(fetchjs)
    page.evaluate(js)
    page.wait_for_timeout(500)
    return errors
 page=b.new_page(viewport={'width':1440,'height':900},device_scale_factor=1)
 errs=setup(page)
 assert page.get_by_text('Command Center').count()>0
 page.screenshot(path='/mnt/data/VALOWISH_v15_desktop_test.png',full_page=True)
 page.locator('button[data-route="discover"]').first.click()
 page.wait_for_timeout(300)
 print('cards discover',page.locator('.ready-card').count(), 'text',page.locator('body').inner_text()[:500])
 assert page.locator('.ready-card').count()>0
 assert page.locator('button[data-pager="discover"]').count()>0
 page.locator('button[data-toggle="wishlist"]').first.click()
 assert len(json.loads(page.evaluate('window.__mem["valowish_v15"]'))['wishlist'])==1
 page.locator('button[data-route="wishlist"]').first.click()
 assert page.locator('.ready-card').count()==1
 page.locator('button[data-route="discover"]').first.click()
 page.locator('button[data-toggle="owned"]').first.click()
 page.locator('button[data-route="locker"]').first.click()
 assert page.locator('.ready-card').count()==1
 page.locator('button[data-detail]').first.click()
 assert page.locator('.ready-modal').count()==1
 page.locator('[data-close="1"]').click()
 assert page.locator('.ready-modal').count()==0
 page.locator('button[data-route="planner"]').first.click()
 page.locator('#new-goal input[name="goalName"]').fill('Test Goal')
 page.locator('#new-goal input[name="goalVP"]').fill('2000')
 page.locator('#new-goal button').first.click()
 assert page.get_by_text('Test Goal').count()>0
 print('desktop errors',errs)
 assert not errs,errs
 mobile=b.new_page(viewport={'width':390,'height':844},device_scale_factor=1)
 me=setup(mobile)
 mobile.screenshot(path='/mnt/data/VALOWISH_v15_mobile_test.png',full_page=True)
 assert mobile.locator('.mobile-nav').is_visible()
 mobile.locator('button[data-route="more"]').last.click()
 assert mobile.locator('.more-sheet').count()==1
 mobile.locator('.more-sheet button[data-route="insights"]').click()
 assert mobile.get_by_text('Insights').count()>0
 assert not me,me
 print('mobile overflow',mobile.evaluate('document.documentElement.scrollWidth > innerWidth+1'))
 print('all browser tests passed')
 b.close()
