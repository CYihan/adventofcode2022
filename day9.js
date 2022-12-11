const fs = require('fs');

fs.readFile('input.txt', 'utf-8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    solve(data.split('\n'))
})

const move = (original, commands) => {
    const newPos = {...original}

    switch (commands[0]) {
        case 'D':
            newPos.y = newPos.y - 1
            break
        case 'U':
            newPos.y = newPos.y + 1
            break
        case 'R':
            newPos.x = newPos.x + 1
            break
        case 'L':
            newPos.x = newPos.x - 1
            break
    }


    return newPos
}

const calcDist = (hPos, tPos) => {


    return Math.sqrt((hPos.x - tPos.x) ** 2 + (hPos.y - tPos.y) ** 2)
}


const solve = (input) => {


    let hPos = [{x: 0, y: 0}]
    let tPos = [{x: 0, y: 0}]

    input.forEach(line => {
        const commands = line.split(' ')

        for (let i = 0; i < parseInt(commands[1]); i++) {
            hPos.push(move(hPos[hPos.length - 1], commands[0]))
        }

    })


    for (let i = 0; i < 9; i++) {
        tPos = [{x: 0, y: 0}]
        hPos.forEach(pos => {
            const currentTPos = tPos[tPos.length - 1]
            if (currentTPos.x === pos.x && currentTPos.y === pos.y) return

            const dist = calcDist(pos, currentTPos)

            if (dist >= 2) {

                //Lateral moves

                if (calcDist({x: pos.x - 1, y: pos.y}, currentTPos) < 2) {
                    tPos.push({x: pos.x - 1, y: pos.y})
                    return
                }

                if (calcDist({x: pos.x + 1, y: pos.y}, currentTPos) < 2) {
                    tPos.push({x: pos.x + 1, y: pos.y})
                    return

                }

                if (calcDist({x: pos.x, y: pos.y - 1}, currentTPos) < 2) {
                    tPos.push({x: pos.x, y: pos.y - 1})
                    return

                }

                if (calcDist({x: pos.x, y: pos.y + 1}, currentTPos) < 2) {
                    tPos.push({x: pos.x, y: pos.y + 1})
                    return
                }
                //Diagonal moves


                if (calcDist({x: pos.x - 1, y: pos.y - 1}, currentTPos) < 2) {
                    tPos.push({x: pos.x - 1, y: pos.y - 1})
                    return
                }

                if (calcDist({x: pos.x + 1, y: pos.y + 1}, currentTPos) < 2) {
                    tPos.push({x: pos.x + 1, y: pos.y + 1})
                    return

                }

                if (calcDist({x: pos.x - 1, y: pos.y + 1}, currentTPos) < 2) {
                    tPos.push({x: pos.x - 1, y: pos.y + 1})
                    return

                }

                if (calcDist({x: pos.x + 1, y: pos.y - 1}, currentTPos) < 2) {
                    tPos.push({x: pos.x + 1, y: pos.y - 1})
                    return
                }

            }

        })

        hPos = tPos
    }


    const unique = {}

    tPos.forEach(pos => {
        unique[JSON.stringify(pos)] = 1
    })

    console.log(Object.keys(unique).length)


}
