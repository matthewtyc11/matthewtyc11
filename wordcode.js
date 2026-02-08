const admins = ["MattDragon64", "Chrishellnah"]
const banned = ["PWPH"]
const levelCord = { 1: [-77, -5, 0], 2: [-50, -5, 0], 3: [-34, 1, -20], 4: [-43, 15, -10], 5: [-23, 18, -6], 6: [-29, 25, 1] }
function playerCommand(id, command) {
    let parts = command.split(" ");
    if (parts[0] === "give" & admins.includes(api.getEntityName(id))) {
        if (!isNaN(parts[parts.length - 1])) {
            let item = parts.slice(1, parts.length - 1).join(" ")
            api.giveItem(id, item, Number(parts[parts.length - 1]))
        } else {
            let item = parts.slice(1).join(" ")
            api.giveItem(id, item)
        }
    }
    else if (parts[0] === "reset") {
        api.setPosition(id, -92, -13, -25)
        api.setMoonstoneChestItemSlot(id, 5, "Block of Emerald", 1, {
            customDisplayName: "Data Store",
            customDescription: "Stores user data",
            customAttributes: { enchantments: { Level: 0 } }
        })
    } else if (parts[0] === "gm" & admins.includes(api.getEntityName(id))) {

    } else if (parts[0] === "level") {
        plrLevel = api.getMoonstoneChestItemSlot(id, 5)?.attributes?.customAttributes.enchantments.Level
        if (parts[1] <= plrLevel) {
            api.setPosition(id, levelCord[parts[1]])
        } else { api.sendMessage(id, "You are not there!", { color: "red" }) }
    } else if (parts[0] === "kill" & admins.includes(api.getEntityName(id))) {
        api.killLifeform(api.getPlayerId(parts[[1]]))
    } else if (parts[0] === "kicks" & admins.includes(api.getEntityName(id))) {
        api.kickPlayer(api.getPlayerId(parts[1]), "For no reason")
    } else if (parts[0] === "setlevel" & admins.includes(api.getEntityName(id))) {
        if (parts[2]) {
            api.setMoonstoneChestItemSlot(api.getPlayerId(parts[2]), 5, "Block of Emerald", 1, {
                customDisplayName: "Data Store",
                customDescription: "Stores user data",
                customAttributes: { enchantments: { Level: Number(parts[1]) } }
            })
        } else {
            api.setMoonstoneChestItemSlot(id, 5, "Block of Emerald", 1, {
                customDisplayName: "Data Store",
                customDescription: "Stores user data",
                customAttributes: { enchantments: { Level: Number(parts[1]) } }
            })
        }
    }
}
function onBlockStand(id, x, y, z, blockName) {
    if (blockName === "Orange Portal") {
        api.setPosition(id, -93, -13, -28)
    }

}


function tick() {
    let plrs = api.getPlayerIds()
    for (let plr of plrs) {
        let blockStanding = api.getBlockTypesPlayerStandingOn(plr)
        if (blockStanding.includes("Block of Diamond") & api.getEffects(plr)[0] === undefined) {
            api.applyEffect(plr, "Speed", null, {})
        } else if (api.getEffects(plr)[0] === "Speed" & !blockStanding.includes("Block of Diamond") & blockStanding.length != 0) {
            api.log(api.now())
            api.removeEffect(plr, "Speed")
        }
    }
}

api.setCallbackValueFallback("onPlayerDropItem", "preventDrop")

onPlayerJoin = id => {
    let playerName = api.getEntityName(id)
    if (banned.includes(playerName)) {
        api.kickPlayer(id, "You are banned")
    }
    api.setClientOption(id, "secsToRespawn", 0)
    api.setClientOption(id, "autoRespawn", true)
    api.sendTopRightHelper(id, "star", playerName + ", nice to join", { color: "yellow", duration: 5, height: 100, width: 300, fontSize: "20px" })
    api.broadcastMessage(playerName + " Welcome", { color: "yellow" })
    api.setClientOption(id, "invincible", false)
    //api.removeItemCraftingRecipes(playerId, null)
    api.setClientOption(id, "canCraft", false)

    const item = api.getMoonstoneChestItemSlot(id, 5)


    api.setMoonstoneChestItemSlot(id, 5, "Block of Emerald", 1, {
        customDisplayName: "Data Store",
        customDescription: "Stores user data",
        customAttributes: {
            enchantments: {
                Level: item?.attributes?.customAttributes?.enchantments?.Level || 0
            }
        }
    })
    // REMOVE IF BROKEN
}

onPlayerMoveInvenItem = (playerId, fromIdx, toStartIdx, toEndIdx, amt) => {
    if (api.getItemSlot(playerId, fromIdx)["name"] === "Block of Emerald") {
        return "preventChange"
    }
}
onPlayerDropItem = (playerId, x, y, z, itemName, itemAmount, fromIdx) => {
    if (itemName === "Block of Emerald") {
        return "preventDrop"
    }
}

onPlayerAttemptAltAction = (playerId, x, y, z, block, targetEId) => {
    if (block.includes("Trapdoor")) return "preventAction";
}

