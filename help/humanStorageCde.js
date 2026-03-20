bigStorage = new Map([
    ["afurry2", 0],
    ["chdsz", 1],
    ["Verylbhg", 2],
    ["TYUwe114514", 3],
    ["CrazyScout178857703", 4],
    ["CN_Deeeep280631", 5],
    ["ZywDo", 6],
    ["CHINAzhl", 7],
    ["Cx330_", 8],
    ["CNbabadad_T0", 8],
    ["Snoozyrhino12345", 9],
    ["853_Liuming_CN", 10],
    ["MVP_Sean_TW", 11],
    ["IloveDumpling", 12],
    ["_1_2_3_4_5_6_7_8_9_0_", 13],
    ["xiaoheiziwanyouxi_67", 14],
    ["SneakCake", 15],
    ["X_ShawnWu_X", 16],
    ["Spk_Builder_JAPAN", 17],
    ["___Vin___", 18],
    ["H2O____", 19],
    ["China788876", 20],
    ["China_788867", 20],
    ["a12345678912345678", 21],
    ["China__KKYT79_HT5", 22],
    ["DragonVide", 23],
    ["IVAN6666666", 24],
    ["Chrishellnah", 25],
    ["TW_china1994_2", 26],
    ["rtbbyst", 27],
    ["Ouyangkaheialex", 27],
    ["Chinapydd__PVP", 28],
    ["XD_superkaikai_XD", 29],
    ["glimmer_of_hope", 30],
    ["_DIO___", 31],
    ["china_T_T_Dream", 32],
    ["9100T_Y", 33],
    ["SB2BFW_2026__", 34],
    ["1Wemmbu2", 35],
    ["NimbleTurkey114514", 36],
    ["TNTQwQ_love_you", 37],
    ["Chinesexiaohao", 38],
    ["1231234568", 39],
    ["ICE_MILKE_TEA", 40],
    ["Bubble_Tea1234", 41],
    ["G_INVINCIBLE", 42],
    ["X_GREEN_TEA_bilbili_X", 43],
    ["QAQ__10954__QAQ__TW", 44],
    ["nnngnbg", 45],
    ["mjuu_826", 46],
    ["tuhjpvpa", 47],
    ["cute_cat_smooth21", 48],
    ["XD_superkaikai_XD_2", 49],
    ["CN_Chuan", 50],
    ["CN_Hang", 50],
    ["ICE_Bruh", 51],
    ["Flame_bruh", 51],
    ["look5259", 52],
    ["deyeOvO", 53],
    ["CHfawai_113", 54],
    ["CARECARE_735735_TW", 55],
])
smallStorage = new Map([
    ["HumbleFarmer7198026", 0],
    ["SteetRnoo", 1],
    ["ClumsyBear112349", 2],
    ["china_lao8_Architect", 3],
    ["", 4],
    ["mjuu_826", 4],
    ["FSBDA114514", 5],
    ["", 6],
    ["ExtremeHamster8754669", 7],
    ["CN_Zhao", 7],
    ["china7773777", 8],
    ["Mint001", 9],
    ["", 10],
    ["Alexalealex711", 11],
    ["SB2BFW_2026_", 12],
    ["China_FUFU", 13],
    ["666sans", 14],
    ["CN_Outrage22665950", 15],
    ["sundayABC", 16],
    ["ggg999ss", 17],
    ["", 18],
    ["YOYO_so", 19],
    ["SurlyLion4224527x", 20],
    ["6704260", 21],
    ["CN_Exotic_Red_China", 22],
    ["SurlyGoose7980696", 23],
    ["CN_Coolwind", 24],
    ["bilibili_wsQWQzjy32", 25],
    ["the_______", 26],
    ["yuhuachen7952998china", 27],
    ["OPSJ_leonardo_", 28],
    ["h14024302", 29],
    ["IamCarefulHammer", 30],
    ["Nico_pvp", 31],
    ["T666_", 31],
    ["pvsb9178", 32],
    ["FateMaster6391", 33],
    ["Anderson_Yan", 34],
    ["HOT_MILKE_TEA", 35],
    ["china250122222222222b", 36],
    ["PW9527", 37],
    ["lewenxiaohao", 38],
    ["Stkov", 38],
    ["moshanglibie680", 39],
    ["StinkyPuma8930670", 40],
    ["_MCurios11_xiao_", 41],
    ["1xzy", 43],
    ["China_food", 44],
    ["CH_Naonao", 45],
    ["China0311", 46],
    ["unhappylllll", 47],
    ["6D24Hei", 48],
    ["Ricky1234Ricky", 49],
    ["hahsuy1", 50],
    ["ZJ61", 51],
    ["N00by_the_gamer", 52],
    ["A_small_legend", 53],
    ["Ryder1006", 54],
    ["jjfjjjskkkkw", 55],
    ["MattDragon64", 56],
    ["Carsonisguy", 57],
    ["KL_qiqi666", 58],
    ["xiongchumo_PIERCE", 59],
    ["chn_draco_67", 60],
    ["sct888", 61],
    ["chinese2014", 62],
    ["HarshKraken8092238", 63],
    ["xizhao__1342", 64],
    ["bread666", 65],
])
void 0;  //xiongchumo_PIERCE

const playerName = api.getEntityName(myId);
const [xb, xs, y, z] = [18.5, 44.5, 7, -45.5]
if (bigStorage.has(playerName)) {
    const playerNumber = bigStorage.get(playerName)
    api.setPosition(myId, xb, y + 4 * (playerNumber % 3), z - 4 * (Math.floor(playerNumber / 3)))
} else if (smallStorage.has(playerName)) {
    const playerNumber = smallStorage.get(playerName)
    api.setPosition(myId, xs, y + 4 * (playerNumber % 3), z - 4 * (Math.floor(playerNumber / 3)))
}

const [xBig, xSmall, yStart, zStart] = [16, 46, 7, -44]
function getPlayerChestPos(plrNum, isBig) {
    let output = []
    if (isBig) {
        for (let yOffset = 0; yOffset < 3; yOffset++) {
            for (let zOffset = 0; zOffset < 3; zOffset++) {
                output.push([xBig, yStart + 4 * (plrNum % 3) + yOffset, z - 4 * Math.floor(playerNumber / 3) - zOffset])
            }
        }
    } else {
        for (let yOffset = 0; yOffset < 3; yOffset++) {
            output.push([xBig, yStart + 4 * (plrNum % 3) + yOffset, z - 4 * Math.floor(playerNumber / 3) - 1])
        }
    }
    return output
}
let warning = (id) => {
    api.kickPlayer(id, "Suspicious Action Detected! Don't steal storage!")
    api.broadcastMessage(api.getEntityName(id) + " is trying to steal storage!", { color: "red" })
    return "preventOpen"
}
if ((x === xBig || x === xSmall) && y >= yStart && y <= yStart + 10) {
    const plrName = api.getEntityName(myId)
    if (bigStorage.has(plrName)) {
        if (!getPlayerChestPos(bigStorage.get(plrName), true).includes([x, y, z])) {
            return warning(myId)
        }
    } else if (smallStorage.has(plrName)) {
        if (!getPlayerChestPos(smallStorage.get(plrName), false).includes([x, y, z])) {
            return warning(myId)
        }
    } else {
        return warning(myId)
    }
}
