isNewLobby = true
canSpawnBoss1 = false
boss1Reward = false
const admins = ["MattDragon64", "Chrishellnah", "CN_Coolwind", "Cantplaylol"]
const tpCmd = { "japan": [310, 2, -200], "adminroom": [-2, 5, 0], "oldlobby": [-127, 2, 138], "train": [-111, 9, 51], "boss": [41, 24, 82], "map1": [84, 2, 37] }
const cmdBlockStorePos = { itemProbability: [-7, 5, -7], itemAttributes: [-7, 5, -5] }
function onPlayerJoin(id) {
    if (!admins.includes(api.getEntityName(id))) {
        api.kickPlayer(id, "Lobby not open yet! You can join after the game is complete.")
    }
    const item = api.getMoonstoneChestItemSlot(id, 5)
    api.setMoonstoneChestItemSlot(id, 5, "Code Block", 1, {
        customDisplayName: "Data Store",
        customDescription: "Stores user data",
        customAttributes: {
            lastPosition: item?.attributes?.customAttributes?.lastPosition || [-268.5, 50, 412.5]
        }
    })
    if (isNewLobby) {
        api.setMoonstoneChestItemSlot(id, 5, "Code Block", 1, {
            customDisplayName: "Data Store",
            customDescription: "Stores user data",
            customAttributes: {
                lastPosition: api.getPosition(id)
            }
        })
        api.setPosition(id, 0.5, 5, 6.5)
        const floatText = [{ text: "Map 1", size: 200, height: 4, color: "#00FFFF", cord: [-307.5, 45, 400.5] },
        { text: "Shop", size: 200, height: 4, color: "#0000FF", cord: [-255.5, 44, 412.5] }]
        api.getMobIds().forEach(mob => {
            api.killLifeform(mob)
        });
        for (let i of floatText) {
            let wildcatId = api.attemptSpawnMob("Wildcat", i.cord[0], i.cord[1], i.cord[2], { spawnerId: api.getPlayerIds()[0] });
            api.scalePlayerMeshNodes(wildcatId, { "TorsoNode": [0, i.height, 0] });
            api.setTargetedPlayerSettingForEveryone(wildcatId, "nameTagInfo", {
                backgroundColor: "rgba(0,0,0,0)", content: [{
                    str: i.text, style:
                    {
                        fontSize: i.size + "px", color: i.color
                    }
                }]
            }, true);
            api.setMobSetting(wildcatId, "walkingSpeedMultiplier", 0); api.setMobSetting(wildcatId, "idleSound", null);
        }
    }
}
function playerCommand(id, cmd) {
    if (!admins.includes(api.getEntityName(id))) {
        return
    }
    let parts = cmd.split(" ")
    if (parts[0] === "effect") {
        api.applyEffect(id, parts[1], null, { inbuiltLevel: Number(parts[2]) })
    } else if (parts[0] === "killallmob") {
        api.getMobIds().forEach(mob => {
            api.killLifeform(mob)
        });
    } else if (parts[0] === "kill") {
        api.killLifeform(api.getPlayerId(parts[[1]]))
    } else if (parts[0] === "adminarmour") {
        const armours = ["Diamond Helmet", "Diamond Chestplate", "Diamond Leggings", "Diamond Boots", "Diamond Gauntlets"]
        armours.forEach(armour => {
            api.giveItem(id, armour, 1, {
                customDisplayName: "Tier 6",
                customDescription: "Admin level armour",
                customAttributes: {
                    enchantmentTier: "Tier 5",
                    enchantments: {
                        "Health": 1000000, "Health Regen": 1000000
                    }
                }
            })
        })

    } else if (parts[0] === "giveblock") {
        let camPos = api.getPlayerFacingInfo(id).camPos
        let dir = api.getPlayerFacingInfo(id).dir

        let out = api.raycastForBlock(camPos, dir)
        api.giveItem(id, api.blockIdToBlockName(out.blockID))

    } else if (parts[0] === "tpp") {
        api.setPosition(id, tpCmd[parts[1]])
    } else if (parts[0] === "tpinfo") {
        api.log(Object.keys(tpCmd))
    }
}


api.setCallbackValueFallback("onWorldAttemptSpawnMob", "preventSpawn")

