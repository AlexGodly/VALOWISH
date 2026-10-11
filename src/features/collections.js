/** VALOWISH v14 • src/features/collections.js • browser-native source (no build step) */
function toggleWish(id){let before=snapshot();if(isWish(id)){db.wishlist=db.wishlist.filter(x=>x!==id);db.priority=db.priority.filter(x=>x!==id);toast('Removed from wishlist');logAction('wishlist',id,'Removed from wishlist',before)}else{db.wishlist.unshift(id);toast('Added to wishlist');logAction('wishlist',id,'Wishlisted',before)}save()}

function toggleOwned(id){let before=snapshot();if(isOwned(id)){db.owned=db.owned.filter(x=>x!==id);toast('Removed from locker');logAction('owned',id,'Removed from locker',before)}else{db.owned.unshift(id);toast('Added to locker');logAction('owned',id,'Marked owned',before)}save()}

function buy(id){let before=snapshot();let s=getSkin(id);if(!s)return;if(isOwned(id)){toast('Already owned');return}let p=price(s);if(db.vp<p&&!confirm(`This skin is estimated at ${money(p)} VP, but your tracker has ${money(db.vp)} VP. Mark it owned anyway?`))return;db.owned.unshift(id);db.wishlist=db.wishlist.filter(x=>x!==id);db.priority=db.priority.filter(x=>x!==id);db.vp=Math.max(0,db.vp-p);toast('Purchased and moved to Locker');logAction('bought',id,'Bought for '+money(p)+' VP',before);save()}

function addPriority(id){if(!isPriority(id))db.priority.push(id);if(!isWish(id))db.wishlist.push(id);save();toast('Added to priority list')}

function removePriority(id){db.priority=db.priority.filter(x=>x!==id);save()}

function setTier(id,v){db.tiers[id]=v;save()}

function setPrice(id,v){let before=snapshot();db.prices[id]=Math.max(0,Number(v)||0);logAction('price',id,'Custom price changed to '+money(db.prices[id])+' VP',before);save()}

