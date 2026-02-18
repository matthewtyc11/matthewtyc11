//first door
draugrSpawnConfirm
api.setPosition(myId, 65.5, 24, 82.5)
api.applyEffect(myId, "Slowness", null, { inbuiltLevel: 5 })

//second door
if (api.getPosition(myId)[0] > 44.5) {
    api.setPosition(myId, 41.5, 24, 82.5)
    api.sendMessage(myId, "Once the boss spawned, you can't leave this room!")
    api.getMobIds().forEach(mob => {
        if (api.getEntityType(mob) === "Draugr Knight") {
            api.killLifeform(mob)
        }
    })
} else if (!getMobNames().includes("Draugr Knight")) {
    api.setPosition(myId, 71.5, 24, 82.5)
}
