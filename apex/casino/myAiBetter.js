/** * BLACKJACK SYSTEM - FULL CODE 
 **/

const CONFIG = {
    numberOfDecks: 6,
    dealerHitsSoft17: false,
    blackjackPayout: 1.5,
    betAmounts: [8, 10, 15, 20, 25, 30, 40, 50, 60, 70, 90, 100]
};
const pos = {
    lobby: [-315.5, 46, 383.5],
    1: { spawn: [-315.5, 54, 382.5], hand1: [-314, 56, 380], hand2: [-315, 56, 380], bet: [-316, 55, 380], dealer: [-318, 56, 380], status: [-317, 56, 380] },
    2: { spawn: [-315.5, 54, 384.5], hand1: [-318, 56, 386], hand2: [-317, 56, 386], bet: [-316, 55, 386], dealer: [-314, 56, 386], status: [-315, 56, 386] }
}
const roomNum = 1
if (!bjRoom[roomNum].id) {
    bjRoom[roomNum] = {
        bet: 8,
        playerHands: { 1: [], 2: [] },
        dealerHand: [],
        shoes: [],
        gameStarted: false,
        handPlaying: 1,
        doubled: { 1: false, 2: false },
        id: myId
    }
    api.setPosition(myId, ...pos[roomNum].spawn)
    bjReset(roomNum)
}

// --- UTILS ---

function updateStatus(room, text) {
    api.setBlockData(...pos[room].status, { persisted: { shared: { text: text, "textSize": 1 } } });
}

function createShoe(decks) {
    let ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
    let shoe = [];
    for (let d = 0; d < decks; d++) {
        for (let r of ranks) {
            for (let i = 0; i < 4; i++) shoe.push(r);
        }
    }
    for (let i = shoe.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shoe[i], shoe[j]] = [shoe[j], shoe[i]];
    }
    return shoe;
}

function handTotal(hand) {
    if (!hand || hand.length === 0) return [0, false];
    let total = 0;
    let aces = 0;
    hand.forEach(card => {
        if (["J", "Q", "K"].includes(card)) total += 10;
        else if (card === "A") { total += 11; aces++; }
        else total += Number(card);
    });
    while (total > 21 && aces > 0) {
        total -= 10;
        aces--;
    }
    return [total, aces > 0];
}

function outputInBoard(playerHands, dealerHand, reveal = false, room) {
    const dTotal = handTotal(dealerHand)[0];
    const p1Total = handTotal(playerHands[1])[0];
    const p2Total = handTotal(playerHands[2])[0];

    let dealerText = reveal
        ? `Dealer Hand:\n${dealerHand.join(", ")}\n(Total ${dTotal})`
        : `Dealer Hand:\n?, ${dealerHand[1]}`;

    api.setBlockData(...pos[room].dealer, { persisted: { shared: { text: dealerText, "textSize": 0 } } });
    api.setBlockData(...pos[room].hand1, { persisted: { shared: { text: `Hand 1:\n${playerHands[1].join(", ")}\n(Total ${p1Total})`, "textSize": 0 } } });

    if (playerHands[2].length > 0) {
        api.setBlockData(...pos[room].hand2, { persisted: { shared: { text: `Hand 2:\n${playerHands[2].join(", ")}\n(Total ${p2Total})`, "textSize": 0 } } });
    } else {
        api.setBlockData(...pos[room].hand2, { persisted: { shared: { text: "", "textSize": 0 } } });
    }
}

// --- LOGIC ---

function dealerPlay(id, room) {
    let thisRoom = bjRoom[room];
    updateStatus(room, "DEALER...");
    let [total, soft] = handTotal(thisRoom.dealerHand);

    while (total < 17 || (total === 17 && soft && CONFIG.dealerHitsSoft17)) {
        thisRoom.dealerHand.push(thisRoom.shoes.pop());
        [total, soft] = handTotal(thisRoom.dealerHand);
    }

    outputInBoard(thisRoom.playerHands, thisRoom.dealerHand, true, room);
    bjEnd(id, room);
}

