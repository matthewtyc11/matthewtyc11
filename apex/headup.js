const floatText = [{ text: "Map 1", size: 200, height: 4, color: "#00FFFF", cord: [-307.5, 45, 400.5] }]
for (let i of floatText) {
    let wildcatId = api.attemptSpawnMob("Wildcat", i.cord[0], i.cord[1], i.cord[2], { name: "s" });
    api.scalePlayerMeshNodes(wildcatId, { "TorsoNode": [0, i.height, 0] });
    api.setTargetedPlayerSettingForEveryone(wildcatId, "nameTagInfo", {
        backgroundColor: "rgba(0,0,0,0)", content: [{
            str: i.text, style:
            {
                fontSize: i.size + "px", color: i.color
            }
        }]
    }, true);
    api.setMobSetting(wildcatId, "walkingSpeedMultiplier", 0); 
    api.setMobSetting(wildcatId, "idleSound", null);
}