export const RARITY_PRICES = { Select: 875, Deluxe: 1275, Premium: 1775, Exclusive: 2175, Ultra: 2475 } as const;
export type Rarity = keyof typeof RARITY_PRICES;
export type CatalogKind = 'skins'|'bundles'|'playercards'|'playertitles'|'buddies'|'sprays'|'flexes'|'agents'|'maps'|'gamemodes'|'seasons'|'events';
export type Page = 'home'|'discover'|'wishlist'|'locker'|'priority'|'loadouts'|'planner'|'insights'|'history'|'settings';
export type Cosmetic = {
  id: string; uuid: string; kind: CatalogKind; name: string;
  icon: string; hero: string; subtitle: string; weapon?: string;
  tierId?: string; tierName?: Rarity; tierIcon?: string; description?: string;
  chromas?: { uuid: string; name: string; icon: string }[];
  levels?: { uuid: string; name: string; icon: string; stream?: string }[];
  raw?: Record<string, unknown>;
};
export type Activity = { id: number; type: string; skinId: string; label: string; time: string };
export type UserData = {
  wishlist: string[]; owned: string[]; priority: string[]; prices: Record<string,number>;
  tiers: Record<string,string>; name: string; vp: number;
  rarityPrices: Record<Rarity, number>; history: Activity[];
  undoStack: string[]; redoStack: string[];
  favorites: string[]; notes: Record<string,string>;
  tags: Record<string,string[]>;
  acquired: Record<string,{date?:string; paid?:number; source?:string}>;
  loadouts: {id:string;name:string;items:Record<string,string>}[];
  goals: {id:string;name:string;target:number;saved:number}[];
  preferences: { density:'comfortable'|'compact'; reducedMotion:boolean; pageSize:number; view:'grid'|'list' };
};
export function blankData():UserData { return {
  wishlist:[],owned:[],priority:[],prices:{},tiers:{},name:'ALEXGODLY',vp:1995,
  rarityPrices:{...RARITY_PRICES},history:[],undoStack:[],redoStack:[],
  favorites:[],notes:{},tags:{},acquired:{},loadouts:[],goals:[],
  preferences:{density:'comfortable',reducedMotion:false,pageSize:24,view:'grid'}
} }
