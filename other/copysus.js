for (let Brainfood of ["onPlayerFinishQTE","tick","onPlayerBoughtShopItem","onPlayerChangeBlock","onRespawnRequest","onPlayerLeave","onPlayerKilledOtherPlayer","playerCommand","onPlayerDamagingOtherPlayer","onPlayerAttemptAltAction","onPlayerDropItem","onPlayerChat","onClose","onPlayerKilledMob","onMobKilledPlayer","onPlayerMoveInvenItem","onPlayerFinishChargingItem","onAttemptKillPlayer","onPlayerDamagingMob","onMobDamagingPlayer","onWorldAttemptSpawnMob","onPlayerAltAction","onPlayerThrowableHitTerrain","doPeriodicSave"/*, "onInventoryUpdated"*/]){globalThis[Brainfood]=(...args)=>{const brain=globalThis[Brainfood+"1"];if (typeof brain==="function") return brain(...args)}}      
api.setMaxPlayers(15, 16)
api.createShopItem("Sabotages","MedBay Door",{image:"Patterned Light Gray Glass",canBuy:false,buyButtonText:"Sabotage",sortPriority:1});
api.createShopItem("Sabotages","Security Door",{image:"Patterned Light Gray Glass",canBuy:false,buyButtonText:"Sabotage",sortPriority:2});
api.createShopItem("Sabotages","Upper Engine Door",{image:"Patterned Light Gray Glass",canBuy:false,buyButtonText:"Sabotage",sortPriority:3});
api.createShopItem("Sabotages","Lower Engine Door",{image:"Patterned Light Gray Glass",canBuy:false,buyButtonText:"Sabotage",sortPriority:4});
api.createShopItem("Sabotages","Storage Door",{image:"Patterned Light Gray Glass",canBuy:false,buyButtonText:"Sabotage",sortPriority:5});
api.createShopItem("Sabotages","Cafeteria Door",{image:"Patterned Light Gray Glass",canBuy:false,buyButtonText:"Sabotage",sortPriority:6});
api.createShopItem("Sabotages","Electrical Door",{image:"Patterned Light Gray Glass",canBuy:false,buyButtonText:"Sabotage",sortPriority:7});
api.createShopItem("Sabotages","O2",{image:"Patterned Light Blue Glass",canBuy:false,buyButtonText:"Sabotage",sortPriority:8});
api.createShopItem("Sabotages","Reactor",{image:"Red Wood Gauntlets",canBuy:false,buyButtonText:"Sabotage",sortPriority:9});
api.createShopItem("Sabotages","Communications",{image:"Light Gray Chalk Bricks Slab",canBuy:false,buyButtonText:"Sabotage",sortPriority:10});
api.createShopItem("Sabotages","Light",{image:"Yellow Portal",canBuy:false,buyButtonText:"Sabotage",sortPriority:11});

var doors = {
"cafeteria":[[ [98, -310, 22],[102, -314, 22] ],[ [77, -314, 43],[77, -310, 47] ],[ [123, -310, 43],[123, -314, 47] ]],
"electrical":[[ [62, -314, -19],[66, -310, -19] ]],
"storage":[[[98,-314,5],[102,-310,5]],[[108,-314,-10],[108,-310,-14]],[[81,-310,-22],[81,-314,-26]]],
"uper":[[[43,-314,43],[43,-310,47]],[[36,-314,33],[32,-310,33]]],
"lower":[[[32,-314,1],[36,-310,1]],[[42,-310,-13],[42,-314,-9]]],
"secu":[[ [43, -314, 19],[43, -310, 15] ]],
"medbay":[[ [63, -310, 40],[67, -314, 40] ]]
}
var roleAssignQueue = []
var revealQueue = []
var gamePhase = "lobby"   
var revealTimer = 0
var REVEAL_DURATION = 4000 
var roleBatchTimer = 0
var ROLE_BATCH_INTERVAL = 150
var ROLE_BATCH_SIZE = 4

var revealBatchTimer = 0
var REVEAL_BATCH_INTERVAL = 150
var REVEAL_BATCH_SIZE = 4
var tasks = {
downloadtask: []
}
var server = true
var reactorActive = false
var reactorTimer = 0
var reactorInterval = null

var reactorTimerTicks = 0
var REACTOR_TOTAL_TIME = 30 * 20

var reactorPos1 = [14, -315, 3]
var reactorPos2 = [14, -315, 31]

var meetingBlocked = false
    
var endGameTimer = 0  
var pendingReset = false 

var lightsSabotaged = false  
var sabotageCooldownActive = false
var sabotageCooldownTicks = 0
var LIGHT_COOLDOWN_TIME = 30 * 20
    
var forceDevImpostors = false

