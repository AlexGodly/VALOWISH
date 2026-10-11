/** VALOWISH v14 • src/ui/filters.js • browser-native source (no build step) */
function populateGuns(){document.querySelectorAll('select.gun').forEach(sel=>{sel.innerHTML=GUNS.map(g=>`<option value="${g}">${g}</option>`).join('')})}

function setupGunFilters(){document.querySelectorAll('.gun-filter').forEach(box=>{let scope=box.dataset.scope,menu=box.querySelector('.multi-menu');let weapons=GUNS.filter(g=>g!=='All Weapons');menu.innerHTML=weapons.map(g=>`<label class="multi-option"><input type="checkbox" value="${g}"><span>${g}</span></label>`).join('');box.querySelector('.multi-toggle').onclick=e=>{e.stopPropagation();document.querySelectorAll('.multi-filter.open,.rarity-filter.open').forEach(x=>{if(x!==box)x.classList.remove('open')});box.classList.toggle('open')};menu.onchange=e=>{let cb=e.target;if(!cb.matches('input'))return;cb.checked?gunFilters[scope].add(cb.value):gunFilters[scope].delete(cb.value);cb.closest('.multi-option').classList.toggle('selected',cb.checked);let n=gunFilters[scope].size;box.querySelector('.multi-toggle span:first-child').textContent=n===1?[...gunFilters[scope]][0]:n?`${n} WEAPONS`:'ALL WEAPONS';if(pageIndex[scope])pageIndex[scope]=1;markDirty(scope);if(currentPage===scope)queueCurrentRender()}})}

function gunMatch(s,scope){let set=gunFilters[scope];return !set.size||set.has(gunOf(s))}

function clearGun(scope){gunFilters[scope].clear();let box=document.querySelector(`.gun-filter[data-scope="${scope}"]`);if(box){box.querySelectorAll('input').forEach(x=>x.checked=false);box.querySelectorAll('.multi-option').forEach(x=>x.classList.remove('selected'));box.querySelector('.multi-toggle span:first-child').textContent='ALL WEAPONS'}}

function matches(s,q,g){return(!q||s.displayName.toLowerCase().includes(q.toLowerCase()))&&(g==='All Weapons'||gunOf(s)===g)}

function rarityMatch(s,scope){let set=rarityFilters[scope];return !set.size||set.has(rarity(s))}

function setupRarityFilters(){document.querySelectorAll('.rarity-filter').forEach(box=>{let scope=box.dataset.scope,menu=box.querySelector('.rarity-menu');menu.innerHTML=RARITIES.map(r=>`<label class="rarity-option"><input type="checkbox" value="${r}"><span>${r}</span></label>`).join('');box.querySelector('.rarity-toggle').onclick=e=>{e.stopPropagation();document.querySelectorAll('.rarity-filter.open').forEach(x=>{if(x!==box)x.classList.remove('open')});box.classList.toggle('open')};menu.onchange=e=>{let cb=e.target;if(!cb.matches('input'))return;cb.checked?rarityFilters[scope].add(cb.value):rarityFilters[scope].delete(cb.value);let n=rarityFilters[scope].size;box.querySelector('.rarity-toggle span:first-child').textContent=n?`${n} RARIT${n===1?'Y':'IES'}`:'ALL RARITIES';if(pageIndex[scope])pageIndex[scope]=1;markDirty(scope);if(currentPage===scope)queueCurrentRender()}});document.addEventListener('click',e=>{if(!e.target.closest('.rarity-filter,.multi-filter'))document.querySelectorAll('.rarity-filter.open,.multi-filter.open').forEach(x=>x.classList.remove('open'))})}

function clearRarity(scope){rarityFilters[scope].clear();let box=document.querySelector(`.rarity-filter[data-scope="${scope}"]`);if(box){box.querySelectorAll('input').forEach(x=>x.checked=false);box.querySelector('.rarity-toggle span:first-child').textContent='ALL RARITIES'}}

