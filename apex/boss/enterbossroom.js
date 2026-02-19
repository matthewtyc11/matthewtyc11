//first door
api.setPosition(myId, 65.5, 24, 82.5)
api.applyEffect(myId, "Slowness", null, { inbuiltLevel: 5 })

//second door
const inRoom = api.getPlayerIds().some(id => {
    const [x, y, z] = api.getPosition(id);
    return x >= 30 && x <= 44 && y >= 24 && y <= 28 && z >= 72 && z <= 93;
});
if (api.getPosition(myId)[0] > 44.5) {
    if (inRoom) {
        api.sendMessage(myId, "Some one is in the boss room.")
    } else {
        api.setPosition(myId, 41.5, 24, 82.5)
        api.sendMessage(myId, "Once the boss spawned, you can't leave this room!")
        canSpawnBoss1 = true
        boss1Reward = false
        api.getMobIds().forEach(mob => {
            if (api.getEntityType(mob) === "Draugr Knight") {
                api.killLifeform(mob)
            }
        })
    }
} else if (!getMobNames().includes("Draugr Knight")) {
    api.setPosition(myId, 71.5, 24, 82.5)
}
