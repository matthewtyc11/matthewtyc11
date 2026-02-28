let myRoom = loadData(0).data[api.getPlayerDbId(myId)]
if (myRoom) {
    if (myRoom.length === 1) {
        let roomNum = myRoom[0]
        api.setPosition(myId, (Math.floor((roomNum % 2 ? roomNum : roomNum - 1) / 2)) * 4 + 11.5, -10, roomNum % 2 ? -5.5 : 5.5)
    } else {
        let roomNum = loadData(0).roomChoose[api.getPlayerDbId(myId)]
        if (roomNum) {
            if (myRoom.includes(roomNum)) {
                api.setPosition(myId, (Math.floor((roomNum % 2 ? roomNum : roomNum - 1) / 2)) * 4 + 11.5, -10, roomNum % 2 ? -5.5 : 5.5)
            }
        } else {
            api.sendMessage(myId, "You own these room:\n" + myRoom + "\nType !room Room_Num to set which room will you enter.")
        }
    }
} else {
    api.sendMessage(myId, "You don't have a storage room.\nGo and buy one.", { color: "red" })
}