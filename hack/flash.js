function cuteSnSpawnOrb(playerId, mobType, x, y, z) {
    if (mobType === "Draugr Skeleton") {
        const nearbyEntities = api.getEntitiesInRect(
            [x - 5, y - 5, z - 5],
            [x + 5, y + 5, z + 5]
        );
        for (const entityId of nearbyEntities) {
            if (api.getEntityType(entityId) === "Player") {
                api.setClientOption(entityId, 'cameraTint', [1, 1, 1, 1])
                api.applyEffect(entityId, "Flashbang", 3000, { icon: "Snow", displayName: cuteSnChinese07[0] })
                flashbangTimers.set(entityId, api.now() + 3000);
            }
        }
    }
    if (mobType === "Gorilla") {
        api.playParticleEffect({
            texture: "generic_2",
            pos1: [x - 3, y, z - 3],
            pos2: [x + 3, y + 5, z + 3],
            minLifeTime: 2.0,
            maxLifeTime: 4.0,
            minEmitPower: 0.5,
            maxEmitPower: 2.0,
            minSize: 1.5,
            maxSize: 2.1,
            manualEmitCount: 2000,
            gravity: [0, -0.5, 0],
            dir1: [-1, 0, -1],
            dir2: [1, 1, 1],
            colorGradients: [{
                timeFraction: 0,
                minColor: [128, 128, 128, 0.8],
                maxColor: [160, 160, 160, 0.6]
            }],
            velocityGradients: [{
                timeFraction: 0,
                factor: 0.3,
                factor2: 0.8
            }],
            blendMode: 1
        });
    }
    if (mobType === "Wildcat") {
        api.playParticleEffect({
            texture: "generic_2",
            pos1: [x - 3, y, z - 3],
            pos2: [x + 3, y + 0.2, z + 3],
            minLifeTime: 4.5,
            maxLifeTime: 5.0,
            minEmitPower: 0,
            maxEmitPower: 0.2,
            minSize: 0.3,
            maxSize: 0.8,
            manualEmitCount: 1000,
            gravity: [0, -0.2, 0],
            dir1: [-2, -1, -2],
            dir2: [2, 1.5, 2],
            colorGradients: [{
                timeFraction: 0,
                minColor: [255, 0, 0, 0.9],
                maxColor: [255, 140, 0, 0.7]
            }, {
                timeFraction: 0.5,
                minColor: [220, 20, 60, 0.8],
                maxColor: [255, 69, 0, 0.6]
            }],
            velocityGradients: [{
                timeFraction: 0,
                factor: 1.2,
                factor2: 2.0
            }],
            blendMode: 1
        });
        const nearbyEntities = api.getEntitiesInRect([x - 3, y - 2, z - 3], [x + 3, y + 3, z + 3]);
        for (const entityId of nearbyEntities) {
            if (api.getEntityType(entityId) === "Player") {
                const endTime = api.now() + 10000;
                molotovTimers.set(entityId, endTime);
                molotovThrowers.set(entityId, playerId);
                api.applyEffect(entityId, "Burning", 10000, { icon: "Patterned Red Glass", displayName: cuteSnChinese07[1] })
                api.setClientOption(entityId, 'cameraTint', [1, 0, 0, 0.2]);
            }
        }
    }
    if (mobType === "Draugr Warper") {
        const nearbyEntities = api.getEntitiesInRect(
            [x - 5, y - 5, z - 5],
            [x + 5, y + 5, z + 5]
        );
        api.playParticleEffect({
            texture: "generic_2",
            pos1: [x, y, z],
            pos2: [x, y, z],
            minLifeTime: 1.0,
            maxLifeTime: 2.0,
            minEmitPower: 2,
            maxEmitPower: 5,
            minSize: 0.3,
            maxSize: 0.8,
            manualEmitCount: 250,
            gravity: [0, -5, 0],
            dir1: [-2, -1, -2],
            dir2: [2, 3, 2],
            colorGradients: [
                { timeFraction: 0, minColor: [255, 255, 255, 1], maxColor: [224, 255, 255, 0.9] },
                { timeFraction: 0.25, minColor: [0, 255, 255, 0.9], maxColor: [173, 216, 230, 0.8] },
                { timeFraction: 0.5, minColor: [135, 206, 235, 0.8], maxColor: [0, 191, 255, 0.7] },
                { timeFraction: 0.75, minColor: [30, 144, 255, 0.7], maxColor: [0, 0, 139, 0.6] }
            ],
            velocityGradients: [
                { timeFraction: 0, factor: 1.5, factor2: 2.0 },
                { timeFraction: 1, factor: 0.2, factor2: 0.3 }
            ],
            blendMode: 1
        });
        for (const entityId of nearbyEntities) {
            if (api.getEntityType(entityId) === "Player") {
                const playerPos = api.getPosition(entityId);
                const playerOffsetY = playerPos[1] + 1;
                const dx = playerPos[0] - x;
                const dy = playerOffsetY - y;
                const dz = playerPos[2] - z;
                const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
                if (distance > 0) {
                    const knockbackForce = Math.max(0, 25 - distance * 3);
                    const normalizedDx = (dx / distance) * knockbackForce;
                    const normalizedDy = (dy / distance) * knockbackForce + 5;
                    const normalizedDz = (dz / distance) * knockbackForce;

                    api.applyImpulse(entityId, normalizedDx, normalizedDy, normalizedDz);
                }
            }
        }
    }
    if (mobType === "Draugr Reaver") {
        const nearbyEntities = api.getEntitiesInRect(
            [x - 5, y - 5, z - 5],
            [x + 5, y + 5, z + 5]
        );
        api.playParticleEffect({
            texture: "z-particle",
            pos1: [x, y, z],
            pos2: [x, y, z],
            minLifeTime: 1.5,
            maxLifeTime: 2.5,
            minEmitPower: 2,
            maxEmitPower: 4,
            minSize: 0.1,
            maxSize: 0.4,
            manualEmitCount: 200,
            gravity: [0, 0, 0],
            dir1: [-1, -1, -1],
            dir2: [1, 1, 1],
            colorGradients: [
                { timeFraction: 0, minColor: [200, 200, 255, 1], maxColor: [255, 255, 255, 1] },
                { timeFraction: 0.3, minColor: [150, 150, 255, 0.9], maxColor: [200, 200, 255, 0.8] },
                { timeFraction: 0.6, minColor: [100, 100, 255, 0.7], maxColor: [150, 150, 255, 0.6] },
                { timeFraction: 1, minColor: [50, 50, 200, 0.3], maxColor: [100, 100, 200, 0.2] }
            ],
            velocityGradients: [
                { timeFraction: 0, factor: 1.5, factor2: 1.5 },
                { timeFraction: 0.5, factor: 0.75, factor2: 0.75 },
                { timeFraction: 1, factor: 0.2, factor2: 0.2 }
            ],
            blendMode: 1
        });
        for (const entityId of nearbyEntities) {
            if (api.getEntityType(entityId) === "Player") {
                api.applyEffect(entityId, "EMP", 10000, { icon: "Custom Lobby Block", displayName: cuteSnChinese07[2] })
                EMPTimers.set(entityId, api.now() + 10000);
            }
        }
    }
};

