/** VALOWISH v14 • src/core/storage.js • browser-native source (no build step) */
function escapeHTML(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}

function freshData(){return {wishlist:[],owned:[],priority:[],prices:{},tiers:{},name:'ALEXGODLY',vp:1995,rarityPrices:{Select:875,Deluxe:1275,Premium:1775,Exclusive:2175,Ultra:2475},history:[],undoStack:[],redoStack:[]}}
function load(){const base=freshData();try{let raw=localStorage.getItem(KEY)||localStorage.getItem(LEGACY_KEY)||localStorage.getItem(LEGACY_KEY_V12)||localStorage.getItem(LEGACY_KEY_V11)||localStorage.getItem(LEGACY_KEY_V10)||localStorage.getItem(LEGACY_KEY_V9)||localStorage.getItem(LEGACY_KEY_V8)||localStorage.getItem(LEGACY_KEY_V61)||localStorage.getItem(LEGACY_KEY_V6)||localStorage.getItem(LEGACY_KEY_V3)||'{}';return Object.assign(base,JSON.parse(raw))}catch(e){return base}}

function save(){try{localStorage.setItem(KEY,JSON.stringify(db))}catch(error){console.warn('Local save unavailable',error)};rebuildFastCaches();renderHeaderState();markDirty('browse','wishlist','priority','locker','history','settings');renderCurrentPage();scheduleCloudSave()}

function toast(s){let e=document.getElementById('toast');e.textContent=s;e.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>e.classList.remove('show'),1800)}

function money(n){return Number(n||0).toLocaleString()}

function snapshot(){return JSON.stringify({wishlist:db.wishlist,owned:db.owned,priority:db.priority,prices:db.prices,tiers:db.tiers,vp:db.vp})}

function logAction(type,id,label,before){db.history.unshift({id:Date.now()+Math.random(),type,skinId:id,label,time:new Date().toISOString()});db.history=db.history.slice(0,300);if(before){db.undoStack.push(before);db.undoStack=db.undoStack.slice(-50);db.redoStack=[]}}

function restoreState(raw){let x=JSON.parse(raw);Object.assign(db,x);save()}

function undoAction(){if(!db.undoStack.length)return toast('Nothing to undo');let cur=snapshot(),prev=db.undoStack.pop();db.redoStack.push(cur);restoreState(prev);toast('Undone')}

function redoAction(){if(!db.redoStack.length)return toast('Nothing to redo');let cur=snapshot(),next=db.redoStack.pop();db.undoStack.push(cur);restoreState(next);toast('Redone')}

