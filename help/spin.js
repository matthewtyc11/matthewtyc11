let output = { 91: 0, 92: 0, 93: 0, 118: 0, 90: 0 }
const drawAmount = 100
for (let i = 0; i < drawAmount; i++) {
    const PoolRandom = Math.floor(Math.random() * 10000)
    if (PoolRandom < 20) {
        output[91] += 1
    } else if (PoolRandom < 40) {
        output[92] += 1
    } else if (PoolRandom < 60) {
        output[93] += 1
    } else if (PoolRandom < 110) {
        output[118] += 1
    } else {
        output[90] += 1
    }
}
Object.keys(output).forEach(item => getGameItem(myId, [item, output[item]]))