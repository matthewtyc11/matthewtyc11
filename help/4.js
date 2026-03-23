function cuteSnChatCustomization(pid) {
    let DBID = api.getPlayerDbId(pid);
    let userType = cuteSnChinese02[0];
    //Department Heads
    if (BestPerson.includes(DBID)) { userType = cuteSnChinese02[1] }
    else if (HumanResources.includes(DBID)) { userType = cuteSnChinese02[12] }
    else if (StoragePerson.includes(DBID)) { userType = cuteSnChinese02[11] }
    //Others
    else if (BestCoder.includes(DBID)) { userType = "Apex服Coder" }
    else if (Cat2.includes(DBID)) { userType = cuteSnChinese02[13] }
    else if (Cat.includes(DBID)) { userType = cuteSnChinese02[16] }
    else if (robber.includes(DBID)) { userType = cuteSnChinese02[17] }
    //Specialists
    else if (BugFinder.includes(DBID)) { userType = cuteSnChinese02[3] }
    else if (AntiTheft.includes(DBID)) { userType = cuteSnChinese02[4] }
    else if (Builder.includes(DBID)) { userType = cuteSnChinese02[8] }
    else if (Creator.includes(DBID)) { userType = cuteSnChinese02[10] }
    //Player Department
    else if (Auditor.includes(DBID)) { userType = cuteSnChinese02[5] }
    else if (Advertisor.includes(DBID)) { userType = cuteSnChinese02[9] }
    else if (CustomerService.includes(DBID)) { userType = cuteSnChinese02[2] }
    //Management Department
    else if (CultureManagement.includes(DBID)) { userType = cuteSnChinese02[14] }
    else if (TradingManagement.includes(DBID)) { userType = cuteSnChinese02[15] }
    else if (PrisonManagement.includes(DBID)) { userType = cuteSnChinese02[18] }
    else if (HackerManagement.includes(DBID)) { userType = cuteSnChinese02[6] }
    else if (Investigator.includes(DBID)) { userType = cuteSnChinese02[19] }
    else if (TrialMod.includes(DBID)) { userType = cuteSnChinese02[7] }

    let userColor = "white";
    //Department Heads
    if (BestPerson.includes(DBID)) { userColor = "pink" }
    else if (HumanResources.includes(DBID)) { userColor = "darkOrange" }
    else if (StoragePerson.includes(DBID)) { userColor = "lightcoral" }
    //Specialists
    else if (BestCoder.includes(DBID)) {userColor = "lightskyblue"}
    else if (BugFinder.includes(DBID)) { userColor = "Orange" }
    else if (AntiTheft.includes(DBID)) { userColor = "Lime" }
    else if (Creator.includes(DBID)) { userColor = "thistle" }
    else if (Builder.includes(DBID)) { userColor = "mediumpurple" }
    //Player Department
    else if (Auditor.includes(DBID)) { userColor = "lemonChiffon" }
    else if (CustomerService.includes(DBID)) { userColor = "yellow" }
    else if (Advertisor.includes(DBID)) { userColor = "khaki" }
    //Management Department
    else if (HackerManagement.includes(DBID)) { userColor = "Cyan" }
    else if (CultureManagement.includes(DBID)) { userColor = "aquamarine" }
    else if (TradingManagement.includes(DBID)) { userColor = "turquoise" }
    else if (PrisonManagement.includes(DBID)) { userColor = "lightskyblue" }
    else if (Investigator.includes(DBID)) { userColor = "lightsteelblue" }
    else if (TrialMod.includes(DBID)) { userColor = "powderBlue" }
    //Others
    return [DBID, userType, userColor]
}

