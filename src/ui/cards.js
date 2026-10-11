/** VALOWISH v14 • src/ui/cards.js • browser-native source (no build step) */
function card(s){let w=isWish(s.uuid),o=isOwned(s.uuid);return `<article class="card"><div class="art"><img loading="lazy" decoding="async" src="${img(s)}" alt="${escapeHTML(s.displayName)}">${o?'<span class="owned-tag">✓ OWNED</span>':''}</div><div class="body"><div class="name">${escapeHTML(s.displayName)}</div><div class="chips"><span class="chip">● ${gunOf(s)}</span><span class="chip rarity">● ${rarity(s)}</span></div><div class="price">◉ ${money(price(s))} VP ${db.prices[s.uuid]!=null?'<span class="custom-price-tag">CUSTOM</span>':''}</div><div class="actions"><button class="btn edit-price" onclick="openPriceEditor('${s.uuid}')">✎ Edit price</button><button class="btn ${w?'primary':''}" onclick="toggleWish('${s.uuid}')">${w?'★ Wishlisted':'☆ Wishlist'}</button><button class="btn ${o?'green':''}" onclick="toggleOwned('${s.uuid}')">${o?'✓ Owned':'I own this'}</button><button class="btn primary" onclick="buy('${s.uuid}')">${o?'Owned':'Buy'}</button></div></div></article>`}

let editingPriceId=null;

function openPriceEditor(id){let s=getSkin(id);if(!s)return;editingPriceId=id;priceModalName.textContent=s.displayName;priceModalRarity.textContent=rarity(s)+' default: '+money(db.rarityPrices[baseRarity(s)]??guessPrice(s.displayName))+' VP';priceModalInput.value=price(s);priceModal.classList.add('open');priceModal.setAttribute('aria-hidden','false');setTimeout(()=>priceModalInput.focus(),0)}

function closePriceEditor(){editingPriceId=null;priceModal.classList.remove('open');priceModal.setAttribute('aria-hidden','true')}

function savePriceEditor(){if(!editingPriceId)return;setPrice(editingPriceId,priceModalInput.value);toast('Custom skin price saved');closePriceEditor()}

function resetPriceEditor(){if(!editingPriceId)return;let before=snapshot(),id=editingPriceId,s=getSkin(id);delete db.prices[id];logAction('price',id,'Custom price removed — using '+baseRarity(s)+' default',before);save();toast('Using rarity default');closePriceEditor()}