function bjEnd(id, room) {
    let thisRoom = bjRoom[room];
    let dTotal = handTotal(thisRoom.dealerHand)[0];
    let finalStatus = "END";

    [1, 2].forEach(hId => {
        let hand = thisRoom.playerHands[hId];
        if (hand.length === 0) return;

        let pTotal = handTotal(hand)[0];
        let bet = thisRoom.bet * (thisRoom.doubled[hId] ? 2 : 1);

        if (pTotal > 21) {
            api.sendMessage(id, `Hand ${hId}: You Bust! Lost ${bet} Gold.`, { color: "red" });
            finalStatus = "BUST";
        } else if (dTotal > 21 || pTotal > dTotal) {
            api.sendMessage(id, `Hand ${hId}: You Win! Gained ${bet * 2} Gold.`, { color: "green" });
            api.giveItem(id, "Raw Gold", bet * 2);
            finalStatus = "WIN";
        } else if (pTotal === dTotal) {
            api.sendMessage(id, `Hand ${hId}: Push (Tie). Returned ${bet} Gold.`);
            api.giveItem(id, "Raw Gold", bet);
            finalStatus = "PUSH";
        } else {
            api.sendMessage(id, `Hand ${hId}: Dealer Wins! Lost ${bet} Gold.`, { color: "red" });
            finalStatus = "LOSE";
        }
    });
    updateStatus(room, finalStatus);
    thisRoom.gameStarted = false;
}
function bjReset(room) {
    updateStatus(room, "READY");
    api.setBlockData(...pos[room].bet, {
        persisted: { shared: { text: `Your bet:\n${bjRoom[roomNum].bet}\nRaw Gold`, "textSize": 1 } }
    })
    api.setBlockData(...pos[room].hand1, {
        persisted: { shared: { text: "Hand 1:", "textSize": 0 } }
    })
    api.setBlockData(...pos[room].hand2, {
        persisted: { shared: { text: "", "textSize": 0 } }
    })
    api.setBlockData(...pos[room].dealer, {
        persisted: { shared: { text: "Dealer Hand:", "textSize": 0 } }
    })
}
// --- ACTIONS ---

function bjBet(id, room) {
    let thisRoom = bjRoom[room];
    if (id !== thisRoom.id) return api.setPosition(id, ...pos.lobby)
    if (thisRoom.gameStarted) return api.sendMessage(id, "Finish your hand first!", { color: "red" });

    const idx = CONFIG.betAmounts.indexOf(thisRoom.bet);
    thisRoom.bet = CONFIG.betAmounts[(idx + 1) % CONFIG.betAmounts.length];

    api.setBlockData(...pos[room].bet, {
        persisted: { shared: { text: `Your bet:\n${thisRoom.bet}\nRaw Gold`, "textSize": 1 } }
    });
}

function bjStart(id, room) {
    let thisRoom = bjRoom[room];
    if (id !== thisRoom.id) return api.setPosition(id, ...pos.lobby)
    if (thisRoom.gameStarted) return api.sendMessage(id, "Game already started!");

    if (api.getInventoryItemAmount(id, "Raw Gold") < thisRoom.bet) {
        updateStatus(room, "NO GOLD");
        return api.sendMessage(id, `Need ${thisRoom.bet} Raw Gold! You have ${api.getInventoryItemAmount(id, "Raw Gold")}`, { color: "red" });
    }
    api.removeItemName(id, "Raw Gold", thisRoom.bet);
    thisRoom.gameStarted = true;
    thisRoom.handPlaying = 1;
    thisRoom.playerHands = { 1: [], 2: [] };
    thisRoom.doubled = { 1: false, 2: false };
    thisRoom.shoes = createShoe(CONFIG.numberOfDecks);

    thisRoom.playerHands[1] = [thisRoom.shoes.pop(), thisRoom.shoes.pop()];
    thisRoom.dealerHand = [thisRoom.shoes.pop(), thisRoom.shoes.pop()];

    updateStatus(room, "PLAYING");
    outputInBoard(thisRoom.playerHands, thisRoom.dealerHand, false, room);

    let pBJ = handTotal(thisRoom.playerHands[1])[0] === 21;
    let dBJ = handTotal(thisRoom.dealerHand)[0] === 21;

    if (pBJ || dBJ) {
        thisRoom.gameStarted = false;
        outputInBoard(thisRoom.playerHands, thisRoom.dealerHand, true, room);
        if (pBJ && dBJ) {
            updateStatus(room, "PUSH");
            api.giveItem(id, "Raw Gold", thisRoom.bet);
            api.sendMessage(id, "Tie! Both have Blackjack.");
        } else if (pBJ) {
            updateStatus(room, "WIN");
            let win = Math.floor(thisRoom.bet + (thisRoom.bet * CONFIG.blackjackPayout));
            api.giveItem(id, "Raw Gold", win);
            api.sendMessage(id, `Blackjack! Won ${win} Gold!`, { color: "green" });
        } else {
            updateStatus(room, "LOSE");
            api.sendMessage(id, "Dealer Blackjack! You lost.", { color: "red" });
        }
    } else {
        let options = "You can: Hit, Stand, Double";
        if (thisRoom.playerHands[1][0] === thisRoom.playerHands[1][1]) options += ", Split";
        api.sendMessage(id, options);
    }
}

