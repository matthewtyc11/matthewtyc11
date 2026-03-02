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
onPlayerBoughtShopItem = (id, categoryKey, itemKey, item, textInput) => {
    if (categoryKey === "admin") {
        if (itemKey === "tp") {
            api.setPosition(id, api.getPosition(textInput))
        } else if (itemKey === "kill") {
            api.killLifeform(textInput, id)
        } else if (itemKey === "kick") {
            api.kickPlayer(textInput, "Admin kick you!")
        }
    }
};