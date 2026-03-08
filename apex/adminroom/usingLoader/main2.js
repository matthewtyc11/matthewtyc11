//load and save data function
admins = ["MattDragon64", "Chrishellnah", "CN_Coolwind", "Cantplaylol", "Shine_Star_Light"]
tpCmd = { "japan": [310, 2, -200], "adminroom": [-2, 5, 0], "oldlobby": [-127, 2, 138], "train": [-111, 9, 51], "boss": [41, 24, 82], "map1": [84, 2, 37], "storage": [0, -10, 0], "spawn": [-268.5, 50, 412.5], "shop": [-255, 46, 412], "lobby outside": [-284, 46, 412], "map3": [400, 1, 630] }
eval(api.getBlockData(-7, 5, -1).persisted.shared.text)
//call when totem work
function totemWork(victim) {
    const pos = api.getPosition(victim);
    api.applyEffect(victim, 'Health Regen', 5000, { inbuiltLevel: 1 });
    api.applyEffect(victim, "Heat Resistance", 10000, { inbuiltLevel: 1 })
    api.applyEffect(victim, "Damage Reduction", 5000, { inbuiltLevel: 1 })
    api.setHealth(victim, 30)
    api.setShieldAmount(victim, 30);
    particle(pos[0], pos[1], pos[2]);
    if (api.getHeldItem(victim)?.attributes.customDisplayName === "Totem Of Undying") {
        slot = api.getSelectedInventorySlotI(victim)
        api.setItemSlot(victim, slot, "Air")
    }
    else { api.removeEffect(victim, 'Totem'); }
}
function particle(x, y, z) {
    y += 1;
    api.playParticleEffect({
        dir1: [-1, -1, -1], dir2: [1, 1, 1],
        pos1: [x + 2, y + 1.5, z + 2], pos2: [x - 2, y - 1.5, z - 2],
        texture: "glint",
        minLifeTime: 0.5, maxLifeTime: 2,
        minEmitPower: 4, maxEmitPower: 6,
        minSize: 0.1, maxSize: 0.5,
        manualEmitCount: 85,
        gravity: [0, -10, 0],
        colorGradients: [{ timeFraction: 0, minColor: [211, 214, 0, 0.5], maxColor: [0, 255, 0, 0.8] }],
        velocityGradients: [{ timeFraction: 1, factor: 0.2, factor2: 1 }],
        blendMode: 1
    });
}
//boss hp bar
function sendBossHealthBar(playerId, currentHp, maxHp, name, activeBar, deadBar, timeInMs) {
    let green = Math.floor(currentHp / maxHp * 16)
    if (currentHp > 0 && green === 0) green = 1
    let red = 16 - green
    let healthBar = ""
    for (let i = 0; i < 16; i++) {
        if (i < green) healthBar += activeBar
        else healthBar += deadBar
    }
    api.sendFlyingMiddleMessage(playerId, [{
        str: "                           [" + name + "]",
        style: {
            color: "#FF4444"
        }
    },
    {
        str: "\n" + healthBar,
        style: {
            color: "#FF4444"
        }
    },
    {
        str: `\n                            (${currentHp}/${maxHp})\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n `,
        style: {
            color: "#DE8C18"
        }
    }
    ], 0, timeInMs)
}
function getMobNames() {
    let mobNames = []
    api.getMobIds().forEach(id => {
        mobNames.push(api.getEntityType(id))
    })
    return mobNames
}
let guns = ["M1911", "MP40", "AK-47", "M16", "AWP", "Double Barrel"]
let gunMaxAmmo = [16, 300, 300, 300, 80, 100]
let gunProb = [[0.3, 0.05, 0.05, 0.05, 0, 0],
[0, 0.2, 0.2, 0.2, 0.05, 0.05],
[0, 0, 0, 0, 0.5, 0.5],
[0.5, 0, 0.3, 0, 0, 1],
[0, 0, 0.2, 0, 0.2, 1]]
function setChest(x, y, z, tier) {
    function clearChest() {
        for (let i = 0; i < 36; i++) {
            api.setStandardChestItemSlot([x, y, z], i, "Air")
        }
    }
    let reward = []
    for (let item in itemProbability[tier]) {
        let prob = itemProbability[tier][item]
        if (Math.random() < prob) {
            reward.push(item)
        }
    }
    for (let i = 0; i < gunProb[tier - 1].length; i++) {
        if (Math.random() < gunProb[tier - 1][i]) {
            reward.push(guns[i])
            break
        }
    }
    for (let i = reward.length; i < 36; i++) { reward.push("Air") }
    reward.sort(() => Math.random() - .5)
    clearChest()
    for (let i = 0; i < reward.length; i++) {
        if (reward[i] === "Air") { continue } else if (guns.includes(reward[i])) {
            api.setStandardChestItemSlot([x, y, z], i, reward[i], 1, undefined, {
                customAttributes: { shotsLeft: gunMaxAmmo[guns.indexOf(reward[i])] }
            })
            continue
        }
        api.setStandardChestItemSlot([x, y, z], i, reward[i], 1, undefined, {
            customDisplayName: itemAttributes[reward[i]][0],
            customDescription: "Value:" + itemAttributes[reward[i]][1],
            customAttributes: {
                enchantmentTier: "Tier " + itemAttributes[reward[i]][2]
            }
        })
    }
}

