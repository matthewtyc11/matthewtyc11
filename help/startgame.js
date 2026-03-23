if (functionDefined.indexOf(0) == -1) {
    api.setPosition(myId, 10.5, 20, 7.5)
    cuteSnInitializePlayer()
    if (playerMusic.get(myId) == 1) {
        playerMusic.set(myId, 0)
        api.setClientOption(myId, "music", "TownTheme")
    }
    if (BestPerson.includes(api.getPlayerDbId(myId))) {
        cuteSnOwnerCostume(myId)
    } else if (BestCoder.includes(api.getPlayerDbId(myId))) { bestCoderCostume(myId) }
} else {
    api.broadcastMessage("服务器初始化未完成，第" + (functionDefined.indexOf(0) + 1) + "个指令方块还没按.")
}