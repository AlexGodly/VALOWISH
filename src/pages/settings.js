/** VALOWISH v14 • src/pages/settings.js • browser-native source (no build step) */
function renderSettings(){topUser.textContent=(db.name||'PLAYER').toUpperCase();topVp.textContent=money(db.vp);vpInput.value=db.vp;nameInput.value=db.name||'';rpSelect.value=db.rarityPrices.Select;rpDeluxe.value=db.rarityPrices.Deluxe;rpPremium.value=db.rarityPrices.Premium;rpExclusive.value=db.rarityPrices.Exclusive;rpUltra.value=db.rarityPrices.Ultra;if(profileEmail&&cloudUser)profileEmail.value=cloudUser.email||'';renderAuthState()}

