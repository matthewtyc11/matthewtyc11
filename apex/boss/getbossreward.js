if (!getMobNames().includes("Draugr Knight") && boss1Reward) {
    boss1Reward = false
    api.giveItem(myId, "Red Wool", 1, {
        customDisplayName: "Map 2 Loot room KEY",
        customDescription: "Enter Loot room in Map 2"
    })
}