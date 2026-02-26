//1.1 打击 效果
onPlayerDamagingOtherPlayer = (Id1, Id2, num, Item) => {
	//1.1.1 嗜血 效果
	if (api.getHeldItem(Id1)?.attributes.customDisplayName == '吸血刀' && Item == 'Iron Sword') {
		api.applyEffect(Id1, "Health Regen", 5000, { inbuiltLevel: 3 })
	}
	//1.1.5 护目镜 效果
	if (api.getHeldItem(Id1)?.attributes.customDisplayName == '定身术' && Item == 'Maple Door') {
		api.applyEffect(Id2, "Frozen", 5000, { inbuiltLevel: 0 })
	}
	//1.1.6 暴风 效果
	if (api.getHeldItem(Id1)?.attributes.customDisplayName == '闪瞎你的眼睛' && Item == 'Mango') {
		api.applyEffect(Id2, "Blindness", 1000, { inbuiltLevel: 0 })
	}
}
//1.2 大招 效果
function onPlayerAttemptAltAction(Id) {
	//1.2.1 深蓝之盾 大招
	if (api.getHeldItem(Id)?.attributes.customDisplayName == '深蓝之盾' && api.getHeldItem(Id)?.name == 'Wood Axe') {
		api.applyEffect(Id, "Slowness", 5000, { inbuiltLevel: 2 })
		api.applyEffect(Id, "Damage Reduction", 10000, { inbuiltLevel: 50 })
	}
	//1.2.2 动力蝴蝶刀 大招
	if (api.getHeldItem(Id)?.attributes.customDisplayName == '动力蝴蝶刀' && api.getHeldItem(Id)?.name == 'Shears') {
		api.applyEffect(Id, "Poisoned", 5000, { inbuiltLevel: 2 })
		api.applyEffect(Id, "Speed", 5000, { inbuiltLevel: 6 })
		api.applyEffect(Id, "Damage", 5000, { inbuiltLevel: 50 })
	}
	//1.2.2 粒子火花剑 大招
	if (api.getHeldItem(Id)?.attributes.customDisplayName == '粒子火花剑' && api.getHeldItem(Id)?.name == 'Knight Sword') {
		api.applyEffect(Id, "Damage", 5000, { inbuiltLevel: 30 })
		api.applyEffect(Id, "Speed", 5000, { inbuiltLevel: 3 })
		api.applyEffect(Id, "Damage Reduction", 5000, { inbuiltLevel: 30 })
	}

	//1.2.2 重工铁拳 大招
	if (api.getHeldItem(Id)?.attributes.customDisplayName == '风暴锤' && api.getHeldItem(Id)?.name == 'Moonstone Mace') {
		api.applyEffect(Id, "Damage", 10000, { inbuiltLevel: 40 })
		api.applyEffect(Id, "Slowness", 5000, { inbuiltLevel: 3 })
		api.applyEffect(Id, "Damage Reduction", 6000, { inbuiltLevel: 30 })
	}
	//1.2.5 二段跳
	if (api.getHeldItem(Id)?.attributes.customDisplayName == '动力回旋镖' && api.getHeldItem(Id)?.name == 'Moonstone Boomerang') {
		api.applyEffect(Id, "Damage", 10000, { inbuiltLevel: 40 })
		api.applyEffect(Id, "X-Ray Vision", 5000, { inbuiltLevel: 3 })
		api.applyEffect(Id, "Damage Reduction", 6000, { inbuiltLevel: 30 })
	}
	//6 锁血图腾
	if (api.getHeldItem(Id)?.attributes.customDisplayName == "锁血图腾" && api.getHeldItem(Id)?.name == "Red Paintball") {
		api.applyEffect(Id, "Damage Reduction", 5000, { inbuiltLevel: 50 })
		api.removeItemName(Id, "Yellow Banner", 1)
	}
}
//2 聊天室设定
//2.1 前缀和颜色
//2.1.1 管理员名字列表
Charm = ["676767simon"]
BestPerson = [""]
Coder = ["AmazingLion9980288", "s6866fdvdsv", "guanglin", "LumpyTaco3153700", "574123690"]
Grass = ["M3"]
Builder = ["g"]
KeFu = ["WangDongerhappynow"]
Mod = [""]
//2.1.2 玩家名字
function onPlayerChat(pid, msg) {
	name = api.getEntityName(pid);
	userType = "玩家";
	//2.1.3 前缀
	if (Charm.includes(name)) { userType = "腐竹!" }
	else if (BestPerson.includes(name)) { userType = "🩷是集指令和建筑于一身的Sn呀!" }
	else if (Coder.includes(name)) { userType = "老玩家" }
	else if (Builder.includes(name)) { userType = "护航" }
	else if (Grass.includes(name)) { userType = "草方块" }
	else if (KeFu.includes(name)) { userType = "国防三角洲服专用客服" }
	//2.1.4 颜色
	userColor = "white";
	if (Charm.includes(name)) { userColor = "orange" }
	else if (BestPerson.includes(name)) { userColor = "pink" }
	else if (Coder.includes(name) || Grass.includes(name)) { userColor = "lime" }
	else if (Builder.includes(name)) { userColor = "Cyan" }
	else if (KeFu.includes(name)) { userColor = "White" }
	//2.1.5 加上前缀和颜色
	api.broadcastMessage([{ str: "[" + userType + "] ", style: { color: "gold" } }, { str: name, style: { color: userColor } }, { str: ": " + msg }]);
	return false;
	return [{ str: "[" + userType + "]", color: "gray" }]
}
//2.2 没收违禁品功能
//2.2.1 违禁品列表
const notallowed = ["Moonstone Explosive", "RPG", "Fireball", "Grenade Launcher", "Super RPG", "Bouncy Bomb", "Iceball", "Moonstone Remote Explosive", "Toxin Ball", "Diamond Hoe"];
//2.2.2 侦测违禁品 没收+警告
let playerStates = {};   // id -> { active: bool, timer: number }
onInventoryUpdated = (playerId) => {
	for (const item of notallowed) {
		if (api.getInventoryItemAmount(playerId, item) > 0 && !Mod.includes(api.getEntityName(playerId))) {
			api.removeItemName(playerId, item, api.getInventoryItemAmount(playerId, item))
			name = api.getEntityName(playerId)
			警告 = api.broadcastMessage(name + "啊，" + item + "太危险了，我帮你收起来哈", { color: "red" })
		}
	}
	//2.4.1 猫猫奖章
	if (api.getInventoryItemAmount(playerId, "Poop") > 11) {
		name = api.getEntityName(playerId)
		api.removeItemName(playerId, "Moonstone", 1)
		api.giveItem(playerId, "Allium", 1, {
			customDescription: "获得这个平均得一直在线一小时啊，肝帝！",
			customDisplayName: "猫猫奖章ฅ^>⩊<^ฅ",
			customAttributes: { "enchantmentTier": "Tier 5" }
		})
		api.broadcastMessage([{ str: "[国防三角洲] 恭喜 ", style: { color: "gold" } }, { str: name, style: { color: "white" } }, { str: " 获得十二个猫猫事件!现颁发奖章一枚!", style: { color: "gold" } }])
	}
}
//2.3 小提示
//2.3.1 小提示列表
tips = ["腐竹在加拿大所以有时差", "最好不要要管理", "新手去找老玩家带"]
function tick(ms) {
	hint = Math.floor(Math.random() * 12000)
	if (hint > 1 && hint <= 10) {
		//2.3.2 小提示
		i = Math.floor(Math.random() * tips.length)
		api.broadcastMessage([{ str: "[国防三角洲] ", style: { color: "gold" } }, { str: "小提示: ", style: { color: "gold" } }, { str: tips[i], style: { color: "gold" } }])
	}
	else if (hint <= 1) {

		//4.3.1 金附魔台转金币
		if (api.getInventoryItemAmount(Id, "Gold Enchanting Table") > 0) {
			api.giveItem(Id, "Gold Coin", api.getInventoryItemAmount(Id, "Gold Enchanting Table"), {
				customDescription: "通用货币",
				customDisplayName: "金币",
				customAttributes: { enchantmentTier: "Tier 5" }
			})
			api.removeItemName(Id, "Gold Enchanting Table", api.getInventoryItemAmount(Id, "Gold Enchanting Table"))
		}
		//4.3.2 钻附魔台转压金
		if (api.getInventoryItemAmount(Id, "Diamond Enchanting Table") > 0) {
			api.giveItem(Id, "Gold Bar", api.getInventoryItemAmount(Id, "Diamond Enchanting Table"), {
				customDescription: "通用货币",
				customDisplayName: "压缩金币",
				customAttributes: { enchantmentTier: "Tier 5" }
			})
			api.removeItemName(Id, "Diamond Enchanting Table", api.getInventoryItemAmount(Id, "Diamond Enchanting Table"))
		}
	}
}
//2.5 上线欢迎
onPlayerJoin = (Id, reset) => {
	if (!reset) {
		name = api.getEntityName(Id)
		//2.5.1 服务器欢迎
		api.broadcastMessage([{ str: "[国防三角洲] ", style: { color: "gold" } }, { str: name, style: { color: "white" } }, { str: " 你好!", style: { color: "gold" } }])
		//2.5.2 音乐
		api.setClientOption(Id, "music", "Mojo Productions - Sneaky Jazz")
		api.setPosition(Id, 36, 517, -45)
	}
}
//3 掉落系统
//3.1 掉落物品列表 (物品,物品名称,物品描述,附魔等级,枪,子弹)
GunAmount = 7
Gun = ["M1911", "MP40", "AK-47", "M16", "AWP", "Double Barrel", "Minigun"]
GunName = ["轻盈", "狂热", "冲锋", "嗜血", "护目镜", "敖犬", "暴风"]
GunMaxAmmo = [16, 300, 300, 300, 80, 100, 1000]
GunTier = ["Tier 1", "Tier 2", "Tier 2", "Tier 2", "Tier 3", "Tier 3", "Tier 4"]
GunCChance = [0.3, 0.05, 0.05, 0.05, 0, 0, 0]
GunBChance = [0, 0.2, 0.2, 0.2, 0.05, 0.05, 0]
GunAChance = [0, 0, 0, 0, 0.5, 0.5, 0.15]
GunSChance = [0, 0, 0, 0, 0, 0, 1]
const MoneyAmount = 2
const Money = ["Gold Coin", "Gold Bar"]
const MoneyName = ["金币", "压缩金币"]
//3.2 侦测 玩家杀死玩家
onPlayerKilledOtherPlayer = (Id1, Id2) => {
	//3.2.1 枪掉落
	for (let i = 0; i < GunAmount; i++) {
		if (api.getInventoryItemAmount(Id2, Gun[i]) > 0) {
			api.giveItem(Id1, Gun[i], api.getInventoryItemAmount(Id2, Gun[i]), {
				customDisplayName: GunName[i],
				customAttributes: { shotsLeft: GunMaxAmmo[i] }
			})
			api.removeItemName(Id2, Gun[i], api.getInventoryItemAmount(Id2, Gun[i]))
		}
	}
	//3.2.2 钱掉落
	for (let i = 0; i < MoneyAmount; i++) {
		if (api.getInventoryItemAmount(Id2, Money[i]) > 0) {
			api.giveItem(Id1, Money[i], api.getInventoryItemAmount(Id2, Money[i]), {
				customDescription: "通用货币",
				customDisplayName: MoneyName[i],
				customAttributes: { "enchantmentTier": "Tier 5" }
			})
			api.removeItemName(Id2, Money[i], api.getInventoryItemAmount(Id2, Money[i]))
		}
	}
	//3.2.3 战利品掉落
	for (let i = 0; i < ChestItemsAmount; i++) {
		if (api.getInventoryItemAmount(Id2, ChestItem[i]) > 0) {
			api.giveItem(Id1, ChestItem[i], api.getInventoryItemAmount(Id2, ChestItem[i]), {
				customDisplayName: ChestItemName[i] + "[$" + ChestItemPrice[i] + "]",
				customAttributes: { "enchantmentTier": ChestItemTier[i] }
			})
			api.removeItemName(Id2, ChestItem[i], api.getInventoryItemAmount(Id2, ChestItem[i]))
		}
	}
}
//4 箱子补充
//4.1 物品池
//4.1.1 物品列表 [数量,ID,名称,价格,等级,C-S类箱中的出现概率]
ChestItemsAmount = 37
ChestItem = ["Bone Meal", "Bone Meal", "Bone Meal", "Bone Meal", "Bone Meal", "Bone Meal", "Bone Meal", "Bone Meal", "Bone Meal", "Moonstone", "Moonstone", "Moonstone", "Moonstone", "Moonstone", "Moonstone", "Moonstone", "Moonstone", "Moonstone", "Block of Gold", "Block of Gold", "Block of Gold", "Block of Gold", "Block of Gold", "Block of Gold", "Beacon", "Beacon", "Beacon", "Beacon", "Beacon", "Beacon", "Beacon", "Dim Lamp On", "Dim Lamp On", "Dim Lamp On", "Dim Lamp On", "Dim Lamp On", "Dim Lamp On"]
ChestItemName = ["记事本", "束带", "抽纸巾", "空瓶子", "简单零件", "基本电池(灰色)", "废弃金属", "游戏卡带", "纸堆", "基本电脑芯片(灰色)", "镊子", "瑞士芝士", "中阶电池(黄色)", "钢管堆", "铜导线圈", "遗骸", "精密仪器蓝图", "磁吸摄像头", "LED灯管", "铁丝网", "中阶芯片(黄色)", "精密仪器", "高阶军用电池(橙色)", "解码金砖", "机密优盘", "军用电路板", "超精密仪器", "高阶军用芯片(橙色)", "顶尖锂离子电池(红色)", "军用阵地雷达", "天然鋯英石晶体", "黄金国家级服务器", "铀-235原矿", "顶尖量子芯片(红色)", "铀-235晶体", "血钻", "传奇晶体[荣誉物品][超级大红]"]
ChestItemPrice = [10, 10, 20, 20, 20, 30, 50, 70, 100, 150, 200, 200, 250, 300, 300, 300, 350, 450, 600, 800, 800, 850, 900, 1000, 2000, 2500, 3000, 3000, 3200, 3500, 5000, 10000, 24000, 30000, 72000, 88000, 299700]
ChestItemTier = ["Tier 1", "Tier 1", "Tier 1", "Tier 1", "Tier 1", "Tier 1", "Tier 1", "Tier 1", "Tier 1", "Tier 1", "Tier 2", "Tier 2", "Tier 2", "Tier 2", "Tier 2", "Tier 2", "Tier 2", "Tier 2", "Tier 3", "Tier 3", "Tier 3", "Tier 3", "Tier 3", "Tier 3", "Tier 4", "Tier 4", "Tier 4", "Tier 4", "Tier 4", "Tier 4", "Tier 4", "Tier 4", "Tier 5", "Tier 5", "Tier 5", "Tier 5", "Tier 5"]
ChestCChance = [0.85, 0.85, 0.83, 0.83, 0.83, 0.82, 0.80, 0.78, 0.75, 0.72, 0.22, 0.22, 0.21, 0.20, 0.20, 0.20, 0.19, 0.16, 0.03, 0.027, 0.027, 0.024, 0.024, 0.018, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
ChestBChance = [0.70, 0.70, 0.68, 0.68, 0.68, 0.67, 0.65, 0.63, 0.60, 0.57, 0.44, 0.44, 0.42, 0.40, 0.40, 0.40, 0.38, 0.32, 0.18, 0.17, 0.17, 0.16, 0.15, 0.12, 0.06, 0.057, 0.054, 0.054, 0.051, 0.048, 0.036, 0.009, 0, 0, 0, 0, 0]
ChestAChance = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.85, 0.85, 0.83, 0.80, 0.80, 0.80, 0.77, 0.70, 0.40, 0.38, 0.38, 0.36, 0.34, 0.24, 0.22, 0.20, 0.18, 0.18, 0.17, 0.16, 0.12, 0.03, 0.03, 0.024, 0.018, 0.015, 0]
ChestSChance = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.85, 0.83, 0.83, 0.80, 0.77, 0.72, 0.40, 0.38, 0.36, 0.36, 0.34, 0.32, 0.24, 0.10, 0.25, 0.22, 0.18, 0.15, 0.05]
//4.1.2 箱子加物品
function setChestItem(ChestChance, GunChance, myId, x, y, z) {
	l = 0
	for (let i = 0; i < ChestItemsAmount; i++) {
		if (Math.random() < ChestChance[i]) {
			api.setStandardChestItemSlot([x = x, y = y, z = z], l, ChestItem[i], 1, myId, {
				customDisplayName: ChestItemName[i] + "[$" + ChestItemPrice[i] + "]",
				customAttributes: { enchantmentTier: ChestItemTier[i] }
			})
			l = Number(l) + Number(1)
		}
	}
	//4.1.3 箱子加枪
	for (let i = 0; i < GunAmount; i++) {
		if (Math.random() < GunChance[i]) {
			api.setStandardChestItemSlot([x = x, y = y, z = z], l, Gun[i], 1, myId, {
				customDisplayName: GunName[i],
				customAttributes: { enchantmentTier: GunTier[i], shotsLeft: GunMaxAmmo[i] }
			})
			l = Number(l) + Number(1)
		}
	}
}
//4.1.6 清除箱子
function ClearChestItem(myId, x, y, z) {
	for (let i = 0; i < 36; i++) {
		api.setStandardChestItemSlot([x = x, y = y, z = z], i, "Air")
	}
}
//4.2 开箱补充物品
chestcd = []
function onPlayerAttemptOpenChest(myId, x, y, z, ismoon) {
	if (ismoon) return
	if (!ismoon && (!chestcd[[x = x, y = y, z = z]] || api.now() - chestcd[[x = x, y = y, z = z]] > 25000)) {
		if (api.getBlock(x, y + 1, z) == "Gray Concrete Slab") {
			chestcd[[x = x, y = y, z = z]] = api.now()
			api.sendMessage(myId, "打开C级箱")
			ClearChestItem(myId, x, y, z)
			setChestItem(ChestCChance, GunCChance, myId, x, y, z)
		}
		if (api.getBlock(x, y + 1, z) == "Blue Concrete Slab") {
			chestcd[[x = x, y = y, z = z]] = api.now()
			api.sendMessage(myId, "打开B级箱")
			ClearChestItem(myId, x, y, z)
			setChestItem(ChestBChance, GunBChance, myId, x, y, z)
		}
		if (api.getBlock(x, y + 1, z) == "Orange Concrete Slab") {
			chestcd[[x = x, y = y, z = z]] = api.now()
			api.sendMessage(myId, "打开A级箱")
			ClearChestItem(myId, x, y, z)
			setChestItem(ChestAChance, GunAChance, myId, x, y, z)
		}
		if (api.getBlock(x, y + 1, z) == "Red Concrete Slab") {
			chestcd[[x = x, y = y, z = z]] = api.now()
			api.sendMessage(myId, "打开S级箱")
			ClearChestItem(myId, x, y, z)
			setChestItem(ChestSChance, GunSChance, myId, x, y, z)
		}
	}
	else {
		api.sendMessage(myId,
			"重启状态...")
		if (api.getBlock(x, y + 1, z) == "Gray Wool") return 'preventOpen'
	}
	return true
}
//4.3 金附魔台转金币 (Code Block 打中文会乱码,改去 World Code)
//5 防止合成
function onPlayerDamagingOtherPlayer(e, o, l, r, s) {
	// ====== Totem of Undying ======
	let a = api.getHeldItem(o); // 注意这里拿受害者手里的Totem
	let i = api.getHealth(o);
	if (a?.attributes?.customDisplayName === "图腾" && i - l <= 30) {
		api.setHealth(o, 100);
		api.setShieldAmount(o, 50);
		api.applyEffect(o, "Health Regen", 10000, { icon: "Health Regen", displayName: "Totem Regeneration", inbuiltLevel: 2 });
		api.applyEffect(o, "Damage Reduction", 8000, { icon: "Damage Reduction", displayName: "Totem Protection", inbuiltLevel: 1 });
		api.removeItemName(o, a.name, 1);

		let [n, c, y] = api.getPosition(o);
		api.playParticleEffect({
			dir1: [-3, -3, -3],
			dir2: [3, 3, 3],
			pos1: [n - 3, c, y - 3],
			pos2: [n + 3, c + 3, y + 3],
			texture: "glint",
			minLifeTime: 0.3,
			maxLifeTime: 1,
			minEmitPower: 3,
			maxEmitPower: 5,
			minSize: 0.3,
			maxSize: 0.7,
			manualEmitCount: 100,
			gravity: [0, -5, 0],
			colorGradients: [{ timeFraction: 0, minColor: [255, 223, 0, 1], maxColor: [255, 255, 100, 1] }],
			velocityGradients: [{ timeFraction: 0, factor: 1, factor2: 1 }],
			blendMode: 1,
		});

		api.sendMessage(o, "Totem of Undying activated!", { color: "gold" });
		return "preventDamage";
	}

	// ====== Mace Slam ======
	let d = api.getHeldItem(e); // 攻击者手里的Mace
	if (d?.attributes?.customDisplayName === "重锤") {
		let m = api.getPosition(e);
		if (m[1] - Math.floor(m[1]) > 0.1) {
			api.applyHealthChange(o, -30, e);
			api.applyEffect(o, "Blindness", 3000, { icon: "Blindness", displayName: "Blindness", inbuiltLevel: 8 });
			api.applyEffect(o, "Frozen", 3000, { icon: "Frozen", displayName: "Frozen", inbuiltLevel: 10 });


			let [p, u, g] = api.getPosition(o);
			api.setVelocity(e, 0, 20, 0);

			api.playParticleEffect({
				dir1: [-3, -3, -3],
				dir2: [3, 3, 3],
				pos1: [p - 3, u, g - 3],
				pos2: [p + 3, u + 3, g + 3],
				texture: "glint",
				minLifeTime: 0.3,
				maxLifeTime: 1,
				minEmitPower: 3,
				maxEmitPower: 5,
				minSize: 0.3,
				maxSize: 0.7,
				manualEmitCount: 100,
				gravity: [0, -5, 0],
				colorGradients: [{ timeFraction: 0, minColor: [180, 180, 180, 1], maxColor: [255, 255, 255, 1] }],
				velocityGradients: [{ timeFraction: 0, factor: 1, factor2: 1 }],
				blendMode: 1,
			});

			return "preventDamage";
		}
	}
}

