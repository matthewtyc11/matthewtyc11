function sendBossHealthBar(playerId, currentHp, maxHp, name, activeBar, deadBar) {
  let green = Math.floor(currentHp / maxHp * 16)
  if(currentHp > 0 && green === 0) green = 1
  let red = 16 - green
  let healthBar = ""
  for(let i = 0; i < 16; i++) {
    if(i < green) healthBar += activeBar
    else healthBar += deadBar
  }
  api.sendFlyingMiddleMessage(playerId, [{
      str: "                           [" + name + "]",
      style: {
        color: "#FF4444"
      }
    },
    {
      str: "\n" + healthBar,
      style: {
        color: "#FF4444"
      }
    },
    {
      str: `\n                            (${currentHp}/${maxHp})\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n `,
      style: {
        color: "#DE8C18"
      }
    }
  ], 0)
}