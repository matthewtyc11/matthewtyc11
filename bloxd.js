api.setCallbackValueFallback("onPlayerDamagingOtherPlayer", "preventDamage")
api.setCallbackValueFallback("onPlayerDropItem", "preventDrop")

onPlayerJoin = playerId => {


    api.setClientOption(playerId, "skyBox", "interstellar")
    //api.removeItemCraftingRecipes(playerId, null)
    api.setClientOption(playerId, "canCraft", false)

    const item = api.getMoonstoneChestItemSlot(playerId, 5)


    api.setMoonstoneChestItemSlot(playerId, 5, "Block of Emerald", 1, {
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
    if (block.includes("Trapdoor")) return "preventAction"
}

