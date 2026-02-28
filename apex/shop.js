api.configureShopCategoryForPlayer('tp', {
    autoSelectCategory: true,
    customTitle: 'Warp',
    sortPriority: 200,
});

const tpCmd = { "japan": [310, 2, -200], "adminroom": [-2, 5, 0], "oldlobby": [-127, 2, 138], "train": [-111, 9, 51], "boss": [41, 24, 82], "map1": [84, 2, 37] }
for (const [key, value] in Object.entries(tpCmd)) {

}
api.createShopItemForPlayer('tp', '1', {
    image: 'Gold Coin',
    currency: 'Gold Coin', // not used since we handle manually
    amount: 1,
    buyButtonText: [{ str: 'Gamble' }],
    customTitle: 'Coin Flip',
    description: 'Type the amount of Gold Coins you want to bet. 50/50 chance to double or lose it!'
});

// Handle purchase
onPlayerBoughtShopItem = (playerId, categoryKey, itemKey, item, textInput) => {
    if (categoryKey === 'gamble' && itemKey === 'CoinFlip') {
        const bet = parseInt(textInput);
        if (!bet || bet <= 0) {
            api.sendMessage(playerId, [{ str: '❌ Invalid bet amount!' }]);
            return;
        }

        const playerCoins = api.getInventoryItemAmount(playerId, 'Gold Coin');

        if (playerCoins < bet) {
            api.sendMessage(playerId, [{ str: `❌ You only have ${playerCoins} Gold Coins! ` }]);
            return;
        }

        // Remove bet amount
        api.removeItemName(playerId, 'Gold Coin', bet);

        // 50/50 chance
        const won = Math.random() < 0.5;
        if (won) {
            api.giveItem(playerId, 'Gold Coin', bet * 2);
            api.sendMessage(playerId, [{ str: ` 🎉 You won! You now get ${bet * 2} Gold Coins!` }]);
        } else {
            api.sendMessage(playerId, [{ str: `💀 You lost ${bet} Gold Coins! Better luck next time.` }]);
        }
    }
};