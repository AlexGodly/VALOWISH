import{useEffect,useState}from 'react';
import type{User}from '@supabase/supabase-js';
import{supabase}from './cloud';
import{useApp}from './store';
export function useCloud(){
 const [user,setUser]=useState<User|null>(null),[status,setStatus]=useState('Offline collection available'),[ready,setReady]=useState(false);
 useEffect(()=>{
  let active=true;
  const hydrate=async(u:User|null)=>{
   if(!active)return;setUser(u);
   if(!u){setStatus('Local mode — sign in to sync');setReady(true);return}
   setStatus('Loading cloud collection…');setReady(false);
   const {data,error}=await supabase.from('valowish_data').select('data').eq('user_id',u.id).maybeSingle();
   if(!active)return;
   if(error){setStatus(`Cloud load failed: ${error.message}`);setReady(false);return}
   if(data?.data){useApp.getState().replaceData(data.data);setStatus('Cloud collection restored')}
   else{setStatus('No cloud backup yet — Sync now to upload local data')}
   setReady(true);
  };
  supabase.auth.getSession().then(({data})=>hydrate(data.session?.user??null)).catch(()=>{setStatus('Cloud unavailable');setReady(false)});
  const {data:{subscription}}=supabase.auth.onAuthStateChange((event,session)=>{
   if(event!=='SIGNED_IN'&&event!=='SIGNED_OUT')return;
   setTimeout(()=>{if(active)hydrate(session?.user??null)},0)
  });
  return()=>{active=false;subscription.unsubscribe()};
 },[]);
 useEffect(()=>{
  if(!user||!ready)return;
  let inFlight=false;
  const sync=async()=>{if(inFlight)return;inFlight=true;const d=useApp.getState().data;
   const payload={...d,undoStack:[],redoStack:[]}; // preserve v14 data schema without shipping undo frames
   const {error}=await supabase.from('valowish_data').upsert({user_id:user.id,data:payload,updated_at:new Date().toISOString()},{onConflict:'user_id'});
   setStatus(error?`Sync error: ${error.message}`:'Cloud saved');inFlight=false;
  };
  window.addEventListener('valowish:data-changed',sync);
  return()=>window.removeEventListener('valowish:data-changed',sync)
 },[user,ready]);
 const login=async(email:string,password:string)=>{const {error}=await supabase.auth.signInWithPassword({email,password});if(error)throw error};
 const signup=async(email:string,password:string,name:string)=>{const {error}=await supabase.auth.signUp({email,password,options:{data:{name}}});if(error)throw error};
 const logout=async()=>{await supabase.auth.signOut();setReady(false)};
 const syncNow=async()=>{if(!user)throw Error('Sign in first');const data=useApp.getState().data;const {error}=await supabase.from('valowish_data').upsert({user_id:user.id,data,updated_at:new Date().toISOString()},{onConflict:'user_id'});if(error)throw error;setStatus('Cloud saved')};
 return{user,ready,status,login,signup,logout,syncNow};
}
