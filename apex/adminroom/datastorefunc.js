function saveData(t,b){api.setStandardChestItemSlot(chestPos,b,"Black Carpet",1,void 0,{customDisplayName:JSON.stringify(t)})}function loadData(t){let b=api.getStandardChestItemSlot(chestPos,t);return b&&b.attributes&&b.attributes.customDisplayName?JSON.parse(b.attributes.customDisplayName):null}chestPos=[0,0,0];
function loadAdminConsole(id) {
    api.configureShopCategoryForPlayer(id, "admin", {
        autoSelectCategory: true,
        customTitle: "Admin Tools",
        sortPriority: 200,
    })
    api.createShopItemForPlayer(id, "admin", "tp", {
        image: "tprequesticon.png",
        buyButtonText: "Tp",
        customTitle: "Tp without request",
        description: "Tp to this player",
        userInput: { type: "player" }
    });
    api.createShopItemForPlayer(id, "admin", "kill", {
        image: "selectPlayerIcon.png",
        buyButtonText: "Kill",
        customTitle: "Kill this player",
        description: "Die instantly",
        userInput: { type: "player" }
    })
    api.createShopItemForPlayer(id, "admin", "kick", {
        image: "selectPlayerIcon.png",
        buyButtonText: "Kick",
        customTitle: "Be kicked instantly",
        description: "Kick this player",
        userInput: { type: "player" }
    })
}