/*======= Meeting stuff =======*/ 
var playerSelectedVote = {}          
var meetingPhase = 0       
var meetingTimer = 0       
var lastMeetingDeaths = []
var secun = 30*20
var votes = {}   
var voteCount = {}
var skipVotes = 0 
 
var colorToPlayer = {}

var executionTarget = null
var executionTimer = 0

/*======= Game vars =======*/    
var alivePlayers = {}
var MEETING_POS = [115.5, -226, 57.5]

var gameEnding = false
var gameEndTimer = 0
var endPhase = 0
var endWinner = null

var roles = {} 
var impostors = [] 
 
var meetingActive = false 

var killCooldown = {} 
var KILL_COOLDOWN_TIME = 3
var KILL_RADIUS = 5
var deadBodies = []
var bodyDrops = []
var DROP_DESPAWN_TICKS = 200

var host = null
var gamestate = false

/*======= Normal vars =======*/
var meetingQueue = []
var meetingQueueIndex = 0
var meetingQueueTimer = 0
var isStartingMeeting = false

var timeuntilestart = null
var startQueueIndex = 0
var startQueueTimer = 0
var START_BATCH_SIZE = 5
var START_BATCH_DELAY = 2 // Ticks
var isStartingGame = false 
var gamestarttimer = -9999999999999999999
var updatetimer = 0
var activ = 0
var MAX_PLAYERS = 15 
var needplayers = 4
var availableColors = [
    "#ff0000", // red 
    "#0000ff", // blue
    "#00ff00", // green
    "#ffff00", // yellow
    "#ff00ff", // pink
    "#00ffff", // cyan
    "#ffa500", // orange
    "#800080", // purple
    "#ffffff", // white 
    "#000000", // black
    "#8B4513", // brown
    "#808080", // gray
    "#ff1493", // deep pink
    "#00ff7f", // spring green
    "#1e90ff"  // dodger blue
]

var usedColors = {}

