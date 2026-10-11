/** VALOWISH v14 • src/events/interface.js • browser-native source (no build step) */
const ownershipDropdown=document.getElementById('ownershipDropdown');

if(ownershipDropdown){
 const toggle=ownershipDropdown.querySelector('.single-toggle');
 toggle.onclick=(e)=>{e.stopPropagation();document.querySelectorAll('.multi-filter.open,.rarity-filter.open').forEach(x=>x.classList.remove('open'));browseStatusDropdown?.classList.remove('open');ownershipDropdown.classList.toggle('open')};
 ownershipDropdown.querySelectorAll('[data-own]').forEach(btn=>btn.onclick=(e)=>{e.stopPropagation();ownershipFilter.value=btn.dataset.own;ownershipLabel.textContent=btn.textContent;ownershipDropdown.querySelectorAll('[data-own]').forEach(x=>x.classList.toggle('selected',x===btn));ownershipDropdown.classList.remove('open');pageIndex.browse=1;markDirty('browse');renderCurrentPage()});
 document.addEventListener('click',e=>{if(!ownershipDropdown.contains(e.target))ownershipDropdown.classList.remove('open')});
}

document.addEventListener('click',e=>{let p=e.target.closest('[data-page]');if(p)showPage(p.dataset.page)});


document.addEventListener('input',e=>{if(['browseSearch','wishSearch','prioritySearch','lockerSearch'].includes(e.target.id)){const map={browseSearch:'browse',wishSearch:'wishlist',prioritySearch:'priority',lockerSearch:'locker'};const scope=map[e.target.id];if(pageIndex[scope])pageIndex[scope]=1;clearTimeout(searchTimer);searchTimer=setTimeout(()=>{markDirty(scope);if(currentPage===scope)queueCurrentRender()},160)}});

document.addEventListener('change',e=>{if(e.target.matches('.gun,#priorityTier,#ownershipFilter')){if(pageIndex[currentPage])pageIndex[currentPage]=1;queueCurrentRender()}});

clearBrowse.onclick=()=>{
  browseSearch.value='';ownershipFilter.value='all';ownershipLabel.textContent='All Skins';
  ownershipDropdown.querySelectorAll('[data-own]').forEach(x=>x.classList.toggle('selected',x.dataset.own==='all'));
  browseStatus.value='all';browseStatusLabel.textContent='Show All';
  browseStatusDropdown.querySelectorAll('[data-status]').forEach(x=>x.classList.toggle('selected',x.dataset.status==='all'));
  clearGun('browse');clearRarity('browse');pageIndex.browse=1;
  markDirty('browse');renderCurrentPage();
};

clearWish.onclick=()=>{wishSearch.value='';clearGun('wishlist');clearRarity('wishlist');pageIndex.wishlist=1;markDirty('wishlist');renderCurrentPage()};

clearLocker.onclick=()=>{lockerSearch.value='';clearGun('locker');clearRarity('locker');pageIndex.locker=1;markDirty('locker');renderCurrentPage()};

toggleView.onclick=lockerView.onclick=()=>{listMode=!listMode;toggleView.textContent=lockerView.textContent=listMode?'☰ List':'▦ Grid';document.querySelectorAll('#browse,#wishlist,#locker').forEach(x=>x.classList.toggle('listmode',listMode));};

autoPriority.onclick=()=>{db.wishlist.forEach(id=>{if(!db.priority.includes(id))db.priority.push(id)});save();toast('Wishlist added to priority list')};

clearPriority.onclick=()=>{if(confirm('Clear the entire priority list?')){db.priority=[];save()}};

saveVp.onclick=()=>{db.vp=Math.max(0,Number(vpInput.value)||0);save();toast('VP balance saved')};

saveName.onclick=async()=>{db.name=(nameInput.value.trim()||'PLAYER');save();if(sb&&cloudUser)await sb.auth.updateUser({data:{name:db.name}});toast('Name updated')};

exportBtn.onclick=()=>{let blob=new Blob([JSON.stringify(db,null,2)],{type:'application/json'}),u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download='valowish-v14-backup.json';a.click();URL.revokeObjectURL(u)};

importFile.onchange=async()=>{try{let x=JSON.parse(await importFile.files[0].text());db=Object.assign(db,x);save();toast('Backup imported')}catch(e){alert('Invalid VALOWISH backup file.')}};

resetBtn.onclick=()=>{if(confirm('Reset all VALOWISH local data? This cannot be undone.')){db=freshData();save();toast('Local data reset')}};

const browseStatusDropdown=document.getElementById('browseStatusDropdown');

browseStatusDropdown?.querySelector('.single-toggle')?.addEventListener('click',e=>{
 e.stopPropagation();ownershipDropdown?.classList.remove('open');browseStatusDropdown.classList.toggle('open');
});

browseStatusDropdown?.querySelectorAll('[data-status]').forEach(btn=>btn.addEventListener('click',()=>{
 const value=btn.dataset.status;
 document.getElementById('browseStatus').value=value;
 document.getElementById('browseStatusLabel').textContent=btn.textContent;
 browseStatusDropdown.querySelectorAll('[data-status]').forEach(x=>x.classList.toggle('selected',x===btn));
 browseStatusDropdown.classList.remove('open');
 pageIndex.browse=1;markDirty('browse');if(currentPage==='browse')queueCurrentRender();
}));

document.addEventListener('click',e=>{if(browseStatusDropdown&&!browseStatusDropdown.contains(e.target))browseStatusDropdown.classList.remove('open')});

saveRarityPrices.onclick=()=>{db.rarityPrices={Select:Math.max(0,+rpSelect.value||0),Deluxe:Math.max(0,+rpDeluxe.value||0),Premium:Math.max(0,+rpPremium.value||0),Exclusive:Math.max(0,+rpExclusive.value||0),Ultra:Math.max(0,+rpUltra.value||0)};save();toast('Rarity prices applied')};

undoBtn.onclick=undoAction;

redoBtn.onclick=redoAction;

clearHistory.onclick=()=>{if(confirm('Clear activity history?')){db.history=[];save()}};

document.querySelectorAll('[data-hfilter]').forEach(b=>b.onclick=()=>{historyFilter=b.dataset.hfilter;document.querySelectorAll('[data-hfilter]').forEach(x=>x.classList.toggle('primary',x===b));renderHistory()});

document.addEventListener('keydown',e=>{if(e.key==='Escape')closePriceEditor()});

priceModal.addEventListener('click',e=>{if(e.target===priceModal)closePriceEditor()});

