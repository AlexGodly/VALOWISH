/** VALOWISH v14 • src/core/state.js • browser-native source (no build step) */
// Explicit DOM references replace legacy reliance on browser named-element globals.
const topUser=document.getElementById('topUser');
const topVp=document.getElementById('topVp');
const browse=document.getElementById('browse');
const browseSearch=document.getElementById('browseSearch');
const browseCards=document.getElementById('browseCards');
const wishlist=document.getElementById('wishlist');
const wishSearch=document.getElementById('wishSearch');
const wishCards=document.getElementById('wishCards');
const priority=document.getElementById('priority');
const prioritySearch=document.getElementById('prioritySearch');
const priorityTier=document.getElementById('priorityTier');
const priorityCount=document.getElementById('priorityCount');
const priorityTotal=document.getElementById('priorityTotal');
const priorityList=document.getElementById('priorityList');
const locker=document.getElementById('locker');
const lockerSearch=document.getElementById('lockerSearch');
const lockerCards=document.getElementById('lockerCards');
const ownedCount=document.getElementById('ownedCount');
const spentVp=document.getElementById('spentVp');
const historyList=document.getElementById('historyList');
const vpInput=document.getElementById('vpInput');
const nameInput=document.getElementById('nameInput');
const rpSelect=document.getElementById('rpSelect');
const rpDeluxe=document.getElementById('rpDeluxe');
const rpPremium=document.getElementById('rpPremium');
const rpExclusive=document.getElementById('rpExclusive');
const rpUltra=document.getElementById('rpUltra');
const profileEmail=document.getElementById('profileEmail');
const authState=document.getElementById('authState');
const authForms=document.getElementById('authForms');
const signedInBox=document.getElementById('signedInBox');
const cloudStatus=document.getElementById('cloudStatus');
const authName=document.getElementById('authName');
const authEmail=document.getElementById('authEmail');
const authPassword=document.getElementById('authPassword');
const profilePassword=document.getElementById('profilePassword');
const loginBtn=document.getElementById('loginBtn');
const signupBtn=document.getElementById('signupBtn');
const logoutBtn=document.getElementById('logoutBtn');
const syncNowBtn=document.getElementById('syncNowBtn');
const saveVp=document.getElementById('saveVp');
const saveName=document.getElementById('saveName');
const saveEmail=document.getElementById('saveEmail');
const savePassword=document.getElementById('savePassword');
const saveRarityPrices=document.getElementById('saveRarityPrices');
const exportBtn=document.getElementById('exportBtn');
const importFile=document.getElementById('importFile');
const resetBtn=document.getElementById('resetBtn');
const deleteAccountBtn=document.getElementById('deleteAccountBtn');
const clearBrowse=document.getElementById('clearBrowse');
const clearWish=document.getElementById('clearWish');
const clearLocker=document.getElementById('clearLocker');
const toggleView=document.getElementById('toggleView');
const lockerView=document.getElementById('lockerView');
const autoPriority=document.getElementById('autoPriority');
const clearPriority=document.getElementById('clearPriority');
const priceModal=document.getElementById('priceModal');
const priceModalName=document.getElementById('priceModalName');
const priceModalRarity=document.getElementById('priceModalRarity');
const priceModalInput=document.getElementById('priceModalInput');
const undoBtn=document.getElementById('undoBtn');
const redoBtn=document.getElementById('redoBtn');
const clearHistory=document.getElementById('clearHistory');
const browseStatus=document.getElementById('browseStatus');
const browseStatusLabel=document.getElementById('browseStatusLabel');
const ownershipFilter=document.getElementById('ownershipFilter');
const ownershipLabel=document.getElementById('ownershipLabel');

let cloudUser=null, cloudTimer=null, applyingCloud=false;

let db=load();

db.rarityPrices=Object.assign({Select:875,Deluxe:1275,Premium:1775,Exclusive:2175,Ultra:2475},db.rarityPrices||{});

db.history=db.history||[];

db.undoStack=db.undoStack||[];

db.redoStack=db.redoStack||[];

let historyFilter='all';

let skins=[];

let skinMap=new Map(),wishSet=new Set(),ownedSet=new Set(),prioritySet=new Set();

let currentPage='browse',lastPage='browse',renderQueued=false,searchTimer=null;

let pageDirty={browse:true,wishlist:true,priority:true,locker:true,history:true,settings:true};

const PAGE_SIZE=(innerWidth<=760?18:36);

let pageIndex={browse:1,wishlist:1,locker:1};

let pageScroll={browse:0,wishlist:0,priority:0,locker:0,history:0,settings:0};

const RARITIES=['Select','Deluxe','Premium','Ultra','Exclusive'];

const rarityFilters={browse:new Set(),wishlist:new Set(),locker:new Set()};

const gunFilters={browse:new Set(),wishlist:new Set(),locker:new Set()};

let listMode=false;

let dragId=null;

