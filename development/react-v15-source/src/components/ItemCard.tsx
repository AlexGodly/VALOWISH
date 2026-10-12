import{Heart,Shield,Check,ArrowUpRight,Bookmark}from'./Icons';
import type{Cosmetic}from'../lib/models';
import{useApp}from'../lib/store';
import{estimatedPrice}from'../lib/collections';
export function ItemCard({item,compact=false}:{item:Cosmetic;compact?:boolean}){
 const d=useApp(s=>s.data),toggle=useApp(s=>s.toggle),setDetail=useApp(s=>s.setDetail);
 const collectible=['skins','bundles','playercards','playertitles','buddies','sprays','flexes'].includes(item.kind);
 const wish=d.wishlist.includes(item.id),owned=d.owned.includes(item.id),favorite=d.favorites.includes(item.id),price=estimatedPrice(item,d);
 return <article className={`item-card ${compact?'compact':''}`}>
  <button className="item-art" onClick={()=>setDetail(item)} aria-label={`View ${item.name}`}>
   <span className="item-art-glow"/>
   {item.icon?<img loading="lazy" decoding="async" src={item.icon} alt=""/>:<div className="no-art">{item.kind==='playertitles'?'TITLE':'NO ART'}</div>}
   {collectible&&owned&&<span className="owned-label"><Check size={12}/> OWNED</span>}
   <span className="view-arrow"><ArrowUpRight size={17}/></span>
  </button>
  <div className="item-info"><div className="item-kind"><span className="red-line"/>{item.weapon||item.kind.replace('player','player ')}{item.tierName&&<span className="tier-note"> / {item.tierName}</span>}</div>
   <button className="item-name" title={item.name} onClick={()=>setDetail(item)}>{item.name}</button>
   <div className="item-bottom"><span className="price-caption">{item.kind==='skins'?`${price.toLocaleString()} VP · EST.`:'COLLECTIBLE'}</span><div className="item-actions">
    <button className={`icon-action ${favorite?'on':''}`} onClick={()=>toggle('favorites',item.id)} title="Favorite" aria-label={`Favorite ${item.name}`}><Bookmark size={17} fill={favorite?'currentColor':'none'}/></button>
    {collectible&&<button className={`icon-action ${wish?'on':''}`} onClick={()=>toggle('wishlist',item.id)} title="Wishlist" aria-label={`Wishlist ${item.name}`}><Heart size={17} fill={wish?'currentColor':'none'}/></button>}
    {collectible&&<button className={`icon-action ${owned?'green':''}`} onClick={()=>toggle('owned',item.id)} title="Mark owned" aria-label={`Owned ${item.name}`}><Shield size={17}/></button>}
   </div></div>
  </div>
 </article>
}
