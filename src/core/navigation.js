/** VALOWISH v14 • src/core/navigation.js • browser-native source (no build step) */
function renderHeaderState(){topUser.textContent=(db.name||'PLAYER').toUpperCase();topVp.textContent=money(db.vp)}

function markDirty(...pages){pages.forEach(p=>pageDirty[p]=true)}

function renderCurrentPage(force=false){
 if(!force&&!pageDirty[currentPage])return;
 if(currentPage==='settings'){renderSettings();pageDirty.settings=false;return}
 if(!skins.length && currentPage!=='history')return;
 if(currentPage==='browse')renderBrowse();
 else if(currentPage==='wishlist')renderWish();
 else if(currentPage==='priority')renderPriority();
 else if(currentPage==='locker')renderLocker();
 else if(currentPage==='history')renderHistory();
 pageDirty[currentPage]=false;
}

function queueCurrentRender(){markDirty(currentPage);if(renderQueued)return;renderQueued=true;requestAnimationFrame(()=>{renderQueued=false;renderCurrentPage()})}

function renderAll(){rebuildFastCaches();renderHeaderState();markDirty('browse','wishlist','priority','locker','history','settings');renderCurrentPage(true)}

function showPage(id){
 const same=id===currentPage;
 if(same)return;
 pageScroll[currentPage]=scrollY||0;
 lastPage=currentPage;currentPage=id;
 document.querySelectorAll('.page').forEach(x=>x.classList.toggle('active',x.id===id));
 document.querySelectorAll('.nav button').forEach(x=>x.classList.toggle('active',x.dataset.page===id));
 renderCurrentPage();
 requestAnimationFrame(()=>scrollTo(0,pageScroll[id]||0));
}

