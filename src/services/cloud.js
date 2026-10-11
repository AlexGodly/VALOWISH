/** VALOWISH v14 • src/services/cloud.js • browser-native source (no build step) */
function cloudPayload(){let x=JSON.parse(JSON.stringify(db));delete x.undoStack;delete x.redoStack;return x}

function renderAuthState(){if(!document.getElementById('authState'))return;if(!CLOUD_READY){authState.textContent='Supabase is not configured yet. Add your project URL and publishable key near the top of the script.';authForms.hidden=true;signedInBox.hidden=true;return}if(!sb){authState.textContent='Connecting to cloud…';authForms.hidden=false;signedInBox.hidden=true;return}if(cloudUser){authState.textContent=`Signed in as ${cloudUser.email}. Changes sync automatically.`;authForms.hidden=true;signedInBox.hidden=false}else{authState.textContent='Sign in or create an account to save your VALOWISH data in the cloud.';authForms.hidden=false;signedInBox.hidden=true}}

function scheduleCloudSave(){if(!sb||!cloudUser||applyingCloud)return;clearTimeout(cloudTimer);cloudTimer=setTimeout(pushCloud,700)}

async function pushCloud(){if(!sb||!cloudUser)return;let {error}=await sb.from('valowish_data').upsert({user_id:cloudUser.id,data:cloudPayload(),updated_at:new Date().toISOString()},{onConflict:'user_id'});if(error)cloudStatus.textContent='Cloud sync failed: '+error.message;else cloudStatus.textContent='Cloud saved.'}

async function pullCloud(){if(!sb||!cloudUser)return;let {data,error}=await sb.from('valowish_data').select('data').eq('user_id',cloudUser.id).maybeSingle();if(error){cloudStatus.textContent='Cloud load failed: '+error.message;return}if(data?.data){applyingCloud=true;db=Object.assign(load(),data.data);localStorage.setItem(KEY,JSON.stringify(db));applyingCloud=false;renderAll();cloudStatus.textContent='Cloud data loaded.'}else{await pushCloud()}}

async function loadCloudClient(){
  if(!CLOUD_READY)return null;
  if(sb)return sb;
  if(!window.supabase){
    await new Promise((resolve,reject)=>{
      const tag=document.createElement('script');
      tag.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
      tag.async=true;tag.onload=resolve;tag.onerror=()=>reject(new Error('Supabase library unavailable'));
      document.head.append(tag);
    });
  }
  if(!window.supabase?.createClient)throw new Error('Supabase library unavailable');
  return sb=window.supabase.createClient(SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY);
}
async function initCloud(){
  renderAuthState();
  try{await loadCloudClient()}catch(error){console.warn(error);cloudStatus.textContent='Cloud currently unavailable; local features remain usable.';return}
  if(!sb)return;
  const {data,error}=await sb.auth.getSession();
  if(error)console.warn('Supabase session:',error.message);
  cloudUser=data?.session?.user||null;
  if(cloudUser){if(cloudUser.user_metadata?.name)db.name=cloudUser.user_metadata.name;await pullCloud()}
  renderAll();
  sb.auth.onAuthStateChange((_,session)=>{cloudUser=session?.user||null;renderAll()});
}

