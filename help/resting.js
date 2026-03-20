function onPlayerAttemptOpenChest(myId, x, y, z, ismoon) {
    const [xBig, xSmall, yStart, zStart] = [16, 46, 7, -45]
    function getPlayerChestPos(plrNum, isBig) {
        let output = []
        if (isBig) {
            for (let yOffset = 0; yOffset < 3; yOffset++) {
                for (let zOffset = 0; zOffset < 3; zOffset++) {
                    output.push([xBig, yStart + 4 * (plrNum % 3) + yOffset, zStart - 4 * Math.floor(plrNum / 3) - zOffset])
                }
            }
        } else {
            for (let yOffset = 0; yOffset < 3; yOffset++) {
                output.push([xSmall, yStart + 4 * (plrNum % 3) + yOffset, zStart - 4 * Math.floor(plrNum / 3) - 1])
            }
        }
        return output
    }
    function warning(id) {
        api.kickPlayer(id, "Suspicious Action Detected! Don't steal storage!")
        api.broadcastMessage(api.getEntityName(id) + " is trying to steal storage!\nPlz take a screenshot and report at boxim", { color: "red" })
        return "preventOpen"
    }
    if ((x === xBig || x === xSmall) && y >= yStart && y <= yStart + 10) {
        const plrName = api.getEntityName(myId)
        if (typeof bigStorage === "undefined" || typeof smallStorage === "undefined") {
            return warning(myId)
        }
        if (bigStorage.has(plrName)) {
            let plrNum = bigStorage.get(plrName)
            for (let yOffset = 0; yOffset < 3; yOffset++) {
                for (let zOffset = 0; zOffset < 3; zOffset++) {
                    if (JSON.stringify([xBig, yStart + 4 * (plrNum % 3) + yOffset, zStart - 4 * Math.floor(plrNum / 3) - zOffset]) === JSON.stringify([x, y, z])) {
                        return true
                    }
                }
            }
            return warning(myId)
        } else if (smallStorage.has(plrName)) {
            let plrNum = smallStorage.get(plrName)
            for (let yOffset = 0; yOffset < 3; yOffset++) {
                for (let zOffset = 0; zOffset < 3; zOffset++) {
                    if (JSON.stringify([xSmall, yStart + 4 * (plrNum % 3) + yOffset, zStart - 4 * Math.floor(plrNum / 3) - zOffset]) === JSON.stringify([x, y, z])) {
                        return true
                    }
                }
            }
            return warning(myId)
        } else {
            return warning(myId)
        }
    }
}