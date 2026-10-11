/** VALOWISH v14 • src/services/catalog.js • browser-native source (no build step) */
async function init(){
 populateGuns();setupGunFilters();setupRarityFilters();
 const CACHE='valowish_skin_api_cache_v1';
 // Render shell/settings immediately; never block navigation on the skin API.
 rebuildFastCaches();renderHeaderState();
 try{
   const cached=JSON.parse(localStorage.getItem(CACHE)||'null');
   if(cached?.normalized&&Array.isArray(cached.data)&&cached.data.length){
     skins=cached.data;rebuildFastCaches();markDirty('browse','wishlist','priority','locker','history');renderCurrentPage(true);
   }
 }catch(_){}
 let networkError=null;
 try{
   const ctl=new AbortController();const timer=setTimeout(()=>ctl.abort(),8000);
   const r=await fetch(API,{mode:'cors',cache:'no-store',signal:ctl.signal});
   clearTimeout(timer);
   if(!r.ok)throw new Error('HTTP '+r.status);
   const j=await r.json();
   const fresh=[];
   (j.data||[]).forEach(w=>(w.skins||[]).forEach(x=>{
     if(!/random|standard/i.test(x.displayName)&&x.displayIcon)fresh.push({uuid:x.uuid,displayName:x.displayName,displayIcon:x.displayIcon,chromas:x.chromas?.length?[{fullRender:x.chromas[0].fullRender}]:[],weapon:w.displayName})
   }));
   fresh.sort((a,b)=>a.displayName.localeCompare(b.displayName));
   if(fresh.length){
     skins=fresh;
     try{localStorage.setItem(CACHE,JSON.stringify({normalized:true,data:skins}))}catch(_){}
     rebuildFastCaches();markDirty('browse','wishlist','priority','locker','history');renderCurrentPage(true);
   }
 }catch(e){networkError=e}
 if(!skins.length){
   browseCards.innerHTML=`<div class="empty"><b>Could not load Valorant skins.</b><br><br>The rest of VALOWISH is still usable. Android's <b>${location.protocol}</b> Downloads viewer may block external API requests.<br><br><button class="btn primary" onclick="init()">RETRY SKIN DATABASE</button><br><br><small>${networkError?escapeHTML(networkError.message):'No local skin cache is available yet.'}</small></div>`;
   pageDirty.browse=false;
 }
}

