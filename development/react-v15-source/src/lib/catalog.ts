import type {CatalogKind,Cosmetic,Rarity} from './models';
const BASE='https://valorant-api.com/v1';
const PATHS:Record<CatalogKind,string>={skins:'weapons',bundles:'bundles',playercards:'playercards',playertitles:'playertitles',buddies:'buddies',sprays:'sprays',flexes:'flex',agents:'agents',maps:'maps',gamemodes:'gamemodes',seasons:'seasons',events:'events'};
const obj=(x:unknown):Record<string,any>=>x&&typeof x==='object'?x as Record<string,any>:{};
const str=(s:unknown)=>typeof s==='string'?s:'';
const asset=(...values:unknown[]):string=>values.map(str).find(Boolean)||'';
const UID=(kind:CatalogKind,id:string)=>kind==='skins'?id:`${kind}:${id}`;
const rarityFromName=(value:string):Rarity|undefined=>{const r=value.toLowerCase();return(['Select','Deluxe','Premium','Exclusive','Ultra'] as Rarity[]).find(x=>r.includes(x.toLowerCase()))};
export function normalizeCatalog(kind:CatalogKind,raw:unknown):Cosmetic[]{
 const input=Array.isArray(raw)?raw:[];
 const entries=kind==='skins'?input.flatMap(w=>{const weapon=obj(w);return (Array.isArray(weapon.skins)?weapon.skins:[]).map((s:unknown)=>({...obj(s),weapon:weapon.displayName}))}):input.map(obj);
 const all=entries.map((entry:unknown):Cosmetic|null=>{
  const e=obj(entry), uuid=str(e.uuid);if(!uuid)return null;
  const name=asset(e.displayName,e.titleText,e.title,e.name,e.displayTitle)||`${kind} ${uuid.slice(0,6)}`;
  const isSkin=kind==='skins';
  if(isSkin&&(/random|standard/i.test(name)||(!e.displayIcon&&!e.chromas?.[0]?.fullRender)))return null;
  const chromas=Array.isArray(e.chromas)?e.chromas.map((v:unknown)=>({uuid:str(obj(v).uuid),name:asset(obj(v).displayName,'Variant'),icon:asset(obj(v).fullRender,obj(v).displayIcon)})):[];
  const levels=Array.isArray(e.levels)?e.levels.map((v:unknown)=>({uuid:str(obj(v).uuid),name:asset(obj(v).displayName,'Level'),icon:asset(obj(v).displayIcon),stream:asset(obj(v).streamedVideo)})):[];
  const icon=asset(e.displayIcon,e.fullTransparentIcon,e.wideArt,e.largeArt,e.splash,e.background,e.listViewIcon,e.smallArt,e.icon,e.displayIconSmall,e.chromas?.[0]?.fullRender,e.levels?.[0]?.displayIcon);
  const hero=asset(e.wideArt,e.fullPortrait,e.largeArt,e.displayIcon,e.fullRender,e.splash,e.background,icon);
  const tierId=str(e.contentTierUuid);const tierName=rarityFromName(name);
  const subtitle=asset(e.weapon,e.role?.displayName,e.type,e.description,e.themeUuid);
  return {id:UID(kind,uuid),uuid,kind,name,icon,hero,subtitle,weapon:str(e.weapon),tierId,tierName,description:str(e.description),chromas,levels,raw:e};
 }).filter((x):x is Cosmetic=>Boolean(x));
 return all.sort((a,b)=>a.name.localeCompare(b.name));
}
export async function fetchCatalog(kind:CatalogKind,signal?:AbortSignal):Promise<Cosmetic[]>{
 const key=`valowish_catalog_v15_${kind}`,maxAge=1000*60*60*18;
 let cached:{time:number;items:Cosmetic[]}|null=null;
 try{const text=localStorage.getItem(key);if(text){cached=JSON.parse(text);if(cached?.items?.length&&Date.now()-cached.time<maxAge)return cached.items}}catch{/*no cache*/}
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),10000);
 const abort=()=>controller.abort();signal?.addEventListener('abort',abort,{once:true});
 try{
  const url=new URL(`${BASE}/${PATHS[kind]}`);
  if(kind==='agents')url.searchParams.set('isPlayableCharacter','true');
  const tierPromise=kind==='skins'?fetch(`${BASE}/contenttiers`,{signal:controller.signal,mode:'cors'}).then(r=>r.ok?r.json():null).catch(()=>null):Promise.resolve(null);
  const res=await fetch(url,{signal:controller.signal,mode:'cors'});if(!res.ok)throw new Error(`Catalog unavailable (HTTP ${res.status})`);
  const body=await res.json();const items=normalizeCatalog(kind,body?.data);
  if(kind==='skins'){
   const tiers=await tierPromise;
   const map=new Map<string,{name:Rarity;icon:string}>();
   for(const rawTier of (Array.isArray(tiers?.data)?tiers.data:[])){
    const name=rarityFromName(str(rawTier.displayName));if(name)map.set(str(rawTier.uuid),{name,icon:str(rawTier.displayIcon)});
   }
   for(const item of items){const t=map.get(item.tierId||'');if(t){item.tierName=t.name;item.tierIcon=t.icon}}
  }
  if(!Array.isArray(body?.data))throw new Error('Unexpected catalog response');
  try{localStorage.setItem(key,JSON.stringify({time:Date.now(),items:items.map(({raw,...item})=>item)}))}catch{/*storage quota*/}
  return items;
 }catch(error){if(cached?.items)return cached.items;throw error}finally{clearTimeout(timer);signal?.removeEventListener('abort',abort)}
}
export const KINDS:{kind:CatalogKind;label:string;section:'cosmetic'|'intel';description:string}[]=[
 {kind:'skins',label:'Weapon Skins',section:'cosmetic',description:'Weapons & finishes'},
 {kind:'bundles',label:'Bundles',section:'cosmetic',description:'Collection archives'},
 {kind:'playercards',label:'Player Cards',section:'cosmetic',description:'Profile showcase'},
 {kind:'playertitles',label:'Player Titles',section:'cosmetic',description:'Identity titles'},
 {kind:'buddies',label:'Gun Buddies',section:'cosmetic',description:'Weapon charms'},
 {kind:'sprays',label:'Sprays',section:'cosmetic',description:'Expressions'},
 {kind:'flexes',label:'Flexes',section:'cosmetic',description:'Flex cosmetics'},
 {kind:'agents',label:'Agents',section:'intel',description:'Roster'},
 {kind:'maps',label:'Maps',section:'intel',description:'Locations'},
 {kind:'gamemodes',label:'Game Modes',section:'intel',description:'Play styles'},
 {kind:'seasons',label:'Seasons',section:'intel',description:'Episode & Act records'},
 {kind:'events',label:'Events',section:'intel',description:'Events archive'}
];
