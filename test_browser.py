from playwright.sync_api import sync_playwright
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from threading import Thread
import os,json,time
os.chdir('/mnt/data/VALOWISH_v15_READY')
srv=ThreadingHTTPServer(('127.0.0.1',8765),SimpleHTTPRequestHandler)
Thread(target=srv.serve_forever,daemon=True).start()
weapons=[]
for weapon in ['Outlaw','Bandit','Warden','Vandal','Phantom']:
    weapons.append({'displayName':weapon,'skins':[{'uuid':f'{weapon.lower()}-{n}','displayName':f'{weapon} Elite {n}','displayIcon':'https://example.com/none.png','contentTierUuid':'tier-premium','levels':[],'chromas':[]} for n in range(1,10)]})
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True, executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
    page=browser.new_page(viewport={'width':1440,'height':900},device_scale_factor=1)
    errors=[]
    page.on('pageerror',lambda e: errors.append(str(e)))
    page.route('**/cdn.jsdelivr.net/**',lambda r:r.abort())
    page.route('**/fonts.googleapis.com/**',lambda r:r.abort())
    page.route('**/fonts.gstatic.com/**',lambda r:r.abort())
    page.route('**/example.com/**',lambda r:r.abort())
    page.route('**/valorant-api.com/v1/weapons',lambda r:r.fulfill(status=200,content_type='application/json',body=json.dumps({'data':weapons})))
    page.route('**/valorant-api.com/v1/contenttiers',lambda r:r.fulfill(status=200,content_type='application/json',body=json.dumps({'data':[{'uuid':'tier-premium','displayName':'Premium Edition','displayIcon':''}]})))
    page.route('**/valorant-api.com/v1/**',lambda r:r.fulfill(status=200,content_type='application/json',body=json.dumps({'data':[{'uuid':'a01','displayName':'Sample Agent','displayIcon':'','description':'Agent'}]})))
    response=page.goto('file:///mnt/data/VALOWISH_v15_READY/index.html',wait_until='domcontentloaded')
    page.wait_for_timeout(600)
    assert response.status==200
    assert page.locator('text=Command Center').count()>0
    page.screenshot(path='/mnt/data/VALOWISH_v15_desktop_test.png',full_page=True)
    page.get_by_role('button',name='Discover',exact=True).first.click()
    page.wait_for_timeout(600)
    assert page.get_by_text('Outlaw Elite 1').count()>0
    assert page.locator('button[data-pager="discover"]').count()>0
    page.locator('[data-toggle="wishlist"]').first.click()
    assert page.evaluate('JSON.parse(localStorage.getItem("valowish_v15")).wishlist.length')==1
    page.locator('button[data-route="wishlist"]').first.click()
    assert page.locator('.ready-card').count()==1
    page.locator('button[data-route="locker"]').first.click()
    assert page.locator('.ready-empty').count()==1
    page.locator('button[data-route="discover"]').first.click()
    page.locator('[data-toggle="owned"]').first.click()
    page.locator('button[data-route="locker"]').first.click()
    assert page.locator('.ready-card').count()==1
    page.locator('[data-detail]').first.click()
    assert page.locator('.ready-modal').count()==1
    page.locator('[data-close="1"]').click()
    assert page.locator('.ready-modal').count()==0
    page.locator('button[data-route="planner"]').first.click()
    page.locator('#new-goal input[name="goalName"]').fill('Test Goal')
    page.locator('#new-goal input[name="goalVP"]').fill('2000')
    page.locator('#new-goal button[type="submit"],#new-goal button').first.click()
    assert page.get_by_text('Test Goal').count()>0
    print('DESKTOP OK', 'errors',errors)
    assert not errors,errors
    mobile=browser.new_page(viewport={'width':390,'height':844},device_scale_factor=1)
    mobile_errors=[]
    mobile.on('pageerror',lambda e:mobile_errors.append(str(e)))
    mobile.route('**/cdn.jsdelivr.net/**',lambda r:r.abort())
    mobile.route('**/fonts.googleapis.com/**',lambda r:r.abort())
    mobile.route('**/fonts.gstatic.com/**',lambda r:r.abort())
    mobile.route('**/valorant-api.com/v1/**',lambda r:r.fulfill(status=200,content_type='application/json',body=json.dumps({'data':weapons})))
    mobile.goto('file:///mnt/data/VALOWISH_v15_READY/index.html',wait_until='domcontentloaded')
    mobile.wait_for_timeout(350)
    mobile.screenshot(path='/mnt/data/VALOWISH_v15_mobile_test.png',full_page=True)
    assert mobile.locator('.mobile-nav').is_visible()
    mobile.locator('.mobile-nav button[data-route="more"]').click()
    assert mobile.locator('.more-sheet').count()==1
    mobile.locator('.more-sheet button[data-route="insights"]').click()
    assert mobile.get_by_text('INSIGHTS',exact=True).count()>0
    assert not mobile_errors,mobile_errors
    overflow=mobile.evaluate('document.documentElement.scrollWidth > window.innerWidth+1')
    print('MOBILE OK', 'horizontal overflow',overflow)
    assert not overflow
    browser.close()
srv.shutdown()
