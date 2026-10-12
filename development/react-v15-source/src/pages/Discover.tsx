import{useDeferredValue,useEffect,useMemo,useState}from'react';
import{useQuery}from'@tanstack/react-query';
import{RefreshCw,Search,SlidersHorizontal,ArrowDownUp}from'lucide-react';
import{useApp}from'../lib/store';
import{KINDS,fetchCatalog}from'../lib/catalog';
import{ItemCard}from'../components/ItemCard';
import{SectionHeader}from'../components/SectionHeader';
import{Pager}from'../components/Pager';
import type{Cosmetic}from'../lib/models';
export function Discover(){
 const kind=useApp(s=>s.kind),setKind=useApp(s=>s.setKind),d=useApp(s=>s.data),catalog=useApp(s=>s.catalog),setCatalog=useApp(s=>s.setCatalog),f=useApp(s=>s.filters[kind]||{q:'',weapon:'all',status:'all',sort:'alpha',page:1}),setFilters=useApp(s=>s.setFilters),openFilters=useApp(s=>s.openFilters),setOpenFilters=useApp(s=>s.setOpenFilters);
 const [group,setGroup]=useState<'cosmetic'|'intel'>('cosmetic');
 const {data:raw=[],isLoading,isError,error,refetch,isFetching}=useQuery({queryKey:['catalog',kind],queryFn:()=>fetchCatalog(kind),retry:1});
 const items=raw.length?raw:catalog[kind]||[];
 useEffect(()=>{if(raw.length&&catalog[kind]!==raw)setCatalog(kind,raw)},[raw,catalog,kind,setCatalog]);
 const deferred=useDeferredValue(f.q);
 const weapons=useMemo(()=>[...new Set(items.map(s=>s.weapon).filter(Boolean))].sort() as string[],[items]);
 const results=useMemo(()=>{
   let a=items.filter(x=>!deferred||`${x.name} ${x.weapon||''}`.toLowerCase().includes(deferred.toLowerCase()));
   if(f.weapon!=='all')a=a.filter(x=>x.weapon===f.weapon);
   if(f.status==='wishlisted')a=a.filter(x=>d.wishlist.includes(x.id));
   if(f.status==='hide-wishlisted')a=a.filter(x=>!d.wishlist.includes(x.id));
   if(f.status==='owned')a=a.filter(x=>d.owned.includes(x.id));
   if(f.status==='hide-owned')a=a.filter(x=>!d.owned.includes(x.id));
   if(f.status==='uncollected')a=a.filter(x=>!d.wishlist.includes(x.id)&&!d.owned.includes(x.id));
   if(f.status==='collected')a=a.filter(x=>d.wishlist.includes(x.id)||d.owned.includes(x.id));
   if(f.status==='favorites')a=a.filter(x=>d.favorites.includes(x.id));
   if(f.sort==='reverse')a.reverse();if(f.sort==='weapon')a.sort((a,b)=>(a.weapon||'').localeCompare(b.weapon||'')||a.name.localeCompare(b.name));
   return a;
 },[items,deferred,f.weapon,f.status,f.sort,d.wishlist,d.owned,d.favorites]);
 const pageSize=d.preferences.pageSize||24,pages=Math.max(1,Math.ceil(results.length/pageSize)),page=Math.min(f.page,pages),visible=results.slice((page-1)*pageSize,page*pageSize);
 const update=(patch:Record<string,string|number>)=>setFilters(kind,{page:1,...patch});
 return <>
 <SectionHeader code="DATABASE / DISCOVER" title="Discover" lead="Every piece of the protocol. One tactical archive." actions={<span className="registry-label"><span className="status-dot"/> LIVE CATALOG</span>}/>
 <div className="discover-hero"><div className="hero-gridline"/><div><div className="eyebrow">// VALORANT COSMETIC INTELLIGENCE</div><h2>THE <em>ARSENAL</em><br/>STARTS HERE.</h2><p>Find it. Want it. Own it. Your entire cosmetic universe, organized your way.</p><div className="hero-facts"><span><b>12</b> DATABASE CATEGORIES</span><span><b>01</b> HOME FOR EVERYTHING</span></div></div><div className="hero-emblem"><img src={`${import.meta.env.BASE_URL}favicon.png`} alt="VALOWISH emblem"/></div><span className="hero-vertical">W // REBORN · V15</span></div>
 <div className="category-top"><button className={group==='cosmetic'?'active':''} onClick={()=>{setGroup('cosmetic');setKind('skins')}}>COSMETICS</button><button className={group==='intel'?'active':''} onClick={()=>{setGroup('intel');setKind('agents')}}>GAME INTEL</button></div>
 <div className="category-pills">{KINDS.filter(k=>k.section===group).map(k=><button className={`category-pill ${kind===k.kind?'active':''}`} key={k.kind} onClick={()=>setKind(k.kind)}><span>{k.label}</span><small>{k.description}</small></button>)}</div>
 <div className="catalog-heading"><div><p className="eyebrow">// CATALOG / {kind.toUpperCase()}</p><h3>{KINDS.find(x=>x.kind===kind)?.label||'Catalog'} <span className="count">{results.length.toLocaleString()}</span></h3></div><button className="small-ghost" onClick={()=>refetch()}><RefreshCw size={16} className={isFetching?'spin':''}/> REFRESH</button></div>
 <div className="catalog-controls"><label className="search-control"><Search size={19}/><input placeholder={`SEARCH ${kind.toUpperCase()}...`} value={f.q} onChange={e=>update({q:e.target.value})}/><kbd>SEARCH</kbd></label><button className={`filter-trigger ${openFilters?'active':''}`} onClick={()=>setOpenFilters(!openFilters)}><SlidersHorizontal size={18}/> FILTERS</button><button className="view-trigger" onClick={()=>useApp.getState().update(x=>({...x,preferences:{...x.preferences,view:x.preferences.view==='list'?'grid':'list'}}))}>{d.preferences.view==='list'?'▦ GRID':'☰ LIST'}</button><label className="desktop-sort"><ArrowDownUp size={16}/><select value={f.sort} onChange={e=>update({sort:e.target.value})}><option value="alpha">NAME A–Z</option><option value="reverse">NAME Z–A</option><option value="weapon">WEAPON</option></select></label></div>
 <div className={`filter-panel ${openFilters?'open':''}`}><div className="filter-head"><b>REFINE RESULTS</b><button onClick={()=>setOpenFilters(false)}>DONE ×</button></div><label>COLLECTION STATUS<select value={f.status} onChange={e=>update({status:e.target.value})}><option value="all">SHOW EVERYTHING</option><option value="wishlisted">WISHLISTED ONLY</option><option value="hide-wishlisted">HIDE WISHLISTED</option><option value="owned">OWNED ONLY</option><option value="hide-owned">HIDE OWNED</option><option value="uncollected">HIDE WISHLISTED + OWNED</option><option value="collected">ONLY WISHLISTED + OWNED</option><option value="favorites">FAVORITES ONLY</option></select></label>{weapons.length>0&&<label>WEAPON<select value={f.weapon} onChange={e=>update({weapon:e.target.value})}><option value="all">ALL WEAPONS</option>{weapons.map(w=><option value={w} key={w}>{w.toUpperCase()}</option>)}</select></label>}<label>SORT BY<select value={f.sort} onChange={e=>update({sort:e.target.value})}><option value="alpha">NAME A–Z</option><option value="reverse">NAME Z–A</option><option value="weapon">WEAPON</option></select></label><button className="small-ghost" onClick={()=>update({q:'',weapon:'all',status:'all',sort:'alpha'})}>RESET FILTERS</button></div>
 {isLoading&&!items.length?<div className="loading-panel"><div className="spinner"/><strong>SYNCING COSMETIC INTELLIGENCE</strong><small>FETCHING {kind.toUpperCase()}…</small></div>:isError&&!items.length?<div className="empty-panel"><strong>DATABASE SIGNAL LOST</strong><p>{error instanceof Error?error.message:'The catalog is temporarily unavailable.'}</p><button className="primary-button" onClick={()=>refetch()}>TRY AGAIN</button></div>:!visible.length?<div className="empty-panel"><strong>NO MATCHING ENTRIES</strong><p>Try different search or collection filters.</p></div>:<div className={`catalog-grid ${d.preferences.density==='compact'?'compact':''} ${d.preferences.view==='list'?'list':''}`}>{visible.map((item:Cosmetic)=><ItemCard item={item} key={item.id} compact={d.preferences.density==='compact'}/>)}</div>}
 <Pager page={page} pages={pages} total={results.length} onChange={p=>{setFilters(kind,{page:p});window.scrollTo({top:0,behavior:'instant'})}}/>
 </>
}
