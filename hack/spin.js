const PoolRandom = Math.floor(Math.random() * 10000)
if(PoolRandom<20){
	getGameItem(myId,[91,1])
} else if (PoolRandom<40){
	getGameItem(myId,[92,1])
} else if (PoolRandom<60){
	getGameItem(myId,[93,1])
} else if (PoolRandom<110){
	getGameItem(myId,[118,3])
} else {
	getGameItem(myId,[90,1])
}