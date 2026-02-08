const thisLvl = 1
const reward = 20
plrLevel = api.getMoonstoneChestItemSlot(playerId, 5)?.attributes?.customAttributes.enchantments.Level

if (plrLevel + 1 === thisLvl) {
    api.setMoonstoneChestItemSlot(playerId, 5, "Block of Emerald", 1, {
        customDisplayName: "Data Store",
        customDescription: "Stores user data",
        customAttributes: { enchantments: { Level: thisLvl } }
    })
    api.giveItem(playerId, "Gold Coin", reward)
    api.sendMessage(myId,"You got " + reward + " gold coin",{color:"lawngreen"})

} else if (plrLevel >= thisLvl) {
    api.sendMessage(myId,"You already claim this award!",{color:'red'})
} else { api.sendMessage(myId,"You skip level! Go back to lvl" + String(plrLevel+1) + "!",{color:"green"})}

plrLevel = api.getMoonstoneChestItemSlot(playerId, 5)?.attributes?.customAttributes.enchantments.Level

api.sendMessage(myId,"You are lvl" + String(plrLevel))
