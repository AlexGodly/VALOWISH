/** VALOWISH v14 • src/pages/browse.js • browser-native source (no build step) */
function renderBrowse(){let q=browseSearch.value,own=ownershipFilter.value;let a=skins.filter(s=>!q||s.displayName.toLowerCase().includes(q.toLowerCase())).filter(s=>gunMatch(s,'browse')).filter(s=>rarityMatch(s,'browse')).filter(s=>own==='owned'?isOwned(s.uuid):own==='unowned'?!isOwned(s.uuid):own==='wishlisted'?isWish(s.uuid):true);const bs=document.getElementById('browseStatus')?.value||'all';
 if(bs==='hide-wishlisted')a=a.filter(x=>!wishSet.has(x.uuid));
 else if(bs==='only-wishlisted')a=a.filter(x=>wishSet.has(x.uuid));
 else if(bs==='hide-owned')a=a.filter(x=>!ownedSet.has(x.uuid));
 else if(bs==='only-owned')a=a.filter(x=>ownedSet.has(x.uuid));
 else if(bs==='hide-saved')a=a.filter(x=>!wishSet.has(x.uuid)&&!ownedSet.has(x.uuid));
 else if(bs==='only-saved')a=a.filter(x=>wishSet.has(x.uuid)||ownedSet.has(x.uuid));
 lastBrowseCount=a.length;let pages=Math.max(1,Math.ceil(a.length/PAGE_SIZE));if(pageIndex.browse>pages)pageIndex.browse=pages;let start=(pageIndex.browse-1)*PAGE_SIZE,shown=a.slice(start,start+PAGE_SIZE);browseCards.innerHTML=shown.length?shown.map(card).join(''):'<div class="empty">No skins match these filters.</div>';if(a.length)browseCards.insertAdjacentHTML('beforeend',pagerHTML('browse',a.length));browse.classList.toggle('listmode',listMode)}

