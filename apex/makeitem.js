const item = "Gold Spade";
const customDisplayName = "";
const customDescription = "";
const tier = 0

const customItem = api.giveItem(myId, item, 1, {
    customDisplayName: customDisplayName || undefined,
    customDescription: customDescription || undefined,
    customAttributes: {
        enchantmentTier: tier !== 0 ? "Tier " + tier : undefined
    }
});