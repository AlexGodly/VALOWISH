/** VALOWISH v14 • src/core/skins.js • browser-native source (no build step) */
function guessPrice(name){let n=name.toLowerCase();if(n.includes('champions')||n.includes('arcane'))return 2675;if(n.includes('protocol')||n.includes('spectrum')||n.includes('radiant entertainment'))return 2475;if(n.includes('elderflame')||n.includes('singularity')||n.includes('kuronami'))return 2175;if(n.includes('reaver')||n.includes('prime')||n.includes('ion')||n.includes('gaia')||n.includes('oni')||n.includes('magepunk'))return 1775;if(n.includes('default'))return 0;return 1275}

function baseRarity(s){let p=guessPrice(s.displayName);return p>=2475?'Ultra':p>=2175?'Exclusive':p>=1775?'Premium':p>=1275?'Deluxe':'Select'}

function price(s){return db.prices[s.uuid]??db.rarityPrices[baseRarity(s)]??guessPrice(s.displayName)}

function rarity(s){return baseRarity(s)}

function gunOf(s){return s.weapon||s.displayName.split(' ').pop()}

function img(s){return s.displayIcon||s.chromas?.[0]?.fullRender||''}

function isWish(id){return wishSet.has(id)}

function isOwned(id){return ownedSet.has(id)}

function isPriority(id){return prioritySet.has(id)}

function rebuildFastCaches(){skinMap=new Map(skins.map(s=>[s.uuid,s]));wishSet=new Set(db.wishlist);ownedSet=new Set(db.owned);prioritySet=new Set(db.priority)}

function getSkin(id){return skinMap.get(id)}

