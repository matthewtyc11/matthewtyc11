bjRoom = { 1: { bet: 8, playerHands: { 1: [], 2: [] }, dealerHand: [], shoes: [], gameStarted: false, handPlaying: 1, doubled: { 1: false, 2: false } } }

const numberOfDecks = 6
const dealerHitsSoft17 = false
const reshufflePenetration = 52
const blackjackPayout = 1.52
function createShoe(decks) {
    api.log("created")
    let ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"]
    let shoe = []
    for (let _ = 0; _ < decks; _++) {
        for (let r of ranks) {
            for (let i = 0; i < 4; i++) {
                shoe.push(r)
            }
        }
    }
    shoe.sort(() => Math.random() - 0.5)
    return shoe
}
function draw(shoe) {
    return shoe.pop()
}
function cardValue(card) {
    if (["J", "Q", "K"].includes(card)) {
        return 10
    }
    if (card === "A") {
        return 11
    }
    return Number(card)
}
function handTotal(hand) {
    let total = 0
    hand.forEach(c => total += cardValue(c))
    let aces = hand.filter(c => c === "A").length
    while (total > 21 && aces > 0) {
        total -= 10
        aces--
    }
    let isSoft = aces > 0
    return [total, isSoft]
}
function isBlackjack(hand) {
    if (hand.length !== 2) {
        return false
    }
    return handTotal(hand)[0] === 21
}
function canSplit(hand) {
    if (hand.length !== 2) {
        return false
    }
    return cardValue(hand[0]) === cardValue(hand[1])
}
function dealerPlay(room) {
    let thisRoom = bjRoom[room]
    let shoes = thisRoom.shoes
    let dealerHand = thisRoom.dealerHand
    while (true) {
        let [total, soft] = handTotal(dealerHand)
        if (total <= 17) {
            dealerHand.push(shoes.pop())
            continue
        }
        if (total === 17 && soft && dealerHitsSoft17) {
            dealerHand.push(shoes.pop())
        }
        thisRoom.gameStarted = false
        break
    }
}
function outputInBoard(playerHands, dealerHand, reveal = false, room) {
    if (reveal) {
        api.setBlockData(-318, 56, 380, { persisted: { shared: { text: `Dealer Hand:\n${dealerHand.join(", ")}\n(Total ${handTotal(dealerHand)[0]})`, "textSize": 0 } } });
    } else {
        api.setBlockData(-318, 56, 380, { persisted: { shared: { text: `Dealer Hand:\n?, ${dealerHand[1]}`, "textSize": 0 } } });
    }
    api.setBlockData(-314, 56, 380, { persisted: { shared: { text: `Your\nFirst Hand:\n${playerHands[1].join(", ")}\n(Total ${handTotal(playerHands[1])[0]})`, "textSize": 0 } } });
    api.setBlockData(-315, 56, 380, { persisted: { shared: { text: `Your\nSecond Hand:\n${playerHands[2].join(", ")}\n(Total ${handTotal(playerHands[2])[0]})`, "textSize": 0 } } });
}
function bjEnd(id, room) {
    let thisRoom = bjRoom[room]
    let playerHands = thisRoom.playerHands
    let dealerHand = thisRoom.dealerHand
    let bet = thisRoom.bet
    let doubled = thisRoom.doubled
    if (handTotal(playerHands[1])[0] === handTotal(dealerHand)[0]) {
        api.sendMessage(id, "You tie with the dealer on your first hand")
        api.giveItem(id, "Raw Gold", bet * (1 + doubled[1]))
    } else if (handTotal(playerHands[1])[0] > handTotal(dealerHand)[0]) {
        api.sendMessage(id, "You win on your first hand")
        api.giveItem(id, "Raw Gold", (doubled[1] + 1) * bet * 2)
    } else if (handTotal(playerHands[1])[0] < handTotal(dealerHand)[0]) {
        bjLost(id, room)
    }
    if (playerHands[2]) {
        if (handTotal(playerHands[2])[0] === handTotal(dealerHand)[0]) {
            api.sendMessage(id, "You tie with the dealer on your second hand")
            api.giveItem(id, "Raw Gold", bet * (1 + doubled[2]))
        } else if (handTotal(playerHands[2])[0] > handTotal(dealerHand)[0]) {
            api.sendMessage(id, "You win on your first hand")
            api.giveItem(id, "Raw Gold", (doubled[2] + 1) * bet * 2)
        } else if (handTotal(playerHands[2])[0] < handTotal(dealerHand)[0]) {
            bjLost(id, room)
        }
    }
}
function bjLost(id, room) {
    let thisRoom = bjRoom[room]
    api.sendMessage(id, `You lost ${thisRoom.bet} Raw Gold, better luck next time.`)
    outputInBoard(thisRoom.playerHands, thisRoom.dealerHand, true, room)
}
function bjStart(id, room) {
    let thisRoom = bjRoom[room]
    if (thisRoom.gameStarted) {
        api.sendMessage(id, "You already start the game!")
        return
    }
    const bet = bjRoom[room].bet
    const rawGoldPlrHave = api.getInventoryItemAmount(id, "Raw Gold")
    if (rawGoldPlrHave < bet) {
        api.sendMessage(id, `You bet is ${bet} Raw Gold, but you only have ${rawGoldPlrHave} Raw Gold`, { color: "red" })
        return
    }
    thisRoom.gameStarted = true
    thisRoom.plrId = id
    let playerHand1 = thisRoom.playerHands[1]
    let playerHand2 = thisRoom.playerHands[2]
    let dealerHand = thisRoom.dealerHand
    playerHand2 = []
    api.removeItemName(id, "Raw Gold", bet)
    let shoes = bjRoom[room].shoes = createShoe(6)
    bjRoom[room].playerHands[1] = [shoes.pop(), shoes.pop()]
    bjRoom[room].dealerHand = [shoes.pop(), shoes.pop()]
    if (isBlackjack(dealerHand) && isBlackjack(playerHand1)) {
        api.sendMessage(id, "You got a tie so you lost nothing.")
        api.giveItem(id, "Raw Gold", bet)
    } else if (isBlackjack(dealerHand)) {
        api.sendMessage(id, `The dealer got Blackjack so you lost ${bet} Raw Gold!`, { color: "red" })
        bjLost(room)
    } else if (isBlackjack(playerHand1)) {
        api.sendMessage(`You got Blackjack so you won ${bet * blackjackPayout}!`, { color: "green" })
        api.giveItem(id, "Raw Gold", bet + bet * blackjackPayout)
    }
    outputInBoard(thisRoom.playerHands, thisRoom.dealerHand, false, room)
    let plrCanDo = "You can Hit, Stand, Double"
    if (canSplit(playerHand1)) {
        plrCanDo += ", Split"
    }
    api.sendMessage(id, plrCanDo)
}
function bjDouble(id, room) {
    let thisRoom = bjRoom[room]
    if (!thisRoom.gameStarted) {
        api.sendMessage(id, "Game not yet started, press the start button.")
        return
    }
    let shoes = thisRoom.shoes
    let plrHands = thisRoom.playerHands
    let handPlaying = thisRoom.handPlaying
    if (plrHands[handPlaying].length < 2) {
        api.sendMessage(id, "You are not allow to double now.")
    }
    thisRoom.doubled[handPlaying] = true
    api.removeItemName(id, "Raw Gold", bet)
    if (!playerHands[2]) {
        await bjHit()
        dealerPlay()
    } else if (handPlaying === 1) {
        await bjHit()
        thisRoom.handPlaying = 2
    } else {
        await bjHit()
        dealerPlay()
    }
}
function bjStand(id, room) {
    let thisRoom = bjRoom[room]
    if (!thisRoom.gameStarted) {
        api.sendMessage(id, "Game not yet started, press the start button.")
        return
    }
    let plrHands = thisRoom.playerHands
    if (!plrHands[2]) {
        dealerPlay()
    } else if (thisRoom.handPlaying === 1) {
        thisRoom.handPlaying = 2
    } else {
        dealerPlay()
    }
}
function bjHit(id, room) {
    let thisRoom = bjRoom[room]
    if (!thisRoom.gameStarted) {
        api.sendMessage(id, "Game not yet started, press the start button.")
        return
    }
    let shoes = thisRoom.shoes
    let plrHands = thisRoom.playerHands
    let handPlaying = thisRoom.handPlaying
    plrHands[handPlaying].push(shoes.pop())
    outputInBoard(plrHands, thisRoom.dealerHand, false, room)
    if (handTotal(plrHands[handPlaying])[0] > 21) {
        if (!plrHands[2]) {
            api.sendMessage(id, "You Bust")
            thisRoom.gameStarted = false
            bjLost(id, room)
        } else if (handPlaying === 1) {
            api.sendMessage(id, "You bust on your first hand")
            thisRoom.handPlaying = 2
        } else {
            api.sendMessage(id, "You bust on your second hand")
        }
    }
}
function bjSplit() {

}
const betAmount = [8, 10, 15, 20, 25, 30, 40, 50, 60, 70, 90, 100];

function bjBet(id, room) {
    if (bjRoom[room].gameStarted) {
        api.sendMessage(id, "You can't change your bet when the game is started.")
        return
    }
    const currentIndex = betAmount.indexOf(bjRoom[1].bet);
    const nextIndex = (currentIndex + 1) % betAmount.length;
    const bet = betAmount[nextIndex];
    bjRoom[1].bet = bet;

    api.setBlockData(-316, 55, 380, {
        persisted: {
            shared: {
                text: `Your bet:\n${bet}\nRaw Gold`,
                "textSize": 1
            }
        }
    });
}
//bjRoom[1]={bet:123,playerHand1:"",playerHand2:"",dealerHand:"",shoes:""}