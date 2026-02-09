let heldItem = api.getHeldItem(myId)
let amount = heldItem?.["amount"]
let value = heldItem?.["attributes"]["customDescription"]?.split(":")[1] * amount || 0
api.giveItem(myId, "Raw Gold", Math.floor(value / 99900))
api.giveItem(myId, "Gold Bar", Math.floor((value % 99900) / 100))
api.giveItem(myId, "Gold Coin", (value % 99900) % 100)
if (value) {
    api.setItemSlot(myId, api.getSelectedInventorySlotI(myId), "Air", 1)
}