function cuteSnCustomProjectile() {
    for (const [playerId, endTime] of flashbangTimers.entries()) {
        if (!api.checkValid(playerId)) {
            flashbangTimers.delete(playerId);
            continue;
        }
        if (api.now() >= endTime) {
            api.setClientOption(playerId, 'cameraTint', null);
            flashbangTimers.delete(playerId);
        }
    }
    for (const [playerId, endTime] of molotovTimers.entries()) {
        if (!api.checkValid(playerId)) {
            molotovTimers.delete(playerId);
            molotovThrowers.delete(playerId);
            continue;
        }
        if (api.now() >= endTime) {
            api.setClientOption(playerId, 'cameraTint', null);
            api.removeEffect(playerId, "Burning");
            molotovTimers.delete(playerId);
            molotovThrowers.delete(playerId);
            continue;
        }
        if (Math.floor(api.now() / 50) % 20 === 0) {
            const throwerId = molotovThrowers.get(playerId);
            if (!api.checkValid(throwerId)) {
                api.setClientOption(playerId, 'cameraTint', null);
                api.removeEffect(playerId, "Burning");
                molotovTimers.delete(playerId);
                molotovThrowers.delete(playerId);
                continue;
            }
            try {
                api.applyHealthChange(playerId, -10, throwerId);
            } catch (error) {
            }
        }
    }
    for (const [playerId, endTime] of EMPTimers.entries()) {
        if (!api.checkValid(playerId)) {
            EMPTimers.delete(playerId);
            continue;
        }
        if (api.now() >= endTime) {
            EMPTimers.delete(playerId);
        }
    }
}
functionDefined[10] = 1
void 0;