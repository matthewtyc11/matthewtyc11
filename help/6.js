function cuteSnIllegalItemsCheck(playerId){
	for(const item of notallowed) {
        if(api.getInventoryItemAmount(playerId, item) > 0 && !BestPerson.includes(api.getPlayerDbId(playerId))){
            api.removeItemName(playerId, item, api.getInventoryItemAmount(playerId, item))
			name = api.getEntityName(playerId)
            api.broadcastMessage(name+cuteSnChinese04[0]+item+cuteSnChinese04[1], { color: "red" })
	    }
	}
	if (api.getHeldItem(playerId)?.attributes.customDisplayName == "医用医疗装置" && api.getHeldItem(playerId)?.attributes?.customAttributes?.enchantmentTier === "Tier 3" && api.getHeldItem(playerId)?.name=="Apple") {
		const selectedSlot = api.getSelectedInventorySlotI(playerId);  
		api.setItemSlot(playerId, selectedSlot, "Air");
		api.broadcastMessage(api.getEntityName(playerId)+cuteSnChinese04[10], { color: "red" })
	}
}
functionDefined[5] = 1
void 0;