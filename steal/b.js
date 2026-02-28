// ========== 全局变量 ==========
let lastBrokenTime = {};
let playerPositions = {};
let lastTickTime = 0;

// ========== 辅助函数 ==========
function getFallHeight(playerId) {
    const currentPos = api.getPosition(playerId);
    const currentY = currentPos[1];
    
    if (!playerPositions[playerId]) {
        playerPositions[playerId] = { y: currentY, time: Date.now() };
        return 0;
    }
    
    const lastY = playerPositions[playerId].y;
    const fallHeight = Math.max(0, lastY - currentY);
    
    playerPositions[playerId] = { y: currentY, time: Date.now() };
    
    return fallHeight;
}

// ========== 玩家伤害玩家 ==========
onPlayerDamagingOtherPlayer = (attackerId, targetId, damageAmount, itemName, bodyPart) => {
    try {
        const targetEffects = api.getEffects(targetId);
        const hasShield = targetEffects.includes("Shield");
        const isBroken = targetEffects.includes("Broken Shield");
        const isCrouching = api.isPlayerCrouching(targetId);
        const now = Date.now();
        const inCooldown = lastBrokenTime[targetId] && (now - lastBrokenTime[targetId] < 5000);

        // 普通格挡（有盾、未破、潜行、非斧头）
        if (hasShield && !isBroken && !inCooldown && isCrouching && !itemName.includes("Axe")) {
            api.broadcastSound("wood", 1, 1, { playerIdOrPos: attackerId });
            return "preventDamage";
        }

        // 斧头破盾
        if (hasShield && !isBroken && !inCooldown && isCrouching && itemName.includes("Axe")) {
            lastBrokenTime[targetId] = now;
            api.removeEffect(targetId, "Shield");
            api.applyEffect(targetId, "Broken Shield", 5000, {
                icon: "Iron Axe",
                displayName: "Shield Broken"
            });
            api.broadcastSound("cannonFire", 1, 20, { playerIdOrPos: attackerId });
            return "preventDamage";
        }

        // 重锤逻辑（无冷却，有粒子效果）
        const weapon = api.getHeldItem(attackerId);
        if (weapon?.attributes?.customDisplayName === "旋风重锤Mace" && 
            weapon?.attributes?.customDescription === "破碎吧") {
            
            const attackerPos = api.getPosition(attackerId);
            const currentY = attackerPos[1];
            
            // 空中检测
            //const isInAir = (currentY - Math.floor(currentY) > 0.01);
            
            //if (isInAir) {
                const fallHeight = getFallHeight(attackerId);
                
                //if (fallHeight < 0.5) {
                //    api.applyHealthChange(targetId, -20, attackerId);
                //    api.sendMessage(attackerId, "§c需要跳跃后下劈！");
                //    return "preventDamage";
                //}

                //const baseDamage = 20;
                const fallDamageBonus = Math.min(60, fallHeight * 5);
                //const totalDamage = Math.floor(baseDamage + fallDamageBonus);

                //api.applyHealthChange(targetId, -totalDamage, attackerId);
                //api.sendMessage(attackerId, `§a重锤伤害: ${totalDamage} (高度: ${fallHeight.toFixed(1)})`);

                const slownessDuration = Math.min(10000, 5000 + fallDamageBonus * 50);
                const slownessLevel = Math.min(5, 2 + Math.floor(fallHeight / 3));

                api.applyEffect(targetId, "Slowness", slownessDuration, {
                    icon: "Slowness",
                    displayName: fallHeight > 3 ? "Devastated" : "Slammed",
                    inbuiltLevel: slownessLevel,
                });

                // 击飞攻击者
                api.setVelocity(attackerId, 0, 20, 0);

                // 目标位置粒子效果
                const pos = api.getPosition(targetId);
                const particleIntensity = Math.min(3, 1 + fallHeight / 5);
                const particleCount = Math.min(200, 100 + fallDamageBonus * 2);

                api.playParticleEffect({
                    dir1: [-3 * particleIntensity, -3 * particleIntensity, -3 * particleIntensity],
                    dir2: [3 * particleIntensity, 3 * particleIntensity, 3 * particleIntensity],
                    pos1: [pos[0] - 3, pos[1], pos[2] - 3],
                    pos2: [pos[0] + 3, pos[1] + 3, pos[2] + 3],
                    texture: "glint",
                    minLifeTime: 0.3,
                    maxLifeTime: 1 + fallHeight * 0.1,
                    minEmitPower: 3,
                    maxEmitPower: 5 + fallHeight,
                    minSize: 0.3,
                    maxSize: 0.7 + fallHeight * 0.05,
                    manualEmitCount: particleCount,
                    gravity: [0, -5, 0],
                    colorGradients: [{
                        timeFraction: 0,
                        minColor: fallHeight > 5 ? [255, 100, 100, 1] : [180, 180, 180, 1],
                        maxColor: fallHeight > 5 ? [255, 200, 100, 1] : [255, 255, 255, 1],
                    }],
                    velocityGradients: [{ timeFraction: 0, factor: 1, factor2: 1 }],
                    blendMode: 1,
                });

                // 攻击者位置粒子效果（下落轨迹）
                api.playParticleEffect({
                    dir1: [-1, -5, -1],
                    dir2: [1, -10, 1],
                    pos1: [attackerPos[0] - 1, attackerPos[1], attackerPos[2] - 1],
                    pos2: [attackerPos[0] + 1, attackerPos[1] + 2, attackerPos[2] + 1],
                    texture: "smoke",
                    minLifeTime: 0.2,
                    maxLifeTime: 0.8,
                    minEmitPower: 2,
                    maxEmitPower: 6,
                    minSize: 0.2,
                    maxSize: 0.6,
                    manualEmitCount: 50,
                    gravity: [0, -3, 0],
                    colorGradients: [{
                        timeFraction: 0,
                        minColor: [100, 100, 100, 0.5],
                        maxColor: [200, 200, 200, 0.8],
                    }],
                    blendMode: 1,
                });
                
                //return "preventDamage";
            //} else {
            //    playerPositions[attackerId] = { y: currentY, time: Date.now() }//;
            //    api.sendMessage(attackerId, "需要在空中使用重锤！");
            //    return "preventDamage";
            //}
        }
    } catch (err) {
        api.log("Error in damage:", err);
    }
};

