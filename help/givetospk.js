startingTick = api.now();
playerTimers = {}
musicDuration = 12000;
HackerMission = null;
playerEntries = {};
flashbangTimers = new Map();
molotovTimers = new Map();
molotovThrowers = new Map();
isSayText = 0;
playerKills = new Map();
bossId = -1
boss2Id = -1
isSpawningBoss = false
suspiciousPlayers = {};
nonTPPlayer = []
playerMusic = new Map();
activeLasers = {};
laserCooldowns = {};
activeCannons = {};
cannonCooldowns = {};
cannonEffectPlayers = {};
suspiciousClickers = {};
EMPTimers = new Map();
chestcd = []
functionDefined = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
storageCheck = new Map();
storageFind = new Map();

function onPlayerClick(playerId) {
    cuteSnAntiCheat3(playerId)
};

function onPlayerDamagingOtherPlayer(Id1, Id2, num, Item, bodyPartHit, damagerDbId) {
    cuteSnAntiCheat2(Id1, Id2, num, Item, bodyPartHit, damagerDbId)
    return cuteSnItemsAttackEffect(Id1, Id2, num, Item)
}

onPlayerKilledOtherPlayer = (attacker, victim, damageDealt, withItem) => {
    cuteSnAntiCheat1(attacker, victim, damageDealt, withItem)
}

function onPlayerAttemptAltAction(Id) {
    cuteSnItemsRightClickEffect(Id)
}

function onPlayerChat(pid, msg) {
    return cuteSnChatAll(pid, msg)
}

function onInventoryUpdated(playerId) {
    cuteSnIllegalItemsCheck(playerId)
    cuteSnCatAwardCheck(playerId)
}

function tick(ms) {
    cuteSnChatTips()
    cuteSnEscapeTimer()
    cuteSnChatSayText()
    cuteSnCustomProjectile()
    cuteSnMusic()
    cuteSnLaserEffect()
    cuteSnCannonEffect()
    cuteSnCannonCancelEffect()
    cuteSnTrailEffect()
    cuteSnStorageCheck()
    cuteSnStorageFind()
}

onPlayerJoin = (Id, reset) => {
    if (!reset) {
        if (!nonTPPlayer.includes(api.getEntityName(Id))) {
            api.setPosition(Id, 10.5, 20, 10.5)
            nonTPPlayer.push(api.getEntityName(Id))
        }
        playerMusic.set(Id, 0);
        api.setClientOption(Id, "music", "TownTheme")
        api.setClientOption(Id, 'canCraft', false)
        name = api.getEntityName(Id)
        api.broadcastMessage([{ str: "[服务器] ", style: { color: "gold" } }, { str: name, style: { color: "white" } }, { str: " 你好呀!", style: { color: "gold" } }])
    }
}
function onPlayerAttemptOpenChest(myId, x, y, z, ismoon) {
    cuteSnLootChest(myId, x, y, z, ismoon)
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
onPlayerKilledMob = (pId, mobId, damageDealt, withItem) => {
    cuteSnBossdrop(pId, mobId, damageDealt, withItem)
    return "preventDrop"
}

onPlayerDamagingMob = (pId, mobId, damageDealt, withItem) => {
    cuteSnBossHealthBar(pId, mobId, damageDealt, withItem)
}

onWorldAttemptSpawnMob = (mobType, x, y, z) => {
    if (isSpawningBoss) {
        return;
    }
    return "preventSpawn";
}
onPlayerAttemptSpawnMob = (playerId, mobType, x, y, z) => {
    cuteSnSpawnOrb(playerId, mobType, x, y, z)
    return "preventSpawn";
}

onPlayerLeave = (playerId, serverIsShuttingDown) => {
    playerKills.delete(playerId);
    playerMusic.delete(playerId);
    const playerDbId = api.getPlayerDbId(playerId);
    delete laserCooldowns[playerDbId];
    delete activeLasers[playerId];
    delete cannonCooldowns[playerDbId];
    delete activeCannons[playerId];
    delete cannonEffectPlayers[playerId];
    delete suspiciousClickers[playerDbId];
    storageCheck.delete(playerId);
    storageFind.delete(playerId);
};