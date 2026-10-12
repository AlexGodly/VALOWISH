import type { Cosmetic, UserData } from './models';
import { RARITY_PRICES } from './models';
const copy=<T,>(v:T):T=>JSON.parse(JSON.stringify(v)) as T;
export function estimatedPrice(c:Cosmetic|undefined,d:UserData):number {
  if(!c)return 0;
  return d.prices[c.id]??d.rarityPrices[c.tierName??'Deluxe']??RARITY_PRICES.Deluxe;
}
export function addActivity(d:UserData,type:string,id:string,label:string,before:UserData):UserData {
  return {...d,history:[{id:Date.now()+Math.random(),type,skinId:id,label,time:new Date().toISOString()},...d.history].slice(0,500),undoStack:[...d.undoStack,JSON.stringify(snapshot(before))].slice(-50),redoStack:[]};
}
export function snapshot(d:UserData){return {wishlist:d.wishlist,owned:d.owned,priority:d.priority,prices:d.prices,tiers:d.tiers,vp:d.vp,favorites:d.favorites,notes:d.notes,acquired:d.acquired}}
export function toggleCollection(d:UserData,key:'wishlist'|'owned'|'favorites',id:string):UserData {
  const before=copy(d);const has=d[key].includes(id);
  const next={...d,[key]:has?d[key].filter(x=>x!==id):[id,...d[key]]};
  return addActivity(next,key,id,`${has?'Removed from':'Added to'} ${key}`,before);
}
export function buyItem(d:UserData,c:Cosmetic):UserData {
  if(d.owned.includes(c.id))return d;
  const before=copy(d),cost=estimatedPrice(c,d);
  return addActivity({...d,owned:[c.id,...d.owned],wishlist:d.wishlist.filter(x=>x!==c.id),priority:d.priority.filter(x=>x!==c.id),vp:Math.max(0,d.vp-cost),acquired:{...d.acquired,[c.id]:{date:new Date().toISOString().slice(0,10),paid:cost,source:'Purchase'}}},'bought',c.id,`Bought for ${cost.toLocaleString()} VP`,before);
}
export function setPriority(d:UserData,id:string):UserData {
  const before=copy(d);return addActivity({...d,priority:d.priority.includes(id)?d.priority:[...d.priority,id],wishlist:d.wishlist.includes(id)?d.wishlist:[id,...d.wishlist]},'priority',id,'Added to priority',before)
}
export function undo(d:UserData):UserData {if(!d.undoStack.length)return d;const stack=[...d.undoStack],last=stack.pop()!;const state=JSON.parse(last) as ReturnType<typeof snapshot>;return {...d,...state,undoStack:stack,redoStack:[...d.redoStack,JSON.stringify(snapshot(d))].slice(-50)} }
export function redo(d:UserData):UserData {if(!d.redoStack.length)return d;const stack=[...d.redoStack],last=stack.pop()!;const state=JSON.parse(last) as ReturnType<typeof snapshot>;return {...d,...state,redoStack:stack,undoStack:[...d.undoStack,JSON.stringify(snapshot(d))].slice(-50)} }
export function moveItem<T>(values:T[],from:number,to:number):T[]{if(from<0||from>=values.length)return values;const list=[...values];const [item]=list.splice(from,1);list.splice(Math.max(0,Math.min(to,list.length)),0,item);return list}
