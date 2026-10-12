import { blankData, type UserData } from './models';
export const STORAGE_KEY='valowish_v15';
export const LEGACY_KEYS=['valowish_v14','valowish_v13','valowish_v12','valowish_v11','valowish_v10','valowish_v9','valowish_v8','valowish_v7','valowish_v61','valowish_v6','valowish_v2'];
const mergeRecord=(v:unknown):Record<string,unknown> => (v && typeof v==='object'&&!Array.isArray(v)?v as Record<string,unknown>:{});
const ids=(v:unknown):string[] => Array.isArray(v)? [...new Set(v.filter((x):x is string=>typeof x==='string'&&x.length>0))]:[];
export function normalizeData(source:unknown):UserData {
  const x=mergeRecord(source),d=blankData();
  const number=(n:unknown,def:number)=>Number.isFinite(Number(n))&&Number(n)>=0?Number(n):def;
  const values=(v:unknown):Record<string,number>=>Object.fromEntries(Object.entries(mergeRecord(v)).filter(([,n])=>Number.isFinite(Number(n))&&Number(n)>=0).map(([k,n])=>[k,Number(n)]));
  return {
    ...d, wishlist:ids(x.wishlist),owned:ids(x.owned),priority:ids(x.priority),favorites:ids(x.favorites),
    prices:values(x.prices),tiers:Object.fromEntries(Object.entries(mergeRecord(x.tiers)).filter(([,v])=>typeof v==='string')) as Record<string,string>,
    name:typeof x.name==='string'&&x.name.trim()?x.name:d.name,vp:number(x.vp,d.vp),
    rarityPrices:{...d.rarityPrices,...values(x.rarityPrices)},
    history:Array.isArray(x.history)?x.history.filter(v=>v&&typeof v==='object').slice(0,500) as UserData['history']:[],
    undoStack:Array.isArray(x.undoStack)?x.undoStack.filter((v):v is string=>typeof v==='string').slice(-50):[],
    redoStack:Array.isArray(x.redoStack)?x.redoStack.filter((v):v is string=>typeof v==='string').slice(-50):[],
    notes: Object.fromEntries(Object.entries(mergeRecord(x.notes)).filter(([,v])=>typeof v==='string')) as Record<string,string>,
    tags:Object.fromEntries(Object.entries(mergeRecord(x.tags)).map(([k,v])=>[k,ids(v)])),
    acquired:mergeRecord(x.acquired) as UserData['acquired'],
    loadouts:Array.isArray(x.loadouts)?x.loadouts.filter(v=>v&&typeof v==='object') as UserData['loadouts']:[],
    goals:Array.isArray(x.goals)?x.goals.filter(v=>v&&typeof v==='object') as UserData['goals']:[],
    preferences:{...d.preferences,...mergeRecord(x.preferences)} as UserData['preferences']
  };
}
export function loadLocal():UserData {
  for(const k of [STORAGE_KEY,...LEGACY_KEYS]){
    try{const v=localStorage.getItem(k);if(v)return normalizeData(JSON.parse(v))}catch(error){console.warn('Skipping unreadable data for',k,error)}
  }
  return blankData();
}
export function saveLocal(data:UserData){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(data))}catch(error){console.warn('Local storage unavailable',error)}}
export function resetLocal(){const data=blankData();saveLocal(data);return data}
export function exportBackup(data:UserData){const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='VALOWISH-v15-backup.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
