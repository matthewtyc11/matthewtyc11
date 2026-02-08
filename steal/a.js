const XP_TABLE = [
    100, 150, 200, 250, 500, 600, 700, 800, 1000, 1200, 1500, 1800,
    2000, 2500, 3000, 4000, 5000, 6000, 8000, 10000, 12000, 15000, 18000, 20000,
    25000, 30000, 40000, 50000, 60000, 80000, 100000, 120000, 150000, 180000, 200000, 250000,
    300000, 400000, 500000, 600000, 800000, 1000000, 1200000, 1500000, 1800000, 2000000, 2500000, 3000000,
    4000000, 5000000, 6000000, 8000000, 10000000, 12000000, 15000000, 18000000, 20000000, 25000000, 30000000, 40000000,
    50000000, 60000000, 80000000, 100000000, 120000000, 150000000, 180000000, 200000000, 250000000, 300000000, 400000000, 500000000,
    600000000, 800000000, 1000000000, 1200000000, 1500000000, 1800000000, 2000000000, 2500000000, 3000000000, 4000000000, 5000000000, 6000000000,
    8000000000, 10000000000, 12000000000, 15000000000, 20000000000, 25000000000, 30000000000, 40000000000, 50000000000, 60000000000, 80000000000, 100000000000,
    120000000000, 150000000000, 180000000000, 2000000000000, 30000000000000, 40000000000000, 50000000000000, 60000000000000, 70000000000000, 80000000000000, 90000000000000, 100000000000000, 110000000000000, 120000000000000, 130000000000000, 140000000000000, 150000000000000, 160000000000000, 170000000000000, 180000000000000, 190000000000000, 200000000000000, 210000000000000, 210000000000000, 220000000000000, 230000000000000, 240000000000000, 250000000000000, 260000000000000, 270000000000000, 280000000000000, 290000000000000, 300000000000000, 310000000000000, 320000000000000, 330000000000000, 340000000000000, 
];

api.setMaxPlayers(40,40)

const RANKS = [
    {name: "Stone", lv: 1, color: "#A9A9A9"}, {name: "Iron", lv: 5, color: "#D3D3D3"},
    {name: "Bronze", lv: 9, color: "#CD7F32"}, {name: "Silver", lv: 13, color: "#C0C0C0"},
    {name: "Gold", lv: 17, color: "#FFD700"}, {name: "Platinum", lv: 21, color: "#E5E4E2"},
    {name: "Diamond", lv: 25, color: "#B9F2FF"}, {name: "Emerald", lv: 29, color: "#50C878"},
    {name: "Ruby", lv: 33, color: "#E0115F"}, {name: "Sapphire", lv: 37, color: "#0F52BA"},
    {name: "Amethyst", lv: 41, color: "#9966CC"}, {name: "Topaz", lv: 45, color: "#FFC87C"},
    {name: "Obsidian", lv: 49, color: "#3C4142"}, {name: "Crystal", lv: 53, color: "#F5F5F5"},
    {name: "Pearl", lv: 57, color: "#EAE0C8"}, {name: "Shadow", lv: 61, color: "#303030"},
    {name: "Mystic", lv: 65, color: "#FF00FF"}, {name: "Ancient", lv: 69, color: "#7B3F00"},
    {name: "Eternal", lv: 73, color: "#00FFFF"}, {name: "Divine", lv: 77, color: "#FFFDD0"},
    {name: "Celestial", lv: 81, color: "#4169E1"}, {name: "Immortal", lv: 85, color: "#FFDAB9"},
    {name: "Mythic", lv: 89, color: "#800000"}, {name: "Master", lv: 93, color: "#C0C0C0"},
    {name: "Legend", lv: 97, color: "#FF450F"}, {name: "Godly", lv: 100, color: "cyan"}, {name: "God", lv: 120, color: "gold"},
];

const Admin = ["Soranokami", "5kaideta_yuuto", "itarQ", "Rui_TEIAl", "Chocolate", "Sigure11", "huirun_huihui"];
const Mod = ["TGK_no_KAITO","RAPIDgames"];
const chatBan = ["ZZZznnnnnnnnnn","Sans_ATK_1_DEF_1","SSS_JP","SS_S"];

const SPAWN_POSITIONS = [
    [88, -3200, 46], [41, -3200, 16], [46, -3200, 4], [87, -3200, -12],
    [109, -3200, 18], [99, -3200, 27], [79, -3200, 6], [19, -3200, 35],
    [68, -3200, 50], [71, -3200, 38], [113, -3200, 39], [98, -3200, -13],
    [93, -3200, -22], [42, -3200, -12], [12, -3200, -15]
];

let actionQueue = [];
let spawnTimer = 0;

