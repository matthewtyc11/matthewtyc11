const tier = 1
let value = 0
for (let i = 0; i < 46; i++) {
    let item = api.getItemSlot(myId, i)
    let itemTier = item?.["attributes"]?.["customAttributes"]["enchantmentTier"]?.split(" ")[1] || 0
    if (itemTier === String(tier)) {
        let amount = item?.["amount"]
        value += item?.["attributes"]["customDescription"]?.split(":")[1] * amount || 0
    }
}
let needSlot = Math.ceil(Math.floor(value / 99900) / 999) + Math.ceil(Math.floor((value % 99900) / 100) / 999) + Math.ceil(((value % 99900) % 100) / 999)
if (value) {
    if (api.getInventoryFreeSlotCount(myId) > needSlot) {
        api.giveItem(myId, "Raw Gold", Math.floor(value / 99900))
        api.giveItem(myId, "Gold Bar", Math.floor((value % 99900) / 100))
        api.giveItem(myId, "Gold Coin", (value % 99900) % 100)
        for (let i = 0; i < 46; i++) {
            let item = api.getItemSlot(myId, i)
            let itemTier = item?.["attributes"]?.["customAttributes"]["enchantmentTier"]?.split(" ")[1] || 0
            if (itemTier === String(tier)) {
                api.setItemSlot(myId, i, "Air", 1)
            }
        }
    api.sendMessage(myId, "Sold all Tier " + String(tier) + " item for " + String(value))
    } else {
        api.sendMessage(myId, "Not enough space in your inventory")
    }
}
