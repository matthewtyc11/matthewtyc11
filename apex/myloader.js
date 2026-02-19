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
    y += 1
    api.playParticleEffect({
        dir1: [-1, -1, -1],
        dir2: [1, 1, 1],
        pos1: [x + 2, y + 1.5, z + 2],
        pos2: [x - 2, y - 1.5, z - 2],
        texture: "glint",
        minLifeTime: 0.5,
        maxLifeTime: 2,
        minEmitPower: 4,
        maxEmitPower: 6,
        minSize: 0.1,
        maxSize: 0.5,
        manualEmitCount: 85,
        gravity: [0, -10, 0],
        colorGradients: [
            {
                timeFraction: 0,
                minColor: [211, 214, 0, 0.5],
                maxColor: [0, 255, 0, 0.8],
            },
        ],
        velocityGradients: [
            {
                timeFraction: 1,
                factor: 0.2,
                factor2: 1,
            },
        ],
        blendMode: 1,
    })
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

const cmdBlockStorePos = { itemProbability: [-7, 5, -7], itemAttributes: [-7, 5, -5] }
for (let key in cmdBlockStorePos) {
    let dictItem = cmdBlockStorePos[key]
    let text = api.getBlockData(dictItem[0], dictItem[1], dictItem[2]).persisted.shared.text
    eval(key + " = " + text)
}

isNewLobby = false
api.setPosition(myId, api.getMoonstoneChestItemSlot(myId, 5).attributes.customAttributes.lastPosition)