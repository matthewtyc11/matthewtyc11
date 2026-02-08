//Dungeons by __player___ 
//most of the code is hidden so you aint stealing the code for  
//the custom stuff I made
//on a side note this is 3 months of work so thank you for playing this
//typing this while I work on the new commands system
//if this game ever dies I'm quiting
//tysm for the support so far tho
authorizedPlayers = ["__player___", "Khat", "Sodium_11", "Sousu"];
authorised = ["Arthur", "SUStreason", ...authorizedPlayers];
allowedJoin = false;
playerIds = [];
levelInput = [];
lbInput = [];
plbInput = [];
buyAmt = [];
trade = {};
tradestats = {};
tradereq = {}

traderoom = { 1: { 1: [184.5, 112, -88.5], 2: [184.5, 112, -95.5] }, 2: { 1: [172.5, 112, -88.5], 2: [172.5, 112, -95.5] }, 3: { 1: [156.5, 112, -88.5], 2: [156.5, 112, -95.5] }, 4: { 1: [144.5, 112, -88.5], 2: [144.5, 112, -95.5] } }
traderoomrect = { 1: { 1: [188, 112, -87], 2: [180, 115, -98] }, 2: { 1: [176, 115, -87], 2: [168, 112, -98] }, 3: { 1: [152, 112, -98], 2: [160, 115, -87] }, 4: { 1: [148, 112, -87], 2: [140, 115, -98] } }
initialisation = 0;
worldInitalised = false
checkAccess = e => {
    if (!(authorizedPlayers.includes(api.getEntityName(e)))) throw new Error("You aren't allowed to do that!")
}

function applyUmbralDamageBonus(attackerId, damage) {
    const stats = calculateUmbralStats(attackerId)
    if (stats.dmg > 0) {
        damage = Math.floor(damage * (1 + stats.dmg))
    }
    return damage
}
api.setCallbackValueFallback("onPlayerAttemptOpenChest", "preventOpen")
api.setCallbackValueFallback("onPlayerDamagingOtherPlayer", "preventDamage")
api.setCallbackValueFallback("onPlayerDropItem", "preventDrop")
const bannedItems = ["Grass Block", "Dirt", "Messy Stone", "Grass", "Updraft", "Snowdash", "Mango", "Mango Block", "AK-47", "AWP", "Kill Spikes", "Artisan Axe", "Minigun", "Wood Spikes", "Super RPG"]
function removeIllegals(id) {
    const plrname = api.getEntityName(id)
    const allowedplayers = ["Sousu", "__player___", "Infinxty", "Khat"]
    if (allowedplayers.includes(plrname)) { return; } else {
        for (const bannedItem of bannedItems) {
            if (api.hasItem(id, bannedItem)) {
                const banAmount = api.getInventoryItemAmount(id, bannedItem);
                api.sendMessage(id, "Banned Item Detected: " + bannedItem, { color: "red" });
                api.removeItemName(id, bannedItem, banAmount);
            }
        }
    }
}

