if (isNewLobby) {
    function totemWork(victim) {
        const pos = api.getPosition(victim);
        api.applyEffect(victim, 'Health Regen', 5000, { inbuiltLevel: 1 });
        api.applyEffect(victim, "Heat Resistance", 10000, { inbuiltLevel: 1 })
        api.applyEffect(victim, "Damage Reduction", 5000, { inbuiltLevel: 1 })
        api.setHealth(victim, 30)
        api.setShieldAmount(victim, 30);
        particle(pos[0], pos[1], pos[2]);
        if (api.getHeldItem(victim)?.attributes.customDisplayName === "Totem Of Undying") {
            slot = api.getSelectedInventorySlotI(victim)
            api.setItemSlot(victim, slot, "Air")
        }
        else { api.removeEffect(victim, 'Totem'); }
    }

    function particle(x, y, z) {
        y += 1;
        api.playParticleEffect({
            dir1: [-1, -1, -1], dir2: [1, 1, 1],
            pos1: [x + 2, y + 1.5, z + 2], pos2: [x - 2, y - 1.5, z - 2],
            texture: "glint",
            minLifeTime: 0.5, maxLifeTime: 2,
            minEmitPower: 4, maxEmitPower: 6,
            minSize: 0.1, maxSize: 0.5,
            manualEmitCount: 85,
            gravity: [0, -10, 0],
            colorGradients: [{ timeFraction: 0, minColor: [211, 214, 0, 0.5], maxColor: [0, 255, 0, 0.8] }],
            velocityGradients: [{ timeFraction: 1, factor: 0.2, factor2: 1 }],
            blendMode: 1
        });
    }
    function sendBossHealthBar(playerId, currentHp, maxHp, name, activeBar, deadBar, timeInMs) {
        let green = Math.floor(currentHp / maxHp * 16)
        if (currentHp > 0 && green === 0) green = 1
        let red = 16 - green
        let healthBar = ""
        for (let i = 0; i < 16; i++) {
            if (i < green) healthBar += activeBar
            else healthBar += deadBar
        }
        api.sendFlyingMiddleMessage(playerId, [{
            str: "                           [" + name + "]",
            style: {
                color: "#FF4444"
            }
        },
        {
            str: "\n" + healthBar,
            style: {
                color: "#FF4444"
            }
        },
        {
            str: `\n                            (${currentHp}/${maxHp})\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n `,
            style: {
                color: "#DE8C18"
            }
        }
        ], 0, timeInMs)
    }
    function getMobNames() {
        let mobNames = []
        api.getMobIds().forEach(id => {
            mobNames.push(api.getEntityType(id))
        })
        return mobNames
    }

    function setChest(x, y, z, tier) {
        function clearChest() {
            for (let i = 0; i < 36; i++) {
                api.setStandardChestItemSlot([x, y, z], i, "Air")
            }
        }

        reward = []
        for (let item in itemProbability[Number(tier)]) {
            let prob = itemProbability[Number(tier)][item]
            if (Math.random() < prob) {
                reward.push(item)
            }

        }
        api.log(reward)
        clearChest()
        for (let i = 0; i < reward.length; i++) {
            api.setStandardChestItemSlot([x, y, z], i, reward[i], 1, undefined, {
                customDisplayName: itemAttributes[reward[i]][0],
                customDescription: "Value:" + itemAttributes[reward[i]][1],
                customAttributes: {
                    enchantmentTier: "Tier " + itemAttributes[reward[i]][2]
                }
            })
        }
    }
    const cmdBlockStorePos = { itemProbability: [-7, 5, -7], itemAttributes: [-7, 5, -5] }
    for (let key in cmdBlockStorePos) {
        let dictItem = cmdBlockStorePos[key]
        let text = api.getBlockData(dictItem[0], dictItem[1], dictItem[2]).persisted.shared.text
        eval(key + " = " + text)
    }
    const floatText = [{ text: "Map 1", size: 200, height: 4, color: "#00FFFF", cord: [-307.5, 45, 400.5] },
    { text: "Shop", size: 200, height: 4, color: "#0000FF", cord: [-255.5, 44, 412.5] }, { text: "Map 2", size: 200, height: 4, color: "#FF0000", cord: [-308.5, 45, 406.5] }]
    api.getMobIds().forEach(mob => {
        api.killLifeform(mob)
    });
    for (let i of floatText) {
        let wildcatId = api.attemptSpawnMob("Wildcat", i.cord[0], i.cord[1], i.cord[2], { spawnerId: api.getPlayerIds()[0] });
        api.scalePlayerMeshNodes(wildcatId, { "TorsoNode": [0, i.height, 0] });
        api.setTargetedPlayerSettingForEveryone(wildcatId, "nameTagInfo", {
            backgroundColor: "rgba(0,0,0,0)", content: [{
                str: i.text, style:
                {
                    fontSize: i.size + "px", color: i.color
                }
            }]
        }, true);
        api.setMobSetting(wildcatId, "walkingSpeedMultiplier", 0); api.setMobSetting(wildcatId, "idleSound", null);
    }
    isInside = (a, b, p) => p.every((v, i) => v >= Math.min(a[i], b[i]) && v <= Math.max(a[i], b[i]));

    isNewLobby = false
    for (let id of api.getPlayerIds()) {
        api.setClientOption(id, "invincible", false)
        let lastPos = api.getMoonstoneChestItemSlot(id, 5).attributes.customAttributes.lastPosition
        api.setPosition(id, lastPos)
        if (isInside([-186, 499], [-358, 327], [lastPos[0], lastPos[2]])) {
            api.applyEffect(id, "Speed", null, { inbuiltLevel: 3 })
        }
    }
} else {
    api.setClientOption(myId, "invincible", false)
    let lastPos = api.getMoonstoneChestItemSlot(myId, 5).attributes.customAttributes.lastPosition
    api.setPosition(myId, lastPos)
    if (isInside([-186, 499], [-358, 327], [lastPos[0], lastPos[2]])) {
        api.applyEffect(myId, "Speed", null, { inbuiltLevel: 3 })
    }
}