// ========== 生物伤害玩家 ==========
onMobDamagingPlayer = (mobId, targetId, damageAmount, itemName) => {
    try {
        const targetEffects = api.getEffects(targetId);
        const hasShield = targetEffects.includes("Shield");
        const isBroken = targetEffects.includes("Broken Shield");
        const isCrouching = api.isPlayerCrouching(targetId);
        const now = Date.now();
        const inCooldown = lastBrokenTime[targetId] && (now - lastBrokenTime[targetId] < 5000);

        if (hasShield && !isBroken && !inCooldown && isCrouching) {
            api.broadcastSound("wood", 1, 1, { playerIdOrPos: mobId });
            return "preventDamage";
        }
    } catch (err) {
        api.log("Error in mob damage:", err);
    }
};

// ========== 每帧更新 ==========
tick = (ms) => {
    const now = Date.now();
    if (now - lastTickTime < 1000) return;
    lastTickTime = now;

    for (const p of api.getPlayerIds()) {
        const effects = api.getEffects(p);
        const hasShield = effects.includes("Shield");
        const isBroken = effects.includes("Broken Shield");
        const isCrouching = api.isPlayerCrouching(p);
        const inCooldown = lastBrokenTime[p] && (now - lastBrokenTime[p] < 5000);

        if (isBroken && !inCooldown && !hasShield) {
            api.removeEffect(p, "Broken Shield");
            api.applyEffect(p, "Shield", null, {
                icon: "Brown Paintball",
                displayName: "Shield ([Sneak] to use)"
            });
            api.sendMessage(p, "盾牌已恢复！");
        }

        const shouldShow = hasShield && !isBroken && !inCooldown && isCrouching;
        
        if (shouldShow) {
            api.updateEntityNodeMeshAttachment(p, "ArmLeftMesh", "BloxdBlock", {
                blockName: "Brown Paintball",
                size: 0.5,
            }, [0.2, -0.3, 0], [0, Math.PI / 2, 0]);
        } else {
            api.updateEntityNodeMeshAttachment(p, "ArmLeftMesh", null);
        }
    }
};

// ========== 右键使用盾牌 ==========
onPlayerAttemptAltAction = (p, x, y, z, block, targetEId) => {
    const held = api.getHeldItem(p);
    if (held?.name === "Brown Paintball") {
        const effects = api.getEffects(p);
        if (effects.includes("Shield") || effects.includes("Broken Shield")) {
            api.sendMessage(p, "你已有盾牌或正在冷却！");
            return "preventAction";
        }
        
        api.applyEffect(p, "Shield", null, {
            icon: "Brown Paintball",
            displayName: "Shield ([Sneak] to use)"
        });
        api.sendMessage(p, "已获得盾牌！潜行使用");
        return "preventAction";
    }
};