onPlayerJoin = playerId => {
    removeIllegals(playerId)
    /*
    if(api.getPlayerDbId(playerId)=== "-Jhd8rbOLC9Sg_T3H5vp7"){
    api.kickPlayer(playerId, "you are not authorised to enter dungeons")
    api.setClientOption(playerId,"secsToRespawn",99999999999999999999999999)
    api.setHealth(playerId, 0)
    }
    */
    const dat = api.getMoonstoneChestItemSlot(playerId, 5)?.attributes?.customAttributes?.enchantments || {};
    if ((Object.keys(dat).includes('banned') && dat.banned) || api.getPlayerDbId(playerId) === "awR6M1wG8L8GPmcGKnWwk") {
        api.kickPlayer(playerId, "You are banned for breaking Dungeons' rules.\nAppeal in bit" + '.' + "ly/bloxd-dungeons-discord");
    }

    devLobby = (api.getLobbyName() === "world610326")
    if (!allowedJoin && devLobby && !authorised.includes(api.getEntityName(playerId))) {
        api.kickPlayer(playerId, "you are not authorised to enter dungeons test world")
        api.setClientOption(playerId, "secsToRespawn", 99999999999999999999999999)
    }
    api.setClientOption(playerId, "skyBox", "interstellar")
    //api.removeItemCraftingRecipes(playerId, null)
    api.setClientOption(playerId, "canCraft", false)
    for (let slot = 0; slot < 46; slot++) {
        const item = api.getItemSlot(playerId, slot);
        if (item && item.name === "Fireball Block" && (!item.attributes || !item.attributes.customDisplayName)) {
            api.setItemSlot(playerId, slot, "Air");
        }
    }
    for (let slot = 0; slot < 36; slot++) {
        const item = api.getMoonstoneChestItemSlot(playerId, slot);
        if (item && item.name === "Fireball Block" && (!item.attributes || !item.attributes.customDisplayName)) {
            api.setMoonstoneChestItemSlot(playerId, slot, "Air");
        }
    }
    playerIds.push(playerId)
    levelInput.push(0)
    lbInput.push(0)
    plbInput.push(0)
    buyAmt.push(1)
    api.setClientOption(playerId, "maxAuraLevel", 2500)
    api.sendMessage(playerId, "Welcome to the dungeon game, Enter an elevator to begin a game!")

    if (initialisation === 0) api.setPosition(playerId, 37.5, 102, -14.5);
    else if (initialisation === 1) api.setPosition(playerId, 37.5, 97, -14.5);
    else api.setPosition(playerId, 220.5, 121, -79.5);
    const item = api.getMoonstoneChestItemSlot(playerId, 5)
    if (item?.attributes?.customAttributes?.enchantments?.Aura !== undefined) {
        api.setTotalAura(playerId, item.attributes.customAttributes.enchantments.Aura)
    };
    let totalAura = api.getAuraInfo(playerId)?.totalAura || 0
    api.setMoonstoneChestItemSlot(playerId, 5, "Block of Emerald", 1, {
        customDisplayName: "Data Store",
        customDescription: "Stores user data",
        customAttributes: {
            enchantments: {
                Version: 1,
                Aura: Math.round(totalAura),
                D1: item?.attributes?.customAttributes?.enchantments?.D1 || 0,
                D2: item?.attributes?.customAttributes?.enchantments?.D2 || 0,
                D3: item?.attributes?.customAttributes?.enchantments?.D3 || 0,
                D4: item?.attributes?.customAttributes?.enchantments?.D4 || 0,
                claimed: item?.attributes?.customAttributes?.enchantments?.claimed || 0,
                banned: item?.attributes?.customAttributes?.enchantments?.banned || 0
            }
        }
    })
    // REMOVE IF BROKEN
}

onPlayerLeave = (playerId, serverIsShuttingDown) => {
    leave(playerId)
}

onPlayerDamagingOtherPlayer = (a, b, c, d, e, f) => {
    if (worldInitalised === false) return "preventDamage";
    else return playDmgPlay(a, b, c, d, e, f)
}
onMobDamagingPlayer = (r, s, t, u) => {
    return mobDmgPlay(r, s, t, u)
}

onAttemptKillPlayer = (killedPlayer, attackingLifeform) => {
    return attemptKillPlayer(killedPlayer, attackingLifeform)
}


onPlayerDamagingMob = (playerId, mobId, damage, withItem) => {
    damage = applyUmbralDamageBonus(playerId, damage)
    return playDmgMob(playerId, mobId, damage, withItem)
}
onPlayerMoveInvenItem = (playerId, fromIdx, toStartIdx, toEndIdx, amt) => {
    if (api.getItemSlot(playerId, fromIdx)["name"] === "Block of Emerald") {
        return "preventChange"
    }
}

onPlayerDropItem = (playerId, x, y, z, itemName, itemAmount, fromIdx) => {
    if (api.getItemSlot(playerId, fromIdx)["name"] === "Block of Emerald") {
        return "preventDrop"
    }
}

onPlayerAttemptOpenChest = (playerId, x, y, z, isMoonstoneChest) => {
    if (x === -5) return "preventOpen"
    if (worldInitalised === false) return "preventOpen"
    return attemptOpenChest(playerId, x, y, z, isMoonstoneChest)
}

tick = (ms) => {
    if (worldInitalised === true) ticks(ms)
}

onMobDamagingOtherMob = (attackingMob, damagedMob, damageDealt, withItem) => {
    if (attackingMob !== damagedMob) return "preventDamage"
}

onPlayerChat = (playerId, chatMessage, channelName) => {
    return chat(playerId, chatMessage, channelName)
}

onPlayerStartChargingItem = (playerId, itemName) => {
    return playerStartChargingItem(playerId, itemName)
}

onPlayerAttemptAltAction = (playerId, x, y, z, block, targetEId) => {
    if (block.includes("Trapdoor")) return "preventAction"
}


onPlayerKilledMob = (playerId, mobId, damageDealt, withItem) => {
    return playKilledMob(playerId, mobId, damageDealt, withItem)
}


attemptApplyDamage = (victimId, attackerId, damage, damageType) => {
    if (api.getEntityType(victimId) !== "Player") return damage
    const stats = calculateUmbralStats(victimId)
    const wearingUmbral = stats.hpPenalty > 0 || stats.dmg > 0
    if (!wearingUmbral) return damage
    const newDamage = Math.floor(damage * 0.30)

    return newDamage
}

playerCommand = (e, m) => {
    return cmd(e, m);
}

function onChestUpdated(id, isms) { if (isms) { removeIllegals(id) } }