const loadData = (p) => {
    let data = { xp: 0, level: 1, gold: 0 };
    const it = api.getMoonstoneChestItemSlot(p, 35);
    if (it && it.attributes && it.attributes.customDescription) {
        try {
            const jsonStr = it.attributes.customDescription.split("\n")[0];
            data = Object.assign(data, JSON.parse(jsonStr));
        } catch (e) {}
    }
    return data;
};

function dataLoad(p){loadData(p)}
function dataSave(p,d){saveData(p,d)}
const saveData = (p, data) => {
    api.setMoonstoneChestItemSlot(p, 35, "Black Paintball", 1, {
        customDisplayName: "Player Stats",
        customDescription: JSON.stringify(data)
    });
};

const getRankInfo = (lv) => {
    let current = RANKS[0];
    for (const r of RANKS) {
        if (lv >= r.lv) current = r;
    }
    return current;
};

const getNextLevelXP = (lv) => {
    return XP_TABLE[lv - 1] || XP_TABLE[XP_TABLE.length - 1];
};

const updateRightUI = (p) => {
    const data = loadData(p);
    const rankInfo = getRankInfo(data.level);
    const nextXP = getNextLevelXP(data.level);
    const neededXP = Math.max(0, nextXP - data.xp);

    api.setClientOption(p, "RightInfoText", [
        {str: "--- Trial-Dungeon ---\n", style:{color:"gold", fontWeight:"bold"}},
        {str: "Level: ", style:{color:"white"}}, {str: data.level + "\n", style:{color:"yellow"}},
        {str: "XP: ", style:{color:"white"}}, {str: data.xp + "/" + nextXP + "\n", style:{color:"aqua"}},
        {str: "Next: ", style:{color:"white"}}, {str: neededXP + " XP\n", style:{color:"orange"}},
        {str: "Rank: ", style:{color:"white"}}, {str: rankInfo.name + "\n", style:{color: rankInfo.color}},
        {str: "Gold: ", style:{color:"white"}}, {str: data.gold + "\n", style:{color:"yellow"}},
        {str: "/clear Gray, /clear Light Gray\n　で灰色、薄灰色の玉を全部削除できます\n"},
		{str: "/clear Wood\n　で木装備をすべて消せます\n"},
    ]);

    const name = api.getEntityName(p);
    if(manageRank(p) === "Player"){
        api.setTargetedPlayerSettingForEveryone(p, "nameTagInfo", {
            subtitle: [{ str: rankInfo.name, style: { color: rankInfo.color } }]
        }, true);
    }else if(name === "Soranokami_VOCALOID"){
        api.setTargetedPlayerSettingForEveryone(p, "nameTagInfo", {
            content: [{str: name, style: {color: "yellow"}}],
            subtitle: [{str: "[Owner] ", style: {color:"#00CED1"}}, { str: rankInfo.name, style: { color: rankInfo.color } }],
            backgroundColor: "#AAAAAA00",
            subtitleBackgroundColor: "#AAAAAA00",
        }, true);
    }else if(manageRank(p) === "Admin"){
        api.setTargetedPlayerSettingForEveryone(p, "nameTagInfo", {
            content: [{str: name, style: {color: "lime"}}],
            subtitle: [{str: "[Admin] ", style: {color:" #00AEEF"}}, { str: rankInfo.name, style: { color: rankInfo.color } }],
            backgroundColor: "#AAAAAA00",
            subtitleBackgroundColor: "#AAAAAA00",
        }, true);
    }else if(manageRank(p) === "Mod"){
        api.setTargetedPlayerSettingForEveryone(p, "nameTagInfo", {
            content: [{str: name, style: {color: "lightyellow"}}],
            subtitle: [{str: "[Moderator] ", style: {color:" #00FEFC"}}, { str: rankInfo.name, style: { color: rankInfo.color } }],
            backgroundColor: "#AAAAAA00",
            subtitleBackgroundColor: "#AAAAAA00",
        }, true);
    }

    api.setTargetedPlayerSettingForEveryone(p, 'lobbyLeaderboardValues', {
        rank: rankInfo.name,
        level: data.level,
        xp: data.xp,
        gold: data.gold
    });
};

const addXP = (p, amount) => {
    let data = loadData(p);
    const oldRankName = getRankInfo(data.level).name;
    data.xp += amount;
    let up = false;
    while (data.level < XP_TABLE.length && data.xp >= getNextLevelXP(data.level)) {
        data.xp -= getNextLevelXP(data.level);
        data.level++;
        up = true;
    }
    if (up) {
        const newRank = getRankInfo(data.level);
        api.broadcastMessage(`${api.getEntityName(p)} が Lv.${data.level} に上がった！\n${api.getEntityName(p)} has leveled up to Level ${data.level}!`, {color:"yellow"});
        if (oldRankName !== newRank.name) {
            api.broadcastMessage([
                {str: `${api.getEntityName(p)} がランクアップ！ [`, style:{color:"white"}},
                {str: newRank.name, style:{color: newRank.color}},
                {str: "] に到達した！\n", style:{color:"white"}},
                {str: `${api.getEntityName(p)} has leveled up! Reached [`, style:{color:"white"}},
                {str: newRank.name, style:{color: newRank.color}},
                {str: "]!", style:{color:"white"}},
            ]);
        }
    }
    saveData(p, data);
    updateRightUI(p);
};