function bjHit(id, room) {
    let thisRoom = bjRoom[room];
    if (id !== thisRoom.id) return api.setPosition(id, ...pos.lobby)
    if (!thisRoom.gameStarted) return api.sendMessage(id, "Press Start first!");

    let hIdx = thisRoom.handPlaying;
    thisRoom.playerHands[hIdx].push(thisRoom.shoes.pop());
    outputInBoard(thisRoom.playerHands, thisRoom.dealerHand, false, room);

    if (handTotal(thisRoom.playerHands[hIdx])[0] > 21) {
        api.sendMessage(id, `Hand ${hIdx} Busted!`, { color: "red" });
        bjStand(id, room);
    }
}

function bjStand(id, room) {
    let thisRoom = bjRoom[room];
    if (id !== thisRoom.id) return api.setPosition(id, ...pos.lobby)
    if (!thisRoom.gameStarted) return api.sendMessage(id, "Press Start first!");

    if (thisRoom.handPlaying === 1 && thisRoom.playerHands[2].length > 0) {
        thisRoom.handPlaying = 2;
        updateStatus(room, "HAND 2");
        api.sendMessage(id, "Switching to Hand 2...");
    } else {
        dealerPlay(id, room);
    }
}

function bjDouble(id, room) {
    let thisRoom = bjRoom[room];
    if (id !== thisRoom.id) return api.setPosition(id, ...pos.lobby)
    let hIdx = thisRoom.handPlaying;
    if (!thisRoom.gameStarted) return api.sendMessage(id, "Press Start first!");
    if (thisRoom.playerHands[hIdx].length !== 2) return api.sendMessage(id, "Can only double on start of hand!");

    if (api.getInventoryItemAmount(id, "Raw Gold") < thisRoom.bet) return api.sendMessage(id, "Not enough gold!");

    api.removeItemName(id, "Raw Gold", thisRoom.bet);
    thisRoom.doubled[hIdx] = true;
    updateStatus(room, "DOUBLE");
    thisRoom.playerHands[hIdx].push(thisRoom.shoes.pop());
    outputInBoard(thisRoom.playerHands, thisRoom.dealerHand, false, room);
    bjStand(id, room);
}

function bjSplit(id, room) {
    let thisRoom = bjRoom[room];
    if (id !== thisRoom.id) return api.setPosition(id, ...pos.lobby)
    if (!thisRoom.gameStarted) return api.sendMessage(id, "Press Start first!");
    let h1 = thisRoom.playerHands[1];

    if (!thisRoom.gameStarted || h1.length !== 2 || h1[0] !== h1[1] || thisRoom.playerHands[2].length > 0) {
        return api.sendMessage(id, "Can't split this!");
    }

    if (api.getInventoryItemAmount(id, "Raw Gold") < thisRoom.bet) return api.sendMessage(id, "Not enough gold!");

    api.removeItemName(id, "Raw Gold", thisRoom.bet);
    thisRoom.playerHands[2] = [h1.pop()];
    h1.push(thisRoom.shoes.pop());
    thisRoom.playerHands[2].push(thisRoom.shoes.pop());

    updateStatus(room, "SPLIT");
    api.sendMessage(id, "Hand split! Playing Hand 1...");
    outputInBoard(thisRoom.playerHands, thisRoom.dealerHand, false, room);
}