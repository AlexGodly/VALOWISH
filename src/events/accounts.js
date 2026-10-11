/** VALOWISH v14 • src/events/accounts.js • browser-native source (no build step) */
loginBtn.onclick=async()=>{if(!sb)return toast('Configure Supabase first');cloudStatus.textContent='Signing in…';let {data,error}=await sb.auth.signInWithPassword({email:authEmail.value.trim(),password:authPassword.value});if(error)return cloudStatus.textContent=error.message;cloudUser=data.user;await pullCloud();toast('Logged in')};

signupBtn.onclick=async()=>{if(!sb)return toast('Configure Supabase first');let name=authName.value.trim()||'PLAYER';cloudStatus.textContent='Creating account…';let {data,error}=await sb.auth.signUp({email:authEmail.value.trim(),password:authPassword.value,options:{data:{name}}});if(error)return cloudStatus.textContent=error.message;db.name=name;save();cloudUser=data.user;if(data.session){await pushCloud();toast('Account created')}else cloudStatus.textContent='Account created. Check your email to confirm your account.'};

logoutBtn.onclick=async()=>{await sb.auth.signOut();cloudUser=null;renderAll();toast('Logged out')};

syncNowBtn.onclick=async()=>{await pushCloud();toast('Cloud synced')};

saveEmail.onclick=async()=>{if(!sb||!cloudUser)return toast('Log in first');let {error}=await sb.auth.updateUser({email:profileEmail.value.trim()});if(error)return toast(error.message);toast('Email update requested — check your email if confirmation is enabled')};

savePassword.onclick=async()=>{if(!sb||!cloudUser)return toast('Log in first');if(profilePassword.value.length<6)return toast('Password must be at least 6 characters');let {error}=await sb.auth.updateUser({password:profilePassword.value});if(error)return toast(error.message);profilePassword.value='';toast('Password changed')};

deleteAccountBtn.onclick=async()=>{if(!sb||!cloudUser)return toast('Log in first');if(!confirm('Permanently delete your VALOWISH account and cloud data? This cannot be undone.'))return;let {error}=await sb.functions.invoke('delete-account');if(error)return toast('Delete failed: '+error.message);localStorage.removeItem(KEY);db=load();cloudUser=null;renderAll();toast('Account deleted')};

