canSpawnBoss1 = false
boss1Reward = false
admins = ["MattDragon64", "Chrishellnah", "CN_Coolwind", "Cantplaylol", "Shine_Star_Light"]
betaPlayers = ["PoliteCowboy7327349"]
lobbyOpen = false
const cmdBlockStorePos = { itemProbability: [-7, 5, -7], itemAttributes: [-7, 5, -5] }
tpCmd = { "japan": [310, 2, -200], "adminroom": [-2, 5, 0], "oldlobby": [-127, 2, 138], "train": [-111, 9, 51], "boss": [41, 24, 82], "map1": [84, 2, 37], "storage": [0, -10, 0], "spawn": [-268.5, 50, 412.5], "shop": [-255, 46, 412], "lobby outside": [-284, 46, 412], "map3": [400, 1, 630] }
const cdTimeInMs = 120000
const blockNameToTier = { "Red Concrete Slab": 5, "Gray Concrete Slab": 1, "Blue Concrete Slab": 2, "Purple Concrete Slab": 3, "Orange Concrete Slab": 4 }
const configOfChest = []
chestOpenedTime = {}
const lobbyCord = [-268.5, 50, 412.5]
function onPlayerJoin(id) {
    if (lobbyOpen || admins.includes(api.getEntityName(id)) || betaPlayers.includes(api.getEntityName(id))) {
        api.kickPlayer(id, "Lobby not open yet! You can join after the game is complete.")
    }
    api.broadcastMessage([{ str: "[Bloxd-Loot-Fight] ", style: { color: "gold" } }, { str: api.getEntityName(id), style: { color: "Cyan" } }, { str: " Hi!", style: { color: "Lime" } }])
    api.setClientOption(id, "canCraft", false)
    const item = api.getMoonstoneChestItemSlot(id, 5)
    api.setMoonstoneChestItemSlot(id, 5, "Code Block", 1, {
        customDisplayName: "Data Store",
        customDescription: "Stores user data",
        customAttributes: {
            lastPosition: item?.attributes?.customAttributes?.lastPosition || [-268.5, 50, 412.5]
        }
    })

    api.setClientOption(id, "invincible", false)
    if (admins.includes(api.getEntityName(id))) {
        loadAdminConsole(id)
        loadTpConsole(id)
    }
    try { api.getPlayerIds().forEach(plrId => api.setCantPickUpItem(plrId, itemId1)) } catch { }
    try { api.getPlayerIds().forEach(plrId => api.setCantPickUpItem(plrId, itemId2)) } catch { }
}
function onPlayerChat(id, cmd) {
    let parts = cmd.split(" ")
    if (parts[0] === "!lobby" && api.getPosition(id)[1] < -8) {
        api.setPosition(id, 0, -10, 0)
    }
    if (parts[0] === "!room") {
        let myRoom = loadData(0).data[api.getPlayerDbId(id)]
        if (parts[1] === undefined) {
            if (myRoom) {
                api.sendMessage(id, "The room you own:\n" + myRoom)
                return false
            } else {
                api.sendMessage(id, "You don't have any room.")
                return false
            }
        }
        if (myRoom && myRoom.length > 1) {
            if (myRoom.includes(Number(parts[1]))) {
                let data = loadData(0)
                data.roomChoose[api.getPlayerDbId(id)] = Number(parts[1])
                saveData(data, 0)
            } else {
                api.sendMessage(id, "You do not own this room.\nThe room you own\n" + myRoom, { color: "red" })
            }
        } else {
            api.sendMessage(id, "You need to own at least 2 storage room.")
        }
    }
    if (cmd[0] === "!") {
        return false
    }
}
function playerCommand(id, cmd) {
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

function onPlayerAttemptOpenChest(id, x, y, z, isMc, isIc) {
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
    if (CL.isRunning) { return }
    if (api.now() >= lastSec + 400 && getMobNames().includes("Draugr Knight")) {
        lastSec = api.now()
        let plrIds = api.getPlayerIds()
        for (let id of plrIds) {
            let plrPos = api.getPosition(id)
            if (plrPos[0] >= 31 && plrPos[0] <= 43 && plrPos[2] >= 72 && plrPos[2] <= 92 && plrPos[1] >= 24 && plrPos[1] <= 28) {
                sendBossHealthBar(id, api.getHealth(bossId), 3000, "Draugr Knight", "🟩", "🟥", 500)
            }
        }
    }
    for (let plr of api.getPlayerIds()) {
        if (isInsideLobby(api.getPosition(plr)) && !api.getEffects(plr).includes("Speed")) {
            api.applyEffect(plr, "Speed", null, { inbuiltLevel: 5 })
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
function onPlayerAttemptAltAction(id) {
    if (api.getHeldItem(id)?.name == "Gold Spade" && api.getHeldItem(id)?.attributes.customDisplayName == "Totem Of Undying" && api.getEffects(id).includes("Totem") == false) {
        /* ---apply totem effect--- */
        api.applyEffect(id, "Totem", null, { icon: "Gold Spade" })
        slot = api.getSelectedInventorySlotI(id)
        api.setItemSlot(id, slot, "Air")
    }
}
function onPlayerDamagingOtherPlayer(attacker, victim, dmg, item) {
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

function onMobDamagingPlayer(attacker, victim, dmg) {
    if (api.getHeldItem(victim)?.attributes.customDisplayName === "Totem Of Undying" && api.getHealth(victim) - dmg < 5 || api.getEffects(victim).includes('Totem')
        && api.getHealth(victim) - dmg < 5) {
        totemWork(victim)
    }
}

function onPlayerKilledMob(id, mobId) {
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
function onPlayerLeave(id) {
    delete swordEffectCd[id]
}