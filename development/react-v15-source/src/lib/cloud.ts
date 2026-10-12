import{createClient}from '@supabase/supabase-js';
const URL='https://nbmcwhsxyvpmriyeozvh.supabase.co';
const KEY='sb_publishable_ViOtA4xlEHtICam3vvOkbQ_6K_vnjfI';
// Publishable browser key, never service_role.
export const supabase=createClient(URL,KEY,{auth:{autoRefreshToken:true,persistSession:true}});
