/** VALOWISH v14 • src/pages/locker.js • browser-native source (no build step) */
function renderLocker(){
 let q=lockerSearch.value;
 let a=db.owned.map(getSkin).filter(Boolean)
   .filter(s=>!q||s.displayName.toLowerCase().includes(q.toLowerCase()))
   .filter(s=>gunMatch(s,'locker'))
   .filter(s=>rarityMatch(s,'locker'));
 ownedCount.textContent=db.owned.length;
 spentVp.textContent=money(db.owned.map(getSkin).filter(Boolean).reduce((n,s)=>n+price(s),0));
 lastLockerCount=a.length;
 let pages=Math.max(1,Math.ceil(a.length/PAGE_SIZE));
 if(pageIndex.locker>pages)pageIndex.locker=pages;
 if(pageIndex.locker<1)pageIndex.locker=1;
 let start=(pageIndex.locker-1)*PAGE_SIZE;
 let shown=a.slice(start,start+PAGE_SIZE);
 lockerCards.innerHTML=shown.length?shown.map(card).join(''):'<div class="empty">Your locker is empty.</div>';
 if(a.length)lockerCards.insertAdjacentHTML('beforeend',pagerHTML('locker',a.length));
 locker.classList.toggle('listmode',listMode);
}

