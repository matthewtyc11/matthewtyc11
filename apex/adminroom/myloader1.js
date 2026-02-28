chestPos = [0,0,0]
function saveData(data, slot) {
    api.setStandardChestItemSlot(chestPos, slot, "Black Carpet", 1, undefined, {
        customDisplayName: JSON.stringify(data)
    });
}
function loadData(slot) {
    let data = api.getStandardChestItemSlot(chestPos, slot);
    if (!data || !data.attributes || !data.attributes.customDisplayName) { return null; }
    return JSON.parse(data.attributes.customDisplayName);
}
api.broadcastMessage("Game Started",{color:"green"})