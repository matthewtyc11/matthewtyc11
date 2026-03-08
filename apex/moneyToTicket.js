let rawGold = api.getInventoryItemAmount(myId, "Raw Gold")
let goldBar = api.getInventoryItemAmount(myId, "Gold Bar")
let goldCoin = api.getInventoryItemAmount(myId, "Gold Coin")
let moneyPlrHave = rawGold * 99900 + goldBar * 100 + goldCoin
const costs = 50000
if (moneyPlrHave >= costs) {
    if (api.getInventoryFreeSlotCount(myId) >= 1) {
        api.removeItemName(myId, "Raw Gold", rawGold)
        api.removeItemName(myId, "Gold Bar", goldBar)
        api.removeItemName(myId, "Gold Coin", goldCoin)
        moneyPlrHave -= costs
        api.giveItem(myId, "Raw Gold", Math.floor(moneyPlrHave / 99900))
        api.giveItem(myId, "Gold Bar", Math.floor((moneyPlrHave % 99900) / 100))
        api.giveItem(myId, "Gold Coin", (moneyPlrHave % 99900) % 100)
        api.giveItem(myId, "Rainbow Banner", 1)
    } else {
        api.sendMessage(myId, "You don't have enough space in your inventory")
    }
} else {
    api.sendMessage(myId, "You don't have enough money to buy", { color: "gold" })
}