const addGold = (p, amount) => {
    let data = loadData(p);
    data.gold += amount;
    saveData(p, data);
    updateRightUI(p);
};

const manageRank = (p) => {
    const name = api.getEntityName(p);
    let result;
    const isAdmin = Admin.some(adminName => name.includes(adminName));
    const isMod = Mod.some(adminName => name.includes(adminName));
    if(isAdmin) result = "Admin";
    if(isMod) result = "Mod";
    if(!isAdmin && !isMod) result = "Player"
    return result
}

tick = () => {
    while (actionQueue.length > 0) {
        const action = actionQueue.shift();
        if (typeof action === "function") action();
    }

    if (++spawnTimer >= 400) {
        spawnTimer = 0;
        let currentTotalMobs = api.getMobIds().length;
        const maxMobs = api.getPlayerIds().length * 3;

        SPAWN_POSITIONS.forEach((p) => {
            if (currentTotalMobs >= maxMobs) return;
            const mobType = Math.random() < 0.8 ? "Draugr Zombie" : "Draugr Skeleton";
            api.attemptSpawnMob(mobType, p[0], p[1], p[2]);
            currentTotalMobs++;
        });
    }
};

onPlayerChat = (p, msg, channel) => {
    if (channel === "Tribe") return true;
    const name = api.getEntityName(p);
    const adminRank = manageRank(p);

    if(chatBan.some(banName => name.includes(banName)) == true){
        api.sendMessage(p, "あなたはchatbanされています。メッセージはオーナーにのみ送信されました。\nYou have been banned from chat. Your message was sent only to the owner.");
        var players = api.getPlayerIds();
        for (var i = 0; i < players.length; i++) {
            if (api.getEntityName(players[i]) === "Soranokami_VOCALOID") {
                api.sendMessage(players[i], [
                    {str: "[ChatBan] ", style: {color: "red", fontWeight: "bold"}},
                    {str: name + ": ", style: {color: "white"}},
                    {str: msg, style: {color: "gray"}}
                ]);
                break;
            }
        }
        return false;
    }
    
    actionQueue.push(() => {
        const data = loadData(p);
        const rankInfo = getRankInfo(data.level);
        const chatParts = [];
        let nameColor = "white"

        if (name === "Soranokami_VOCALOID") {
            chatParts.push({str: `[Owner] `, style: {color: "#00CED1", fontWeight: "bold"}}); 
            chatParts.push({str: ` `, style: {}});
            nameColor = "yellow"
        } else if (adminRank === "Admin") {
            chatParts.push({str: `[Admin] `, style: {color: "#00AEEF"}});
            nameColor = "lime"
        } else if (adminRank === "Mod") {
            chatParts.push({str: `[Moderation] `, style:{color:"#00FEFC"}});
            nameColor = "lightyellow"
        }

        chatParts.push({str: `[${rankInfo.name}] `, style: {color: rankInfo.color}});
        chatParts.push({str: `${name}: `, style: {color: nameColor}});
        chatParts.push({str: msg, style: {color: "white"}});
        
        api.broadcastMessage(chatParts);
    });
    return false;
};

helpMsg = []

