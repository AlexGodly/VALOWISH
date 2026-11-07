"""VALOWISH v24 browser test (desktop 1366px + mobile 375px) in real Chromium.

Covers: chip filters, Priority BY WEAPON TYPE, buying-plan picker (filters, multi-select,
list keeps its scroll position after add/select), the in-app video player (play, next,
error fallback, close), completion page, two-tab data safety, and no horizontal overflow.
Run: python3 tests/v24_browser.py   (needs Playwright + Chrome; serves the repo locally)
"""
import json, subprocess, sys, time, socket, os, tempfile
from pathlib import Path
from playwright.sync_api import sync_playwright

root = Path(__file__).resolve().parent.parent
CHROME = next((p for p in ('/usr/bin/chromium', '/usr/bin/google-chrome', '/usr/bin/chromium-browser') if os.path.exists(p)), None)

def free_port():
    s = socket.socket(); s.bind(('127.0.0.1', 0)); p = s.getsockname()[1]; s.close(); return p

# ---- fixture catalog --------------------------------------------------------------
tiers = [{'uuid': 't-sel', 'displayName': 'Select Edition'}, {'uuid': 't-prem', 'displayName': 'Premium Edition'},
         {'uuid': 't-excl', 'displayName': 'Exclusive Edition'}, {'uuid': 't-ultra', 'displayName': 'Ultra Edition'}]
tier_ids = ['t-sel', 't-prem', 't-excl', 't-ultra']
img = 'https://media.test/art.png'
def skin(uid, name, tier, videos=False):
    s = {'uuid': uid, 'displayName': name, 'contentTierUuid': tier, 'displayIcon': img,
         'chromas': [{'uuid': uid + '-c0', 'displayName': name, 'fullRender': img}],
         'levels': [{'uuid': uid + '-l1', 'displayName': name}]}
    if videos:
        s['chromas'] += [{'uuid': uid + '-c1', 'displayName': name + ' Variant 1 Red', 'fullRender': img, 'swatch': img, 'streamedVideo': 'https://media.test/ok.mp4'},
                         {'uuid': uid + '-c2', 'displayName': name + ' Variant 2 Blue', 'fullRender': img, 'swatch': img, 'streamedVideo': 'https://media.test/broken.mp4'}]
        s['levels'] += [{'uuid': uid + '-l2', 'displayName': name + ' Level 2', 'levelItem': 'EEquippableSkinLevelItem::VFX', 'streamedVideo': 'https://media.test/ok.mp4'},
                        {'uuid': uid + '-l3', 'displayName': name + ' Level 3', 'levelItem': 'EEquippableSkinLevelItem::Animation', 'streamedVideo': 'https://media.test/ok.mp4'}]
    return s
weapons = []
for w in ['Vandal', 'Phantom', 'Sheriff', 'Ghost', 'Operator', 'Spectre', 'Judge', 'Odin', 'Melee']:
    skins = [{'uuid': f'std-{w}', 'displayName': f'Standard {w}' if w != 'Melee' else 'Melee'}]
    skins += [skin(f'{w.lower()}-{i:02d}', f'Skin{i:02d} {w}', tier_ids[i % 4], videos=(w == 'Vandal' and i == 0)) for i in range(40 if w == 'Vandal' else 6)]
    weapons.append({'uuid': 'w-' + w, 'displayName': w, 'displayIcon': img, 'skins': skins})
cards = [{'uuid': f'card{i}', 'displayName': f'Card {i:02d}', 'largeArt': img} for i in range(20)]
fixture = {'weapons': weapons, 'contenttiers': tiers, 'playercards': cards, 'buddies': [], 'sprays': [], 'playertitles': [], 'flex': [], 'bundles': []}

SUPABASE_STUB = "window.supabase={createClient:()=>({auth:{getSession:async()=>({data:{session:null},error:null}),onAuthStateChange:()=>({})}})};"

