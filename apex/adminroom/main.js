isNewLobby = true
canSpawnBoss1 = false
boss1Reward = false
admins = ["MattDragon64", "Chrishellnah", "CN_Coolwind", "Cantplaylol", "Shine_Star_Light"]
betaPlayers = ["PoliteCowboy7327349", "Y_KILL_ME_O3O_87", 'Handsomedragonnn']
lobbyOpen = true
const cmdBlockStorePos = { itemProbability: [-7, 5, -7], itemAttributes: [-7, 5, -5] }
tpCmd = { "japan": [310, 2, -200], "adminroom": [-2, 5, 0], "oldlobby": [-127, 2, 138], "train": [-111, 9, 51], "boss": [41, 24, 82], "map1": [84, 2, 37], "storage": [0, -10, 0], "spawn": [-268.5, 50, 412.5], "shop": [-255, 46, 412], "lobby outside": [-284, 46, 412], "map3": [400, 1, 630], "map4": [432, 1, 993] }
const cdTimeInMs = 120000
const blockNameToTier = { "Red Concrete Slab": 5, "Gray Concrete Slab": 1, "Blue Concrete Slab": 2, "Purple Concrete Slab": 3, "Orange Concrete Slab": 4 }
const configOfChest = []
chestOpenedTime = {}
const lobbyCord = [-268.5, 50, 412.5]
onPlayerJoin = (id) => {
    if (!(lobbyOpen || admins.includes(api.getEntityName(id)) || betaPlayers.includes(api.getEntityName(id)))) {
        api.kickPlayer(id, "Lobby not open yet! You can join after the game is complete.")
    }
    api.broadcastMessage([{ str: "[Bloxd-Loot-Fight] ", style: { color: "gold" } }, { str: api.getEntityName(id), style: { color: "Cyan" } }, { str: " Hi!", style: { color: "Lime" } }])
    api.setClientOption(id, "canCraft", false)
    if (api.isInsideRect(api.getPosition(id), [-320, 61, 386], [-312, 54, 380])) {
        api.setPosition(id, -315.5, 46, 383.5)
    }
    const item = api.getMoonstoneChestItemSlot(id, 5)
    api.setMoonstoneChestItemSlot(id, 5, "Code Block", 1, {
        customDisplayName: "Data Store",
        customDescription: "Stores user data",
        customAttributes: {
            lastPosition: item?.attributes?.customAttributes?.lastPosition || [-268.5, 50, 412.5]
        }
    })
    if (!isNewLobby) {
        api.setClientOption(id, "invincible", false)
        if (admins.includes(api.getEntityName(id))) {
            loadAdminConsole(id)
            loadTpConsole(id)
        }
        try { api.getPlayerIds().forEach(plrId => api.setCantPickUpItem(plrId, itemId1)) } catch { }
        try { api.getPlayerIds().forEach(plrId => api.setCantPickUpItem(plrId, itemId2)) } catch { }
    }
    if (isNewLobby) {
        api.setClientOption(id, "invincible", true)
        let plrPos = api.getPosition(id)
        if (!(plrPos[0] < 2 && plrPos[0] > -1 && plrPos[1] < 7 && plrPos[1] >= 5 && plrPos[2] < 8 && plrPos[2] > 5))
            api.setMoonstoneChestItemSlot(id, 5, "Code Block", 1, {
                customDisplayName: "Data Store",
                customDescription: "Stores user data",
                customAttributes: {
                    lastPosition: api.getPosition(id)
                }
            })
        api.setPosition(id, 0.5, 5, 6.5)
    }
}
onPlayerChat = (id, cmd) => {
    if (isNewLobby) { return }
    return plrChatFunc(id, cmd)
    if (cmd[0] === "!") { return false }
}
playerCommand = (id, cmd) => {
    if (isNewLobby) { return }
    plrCommandFunc(id, cmd)
}


api.setCallbackValueFallback("onWorldAttemptSpawnMob", "preventSpawn")
function tpLobby(id) {
    api.setPosition(id, lobbyCord)
}

onPlayerMoveInvenItem = (playerId, fromIdx, toStartIdx, toEndIdx, amt) => {
    if (api.getItemSlot(playerId, fromIdx).attributes.customDisplayName === "Data Store") {
        return "preventChange"
    }
}
onPlayerDropItem = (playerId, x, y, z, itemName, itemAmount, fromIdx) => {
    if (api.getItemSlot(playerId, fromIdx).attributes.customDisplayName === "Data Store") {
        return "preventDrop"
    }
}

