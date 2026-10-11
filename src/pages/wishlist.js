/** VALOWISH v14 • src/pages/wishlist.js • browser-native source (no build step) */
function renderWish(){
  const q=wishSearch.value.trim().toLowerCase();
  const a=db.wishlist.map(getSkin).filter(Boolean)
    .filter(s=>!q||s.displayName.toLowerCase().includes(q))
    .filter(s=>gunMatch(s,'wishlist')).filter(s=>rarityMatch(s,'wishlist'));
  lastWishCount=a.length;
  const pages=Math.max(1,Math.ceil(a.length/PAGE_SIZE));
  pageIndex.wishlist=Math.min(Math.max(1,pageIndex.wishlist),pages);
  const start=(pageIndex.wishlist-1)*PAGE_SIZE;
  const shown=a.slice(start,start+PAGE_SIZE);
  wishCards.innerHTML=shown.length?shown.map(s=>card(s).replace('</div></div></article>',
    `<button class="btn" onclick="addPriority('${s.uuid}')">${isPriority(s.uuid)?'✓ In priority':'＋ Priority'}</button></div></div></article>`)).join(''):
    '<div class="empty">Your wishlist is empty. Add skins from Browse.</div>';
  if(a.length)wishCards.insertAdjacentHTML('beforeend',pagerHTML('wishlist',a.length));
  wishlist.classList.toggle('listmode',listMode);
}