function cuteSnChatCommand(pid, msg) {
    let [DBID, userType, userColor] = cuteSnChatCustomization(pid)
    let sayText, sayTextId1, sayTextId2
    if (msg.startsWith(cuteSnChinese03[0]) && BestPerson.includes(DBID)) {
        const split = msg.slice(3).trim().split(" ");
        const target = split[0];
        const privatemsg = split.slice(1).join(" ");
        sayTextId1 = api.getPlayerId(target);
        sayTextId2 = pid
        if (sayTextId1) {
            sayText = [{ str: "[" + cuteSnChinese03[1] + target + "] ", style: { color: "gold" } }, { str: privatemsg, style: { color: "pink" } }];
            api.sendMessage(sayTextId1, sayText)
            api.sendMessage(sayTextId2, sayText)
        } else {
            sayText = [{ str: cuteSnChinese03[2], style: { color: "red" } }]
            isSayText = 3
        }
    } else if (msg.startsWith(cuteSnChinese03[3]) && BestPerson.includes(DBID)) {
        const split = msg.slice(3).trim().split(" ");
        const targetPlayerName = split[0];
        const targetId = api.getPlayerId(targetPlayerName);
        if (targetId) {
            const targetPos = api.getPosition(targetId);
            api.setPosition(pid, targetPos[0], targetPos[1], targetPos[2]);
        } else {
            sayTextId2 = pid
            sayText = [{ str: cuteSnChinese03[2], style: { color: "red" } }]
            api.sendMessage(sayTextId2, sayText)
        }
    } else if ((msg.startsWith(cuteSnChinese03[4]) || msg.startsWith(cuteSnChinese03[5])) && (EmployeeList.includes(DBID))) {
        const privatemsg = msg.slice(5).trim();
        const playername = api.getEntityName(pid)
        sayText = [{ str: "[" + cuteSnChinese03[6], style: { color: "gold" } }, { str: playername, style: { color: userColor } }, { str: "] ", style: { color: "gold" } }, { str: privatemsg, style: { color: "cyan" } }];
        for (const playerId of api.getPlayerIds()) {
            DBID = api.getPlayerDbId(playerId);
            if (EmployeeList.includes(DBID)) {
                api.sendMessage(playerId, sayText);
            }
        }
    } else if ((msg.startsWith(cuteSnChinese03[7]) || msg.startsWith(cuteSnChinese03[8])) && (HumanResources.includes(DBID) || CultureManagement.includes(DBID) || TradingManagement.includes(DBID) || PrisonManagement.includes(DBID))) {
        const split = msg.slice(3).trim().split(" ");
        const targetPlayerName = split[0];
        const targetId = api.getPlayerId(targetPlayerName);
        const playername = api.getEntityName(pid)
        if (targetId) {
            if (!EmployeeList.includes(api.getPlayerDbId(targetId))) {
                api.kickPlayer(targetId, cuteSnChinese03[9] + playername + cuteSnChinese03[12])
                sayText = [{ str: cuteSnChinese03[9], style: { color: "gold" } }, { str: playername, style: { color: "Red" } }, { str: cuteSnChinese03[10], style: { color: "gold" } }, { str: targetPlayerName, style: { color: "red" } }, { str: cuteSnChinese03[11], style: { color: "gold" } }]
                api.broadcastMessage(sayText)
            } else {
                sayTextId2 = pid
                sayText = [{ str: cuteSnChinese03[13], style: { color: "red" } }]
                api.sendMessage(sayTextId2, sayText)
            }
        } else {
            sayTextId2 = pid
            sayText = [{ str: cuteSnChinese03[2], style: { color: "red" } }]
            api.sendMessage(sayTextId2, sayText)
        }
    } else if (msg.startsWith("@")) {
        const playername = api.getEntityName(pid)
        sayText = [{ str: "[" + userType + "] ", style: { color: "gold" } }, { str: playername + ": ", style: { color: userColor } }, { str: msg, style: { color: "red" } }]
        api.broadcastMessage(sayText)
    } else {
        const playername = api.getEntityName(pid)
        sayText = [{ str: "[" + userType + "] ", style: { color: "gold" } }, { str: playername + ": ", style: { color: userColor } }, { str: msg, style: { color: userColor } }]
        api.broadcastMessage(sayText)
    }
}

function cuteSnChatAll(pid, msg) {
    cuteSnChatCommand(pid, msg)
    return false
}
functionDefined[3] = 1
void 0;