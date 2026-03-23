api.removeEffect(myId, "Weakness")
api.removeEffect(myId, "Slowness")
api.removeEffect(myId, "Radiation")
api.setClientOption(myId, 'cameraTint', null)
api.setClientOption(myId, 'canSeeNametagsThroughWalls', false)
api.setClientOption(myId, 'canCraft', false)
api.setClientOption(myId, 'dealingDamageHeadMultiplier', 1.75)
api.setClientOption(myId, 'dealingDamageDefaultMultiplier', 1)
delete playerTimers[myId];
api.setClientOption(myId, "middleTextUpper", "");

function cuteSnDefinePlayerIDs() {
    cuteSnPID_Sna = "co0TcMa_dUj-ptp3roIUO"
    cuteSnPID_Spk = "7suj05XsPJls2W6ACDDbt"
    cuteSnPID_Ext = "KkEAF3Q8kw4hy1uF_CUXU"
    cuteSnPID_Ice = "ylQ2kbX6fQ641eLAJ9fXl"
    cuteSnPID_Ale = "4OED3KTOnTh6MvNl133vS"
    cuteSnPID_Iva = "_lYlRjmzGdOYR-C6VC4Z1"
    cuteSnPID_Chr = "goR36SY1t16sThBE8uhe7"
    cuteSnPID_Mer = "l1qA10te8-XW0YMqN9zhK"
    cuteSnPID_Cnd = "a4Y-yxzUvCmzUw7ZWwTPN"
    cuteSnPID_The = "8rGIvK8NbeLSHMPEhspYp"
    cuteSnPID_Sne = "v1nxEc2f0-u0HgPgw45-l"
    cuteSnPID_Chi = "Oi7IwDg0cNumzCOUh-g2g"
    cuteSnPID_Twc = "u-faNmvpqszvegUlFYa-G"
    cuteSnPID_Cx3 = "cQnhtGSOmzQ-UyBqkBMmL"
    cuteSnPID_Dra = "tJErtvfHjKdUC6ogMj6P1"
    cuteSnPID_Ilo = "7F1YVvC2OWnXWekbliErt"
    cuteSnPID_Sun = "mAr164Id-G8jpksaxqYkx"
    cuteSnPID_Chn = "rsc9AdzRKRm5QPXU5sYZR"
    cuteSnPID_Chd = "x7Qk9jcjqB-B4nee0skGK"
    cuteSnPID_Voi = "PoNlTtTCv6k4YFvC8iRZr"
    cuteSnPID_Sha = "273UfIqI1EKNvhzRtLpJc"
    cuteSnPID_Loo = "I6kNcUX8I5BHpEUzQ4eZp"
}
function cuteSnInitializeServer() {
    //Department Heads
    BestPerson = [cuteSnPID_Sna]
    HumanResources = [cuteSnPID_Sna, cuteSnPID_Spk]
    StoragePerson = [cuteSnPID_Sna, cuteSnPID_Ext]
    //Specialists
    BugFinder = [cuteSnPID_Ilo, "DIO____"]
    AntiTheft = ["cuteSnPID_Sne"]
    Builder = [cuteSnPID_Dra, cuteSnPID_Voi, cuteSnPID_Sha, "magfanstar", "CN_CangBai"]
    Creator = [cuteSnPID_Iva, "XD_superkaikai_XD"]
    //Player Department
    Advertisor = ["qinxiaochen_IlIlIl"]
    Auditor = [cuteSnPID_Cnd, "yuhuachen7952998china"]
    CustomerService = [cuteSnPID_Chr, cuteSnPID_Loo, "china_T_T_Dream", "YOYO_so"]
    //Management Department
    HackerManagement = [cuteSnPID_Chd, cuteSnPID_Mer, cuteSnPID_Spk, cuteSnPID_Ext, cuteSnPID_Ale, cuteSnPID_Cx3, "IloveDumpling", "MVP_Sean_TW", "afurry2", "Martin_123new_account"]
    CultureManagement = [cuteSnPID_Ice, cuteSnPID_Twc]
    TradingManagement = [cuteSnPID_Chd]
    PrisonManagement = []
    Investigator = [cuteSnPID_Sun, cuteSnPID_Chn]
    TrialMod = [cuteSnPID_Chr, "Chinesexiaohao", "Jayden_UwU1320870", "china_T_T_Dream"]
    //Others
    Cat2 = ["XD_superkaikai_XD"]
    Cat = ["rtbbyst"]
    robber = [cuteSnPID_Cnd]
    //All
    EmployeeList = [cuteSnPID_Sna, cuteSnPID_Spk, cuteSnPID_Ext, cuteSnPID_Ice, cuteSnPID_Ale, cuteSnPID_Iva, cuteSnPID_Chr, cuteSnPID_Mer, cuteSnPID_Cnd, cuteSnPID_Sne, cuteSnPID_Chi, cuteSnPID_Twc, cuteSnPID_Cx3, cuteSnPID_Dra, cuteSnPID_Ilo, cuteSnPID_Sun, cuteSnPID_Chn, cuteSnPID_Chd, cuteSnPID_Voi, cuteSnPID_Sha, cuteSnPID_Loo, "china_T_T_Dream", "yuhuachen7952998china", "qinxiaochen_IlIlIl", "ChinesePlayerLee", "magfanstar", "CN_CangBai", "MVP_Sean_TW", "afurry2", "Martin_123new_account", "XD_superkaikai_XD", "YOYO_so", "Chinesexiaohao", "Jayden_UwU1320870", "CN_Zhao"]
}
function cuteSnOwnerCostume(Id) {
    api.updateEntityNodeMeshAttachment(
        Id,
        "TorsoNode",
        "ParticleEmitter",
        {
            emitRate: 100,
            meshOffset: 30,
            width: 1,
            height: 1,
            depth: 1,
            dir: [1, 0, 0],
            texture: "heart",
            minLifeTime: 0.5,
            maxLifeTime: 1,
            minEmitPower: 1,
            maxEmitPower: 3,
            minSize: 0.25,
            maxSize: 0.45,
            manualEmitCount: 35,
            gravity: [1, 0, 1],
            colorGradients: [
                {
                    timeFraction: 0,
                    minColor: [136, 0, 25],
                    maxColor: [237, 258, 256]
                },
            ],
            velocityGradients: [
                {
                    timeFraction: 0,
                    factor: 1,
                    factor2: 1,
                },
            ],
            blendMode: 1,
        },
        [0, 0, 0], [0, 0, 0]
    );
    api.scalePlayerMeshNodes(Id, {
        LegLeftMesh: [1, 1.5, 1],
        LegRightMesh: [1, 1.5, 1],
        TorsoNode: [1, 1, 1],
        HeadMesh: [1, 1, 1],
        ArmLeftMesh: [1, 1, 1],
        ArmRightMesh: [1, 1, 1]
    });
    api.updateEntityNodeMeshAttachment(Id, "TorsoNode", "BloxdBlock", { blockName: "Cherry Leaves", size: 0.5, meshOffset: [0, 0, 0] }, [0, 0.5, 0], [0, 0, 0])
    api.updateEntityNodeMeshAttachment(Id, "HeadMesh", "BloxdBlock", { blockName: "Patterned Pink Glass", size: 0.7, meshOffset: [0, 0, 0] }, [0, 0.3, 0], [0, 0, 0])
    api.updateEntityNodeMeshAttachment(Id, "ArmRightMesh", "BloxdBlock", { blockName: "Magenta Ceramic", size: 0.4, meshOffset: [0, 0, 0] }, [-0.1, 0, 0], [0, 0, 0])
    api.updateEntityNodeMeshAttachment(Id, "ArmLeftMesh", "BloxdBlock", { blockName: "Magenta Ceramic", size: 0.4, meshOffset: [0, 0, 0] }, [0.1, 0, 0], [0, 0, 0])
}
cuteSnDefinePlayerIDs()
cuteSnInitializeServer()
functionDefined[0] = 1
void 0;