onPlayerAttemptOpenChest = (id, x, y, z, isMc, isIc) => {
    let tierOfChest = blockNameToTier[api.getBlock(x, y + 1, z)]
    if (tierOfChest != undefined & !isMc & !isIc) {
        if ([x, y, z] in chestOpenedTime) {
            let lastOpen = chestOpenedTime[[x, y, z]]
            if (lastOpen + cdTimeInMs <= api.now()) {
                api.sendMessage(id, "You opened a Tier " + String(tierOfChest) + " chest")
                chestOpenedTime[[x, y, z]] = api.now()
                setChest(x, y, z, tierOfChest, id)
            } else {
                api.sendMessage(id, "Chest in Cd")
            }
        } else {

            api.sendMessage(id, "You opened a Tier" + String(tierOfChest) + " chest")
            chestOpenedTime[[x, y, z]] = api.now()
            setChest(x, y, z, tierOfChest)
        }
    }
}
const allowMobs = ["Wildcat", "Draugr Knight"]

onWorldAttemptDespawnMob = (id) => {
    if (!allowMobs.includes(api.getEntityName(id))) {
        return "preventDespawn"
    }
}

let lastSec = api.now()
let lastPlayerCount = 0;
let itemId1
let itemId2
let spawnItemCd = api.now()
tick = () => {
    if (api.now() >= lastSec + 400 && !isNewLobby && getMobNames().includes("Draugr Knight")) {
        lastSec = api.now()
        let plrIds = api.getPlayerIds()
        for (let id of plrIds) {
            let plrPos = api.getPosition(id)
            if (plrPos[0] >= 31 && plrPos[0] <= 43 && plrPos[2] >= 72 && plrPos[2] <= 92 && plrPos[1] >= 24 && plrPos[1] <= 28) {
                sendBossHealthBar(id, api.getHealth(bossId), 3000, "Draugr Knight", "🟩", "🟥", 500)
            }
        }
    }
    if (!isNewLobby) {
        for (let plr of api.getPlayerIds()) {
            if (isInsideLobby(api.getPosition(plr)) && !api.getEffects(plr).includes("Speed")) {
                api.applyEffect(plr, "Speed", null, { inbuiltLevel: 5 })
            }
        }
    }
    if (api.now() > spawnItemCd + 200) {
        const currentPlayers = api.getEntitiesInRect([-249, 54, 402], [-255, 47, 395]).length
        if (currentPlayers > lastPlayerCount) {
            try { api.deleteItemDrop(itemId1) } catch { }
            try { api.deleteItemDrop(itemId2) } catch { }
            itemId1 = api.createItemDrop(-247.5, 48, 397.5, "Moonstone Axe", 1, false, { customAttributes: { "enchantmentTier": "Tier 5" } })
            itemId2 = api.createItemDrop(-255.5, 48, 397.5, "Knight Sword", 1, false, { customAttributes: { "enchantmentTier": "Tier 5" } })
            api.getPlayerIds().forEach(plrId => api.setCantPickUpItem(plrId, itemId1))
            api.getPlayerIds().forEach(plrId => api.setCantPickUpItem(plrId, itemId2))
            lastPlayerCount = currentPlayers
        } else {
            lastPlayerCount = api.getEntitiesInRect([-249, 54, 402], [-255, 47, 395]).length
        }
        spawnItemCd = api.now()
    }
}
onPlayerAttemptAltAction = (id) => {
    if (api.getHeldItem(id)?.name == "Gold Spade" && api.getHeldItem(id)?.attributes.customDisplayName == "Totem Of Undying" && api.getEffects(id).includes("Totem") == false) {
        /* ---apply totem effect--- */
        api.applyEffect(id, "Totem", null, { icon: "Gold Spade" })
        slot = api.getSelectedInventorySlotI(id)
        api.setItemSlot(id, slot, "Air")
    }
}
onPlayerDamagingOtherPlayer = (attacker, victim, dmg, item) => {
    if (item.split(" ")[1] === "Spikes") {
        return api.getHealth(victim) * 0.1 + 35
    }
    if (api.getHeldItem(victim)?.attributes.customDisplayName === "Totem Of Undying" && api.getHealth(victim) - dmg < 5 || api.getEffects(victim).includes('Totem')
        && api.getHealth(victim) - dmg < 5) {
        totemWork(victim)
    }
    if (api.getHeldItem(attacker)?.attributes.customDisplayName === "Dragon Axe") {
        api.applyEffect(victim, "Blindness", 3000, {})
        api.applyEffect(victim, "Weakness", 5000, { inbuiltLevel: 2 })
    }
}

