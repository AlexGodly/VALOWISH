/** VALOWISH v14 • src/ui/pagination.js • browser-native source (no build step) */
function pagerHTML(scope,total){
 const pages=Math.max(1,Math.ceil(total/PAGE_SIZE)),p=Math.min(pageIndex[scope]||1,pages);
 pageIndex[scope]=p;
 if(pages<=1)return '';
 const start=Math.max(1,p-2),end=Math.min(pages,p+2);
 let nums='';
 for(let i=start;i<=end;i++) nums+=`<button class="btn ${i===p?'primary':''}" onclick="goPage('${scope}',${i})">${i}</button>`;
 return `<div class="pager" style="grid-column:1/-1;display:flex;gap:8px;justify-content:center;align-items:center;flex-wrap:wrap;padding:18px 0">
 <button class="btn" ${p<=1?'disabled':''} onclick="goPage('${scope}',${p-1})">‹ PREV</button>
 ${start>1?`<button class="btn" onclick="goPage('${scope}',1)">1</button>${start>2?'<span>…</span>':''}`:''}
 ${nums}
 ${end<pages?`${end<pages-1?'<span>…</span>':''}<button class="btn" onclick="goPage('${scope}',${pages})">${pages}</button>`:''}
 <button class="btn" ${p>=pages?'disabled':''} onclick="goPage('${scope}',${p+1})">NEXT ›</button>
 <span style="width:100%;text-align:center;opacity:.65;font-size:12px">PAGE ${p} / ${pages} · ${total} ITEMS</span></div>`;
}

function goPage(scope,p){
 const totalPages=Math.max(1,Math.ceil((scope==='browse'?lastBrowseCount:scope==='wishlist'?lastWishCount:lastLockerCount)/PAGE_SIZE));
 pageIndex[scope]=Math.max(1,Math.min(p,totalPages));
 pageDirty[scope]=true;
 if(currentPage===scope){renderCurrentPage();requestAnimationFrame(()=>scrollTo(0,0))}
}

let lastBrowseCount=0,lastWishCount=0,lastLockerCount=0;

