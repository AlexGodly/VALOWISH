import{describe,expect,it}from'vitest';
import{normalizeData}from'../src/lib/storage';
import{blankData}from'../src/lib/models';
import{toggleCollection,buyItem,undo,redo,moveItem}from'../src/lib/collections';
import{normalizeCatalog}from'../src/lib/catalog';
describe('v14 compatible migration',()=>{
 it('preserves v13/v14 skins, prices, priorities and name',()=>{
  const d=normalizeData({wishlist:['skin-a'],owned:['skin-b'],priority:['skin-a'],name:'ALEX',vp:900,prices:{'skin-a':2175},rarityPrices:{Premium:2000}});
  expect(d.wishlist).toEqual(['skin-a']);expect(d.owned).toEqual(['skin-b']);expect(d.prices['skin-a']).toBe(2175);expect(d.rarityPrices.Premium).toBe(2000);expect(d.goals).toEqual([]);
 });
 it('deduplicates identifiers and ignores broken numbers',()=>{
  const d=normalizeData({wishlist:['x','x',null],vp:-100});expect(d.wishlist).toEqual(['x']);expect(d.vp).toBe(1995)
 })
});
describe('collection behavior',()=>{
 it('wishlist and undo/redo work',()=>{
  const first=toggleCollection(blankData(),'wishlist','skin1');expect(first.wishlist).toContain('skin1');const previous=undo(first);expect(previous.wishlist).toEqual([]);expect(redo(previous).wishlist).toEqual(['skin1']);
 });
 it('buy moves wishlist to locker and deducts tracked VP',()=>{
  const data=blankData();data.wishlist=['s1'];data.priority=['s1'];
  const result=buyItem(data,{id:'s1',uuid:'s1',kind:'skins',name:'Skin',icon:'',hero:'',subtitle:'',tierName:'Premium'});
  expect(result.owned).toContain('s1');expect(result.wishlist).not.toContain('s1');expect(result.priority).not.toContain('s1');expect(result.vp).toBe(220);
 });
 it('reorders manual priority',()=>expect(moveItem(['a','b','c'],0,2)).toEqual(['b','c','a']))
});
describe('catalog',()=>{
 it('keeps v14-compatible skin UUIDs and uses weapon names from API',()=>{
  const items=normalizeCatalog('skins',[{displayName:'Warden',skins:[{uuid:'warden-skin',displayName:'Crimson Warden',displayIcon:'https://example.com/a.png'}]}]);
  expect(items[0].id).toBe('warden-skin');expect(items[0].weapon).toBe('Warden');
 });
 it('distinguishes IDs across types',()=>{
  const items=normalizeCatalog('playercards',[{uuid:'x',displayName:'Card',displayIcon:'a'}]);expect(items[0].id).toBe('playercards:x')
 })
});