def main():
    tmp = Path(tempfile.mkdtemp())
    ok_mp4 = tmp / 'ok.mp4'
    subprocess.run(['ffmpeg', '-loglevel', 'error', '-f', 'lavfi', '-i', 'testsrc=size=320x180:rate=10', '-t', '2', '-pix_fmt', 'yuv420p', '-c:v', 'libx264', str(ok_mp4)], check=True)
    port = free_port()
    server = subprocess.Popen([sys.executable, '-m', 'http.server', str(port), '--bind', '127.0.0.1', '--directory', str(root)], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    time.sleep(0.8)
    base = f'http://127.0.0.1:{port}/index.html'
    shots = Path(os.environ.get('SHOTS', tmp)); shots.mkdir(parents=True, exist_ok=True)
    results = []
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True, executable_path=CHROME, args=['--no-sandbox', '--disable-dev-shm-usage', '--autoplay-policy=no-user-gesture-required'])
            for label, vw, vh, mobile in (('desktop', 1366, 860, False), ('mobile', 375, 760, True)):
                ctx = browser.new_context(viewport={'width': vw, 'height': vh}, is_mobile=mobile, has_touch=mobile)
                def route(r):
                    u = r.request.url
                    if 'valorant-api.com/v1/' in u:
                        key = u.split('/v1/')[1].split('?')[0]
                        return r.fulfill(status=200, content_type='application/json', body=json.dumps({'data': fixture.get(key, [])}))
                    if 'supabase-js' in u: return r.fulfill(status=200, content_type='application/javascript', body=SUPABASE_STUB)
                    if u.endswith('ok.mp4'): return r.fulfill(status=200, content_type='video/mp4', body=ok_mp4.read_bytes())
                    if 'media.test' in u and u.endswith('.png'): return r.fulfill(status=200, content_type='image/png', body=(root / 'assets/favicon-32.png').read_bytes())
                    if 'media.test' in u: return r.fulfill(status=404, body='')
                    if 'fonts.g' in u: return r.fulfill(status=200, body='')
                    return r.continue_()
                ctx.route('**/*', route)
                page = ctx.new_page(); errors = []
                page.on('pageerror', lambda e: errors.append(str(e)))
                page.add_init_script("localStorage.getItem('valowish_v22')||localStorage.setItem('valowish_v22', JSON.stringify({wishlist:['vandal-01','vandal-02','vandal-03','sheriff-03','phantom-02'],owned:['vandal-05','phantom-01'],priority:['sheriff-03','vandal-01','phantom-02','vandal-02'],preferences:{collectionViews:{wishlist:{edition:'Ultra Edition'}}}}))")
                page.goto(base); page.wait_for_selector('.app-shell')
                def nav(r):
                    if mobile:
                        if page.locator(f'.mobile-nav [data-route="{r}"]').count(): page.locator(f'.mobile-nav [data-route="{r}"]').click()
                        else: page.locator('.mobile-nav [data-route="more"]').click(); page.locator(f'.more-grid [data-route="{r}"]').click()
                    else: page.locator(f'.side-nav [data-route="{r}"]').click()
                    page.wait_for_timeout(150)
                def no_overflow(where):
                    w = page.evaluate('document.documentElement.scrollWidth'); assert w <= vw + 1, f'{label} horizontal overflow on {where}: {w}'
                def tap(loc):
                    loc.evaluate("e=>e.scrollIntoView({block:'center',inline:'center',behavior:'instant'})"); loc.click()
                def check(name, cond, msg=''):
                    assert cond, f'{label}: {name} {msg}'; results.append(f'{label}: {name}')

                # Discover chips
                nav('discover'); page.wait_for_selector('.chip-filter')
                total = page.locator('.ready-catalog-header h3').inner_text()
                tap(page.locator('.chip[data-chip-group="weapons"][data-chip-value="Sheriff"]'))
                tap(page.locator('.chip[data-chip-group="weapons"][data-chip-value="Ghost"]'))
                tap(page.locator('.chip[data-chip-group="editions"][data-chip-value="Ultra Edition"]'))
                tap(page.locator('.chip[data-chip-group="editions"][data-chip-value="Exclusive Edition"]'))
                names = page.locator('.ready-card .name-btn').all_inner_texts()
                check('discover multi-chip filter', len(names) == 4 and all(('Sheriff' in n or 'Ghost' in n) for n in names), str(names))
                no_overflow('discover'); page.screenshot(path=str(shots / f'{label}-discover.png'))
                page.locator('[data-filterclear]').click()

                # Wishlist: migrated v22 single edition shows as a chip
                nav('wishlist'); page.wait_for_selector('.chip-filter')
                check('v22 edition preference migrated to chip', page.locator('.chip.on[data-chip-value="Ultra Edition"]').count() == 1)
                check('wishlist filtered by migrated chip', page.locator('.ready-card').count() == 2)
                no_overflow('wishlist')

                # Priority by weapon type
                nav('priority'); page.locator('[data-priority-scope="type"]').click()
                page.locator('[data-priority-type="rifles"]').click()
                ranks = page.locator('.ready-card .name-btn').all_inner_texts()
                check('rifles priority list in global order', ranks == ['Skin01 Vandal', 'Skin02 Phantom', 'Skin02 Vandal'], str(ranks))
                page.locator('[data-priority-scope="weapon"]').click(); tap(page.locator('[data-priority-weapon="Vandal"]'))
                check('priority BY WEAPON uses weapon-name chips', [n for n in page.locator('.ready-card .name-btn').all_inner_texts()] == ['Skin01 Vandal', 'Skin02 Vandal'] and page.locator('[data-priority-weapon="Classic"]').count() == 1)
                page.locator('[data-priority-scope="type"]').click()
                if not mobile:
                    page.locator('.ready-card').nth(2).locator('[data-move][data-offset="-1"]').click()
                    ranks = page.locator('.ready-card .name-btn').all_inner_texts()
                    check('rifles list reorders independently', ranks[0] == 'Skin01 Vandal' and ranks[1] == 'Skin02 Vandal', str(ranks))
                    page.locator('[data-priority-scope="global"]').click()
                    check('global order untouched', page.locator('.ready-card .name-btn').first.inner_text() == 'Skin03 Sheriff')
                no_overflow('priority'); page.screenshot(path=str(shots / f'{label}-priority-type.png'))

                # Buying plan picker
                nav('simulator')
                if page.locator('#new-buying-plan input').count():
                    page.locator('#new-buying-plan input').first.fill('Test Plan'); page.locator('#new-buying-plan button').first.click()
                page.locator('[data-sim-open]').first.click(); page.wait_for_selector('#sim-picker-list .sim-picker-item')
                if not page.locator('.sim-picker-filters').count(): page.locator('[data-sim-filters-toggle]').click()
                tap(page.locator('.chip[data-chip-scope="sim"][data-chip-value="Vandal"]')); page.wait_for_timeout(100)
                if mobile: page.locator('[data-sim-filters-toggle]').click()  # phones: close the filter panel to browse
                lst = page.locator('#sim-picker-list')
                lst.evaluate('e=>e.scrollTop=e.scrollHeight'); page.wait_for_timeout(80)
                before = lst.evaluate('e=>e.scrollTop'); check('picker list scrollable', before > 100, str(before))
                last_row = page.locator('#sim-picker-list .sim-picker-item').last
                last_row.locator('[data-sim-add]').click(); page.wait_for_timeout(120)
                after = page.locator('#sim-picker-list').evaluate('e=>e.scrollTop')
                check('list stays in place after + ADD', abs(after - before) < 2, f'{before}->{after}')
                check('row shows ADDED in place', 'ADDED' in last_row.locator('[data-sim-add]').inner_text())
                rows = page.locator('#sim-picker-list .sim-picker-item')
                rows.nth(rows.count() - 2).locator('.sim-picker-select').click(); rows.nth(rows.count() - 3).locator('.sim-check').check()
                after2 = page.locator('#sim-picker-list').evaluate('e=>e.scrollTop')
                check('list stays in place after selecting', abs(after2 - before) < 2, f'{before}->{after2}')
                check('bulk bar counts selection', '2 SELECTED' in page.locator('#sim-bulk-bar').inner_text())
                page.screenshot(path=str(shots / f'{label}-picker.png'))
                page.locator('[data-sim-add-selected]').click(); page.wait_for_timeout(100)
                check('bulk add updates plan count', page.locator('#sim-picker-plan-count').inner_text() == '3')
                if mobile: page.locator('[data-sim-filters-toggle]').click()
                tap(page.locator('.chip[data-chip-scope="sim"][data-chip-value="Ultra Edition"]'))
                page.locator('[data-sim-select="all"]').click()
                sel = page.locator('#sim-bulk-bar strong').inner_text()
                page.locator('[data-sim-add-selected]').click(); page.wait_for_timeout(100)
                check('select all matching + add', page.locator('#sim-picker-plan-count').inner_text() == str(3 + int(sel.split()[0])), sel)
                no_overflow('picker')
                page.locator('.sim-picker footer [data-sim-close]').click()
                check('plan rendered with added items', page.locator('.sim-item').count() >= 4)

                # Video player
                nav('discover'); page.fill('#catalog-search', 'Skin00 Vandal'); page.wait_for_timeout(400)
                page.locator('.ready-card .name-btn').first.click(); page.wait_for_selector('.ready-modal')
                check('variant chips marked with video', page.locator('.variant-chips .has-video').count() == 2)
                check('levels list shows play buttons', page.locator('button.level-chip').count() == 2)
                page.locator('.variant-chips [data-variant="2"]').click()
                page.locator('.art-play').click(); page.wait_for_selector('#video-root .video-player')
                check('video popup is in-page (no new tab)', len(ctx.pages) == 1)
                page.wait_for_function("()=>{const v=document.getElementById('video-element');return v&&v.readyState>=2}", timeout=8000)
                check('variant video loads', True)
                page.screenshot(path=str(shots / f'{label}-video.png'))
                page.locator('[data-video-step="1"]').click(); page.wait_for_timeout(500)
                check('broken video shows fallback', page.locator('#video-error').is_visible())
                page.locator('[data-video-tab="levels"]').click()
                check('levels tab', 'LEVEL 1' in page.locator('.video-player h2').inner_text() and 'VFX' in page.locator('.video-player header p').inner_text())
                page.keyboard.press('Escape'); page.wait_for_timeout(100)
                check('Esc closes video but keeps details', page.locator('#video-root .video-player').count() == 0 and page.locator('.ready-modal').count() == 1)
                page.locator('button.level-chip').nth(1).click(); page.wait_for_selector('.video-player')
                check('level chip opens that level', 'LEVEL 2' in page.locator('.video-player h2').inner_text())
                page.locator('[data-video-close]').click(); page.locator('.modalclose').click()

                # Completion
                nav('insights'); page.wait_for_selector('.completion-types')
                page.locator('[data-completion-type="rifles"]').click()
                txt = page.locator('.completion-type.open').inner_text()
                check('rifles completion counts', '2 / 46' in txt and 'VANDAL' in txt, txt[:120])
                page.locator('#main-content [data-completion-defaults]').check(); page.wait_for_timeout(100)
                check('defaults toggle adds standard skins', '4 / 48' in page.locator('.completion-type.open').inner_text())
                tap(page.locator('.chip[data-chip-scope="completion"][data-chip-value="Exclusive Edition"]'))
                check('edition filter on completion', '0 / 11' in page.locator('.completion-type.open').inner_text())
                no_overflow('insights'); page.screenshot(path=str(shots / f'{label}-completion.png'), full_page=True)
                page.locator('[data-completion-weapon="Vandal"]').click(); page.wait_for_selector('.ready-card')
                check('weapon row opens missing skins in Discover', page.locator('.chip.on[data-chip-value="Exclusive Edition"]').count() == 1 and page.locator('.chip.on[data-chip-scope="discover"][data-chip-value="Vandal"]').count() == 1)
                nav('home'); check('home completion card', page.locator('.home-completion').count() == 1)
                check('sign-in nudge on home', page.locator('.data-banner').count() == 1)

                # Two tabs: a stale tab must not erase the other tab's changes
                other = ctx.new_page(); other.goto(base); other.wait_for_selector('.app-shell')
                other.evaluate("()=>{}")
                nav('discover'); page.locator('[data-filterclear]').click(); page.fill('#catalog-search', 'Skin10 Vandal'); page.wait_for_timeout(350)
                page.locator('.ready-card [data-toggle="wishlist"]').first.click()
                other.bring_to_front(); other.wait_for_timeout(200)
                other.evaluate("()=>document.querySelector('[data-route=\"discover\"]').click()"); other.wait_for_timeout(200)
                other.fill('#catalog-search', 'Skin11 Vandal'); other.wait_for_timeout(350)
                other.locator('.ready-card [data-toggle="wishlist"]').first.click(); other.wait_for_timeout(100)
                saved = json.loads(page.evaluate("localStorage.getItem('valowish_v22')"))
                check('two tabs: both wishlist additions kept', 'vandal-10' in saved['wishlist'] and 'vandal-11' in saved['wishlist'], str(saved['wishlist']))
                check('catalog not stored in localStorage', not page.evaluate("Object.keys(localStorage).some(k=>k.startsWith('valowish_catalog'))"))
                other.close()
                check(f'no JavaScript errors', not errors, str(errors))
                ctx.close()
            browser.close()
    finally:
        server.terminate()
    print('\n'.join('  ✓ ' + r for r in results)); print(f'\n{len(results)} checks passed · screenshots in {shots}')

if __name__ == '__main__':
    main()