const cdTimeInMs = 10000
const blockNameToTier = { "Red Concrete Slab": 5, "Gray Concrete Slab": 1, "Blue Concrete Slab": 2, "Purple Concrete Slab": 3, "Orange Concrete Slab": 4 }
const configOfChest = []
chestOpenedTime = {}
const lobbyCord = [-268.5, 50, 412.5]
function tpLobby(id) {
    api.setPosition(id, lobbyCord)
}
function getMobNames() {
    let mobNames = []
    for (let id of api.getMobIds()) {
        mobNames.push(api.getEntityType(id))
    }
    return mobNames
}
function setChest(x, y, z, tier) {
    function clearChest() {
        for (let i = 0; i < 36; i++) {
            api.setStandardChestItemSlot([x, y, z], i, "Air")
        }
    }

    reward = []
    for (let item in itemProbability[Number(tier)]) {
        let prob = itemProbability[Number(tier)][item]
        if (Math.random() < prob) {
            reward.push(item)
        }

    }
    api.log(reward)
    clearChest()
    for (let i = 0; i < reward.length; i++) {
        api.setStandardChestItemSlot([x, y, z], i, reward[i], 1, undefined, {
            customDisplayName: itemAttributes[reward[i]][0],
            customDescription: "Value:" + itemAttributes[reward[i]][1],
            customAttributes: {
                enchantmentTier: "Tier " + itemAttributes[reward[i]][2]
            }
        })
    }
}
function onPlayerAttemptOpenChest(id, x, y, z, isMc, isIc) {
    let tierOfChest = blockNameToTier[api.getBlock(x, y + 1, z)]
    if (tierOfChest != undefined & !isMc & !isIc) {
        if ([x, y, z] in chestOpenedTime) {
            let lastOpen = chestOpenedTime[[x, y, z]]
            if (lastOpen + cdTimeInMs <= api.now()) {
                api.sendMessage(id, "You opened a Tier " + String(tierOfChest) + "chest")
                chestOpenedTime[[x, y, z]] = api.now()
                setChest(x, y, z, tierOfChest)
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
function tick() {
    if (api.now() >= lastSec + 400 && getMobNames().includes("Draugr Knight")) {
        lastSec = api.now()
        let plrIds = api.getPlayerIds()
        for (let id of plrIds) {
            let plrPos = api.getPosition(id)
            if (plrPos[0] >= 31 && plrPos[0] <= 43 && plrPos[2] >= 72 && plrPos[2] <= 92 && plrPos[1] >= 24 && plrPos[1] <= 28) {
                sendBossHealthBar(id, api.getHealth(bossId), 2000, "Draugr Knight", "🟩", "🟥", 500)
            }
        }
    }
    /*
    if (!isNewLobby) {
        for (let id of api.getPlayerIds()) {
            if (api.getMoonstoneChestItemSlot(id, 5).attributes.customAttributes.lastPosition !== api.getPosition(id))
                api.setMoonstoneChestItemSlot(id, 5, "Code Block", 1, {
                    customDisplayName: "Data Store",
                    customDescription: "Stores user data",
                    customAttributes: {
                        lastPosition: api.getPosition(id) || [-268.5, 50, 412.5]
                    }
                })
        }
    }*/
}
function onPlayerAttemptAltAction(id) {

    if (api.getHeldItem(id)?.name == "Gold Spade" && api.getHeldItem(id)?.attributes.customDisplayName == "Totem Of Undying" && api.getEffects(id).includes("Totem") == false) {
        /* ---apply totem effect--- */
        api.applyEffect(id, "Totem", null, { icon: "Gold Spade" })
        slot = api.getSelectedInventorySlotI(id)
        api.setItemSlot(id, slot, "Air")
    }
}
function onPlayerDamagingOtherPlayer(attacker, victim, dmg) {

    if (api.getHeldItem(victim)?.attributes.customDisplayName === "Totem Of Undying" && api.getHealth(victim) - dmg < 5 || api.getEffects(victim).includes('Totem')
        && api.getHealth(victim) - dmg < 5) {
        totemWork(victim)
    }
}

function onMobDamagingPlayer(attacker, victim, dmg) {

    if (api.getHeldItem(victim)?.attributes.customDisplayName === "Totem Of Undying" && api.getHealth(victim) - dmg < 5 || api.getEffects(victim).includes('Totem')
        && api.getHealth(victim) - dmg < 5) {
        totemWork(victim)
    }
}

onPlayerFinishChargingItem = (id, isUsed, item) => {
    if (isUsed && item === "Apple") {

        api.applyEffect(id, "Health Regen", 20000, { inbuiltLevel: 25 })
        api.applyEffect(id, "Damage", 15000, { inbuiltLevel: 50 })
        api.applyEffect(id, "Damage Reduction", 10000, { inbuiltLevel: 30 })
        api.setShieldAmount(id, 100)
        const oldHealth = api.getHealth(id)
        if (oldHealth < 700) {
            api.setHealth(id, oldHealth + 200, undefined, true)
        }
    }
}