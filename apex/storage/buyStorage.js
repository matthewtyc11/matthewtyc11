const price = 2000
function makeRoom(roomNum, plrName) {
    if (roomNum % 2 === 1) {
        let startX = (Math.floor(roomNum / 2)) * 4 + 9
        let endX = startX + 4
        //make room
        api.setBlockWalls([startX, -7, -4], [endX, -11, -10], "Block of Diamond", true, true)
        api.setBlockWalls([startX + 1, -10, -4], [endX - 1, -8, -4], "Glass")
        api.setBlockWalls([startX + 1, -10, -9], [endX - 1, -8, -9], "Chest")
        api.setBlock(startX + 2, -11, -7, "Moonstone Chest")
        //make floor
        api.setBlockWalls([startX, -11, 2], [endX, -11, -3], "Block of Diamond", true)
        //make things to block player
        api.setBlockWalls([startX, -10, -3], [startX, -7, 2], "Air")
        api.setBlockWalls([endX, -10, -3], [endX, -7, 2], "Block of Diamond")
        //roof
        api.setBlockWalls([startX, -6, -3], [endX, -6, 2], "Block of Diamond", true)
        //other side wall
        api.setBlockWalls([startX, -10, 3], [endX, -7, 3], "Block of Diamond")
        //board
        api.setBlock([startX + 2, -7, -3], "Board")
        api.setBlockData(startX + 2, -7, -3, { persisted: { shared: { text: "Room\n" + roomNum + "\n" + plrName, textSize: 1 } } })
        api.setBlock([startX + 2, -9, -5], "Board|meta|rot3")
        api.setBlockData(startX + 2, -9, -5, { persisted: { shared: { text: "Room " + roomNum + "\nType\n!lobby\nto leave", textSize: 1 } } })
    } else {
        let startX = Math.floor((roomNum - 1) / 2) * 4 + 9
        let endX = startX + 4
        api.setBlockWalls([startX, -7, 3], [endX, -11, 9], "Block of Diamond", true, true)
        api.setBlockWalls([startX + 1, -10, 3], [endX - 1, -8, 3], "Glass")
        api.setBlockWalls([startX + 1, -10, 8], [endX - 1, -8, 8], "Chest|meta|rot3")
        api.setBlock(startX + 2, -11, 6, "Moonstone Chest")
        api.setBlock([startX + 2, -7, 2], "Board|meta|rot3")
        api.setBlockData(startX + 2, -7, 2, { persisted: { shared: { text: "Room\n" + roomNum + "\n" + plrName, textSize: 1 } } })
        api.setBlock([startX + 2, -9, 4], "Board")
        api.setBlockData(startX + 2, -9, 4, { persisted: { shared: { text: "Room " + roomNum + "\nType\n!lobby\nto leave", textSize: 1 } } })
    }
}
if (buyRoomCd + 100 < api.now()) {
    buyRoomCd = api.now()
    if (api.getInventoryItemAmount(myId, "Raw Gold") >= price || admins.includes(api.getEntityName(myId))) {
        let data = loadData(0)
        data.roomCount += 1
        makeRoom(data.roomCount, api.getEntityName(myId))
        if (Object.keys(data.data).includes(api.getPlayerDbId(myId))) {
            data.data[api.getPlayerDbId(myId)].push(data.roomCount)
        } else {
            data.data[api.getPlayerDbId(myId)] = [data.roomCount]
        }
        api.sendMessage(myId, "You bought storage room " + data.roomCount, { color: "green" })
        saveData(data, 0)
        do {
            makeRoom(data.roomCount, api.getEntityName(myId))
        } while (api.getBlock((Math.floor((data.roomCount % 2 ? data.roomCount : data.roomCount - 1) / 2)) * 4 + 12, -11, 0) === "Air")
        api.removeItemName(myId, "Raw Gold", price)
    } else {
        api.sendMessage(myId, "You don't have enough raw gold to buy.")
    }
} else {
    api.log("Press too fast")
}