let isNewLobby = true
canSpawnBoss1 = false
const admins = ["MattDragon64", "Chrishellnah", "CN_Coolwind"]
function playerCommand(id, cmd) {
    let parts = cmd.split(" ")
    if (parts[0] === "effect" & admins.includes(api.getEntityName(id))) {
        api.applyEffect(id, parts[1], null, { inbuiltLevel: Number(parts[2]) })
    } else if (parts[0] === "killallmob" & admins.includes(api.getEntityName(id))) {
        api.getMobIds().forEach(mob => {
            api.killLifeform(mob)
        });
    } else if (parts[0] === "kill" & admins.includes(api.getEntityName(id))) {
        api.killLifeform(api.getPlayerId(parts[[1]]))
    } else if (parts[0] === "adminarmour" & admins.includes(api.getEntityName(id))) {
        const armours = ["Diamond Helmet", "Diamond Chestplate", "Diamond Leggings", "Diamond Boots", "Diamond Gauntlets"]
        armours.forEach(armour => {
            api.giveItem(id, armour, 1, {
                customDisplayName: "Tier 6",
                customDescription: "Admin level armour",
                customAttributes: {
                    enchantmentTier: "Tier 5",
                    enchantments: {
                        "Health": 1000000, "Health Regen": 1000000
                    }
                }
            })
        });

    }
}
api.setCallbackValueFallback("onWorldAttemptSpawnMob", "preventSpawn")
function sendBossHealthBar(playerId, currentHp, maxHp, name, activeBar, deadBar,timeInMs) {
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
    ], 0,timeInMs)
}
const itemProbability = {
    1: {
        "Sand": 1.0,
        "Glass": 0.4,
        "Bone Meal": 1.0,
        "Sugar Cane Plant": 0.8,
        "Wood Enchanting Table": 1.0,
        "Iron Ladder": 0.7,
        "Engraved Andesite": 0.9,
        "Stone Slab": 1.0,
        "Gravel": 1.0,
        "Pumpkin Seeds": 0.7,
        "Granite": 0.23,
        "Orange Wool": 0.3,
        "White Carpet": 0.3,
        "Red Carpet": 0.06,
        "Light Gray Carpet": 0.05,
        "Leather Block": 0.3,
        "Apple Block": 0.015,
        "Carrot Seeds": 0.002,
        "Gray Carpet": 0.001
    },
    2: {
        "Sand": 0.65,
        "Glass": 0.6,
        "Bone Meal": 0.65,
        "Sugar Cane Plant": 0.65,
        "Wood Enchanting Table": 0.65,
        "Iron Ladder": 0.65,
        "Engraved Andesite": 0.65,
        "Stone Slab": 0.7,
        "Gravel": 0.7,
        "Pumpkin Seeds": 0.7,
        "Granite": 0.7,
        "Orange Wool": 0.8,
        "White Carpet": 1.0,
        "Red Carpet": 0.8,
        "Light Gray Carpet": 0.8,
        "Leather Block": 0.9,
        "Apple Block": 0.5,
        "Carrot Seeds": 0.4,
        "Gray Carpet": 0.3,
        "Blue Carpet": 0.01,
        "Grant Wool": 0.01,
        "Chili Pepper Block": 0.01
    },
    3: {
        "Sand": 0.2,
        "Glass": 0.3,
        "Bone Meal": 0.1,
        "Sugar Cane Plant": 0.2,
        "Wood Enchanting Table": 0.05,
        "Iron Ladder": 0.08,
        "Stone Slab": 0.01,
        "Gravel": 0.5,
        "Pumpkin Seeds": 0.4,
        "Granite": 0.5,
        "Orange Wool": 0.5,
        "White Carpet": 0.4,
        "Red Carpet": 0.4,
        "Light Gray Carpet": 0.5,
        "Leather Block": 0.8,
        "Apple Block": 0.9,
        "Carrot Seeds": 0.8,
        "Gray Carpet": 1.0,
        "Blue Carpet": 0.7,
        "Grant Wool": 0.6,
        "Chili Pepper Block": 0.8,
        "Purple Carpet": 0.5,
        "Chili Pepper Seeds": 0.15,
        "Block of Lapis Lazuli": 0.2,
        "Beacon": 0.1,
        "Patterned Blue Glass": 0.01,
        "Black Carpet": 0.005
    },
    4: {
        "Sand": 0.01,
        "Glass": 0.01,
        "Bone Meal": 0.01,
        "Sugar Cane Plant": 0.01,
        "Wood Enchanting Table": 0.01,
        "Iron Ladder": 0.01,
        "Engraved Andesite": 0.01,
        "Stone Slab": 0.01,
        "Granite": 0.05,
        "Orange Wool": 0.05,
        "White Carpet": 0.01,
        "Red Carpet": 0.02,
        "Light Gray Carpet": 0.02,
        "Leather Block": 0.02,
        "Apple Block": 0.05,
        "Carrot Seeds": 0.7,
        "Gray Carpet": 0.7,
        "Blue Carpet": 0.1,
        "Grant Wool": 0.7,
        "Chili Pepper Block": 0.8,
        "Purple Carpet": 0.9,
        "Chili Pepper Seeds": 0.9,
        "Block of Lapis Lazuli": 0.9,
        "Beacon": 0.5,
        "Patterned Blue Glass": 0.4,
        "Black Carpet": 0.15,
        "Radar": 0.1,
        "Sponge": 0.01
    },
    5: {
        "Light Gray Carpet": 0.05,
        "Leather Block": 0.05,
        "Apple Block": 0.05,
        "Carrot Seeds": 0.05,
        "Gray Carpet": 0.05,
        "Blue Carpet": 0.1,
        "Grant Wool": 0.07,
        "Chili Pepper Block": 0.1,
        "Purple Carpet": 0.7,
        "Chili Pepper Seeds": 0.6,
        "Block of Lapis Lazuli": 0.9,
        "Beacon": 0.8,
        "Patterned Blue Glass": 0.8,
        "Black Carpet": 0.6,
        "Radar": 0.5,
        "Sponge": 0.4,
        "Emerald Ore": 0.3,
        "Block of Emerald": 0.2,
        "Toxin Ball Block": 0.2,
        "White Chalk": 0.01,
        "Block of Moonstone": 0.005
    }
}
const itemAttributes = {
    "Sand": [
        "Silicon Dust",
        1,
        1
    ],
    "Glass": [
        "Empty Chemical Vial",
        200,
        1
    ],
    "Bone Meal": [
        "Paper",
        10,
        1
    ],
    "Sugar Cane Plant": [
        "Paper Waste",
        11,
        1
    ],
    "Wood Enchanting Table": [
        "Tissue ",
        15,
        1
    ],
    "Iron Ladder": [
        "Steel Rod",
        18,
        1
    ],
    "Engraved Andesite": [
        "Concrete",
        20,
        1
    ],
    "Stone Slab": [
        "Concrete Tile",
        50,
        1
    ],
    "Gravel": [
        "Metal Scrapes",
        100,
        1
    ],
    "Pumpkin Seeds": [
        "Used Battery",
        150,
        1
    ],
    "Granite": [
        "Raw Copper",
        600,
        2
    ],
    "Orange Wool": [
        "Copper Wire",
        700,
        2
    ],
    "White Carpet": [
        "Encrypted Document",
        750,
        2
    ],
    "Red Carpet": [
        "Diplomatic Bag",
        1500,
        2
    ],
    "Light Gray Carpet": [
        "Classified Folder",
        1600,
        2
    ],
    "Leather Block": [
        "Smuggled Textiles",
        1900,
        2
    ],
    "Apple Block": [
        "Medical Supplies",
        3000,
        3
    ],
    "Carrot Seeds": [
        "Microchip",
        3100,
        3
    ],
    "Gray Carpet": [
        "Encrypted Hard Drive",
        3200,
        3
    ],
    "Blue Carpet": [
        "Military Blurprint",
        5000,
        3
    ],
    "Grant Wool": [
        "Stolen Masterpiece ",
        5500,
        3
    ],
    "Chili Pepper Block": [
        "Chemical Crystal ",
        6000,
        3
    ],
    "Purple Carpet": [
        "Experimental Tech",
        8000,
        4
    ],
    "Chili Pepper Seeds": [
        "Lithium Vehicle Battery",
        9000,
        4
    ],
    "Block of Lapis Lazuli": [
        "Server Module",
        10000,
        4
    ],
    "Beacon": [
        "GPS Jammer",
        15000,
        4
    ],
    "Patterned Blue Glass": [
        "AI Memory Crystal",
        20000,
        4
    ],
    "Black Carpet": [
        "Google Server",
        35000,
        5
    ],
    "Radar": [
        "Alien Signal Receiver",
        50000,
        5
    ],
    "Sponge": [
        "Bio-Organic Sample",
        60000,
        5
    ],
    "Emerald Ore": [
        "Uranium-235 Ore",
        80000,
        5
    ],
    "Block of Emerald": [
        "Refined Uranium Core",
        100000,
        5
    ],
    "Toxin Ball Block": [
        "Virus Strain",
        120000,
        5
    ],
    "White Chalk": [
        "Illegal Drug",
        250000,
        5
    ],
    "Block of Moonstone": [
        "Refined Moon-Core",
        500000,
        5
    ]
}
const cdTimeInMs = 10000
const blockNameToTier = { "Red Concrete Slab": 5, "Gray Concrete Slab": 1, "Blue Concrete Slab": 2, "Purple Concrete Slab": 3, "Orange Concrete Slab": 4 }
const configOfChest = []
chestOpenedTime = {}
const lobbyCord = [-268.5, 50, 412.5]
function tpLobby(id) {
    api.setPosition(id, lobbyCord)
}
function getMobNames() {
    let mobNames = []
    for (let id of api.getMobIds()) {
        mobNames.push(api.getEntityType(id))
    }
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
function onPlayerAttemptOpenChest(id, x, y, z, isMc, isIc) {
    let tierOfChest = blockNameToTier[api.getBlock(x, y + 1, z)]
    if (tierOfChest != undefined & !isMc & !isIc) {
        if ([x, y, z] in chestOpenedTime) {
            let lastOpen = chestOpenedTime[[x, y, z]]
            if (lastOpen + cdTimeInMs <= api.now()) {
                api.sendMessage(id, "You opened a Tier " + String(tierOfChest) + "chest")
                chestOpenedTime[[x, y, z]] = api.now()
                setChest(x, y, z, tierOfChest)
            } else {
                api.sendMessage(id, "Chest in Cd")
            }
        } else {

            api.sendMessage(id, "You opened a Tier" + String(tierOfChest) + " chest")
            chestOpenedTime[[x, y, z]] = api.now()
            setChest(x, y, z, tierOfChest)
        }
    }
}
const allowMobs = ["Wildcat", "Draugr Knight"]
onWorldAttemptSpawnMob = (mob) => {
    if (!allowMobs.includes(mob)) {
        return "preventSpawn"
    }
}
onWorldAttemptDespawnMob = (id) => {
    if (!allowMobs.includes(api.getEntityName(id))) {
        return "preventDespawn"
    }
}
function onPlayerJoin(id) {
    if (!admins.includes(api.getEntityName(id))) {
        api.kickPlayer(id, "Lobby not open yet!")
    }
    if (isNewLobby) {
        isNewLobby = false
        const floatText = [{ text: "Map 1", size: 200, height: 4, color: "#00FFFF", cord: [-307.5, 45, 400.5] },
        { text: "Shop", size: 200, height: 4, color: "#0000FF", cord: [-255.5, 44, 412.5] }]
        api.getMobIds().forEach(mob => {
            api.killLifeform(mob)
        });
        for (let i of floatText) {
            let wildcatId = api.attemptSpawnMob("Wildcat", i.cord[0], i.cord[1], i.cord[2]);
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
    }
}
let lastSec = api.now()
function tick() {
    if (api.now() >= lastSec + 400 && getMobNames().includes("Draugr Knight")) {
        lastSec = api.now()
        let plrIds = api.getPlayerIds()
        for (let id of plrIds) {
            let plrPos = api.getPosition(id)
            if (plrPos[0] >= 31 && plrPos[0] <= 43 && plrPos[2] >= 72 && plrPos[2] <= 92) {
                sendBossHealthBar(id, api.getHealth(bossId), 2000, "Draugr Knight", "🟩", "🟥",500)
            }
        }
    }
}
function onPlayerAttemptAltAction(id){

	if (api.getHeldItem(id)?.name == "Gold Spade" &&
		api.getHeldItem(id)?.attributes.customDisplayName == "Totem Of Undying"  		 &&	api.getEffects(id).includes ("Totem") == false){
	       /* ---apply totem effect--- */
		api.applyEffect(id, "Totem", null, {icon: "Gold Spade"})
		slot = api.getSelectedInventorySlotI(id)
		api.setItemSlot(id, slot, "Air")
	}
}

function onPlayerDamagingOtherPlayer(attacker, victim, dmg) {

  if (api.getHeldItem(victim)?.attributes.customDisplayName ==="Totem Of Undying" && api.getHealth(victim) - dmg < 5 || api.getEffects(victim).includes('Totem')
      && api.getHealth(victim) - dmg < 5) {
	/* ---TOTEM WORK--- */
    const pos = api.getPosition(victim);
    api.applyEffect(victim, 'Health Regen', 5000, {inbuiltLevel: 1});
	api.applyEffect(victim, "Heat Resistance", 10000, {inbuiltLevel: 1})
	api.applyEffect(victim, "Damage Reduction", 5000, {inbuiltLevel: 1})
	api.setHealth(victim, 30)
    api.setShieldAmount(victim, 30);
    particle(pos[0], pos[1], pos[2]);
    if (api.getHeldItem(victim)?.attributes.customDisplayName ==="Totem Of Undying"){
	slot = api.getSelectedInventorySlotI(victim)
	api.setItemSlot(victim, slot, "Air")}
	else {api.removeEffect(victim, 'Totem');}
  }
}

function onMobDamagingPlayer(attacker, victim, dmg) {

  if (api.getHeldItem(victim)?.attributes.customDisplayName ==="Totem Of Undying" && api.getHealth(victim) - dmg < 5 || api.getEffects(victim).includes('Totem')
      && api.getHealth(victim) - dmg < 5) {
	/* ---TOTEM WORK--- */
    const pos = api.getPosition(victim);
    api.applyEffect(victim, 'Health Regen', 5000, {inbuiltLevel: 1});
	api.applyEffect(victim, "Heat Resistance", 10000, {inbuiltLevel: 1})
	api.applyEffect(victim, "Damage Reduction", 5000, {inbuiltLevel: 1})
	api.setHealth(victim, 500)
    api.setShieldAmount(victim, 200);
    particle(pos[0], pos[1], pos[2]);
    if (api.getHeldItem(victim)?.attributes.customDisplayName ==="Totem Of Undying"){
	slot = api.getSelectedInventorySlotI(victim)
	api.setItemSlot(victim, slot, "Air")}
	else {api.removeEffect(victim, 'Totem');}
  }
}

function particle(x, y, z){ 
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

onPlayerFinishChargingItem=(id,isUsed,item)=>{
if(isUsed && item==="Apple")

{

api.applyEffect(id,"Health Regen",20000,{inbuiltLevel:25})
api.applyEffect(id,"Damage",15000,{inbuiltLevel:50})
api.applyEffect(id,"Damage Reduction",10000,{inbuiltLevel:30})
api.setShieldAmount(id,100)
const oldHealth = api.getHealth(id)
if(oldHealth<700){
api.setHealth(id,oldHealth+200,undefined,true)}}}