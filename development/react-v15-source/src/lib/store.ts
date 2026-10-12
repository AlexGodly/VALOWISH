import {create} from 'zustand';
import type{UserData,Page,CatalogKind}from './models';
import{blankData}from './models';
import{loadLocal,saveLocal,normalizeData}from './storage';
import{toggleCollection,buyItem,setPriority,undo,redo,moveItem}from './collections';
import type{Cosmetic}from './models';

type AppStore={
 data:UserData;page:Page;kind:CatalogKind;detail:Cosmetic|null;
 filters:Record<string,{q:string;weapon:string;status:string;sort:string;page:number}>;
 catalog:Record<string,Cosmetic[]>;
 toast:string;openFilters:boolean;
 setPage:(p:Page)=>void;setKind:(k:CatalogKind)=>void;setDetail:(c:Cosmetic|null)=>void;
 setCatalog:(k:CatalogKind,items:Cosmetic[])=>void;
 setFilters:(k:string,patch:Partial<AppStore['filters'][string]>)=>void;
 setOpenFilters:(open:boolean)=>void;notify:(msg:string)=>void;
 update:(fn:(data:UserData)=>UserData)=>void;replaceData:(v:unknown)=>void;
 toggle:(key:'wishlist'|'owned'|'favorites',id:string)=>void;
 buy:(c:Cosmetic)=>void;addPriority:(id:string)=>void;
 movePriority:(from:number,to:number)=>void;undo:()=>void;redo:()=>void;
};
let saveTimeout:ReturnType<typeof setTimeout>|null=null;
export const useApp=create<AppStore>((set,get)=>({
 data:loadLocal(),page:'home',kind:'skins',detail:null,filters:{},catalog:{},toast:'',openFilters:false,
 setPage:page=>set({page,detail:null,openFilters:false}),
 setKind:kind=>set({kind,detail:null,openFilters:false}),setDetail:detail=>set({detail}),
 setCatalog:(k,items)=>set(s=>({catalog:{...s.catalog,[k]:items}})),
 setFilters:(k,patch)=>set(s=>({filters:{...s.filters,[k]:{...(s.filters[k]??{q:'',weapon:'all',status:'all',sort:'alpha',page:1}),...patch}}})),
 setOpenFilters:openFilters=>set({openFilters}),notify:toast=>set({toast}),
 update:fn=>{const next=fn(get().data);set({data:next});saveLocal(next);if(saveTimeout)clearTimeout(saveTimeout);saveTimeout=setTimeout(()=>window.dispatchEvent(new Event('valowish:data-changed')),800)},
 replaceData:v=>{const next=normalizeData(v);set({data:next});saveLocal(next)},
 toggle:(key,id)=>get().update(d=>toggleCollection(d,key,id)),
 buy:c=>get().update(d=>buyItem(d,c)),addPriority:id=>get().update(d=>setPriority(d,id)),
 movePriority:(from,to)=>get().update(d=>({...d,priority:moveItem(d.priority,from,to)})),
 undo:()=>get().update(undo),redo:()=>get().update(redo)
}));
export function restoreFreshData(){useApp.getState().replaceData(blankData())}
