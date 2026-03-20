function onPlayerAttemptOpenChest(id, x, y, z, isMC, isIC) {
    if (api.getEntitiesInRect([21, 7, -42], [40, 15, -78]).includes(id) && !isMC) {
        api.kickPlayer(id, "Suspicious Action Detected!")
    }
}