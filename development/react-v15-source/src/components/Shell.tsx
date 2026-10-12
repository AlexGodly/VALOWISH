import{useState,type ReactNode}from'react';
import{motion}from'motion/react';
import{Home,Compass,Heart,Shield,Star,Layers,Target,ChartNoAxesCombined,History,Settings,Menu,Wallet,ArrowUpRight}from './Icons';
import{useApp}from'../lib/store';
import type{Page}from'../lib/models';
const nav:[Page,string,typeof Home,string][]=[
 ['home','Command Center',Home,'MAIN'],['discover','Discover',Compass,'MAIN'],
 ['wishlist','Wishlist',Heart,'COLLECTION'],['locker','Locker',Shield,'COLLECTION'],
 ['priority','Priority',Star,'COLLECTION'],['loadouts','Loadout Studio',Layers,'COLLECTION'],
 ['planner','Purchase Planner',Target,'OPERATIONS'],['insights','Insights',ChartNoAxesCombined,'OPERATIONS'],
 ['history','Activity',History,'SYSTEM'],['settings','Settings',Settings,'SYSTEM']
];
const mobile:[Page|string,string,typeof Home][]=[['home','Home',Home],['discover','Discover',Compass],['wishlist','Wishlist',Heart],['locker','Locker',Shield],['more','More',Menu]];
export function Shell({children}:{children:ReactNode}){
 const page=useApp(s=>s.page),setPage=useApp(s=>s.setPage),d=useApp(s=>s.data);
 const [moreOpen,setMoreOpen]=useState(false);
 const navigate=(next:Page)=>{setPage(next);setMoreOpen(false)};
 let section='';
 return <div className="app-shell">
  <aside className="sidebar">
   <button className="identity" onClick={()=>setPage('home')} aria-label="Go to command center"><img src={`${import.meta.env.BASE_URL}favicon.png`} alt="VALOWISH emblem"/><div><strong>VALO<span>WISH</span></strong><small>R E B O R N · 15</small></div></button>
   <div className="side-sep"><span>TACTICAL COSMETIC SYSTEM</span><span className="status-dot"/></div>
   <nav className="side-nav" aria-label="Primary navigation">
    {nav.map(([id,label,Icon,group])=>{const start=group!==section;section=group;return <div key={id}>
      {start&&<div className="nav-group">{group}</div>}
      <button className={`nav-link ${page===id?'selected':''}`} onClick={()=>setPage(id)}><Icon size={19} strokeWidth={1.9}/><span>{label}</span>{page===id&&<i/>}</button>
    </div>})}
   </nav>
   <div className="sidebar-bottom"><div className="operator-mark">AG<span> / </span>01</div><div className="operator-info"><b>{d.name||'OPERATOR'}</b><small>YOUR COSMETIC HQ</small></div><span className="live-indicator"/></div>
  </aside>
  <div className="workspace">
   <header className="topbar">
    <div className="breadcrumb"><img className="mobile-logo" src={`${import.meta.env.BASE_URL}favicon.png`} alt=""/><span>VALOWISH</span><span className="slash">/</span><strong>{nav.find(n=>n[0]===page)?.[1]||'Command Center'}</strong></div>
    <div className="top-actions"><span className="live-label"><span className="status-dot"/> COSMETIC DATABASE</span><button className="vp-pill" onClick={()=>setPage('planner')}><Wallet size={16}/><span>{d.vp.toLocaleString()}</span><small>VP</small><ArrowUpRight size={13}/></button><button className="avatar" onClick={()=>setPage('settings')}>{d.name?.slice(0,2).toUpperCase()||'AG'}</button></div>
   </header>
   <motion.main className="main" key={page} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:.2}}>{children}</motion.main>
   <footer className="footer"><span>VALOWISH / REBORN</span><span>BY ALEX GODLY · UNOFFICIAL FAN PROJECT</span></footer>
  </div>
  {moreOpen&&<div className="more-scrim" onMouseDown={e=>{if(e.target===e.currentTarget)setMoreOpen(false)}}><section className="more-sheet" role="dialog" aria-modal="true" aria-label="More pages"><header><div><span className="eyebrow">// NAVIGATION / ALL SYSTEMS</span><h3>MORE OPERATIONS</h3></div><button onClick={()=>setMoreOpen(false)} aria-label="Close menu">×</button></header><div className="more-grid">{nav.filter(n=>!['home','discover','wishlist','locker'].includes(n[0])).map(([id,label,Icon])=><button key={id} onClick={()=>navigate(id)}><Icon size={20}/><span>{label}</span><ArrowUpRight size={15}/></button>)}</div></section></div>}
  <nav className="mobile-nav" aria-label="Mobile navigation">{mobile.map(([id,label,Icon])=><button key={id} className={(id==='more'?moreOpen:page===id)?'selected':''} onClick={()=>id==='more'?setMoreOpen(o=>!o):navigate(id as Page)} aria-label={label}><Icon size={21} strokeWidth={(id==='more'?moreOpen:page===id)?2.3:1.8}/><small>{label}</small></button>)}</nav>
 </div>
}
