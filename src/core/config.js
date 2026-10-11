/** VALOWISH v14 • src/core/config.js • browser-native source (no build step) */
const API='https://valorant-api.com/v1/weapons';

const GUNS=['All Weapons','Classic','Shorty','Frenzy','Ghost','Sheriff','Stinger','Spectre','Bucky','Judge','Bulldog','Guardian','Phantom','Vandal','Marshal','Operator','Ares','Odin','Melee'];

const KEY='valowish_v14';

const LEGACY_KEY='valowish_v13';
const LEGACY_KEY_V12='valowish_v12';

const LEGACY_KEY_V11='valowish_v11';

const LEGACY_KEY_V10='valowish_v10';

const LEGACY_KEY_V9='valowish_v9';

const LEGACY_KEY_V8='valowish_v8';

const LEGACY_KEY_V61='valowish_v61';

const LEGACY_KEY_V6='valowish_v6';

const LEGACY_KEY_V3='valowish_v2';

const SUPABASE_URL='https://nbmcwhsxyvpmriyeozvh.supabase.co';

const SUPABASE_PUBLISHABLE_KEY='sb_publishable_ViOtA4xlEHtICam3vvOkbQ_6K_vnjfI';

const CLOUD_READY=!SUPABASE_URL.startsWith('YOUR_')&&!SUPABASE_PUBLISHABLE_KEY.startsWith('YOUR_');

let sb = null; // Cloud SDK is loaded asynchronously after the UI starts.

