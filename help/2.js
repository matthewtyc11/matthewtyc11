function cuteSnAntiCheat1(attacker, victim, damageDealt, withItem){
	if (!playerKills.has(attacker)) {  
	        playerKills.set(attacker, []);  
	    }  
	    const kills = playerKills.get(attacker);  
	    kills.push(api.now());
	    const oneMinuteAgo = api.now() - 60000;  
	    const recentKills = kills.filter(timestamp => timestamp > oneMinuteAgo);  
	    playerKills.set(attacker, recentKills);  
	    if (recentKills.length >= 10) {  
	        const playerName = api.getEntityName(attacker);  
	        playerKills.delete(attacker);  
			api.broadcastMessage([{str:"["+chinStringAntiCheat[0]+"] ", style: {color: "gold"}},{str:playerName, style: {color: "red"}},{str:chinStringAntiCheat[3], style: {color: "gold"}}]);
		api.broadcastMessage([{str:chinStringAntiCheat[2], style: {color: "red"}}]);
        api.kickPlayer(attacker,chinStringAntiCheat[0]+chinStringAntiCheat[3]);
	    }
}

function cuteSnAntiCheat2(attackingPlayer, damagedPlayer, damageDealt, withItem, bodyPartHit, damagerDbId){
    const itemLower = withItem.toLowerCase();    
    const isGun = itemLower.includes("m1911") ||     
                  itemLower.includes("ak-47") ||     
                  itemLower.includes("mp40") ||     
                  itemLower.includes("awp") ||     
                  itemLower.includes("one shot pistol") ||    
                  itemLower.includes("double barrel") ||    
                  itemLower.includes("m16") ||    
                  itemLower.includes("tar-21") ||    
                  itemLower.includes("minigun");  
    if (!isGun) return;  
    const attackerPos = api.getPosition(attackingPlayer);  
    const damagedPos = api.getPosition(damagedPlayer);  
    const eyeLevelPos = [attackerPos[0], attackerPos[1] + 1.5, attackerPos[2]];  
    const dx = damagedPos[0] - eyeLevelPos[0];  
    const dy = damagedPos[1] - eyeLevelPos[1];  
    const dz = damagedPos[2] - eyeLevelPos[2];  
    const distance = Math.sqrt(dx*dx + dy*dy + dz*dz);  
    const dir = [dx/distance, dy/distance, dz/distance];  
    let hasClearPath = false;  
    for (let offsetX = -1; offsetX <= 1; offsetX += 1) {  
        for (let offsetZ = -1; offsetZ <= 1; offsetZ += 1) {
			for (let offsetY = 0; offsetY <= 3; offsetY += 1) {  
                const targetPos = [  
                    damagedPos[0] + offsetX,  
                    damagedPos[1] + offsetY,   
                    damagedPos[2] + offsetZ  
                ];  
                  
                if (hasClearLineOfSight(eyeLevelPos, targetPos)) {  
                    hasClearPath = true;
                    break;
                }  
            }  
            if (hasClearPath) break;  
        }  
        if (hasClearPath) break;  
    }  
    if (!hasClearPath) {  
        const playerDbId = api.getPlayerDbId(attackingPlayer);  
        const currentTime = api.now();  
        if (!suspiciousPlayers[playerDbId]) {  
            suspiciousPlayers[playerDbId] = {  
                shots: [],  
                warned: false  
            };  
        }  
        suspiciousPlayers[playerDbId].shots.push(currentTime);  
        const oneMinuteAgo = currentTime - 60000;  
        suspiciousPlayers[playerDbId].shots = suspiciousPlayers[playerDbId].shots.filter(  
            timestamp => timestamp > oneMinuteAgo  
        );
        if (suspiciousPlayers[playerDbId].shots.length >= 3) {  
            api.broadcastMessage([{str:"["+chinStringAntiCheat[0]+"] ", style: {color: "gold"}},{str:api.getEntityName(attackingPlayer), style: {color: "red"}},{str:chinStringAntiCheat[1], style: {color: "gold"}}]);  
            api.broadcastMessage([{str:chinStringAntiCheat[2], style: {color: "red"}}]);  
            api.kickPlayer(attackingPlayer, chinStringAntiCheat[0]+chinStringAntiCheat[1]);  
            delete suspiciousPlayers[playerDbId];  
        } else if (!suspiciousPlayers[playerDbId].warned) {  
            api.sendMessage(attackingPlayer, [{str: "[Warning] ", style: {color: "yellow"}},{str: "Suspicious aiming detected. 2 more offenses will result in a kick.", style: {color: "white"}}]);  
            suspiciousPlayers[playerDbId].warned = true;  
        }
    }  
};
 
function hasClearLineOfSight(fromPos, toPos) {  
    const dx = toPos[0] - fromPos[0];  
    const dy = toPos[1] - fromPos[1];  
    const dz = toPos[2] - fromPos[2];  
    const distance = Math.sqrt(dx*dx + dy*dy + dz*dz);  
    const dir = [dx/distance, dy/distance, dz/distance];  
    const stepSize = 0.5;  
    for (let d = 0; d <= distance; d += stepSize) {  
        const checkPos = [  
            fromPos[0] + dir[0] * d,  
            fromPos[1] + dir[1] * d,  
            fromPos[2] + dir[2] * d  
        ];  
        if (api.getBlockSolidity(checkPos[0], checkPos[1], checkPos[2])) {  
            return false;  
        }  
    }  
    return true;  
}

function cuteSnAntiCheat3(playerId){
	if (api.isMobile(playerId)){
		antiCheat3WarnClick = 30
		antiCheat3KickClick = 50
	} else {
		antiCheat3WarnClick = 20
		antiCheat3KickClick = 30
	}
	const playerDbId = api.getPlayerDbId(playerId);  
    const currentTime = api.now();  
    if (!suspiciousClickers[playerDbId]) {  
        suspiciousClickers[playerDbId] = {  
            clicks: [],  
            warned: false  
        };  
    }  
    suspiciousClickers[playerDbId].clicks.push(currentTime);  
    const oneSecondAgo = currentTime - 1000;  
    suspiciousClickers[playerDbId].clicks = suspiciousClickers[playerDbId].clicks.filter(  
        timestamp => timestamp > oneSecondAgo  
    );  
    if (!suspiciousClickers[playerDbId].warned && suspiciousClickers[playerDbId].clicks.length >= antiCheat3WarnClick) {  
		api.sendMessage(playerId,[{str:"["+chinStringAntiCheat[0]+"] ", style: {color: "gold"}},{str:api.getEntityName(playerId), style: {color: "red"}},{str:chinStringAntiCheat[5], style: {color: "gold"}}]);  
        suspiciousClickers[playerDbId].warned = true;  
    } else if (suspiciousClickers[playerDbId].clicks.length >= antiCheat3KickClick) {  
        api.broadcastMessage([{str:"["+chinStringAntiCheat[0]+"] ", style: {color: "gold"}},{str:api.getEntityName(playerId), style: {color: "red"}},{str:chinStringAntiCheat[4], style: {color: "gold"}}]);
        api.broadcastMessage([{str:chinStringAntiCheat[2], style: {color: "red"}}]);  
        api.kickPlayer(playerId, chinStringAntiCheat[0]+chinStringAntiCheat[4]);  
        delete suspiciousClickers[playerDbId];  
    }  
}
functionDefined[1] = 1
void 0;