const prob = 1
const tier = 1
const value = 1
const names = ""
const cord = [-9, 1, 14]
let item = api.getStandardChestItemSlot(cord, 0)
api.log(item)
api.setStandardChestItemSlot(cord, 0, item["name"], 1, undefined, {
    customDisplayName: names,
    customDescription: "Value:" + value + " Prob:" + prob,
    customAttributes: {
        enchantmentTier: "Tier " + tier
    }
})