const cmdBlockStorePos = { itemProbability: [-7, 5, -7], itemAttributes: [-7, 5, -5], floatText: [-7, 5, -3] }
for (let key in cmdBlockStorePos) {
    let dictItem = cmdBlockStorePos[key]
    let text = api.getBlockData(dictItem[0], dictItem[1], dictItem[2]).persisted.shared.text
    eval(key + " = " + text)
}
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
function loadAdminConsole(id) {
    api.configureShopCategoryForPlayer(id, "admin", {
        autoSelectCategory: true,
        customTitle: "Admin Tools",
        sortPriority: 200,
    })
    api.createShopItemForPlayer(id, "admin", "tp", {
        image: "tprequesticon.png",
        buyButtonText: "Tp",
        customTitle: "Tp without request",
        description: "Tp to this player",
        userInput: { type: "player" }
    });
    api.createShopItemForPlayer(id, "admin", "kill", {
        image: "selectPlayerIcon.png",
        buyButtonText: "Kill",
        customTitle: "Kill this player",
        description: "Die instantly",
        userInput: { type: "player" }
    })
    api.createShopItemForPlayer(id, "admin", "kick", {
        image: "selectPlayerIcon.png",
        buyButtonText: "Kick",
        customTitle: "Be kicked instantly",
        description: "Kick this player",
        userInput: { type: "player" }
    })
    api.createShopItemForPlayer(id, "admin", "tphere", {
        image: "selectPlayerIcon.png",
        buyButtonText: "Tp here",
        customTitle: "Tp player to you",
        description: "Tp to you instantly",
        userInput: { type: "player" }
    })
}
function loadTpConsole(id) {
    api.configureShopCategoryForPlayer(id, 'tp', {
        autoSelectCategory: true,
        customTitle: 'Warp',
        sortPriority: 200,
    });
    for (const place in tpCmd) {
        api.createShopItemForPlayer(id, 'tp', place, {
            image: 'tprequesticon.png',
            buyButtonText: "TP",
            customTitle: place,
            description: "Tp to here"
        });
    }
}
function plrCommandFunc(id, cmd) {
    let parts = cmd.split(" ")
    if (!admins.includes(api.getEntityName(id))) {
        return
    }
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
isInside = (a, b, p) => p.every((v, i) => v >= Math.min(a[i], b[i]) && v <= Math.max(a[i], b[i]));
isInsideLobby = (plrPos) => (isInside([-186, 499], [-358, 327], [plrPos[0], plrPos[2]]) || plrPos[1] < -8);
buyRoomCd = api.now()
for (let id of api.getPlayerIds()) {
    api.setClientOption(id, "invincible", false)
    let lastPos = api.getMoonstoneChestItemSlot(id, 5).attributes.customAttributes.lastPosition
    api.setPosition(id, lastPos)
    if (admins.includes(api.getEntityName(id))) {
        loadAdminConsole(id)
        loadTpConsole(id)
    }
}