onMobDamagingPlayer = (attacker, victim, dmg) => {
    if (api.getHeldItem(victim)?.attributes.customDisplayName === "Totem Of Undying" && api.getHealth(victim) - dmg < 5 || api.getEffects(victim).includes('Totem')
        && api.getHealth(victim) - dmg < 5) {
        totemWork(victim)
    }
}

onPlayerKilledMob = (id, mobId) => {
    if (api.getEntityType(mobId) === "Draugr Knight") {
        return "preventDrop"
    }
}

onPlayerFinishChargingItem = (id, isUsed, item) => {
    if (isUsed && item === "Apple") {
        api.applyEffect(id, "Health Regen", 15000, { inbuiltLevel: 15 })
        api.applyEffect(id, "Damage", 15000, { inbuiltLevel: 30 })
        api.applyEffect(id, "Damage Reduction", 10000, { inbuiltLevel: 20 })
        api.setShieldAmount(id, 100)
        const oldHealth = api.getHealth(id)
        if (oldHealth < 700) {
            api.setHealth(id, oldHealth + 100, undefined, true)
        }
    }
}
onPlayerBoughtShopItem = (id, categoryKey, itemKey, item, textInput) => {
    if (categoryKey === "tp") {
        api.setPosition(id, tpCmd[itemKey])
    }
    if (categoryKey === "admin") {
        if (itemKey === "tp") {
            api.setPosition(id, api.getPosition(textInput))
        } else if (itemKey === "kill") {
            api.killLifeform(textInput, id)
        } else if (itemKey === "kick") {
            api.kickPlayer(textInput, "Admin kick you!")
        } else if (itemKey === "tphere") {
            api.setPosition(textInput, api.getPosition(id))
        }
    }
};
let swordEffectCd = {}
function onPlayerAltAction(id) {
    if ((swordEffectCd?.[id] ?? 0) < api.now() - 2000) {
        if (api.getHeldItem(id)?.attributes.customDisplayName === 'Dragon Sword') {
            api.applyEffect(id, "Damage", 5000, { inbuiltLevel: 20 })
            api.applyEffect(id, "Speed", 5000, { inbuiltLevel: 3 })
            api.applyEffect(id, "Damage Reduction", 5000, { inbuiltLevel: 15 })
            swordEffectCd[id] = api.now()
        } else if (api.getHeldItem(id)?.attributes.customDisplayName === "Dragon Axe") {
            api.applyEffect(id, "Speed", 3000, { inbuiltLevel: 2 })
            api.applyEffect(id, "Damage", 5000, { inbuiltLevel: 35 })
            api.applyEffect(id, "Damage Reduction", 5000, { inbuiltLevel: 25 })
            api.applyEffect(id, "Blindness", 1000, {})
            swordEffectCd[id] = api.now()
        }
    }
}
//black jack
bjRoom = {
    1: {
        bet: 8,
        playerHands: { 1: [], 2: [] },
        dealerHand: [],
        shoes: [],
        gameStarted: false,
        handPlaying: 1,
        doubled: { 1: false, 2: false },
        id: null
    },
    2: {
        bet: 8,
        playerHands: { 1: [], 2: [] },
        dealerHand: [],
        shoes: [],
        gameStarted: false,
        handPlaying: 1,
        doubled: { 1: false, 2: false },
        id: null
    }
};

function onPlayerLeave(id) {
    delete swordEffectCd[id];
    [1, 2].forEach(i => {
        if (bjRoom[i].id === id) {
            bjRoom[i].id = null
        }
    })
}
const notAllowed = ["Moonstone Explosive", "RPG", "Super RPG", "Grenade Launcher", "Moonstone Remote Explosive", "Bouncy Bomb", "Lucky Block", "Ultra Lucky Block"];
let playerStates = {}; // id -> { active: bool, timer: number }

onInventoryUpdated = (playerId) => {
    for (const item of notAllowed) {
        if (
            api.getInventoryItemAmount(playerId, item) > 0 &&
            !admins.includes(api.getEntityName(playerId))
        ) {
            api.removeItemName(
                playerId,
                item,
                api.getInventoryItemAmount(playerId, item)
            );
            let name = api.getEntityName(playerId);
            let warning = `${name},「${item}」that's too dangerous, I'll help u keep it`;
            api.broadcastMessage(warning, { color: "Gold" });
        }
    }
};