playerCommand = (p, c) => {
    if(c == "help"){
      api.sendMessage(p, helpMsg)
    }
    if(c.startsWith("clear")){
      if(c.slice(6) == "Gray"){
        api.removeItemName(p, "Gray Paintball", 999)
        api.sendMessage(p, [{icon:"Gray Paintball"}, {str:"を削除しました"}])
      }else if(c.slice(6) == "Light Gray"){
        api.removeItemName(p, "Light Gray Paintball", 999)
        api.sendMessage(p, [{icon:"Light Gray Paintball"}, {str:"を削除しました"}])
	  }else if(c.slice(6) == "Wood"){
		type = ["Helmet", "Chestplate", "Gauntlets", "Leggings", "Boots"]
		for(let now of type){
		  api.removeItemName(p, "Wood " + now, 999)
		}
        api.sendMessage(p, [{icon:"Wood Helmet"},{icon:"Wood Chestplate"},{icon:"Wood Gauntlets"},{icon:"Wood Leggings"},{icon:"Wood Boots"}, {str:"を削除しました"}])
      }else {
        api.sendMessage(p, "形式が正しくありません")
      }
    return true;
    }
    if(c.startsWith("addXp")){
      if(manageRank(p) === "Admin"){
        addXP(p, Number(c.slice(6)));
        api.sendMessage(p, `${c.slice(6)} XPを付与しました`)
      }else {
        api.sendMessage(p, `Admin専用コマンドです`)
      }
    return true
    }
    if(c.startsWith("addGold")){
      if(manageRank(p) === "Admin"){
        addGold(p, Number(c.slice(8)));
        api.sendMessage(p, `${c.slice(8)} Goldを付与しました`)
      }else {
        api.sendMessage(p, `Admin専用コマンドです`)
      }
    return true
    }
    if(c.startsWith("info")){
      if(manageRank(p) === "Admin"){
        api.broadcastMessage([{str:"[お知らせ] ",style:{fontSize:"20px",fontWeight:"bold",color:"orange"}},{str:c.slice(5),style:{fontSize:"20px",color:"orange"}}])
      }else {
        api.sendMessage(p, `Admin専用コマンドです`)
      }
    return true
    }
    if(c.startsWith("eninfo")){
      if(manageRank(p) === "Admin"){
        api.broadcastMessage([{str:"[Notice] ",style:{fontSize:"20px",fontWeight:"bold",color:"orange"}},{str:c.slice(7),style:{fontSize:"20px",color:"orange"}}])
      }else {
        api.sendMessage(p, `Admin専用コマンドです`)
      }
    return true
    }
    if(c.startsWith("give")){
      if(manageRank(p) === "Admin"){
        api.giveItem(p, c.slice(5), 1, {})
        str = [{icon: c.slice(5)}, {str: "を1つ付与しました"}]
        api.sendMessage(p, str)
      }else {
        api.sendMessage(p, `Admin専用コマンドです`)
      }
    return true
    }
}

onPlayerJoin = (p) => {
    api.setClientOptions(p, { autoRespawn: true });
    const passables = ["Code Block", "Glass", "Yellow Portal", "Light Blue Portal", "Lime Portal"];
    passables.forEach(type => api.setWalkThroughType(p, type));

    const it = api.getMoonstoneChestItemSlot(p, 35);
    if (!it) saveData(p, { xp: 0, level: 1, gold: 0 });

    api.setClientOption(p, 'lobbyLeaderboardInfo', {
        name: { displayName: "Name", sortPriority: 4 },
        rank: { displayName: "Rank", sortPriority: 3 },
        level: { displayName: "Level", sortPriority: 0 },
        xp: { displayName: "XP", sortPriority: 1 },
        gold: { displayName: "Gold", sortPriority: 2 },
    });
    api.removeItemName(p, "Cyan Paintball", 999)
    api.removeItemName(p, "Bone", 999)
    api.removeItemName(p, "Bone Meal", 999)
    api.removeItemName(p, "Rotten Flesh", 999)
    
    updateRightUI(p);
};

onPlayerKilledMob = (p, m) => {
    const mobType = api.getEntityType(m);
    const mobName = api.getEntityName(m);
    if (mobName === "=Spirit= Pickaxe Golem") {addXP(p,150000);addGold(p,1500)}
    if (mobName === "Pickaxe Golem") {addXP(p,100000);addGold(p,1000)}
    if (mobName === "Crystalline Golem") {addXP(p,50000);addGold(p,5000)}
    if (mobName === "Masked Knight") {addXP(p,30000);addGold(p,3000)}
    if (mobName === "Shroom Golem") {addXP(p,10000);addGold(p,1000);}
    if (mobType === "Draugr Zombie") {
        addXP(p, 10);
        addGold(p, 5);
    } else if (mobType === "Draugr Skeleton") {
        addXP(p, 15);
        addGold(p, 10);
    }
};



onPlayerLeave = (p) => {
    saveData(p, loadData(p));
};

onPlayerDamagingMob = (pId, mobId, damage) => {
    const hp = Math.max(0, Math.floor(api.getHealth(mobId) - damage));
    const txt = hp > 0 ? hp.toString() : "Dead";
    api.sendFlyingMiddleMessage(pId, [
        { str: txt, style: { color: "#E5E5E5" } },
        { str: " [-" + Math.floor(damage) + "]", style: { fontSize: "15px", color: "#C05070" } }
    ], 25);
};

onPlayerDamagingOtherPlayer = (a, v, d, w) => { 
    if(manageRank(a) == "Player"){
        return "preventDamage"
    }
    if(api.getHeldItem(a)?.name !== "Stick"){
        return "preventDamage"
    }
    const hp = Math.max(0, Math.floor(api.getHealth(v) - d));
    const txt = hp > 0 ? hp.toString() : "Dead";
    api.sendFlyingMiddleMessage(a, [
        { str: txt, style: { color: "#E5E5E5" } },
        { str: " [-" + Math.floor(d) + "]", style: { fontSize: "15px", color: "#C05070" } }
		])
}