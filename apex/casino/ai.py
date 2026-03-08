import random

# -----------------------------
# Configuration
# -----------------------------
NUMBER_OF_DECKS = 6
DEALER_HITS_SOFT_17 = False
RESHUFFLE_PENETRATION = 52
BLACKJACK_PAYOUT = (3, 2)

# -----------------------------
# Deck helpers
# -----------------------------
def create_shoe(decks):

    ranks = ['2','3','4','5','6','7','8','9','10','J','Q','K','A']
    shoe = []

    for _ in range(decks):
        for r in ranks:
            for _ in range(4):
                shoe.append(r)

    random.shuffle(shoe)
    return shoe


def draw(shoe):
    return shoe.pop()


# -----------------------------
# Card values
# -----------------------------
def card_value(card):

    if card in ['J','Q','K']:
        return 10

    if card == 'A':
        return 11

    return int(card)


def hand_total(hand):

    total = 0
    aces = 0

    for c in hand:

        if c == 'A':
            aces += 1

        total += card_value(c)

    while total > 21 and aces > 0:
        total -= 10
        aces -= 1

    is_soft = aces > 0
    return total, is_soft


def is_blackjack(hand):

    if len(hand) != 2:
        return False

    total,_ = hand_total(hand)

    return total == 21


def can_split(hand):

    if len(hand) != 2:
        return False

    return card_value(hand[0]) == card_value(hand[1])


# -----------------------------
# Dealer play
# -----------------------------
def dealer_play(shoe, dealer):

    while True:

        total,soft = hand_total(dealer)

        if total < 17:
            dealer.append(draw(shoe))
            continue

        if total == 17 and soft and DEALER_HITS_SOFT_17:
            dealer.append(draw(shoe))
            continue

        break


# -----------------------------
# Table display
# -----------------------------
def show_table(player_hands, bets, dealer, reveal=False):

    print("\n=========== TABLE ===========")

    if reveal:
        total,_ = hand_total(dealer)
        print(f"Dealer: {', '.join(dealer)}  (Total {total})")
    else:
        print(f"Dealer: [hidden], {dealer[1]}")

    print()

    for i,hand in enumerate(player_hands):

        total,_ = hand_total(hand)

        print(f"Hand {i+1} | Bet {bets[i]} | Cards: {', '.join(hand)} | Total {total}")

    print("==============================\n")


# -----------------------------
# Game
# -----------------------------
def play():

    shoe = create_shoe(NUMBER_OF_DECKS)

    bankroll = 1000

    print("Blackjack started")
    print("Starting bankroll:", bankroll)

    while True:

        if len(shoe) < RESHUFFLE_PENETRATION:

            print("Reshuffling shoe...")
            shoe = create_shoe(NUMBER_OF_DECKS)

        print("\n------ New Round ------")

        bet = int(input("Bet (0 to quit): "))

        if bet == 0:
            print("Final bankroll:", bankroll)
            return

        if bet > bankroll:
            print("Not enough bankroll")
            continue

        bankroll -= bet

        player_hands = [[draw(shoe), draw(shoe)]]
        bets = [bet]

        dealer = [draw(shoe), draw(shoe)]

        split_used = False

        show_table(player_hands, bets, dealer, False)

        # -----------------------------
        # Dealer peek rule
        # -----------------------------
        dealer_up = dealer[1]

        dealer_blackjack = False

        if dealer_up in ['A','10','J','Q','K']:
            dealer_blackjack = is_blackjack(dealer)

        player_blackjack = is_blackjack(player_hands[0])

        if dealer_blackjack or player_blackjack:

            show_table(player_hands, bets, dealer, True)

            if dealer_blackjack and player_blackjack:
                print("Push")
                bankroll += bet

            elif player_blackjack:
                payout = bet * BLACKJACK_PAYOUT[0] // BLACKJACK_PAYOUT[1]
                print("Blackjack! Win", payout)
                bankroll += bet + payout

            else:
                print("Dealer blackjack. Lose")

            print("Bankroll:", bankroll)
            continue

        # -----------------------------
        # PLAYER TURN
        # -----------------------------
        i = 0

        while i < len(player_hands):

            hand = player_hands[i]
            bet_amount = bets[i]

            split_aces = (hand[0] == 'A' and hand[1] == 'A')

            while True:

                total,_ = hand_total(hand)

                show_table(player_hands, bets, dealer, False)

                print(f"Playing Hand {i+1}")

                if total > 21:
                    print("Bust")
                    break

                options = ["hit(h)", "stand(s)"]

                if len(hand) == 2 and bankroll >= bet_amount:
                    options.append("double(d)")

                if not split_used and can_split(hand) and bankroll >= bet_amount:
                    options.append("split(p)")

                print("Options:", ", ".join(options))

                move = input("> ").lower()

                # HIT
                if move in ['h','hit']:

                    hand.append(draw(shoe))

                    if split_aces:
                        break

                    continue

                # STAND
                elif move in ['s','stand']:
                    break

                # DOUBLE
                elif move in ['d','double'] and len(hand) == 2 and bankroll >= bet_amount:

                    bankroll -= bet_amount
                    bets[i] *= 2

                    hand.append(draw(shoe))

                    break

                # SPLIT
                elif move in ['p','split'] and not split_used and can_split(hand):

                    split_used = True
                    bankroll -= bet_amount

                    new_hand = [hand.pop()]

                    hand.append(draw(shoe))
                    new_hand.append(draw(shoe))

                    player_hands.insert(i+1, new_hand)
                    bets.insert(i+1, bet_amount)

                    show_table(player_hands, bets, dealer, False)

                    continue

                else:
                    print("Invalid move")

            i += 1

        # -----------------------------
        # Skip dealer if all bust
        # -----------------------------
        all_bust = True

        for hand in player_hands:

            total,_ = hand_total(hand)

            if total <= 21:
                all_bust = False

        if all_bust:

            print("All player hands bust")
            print("Bankroll:", bankroll)
            continue

        # -----------------------------
        # DEALER TURN
        # -----------------------------
        show_table(player_hands, bets, dealer, True)

        dealer_play(shoe, dealer)

        show_table(player_hands, bets, dealer, True)

        dealer_total,_ = hand_total(dealer)

        # -----------------------------
        # RESULTS
        # -----------------------------
        for i,hand in enumerate(player_hands):

            player_total,_ = hand_total(hand)
            bet_amount = bets[i]

            if player_total > 21:

                print(f"Hand {i+1} loses")

            elif dealer_total > 21 or player_total > dealer_total:

                print(f"Hand {i+1} wins")
                bankroll += bet_amount * 2

            elif player_total == dealer_total:

                print(f"Hand {i+1} push")
                bankroll += bet_amount

            else:

                print(f"Hand {i+1} loses")

        print("Bankroll:", bankroll)

        if bankroll <= 0:

            print("You are broke")
            return


# -----------------------------
# Start game
# -----------------------------
if __name__ == "__main__":
    play()