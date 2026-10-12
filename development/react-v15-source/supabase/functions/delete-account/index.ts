import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
Deno.serve(async (req) => {
  const cors={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type"};
  if(req.method==="OPTIONS") return new Response("ok",{headers:cors});
  const auth=req.headers.get("Authorization");
  if(!auth) return new Response(JSON.stringify({error:"Unauthorized"}),{status:401,headers:{...cors,"Content-Type":"application/json"}});
  const url=Deno.env.get("SUPABASE_URL")!; const anon=Deno.env.get("SUPABASE_ANON_KEY")!; const service=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const userClient=createClient(url,anon,{global:{headers:{Authorization:auth}}});
  const {data:{user},error}=await userClient.auth.getUser();
  if(error||!user) return new Response(JSON.stringify({error:"Unauthorized"}),{status:401,headers:{...cors,"Content-Type":"application/json"}});
  const admin=createClient(url,service);
  const {error:delError}=await admin.auth.admin.deleteUser(user.id);
  if(delError) return new Response(JSON.stringify({error:delError.message}),{status:400,headers:{...cors,"Content-Type":"application/json"}});
  return new Response(JSON.stringify({ok:true}),{headers:{...cors,"Content-Type":"application/json"}});
});