/*======= Queue vars =======*/
var queue = []
var spawnqueues = [
[87.5, -230, 66.5],
[88.5, -230, 68.5],
[90.5, -230, 69.5],
[92.5, -230, 70.5],
[96.5, -230, 70.5],
[98.5, -230, 69.5],
[100.5, -230, 68.5],
[101.5, -230, 66.5],

]
/*======= CallBacks =======*/
tick1 = (ms) => {

if(activ == 0){
for(let id of api.getPlayerIds()){
api.setPosition(id, 115.5, -226, 57.5)
}
return false
}
if(activ == 1){
for(let id of api.getPlayerIds()){
api.setPosition(id, 115.5, -226, 61.5)
}
return false
}
// END GAME TIMER
if (pendingReset) {

    endGameTimer -= ms

    if (endGameTimer <= 0) {
        pendingReset = false
        resetGameToLobby()
    }
return false
}



if (isStartingMeeting) {
    playMeetingTeleport()
    return false
}

if (meetingPhase > 0) {

    if (meetingTimer > 0) {
        meetingTimer--

        if (meetingTimer == 0) {

            if (meetingPhase == 1) {
                meetingPhase = 2
for(let id of api.getPlayerIds()){
				api.openShop(id)
}
                meetingTimer = 30*20
                api.broadcastMessage("Voting has started - 30 seconds", { color: "orange" })
updateVotingShop()
            }

            else if (meetingPhase == 2) {
                meetingPhase = 3
                calculateVotes()
            }

            else if (meetingPhase == 4) {
                finishMeeting()
            }
        }
    }

    if (meetingPhase == 4) {
        executionTimer--
        if (executionTimer == 0) {
            revealRole()
        }
    }

    return false
}
if (gamePhase === "assigning") {
asg(ms)
}
if (gamePhase === "revealing") {
rev(ms)
}
if (isStartingGame) {
playStartGame(ms)
return false
}
if (sabotageCooldownActive) {
 
    sabotageCooldownTicks--

    if (sabotageCooldownTicks <= 0) {

        sabotageCooldownActive = false

        // Yellow Carpet zurückgeben
        for (let pid of impostors) {

            if (!alivePlayers[pid]) continue
            if (roles[pid] !== "imposter") continue
			resetSabotages(pid, true)
        }
		
        api.broadcastMessage("⚡ Sabotage ready again!", { color: "yellow" })
    }
}

// ☢️ REACTOR SYSTEM

doreactorsystem(ms)

secun--

updatetimer+=ms
if (updatetimer >= 10000){
 for (let pid in killCooldown) {

        // 🔥 SUPER WICHTIG
        if (!gamestate) continue
        if (!alivePlayers[pid]) continue
        if (roles[pid] !== "imposter") continue

        killCooldown[pid] -= 1

if (killCooldown[pid] <= 0) {
    killCooldown[pid] = 0
	api.removeItemName(pid, "Gray Carpet", 999)
    giveImposterItems()
}
    }

updatetimer = 0
updateVotingShop()
updateSidebarAll()
makegamestart() 
updateSidebarAll()
for (let body of deadBodies) {

    api.playParticleEffect({
        dir1: [-0.05,0,-0.05],
        dir2: [0.05,0.5,0.05],
        pos1: [body.x-0.3,body.y,body.z-0.3],
        pos2: [body.x+0.3,body.y+2.2,body.z+0.3],
        texture: "soul_0",
        minLifeTime: 9.5,
        maxLifeTime: 10.5,
        minEmitPower: 0.1,
        maxEmitPower: 0.3,
        minSize: 0.4,
        maxSize: 0.8,
        manualEmitCount: 25,
        gravity: [0,0.01,0],
        colorGradients: [{
            timeFraction:0,
            minColor:[60,0,0,0.8],
            maxColor:[120,0,0,1]
        }],
        velocityGradients:[{
            timeFraction:0,
            factor:1,
            factor2:1
        }],
        blendMode:1
    })

body.itemTimer = 0
api.createItemDrop(
    body.x,
    body.y + 0.2,
    body.z,
    body.itemName,
    1,
    false,
    {},
    20000
)


    
}
}
}
onPlayerJoin = (playerId) => {
api.setClientOption(playerId, "fogChunkDistanceOverride", 0.1)
api.setClientOption(playerId, "fogColourOverride", "#000000")
api.setClientOption(playerId, "secsToRespawn", 0)
api.setClientOption(playerId, "autoRespawn", true)
api.setClientOption(playerId, "skyBox", {
      type: "earth",
      inclination: 0,
      turbidity: 0,
      luminance: 0,
      azimuth: 0,
      infiniteDistance: 0.3,
      vertexTint: [0,0,0]
    });
api.clearInventory(playerId)
api.setClientOption(playerId, "canPickUpItems", false)

    api.createShopItemForPlayer(playerId, "classicGame:utilities", "voter", {
        image: "tprequesticon.png",
        customTitle: "Who you wanna vote",
        description: "Select color you wanna vote for",
        buyButtonText: "Select",
        sortPriority: 20,
        canBuy: true,

        userInput: {
            type: "dropdown",
            dropdownOptions: ["Skip"]
        }
    })

    api.createShopItemForPlayer(playerId, "classicGame:utilities", "Vote", {
        customTitle: "Vote skip",
        image: "crosshairs",
        description: [],
        sortPriority: 60,
        canBuy: true
    })
if(!server){
api.kickPlayer(playerId, "Server is updating. Join amongus_brainfood in custome lobbys")
return false
}
    if (api.getNumPlayers() > MAX_PLAYERS) {
        api.kickPlayer(playerId, "Lobby is full (15 players max) join amongus_brainfood in custome lobbys")
        return
    }

    const taken = Object.values(usedColors)
    const freeColors = availableColors.filter(c => !taken.includes(c))

    if (freeColors.length === 0) {
        api.kickPlayer(playerId, "No colors available")
        return
    }
let random = Math.floor(Math.random()*8)
let posit = spawnqueues[random]
api.setPosition(playerId, posit)

    const randomColor = freeColors[Math.floor(Math.random() * freeColors.length)]

    usedColors[playerId] = randomColor

    api.setTargetedPlayerSettingForEveryone(
        playerId,
        "overlayColour",
        randomColor,
        true
    )

    api.setTargetedPlayerSettingForEveryone(
        playerId,
        "nameTagInfo",
        {
            content: [],
            subtitle: [],
            backgroundColor: "",
            subtitleBackgroundColor: ""
        },
        true
    )

if (!gamestate || gameEnding) {
    if (!queue.includes(playerId)) {
        queue.push(playerId)
    }
}
if(host==null){
if(gamestate == false){
host = api.getPlayerDbId(playerId)
api.log("New Host: "+api.getEntityName(playerId))
}
}
updateSidebarAll()
}
onPlayerLeave1 = (playerId) => {

    queue = queue.filter(id => id !== playerId)
    impostors = impostors.filter(id => id !== playerId)

    delete alivePlayers[playerId]
    delete usedColors[playerId]
    delete roles[playerId]
    delete killCooldown[playerId]
    delete votes[playerId]

    for (let color in colorToPlayer) {
        if (colorToPlayer[color] === playerId) {
            delete colorToPlayer[color]
        }
    }

    if (cid(host) == playerId) {
        const players = api.getPlayerIds()
        if (players.length > 0) {
            host = api.getPlayerDbId(players[0])
        } else {
            host = null
        }
    }

    checkWinCondition()
}