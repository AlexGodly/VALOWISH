declare namespace JSX { interface Element {} interface IntrinsicAttributes {key?:string|number} interface IntrinsicElements { [elemName: string]:{[attr:string]:unknown;onClick?:(e:any)=>void;onChange?:(e:any)=>void;onMouseDown?:(e:any)=>void;onKeyDown?:(e:any)=>void} } }
declare module 'react' {
  export type ReactNode = any;export type MouseEvent<T>={target:EventTarget;currentTarget:T};export type DragEvent<T>={target:EventTarget;currentTarget:T;preventDefault:()=>void};
  export type ChangeEvent<T>={target:T};
  export function useState<T>(initial:T|(()=>T)):[T,(next:T|((old:T)=>T))=>void];
  export function useEffect(effect:()=>void|(()=>void),deps?:readonly unknown[]):void;
  export function useMemo<T>(fn:()=>T,deps:readonly unknown[]):T;
  export function useDeferredValue<T>(x:T):T;
  const React:{StrictMode:any};export default React;
}
declare module 'react-dom/client' { export function createRoot(target:any): {render(content:any):void}; }
declare module 'lucide-react' { export const Home:any,Compass:any,Heart:any,Shield:any,Layers:any,ChartNoAxesCombined:any,Settings:any,History:any,Star:any,Target:any,Menu:any,Map:any,Users:any,ShoppingBag:any,Bookmark:any,PanelLeftClose:any,Search:any,ChevronRight:any,ChevronLeft:any,Check:any,LockKeyhole:any,Wallet:any,ArrowUpRight:any,Gem:any,SlidersHorizontal:any,RotateCcw:any,Command:any,ArrowDownUp:any,X:any,RefreshCw:any,ArrowUp:any,ArrowDown:any,Trash2:any,Plus:any,BarChart3:any,ArrowRight:any,Cloud:any,User:any,Paintbrush:any,Database:any,LogOut:any,Upload:any,Download:any; }
declare module 'motion/react' {export const motion:Record<string,any>;export const AnimatePresence:any;}
declare module '@tanstack/react-query' {
  export class QueryClient {constructor(x?:any)}
  export const QueryClientProvider:any;
  export function useQuery<T>(options:{queryKey:any[],queryFn:()=>Promise<T>,enabled?:boolean,staleTime?:number,retry?:number}):{data:T|undefined;isLoading:boolean;isFetching:boolean;isError:boolean;error:unknown;refetch:()=>void};
}
declare module 'zustand' {
  export function create<S>(init:(set:(patch:Partial<S>|((s:S)=>Partial<S>))=>void,get:()=>S)=>S):{<T>(select:(s:S)=>T):T;getState:()=>S};
}
declare module '@supabase/supabase-js' {
  export type User={id:string;email?:string;user_metadata?:Record<string,unknown>};
  type Result<T>={data:T,error:Error|null};
  interface QueryTable { select:(cols:string)=>{eq:(col:string,id:string)=>{maybeSingle:()=>Promise<Result<{data?:unknown}|null>>}}; upsert:(data:unknown,options?:unknown)=>Promise<{error:Error|null}> }
  interface Client { from:(table:string)=>QueryTable; auth:{getSession:()=>Promise<{data:{session:{user:User|null}|null}}>;onAuthStateChange:(cb:(event:string,session:{user:User|null}|null)=>void)=>{data:{subscription:{unsubscribe:()=>void}}};signInWithPassword:(a:unknown)=>Promise<Result<{user:User}>>;signUp:(a:unknown)=>Promise<Result<{user:User}>>;signOut:()=>Promise<unknown>;updateUser:(a:unknown)=>Promise<{error:Error|null}>}; functions:{invoke:(name:string)=>Promise<{error:Error|null}>} }
  export function createClient(url:string,key:string,opts?:unknown):Client;
}
interface ImportMeta{ env:{ BASE_URL:string }}
declare module '*.css';

declare module 'react/jsx-runtime' { export const jsx:any; export const jsxs:any; export const Fragment:any; }
