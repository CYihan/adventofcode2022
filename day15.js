import fs from 'fs'

fs.readFile('input.txt', 'utf-8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    solve(data.split('\n'))
})

const manhattanDistance = (x1, y1, x2, y2) => {
    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);
    return dx + dy;
}

const solve = (input) => {
    const raw = input.map(r => r.split(';'))

    const extractInfo = (inputString) => {

        const sensorAndBeacon = inputString.split(':')
        const regex = /-?\d+/g;

        return sensorAndBeacon.map(s => {
            return s.match(regex).map(s => parseInt(s));
        })
    };

    const beaconMap = {}
    const sensorMap = {}
    let xMax = -Infinity
    let xMin = Infinity
    let yMax = -Infinity
    let yMin = Infinity
    raw.forEach(f => {
        const [sensor, beacon] = extractInfo(f[0]);

        /*     if(xMax < beacon[0]) xMax = beacon[0]
             if(xMax < sensor[0]) xMax = sensor[0]

             if(xMin > beacon[0]) xMin = beacon[0]
             if(xMin > sensor[0]) xMin = sensor[0]

             if(yMax < beacon[1]) yMax = beacon[1]
             if(yMax < sensor[1]) yMax = sensor[1]

             if(yMin > beacon[1]) yMin = beacon[1]
             if(yMin > sensor[1]) yMin = sensor[1]*/

        beaconMap[JSON.stringify([beacon[0], beacon[1]])] = 1
        sensorMap[JSON.stringify([sensor[0], sensor[1]])] = manhattanDistance(sensor[0], sensor[1], beacon[0], beacon[1])


    })
    let impossibleXPos = {}
    const yCheck = 2000000
    console.time()
    for (const sensorMapKey in sensorMap) {
        const sensorDistance = sensorMap[sensorMapKey]
        const coord = JSON.parse(sensorMapKey)

        const yDiff = Math.abs(yCheck - coord[1])
        const xRange = sensorDistance - yDiff

        if (xRange < 0) {
            //Too far away
            continue
        }

        const startX = coord[0]

        const left = startX - xRange
        const right = startX + xRange

        for (let i = left; i < right + 1; i++) {
            impossibleXPos[i] = 1
        }
    }

    for (const beaconMapKey in beaconMap) {
        const coord = JSON.parse(beaconMapKey)
        if (coord[1] === yCheck) {
            if (impossibleXPos[coord[0]]) {
                delete impossibleXPos[coord[0]]
            }
        }
    }

    console.log(Object.keys(impossibleXPos).length)

//console.log(sensorMap)
    console.timeEnd()
    const numbers = Object.values(sensorMap)
    console.log(numbers)
    console.log(sensorMap)

    const availableMap = {}


    function manhattanCoordinates(x, y, c) {
        const coordinates = [];

        for (let i = x - c; i <= x + c; i++) {
            for (let j = y - c; j <= y + c; j++) {
                if (Math.abs(i - x) + Math.abs(j - y) === c) {
                    coordinates.push([i, j]);
                }
            }
        }

        return coordinates;
    }

    let finalCoord
    const possibleMap = {}
    for (const sensorMapKey in sensorMap) {

        const coords = JSON.parse(sensorMapKey)
        const distance = sensorMap[sensorMapKey] + 1

        const x = coords[0]
        const y = coords[1]

        console.log(sensorMapKey)
        console.time()


        for (let i = 0; i <= distance; i++) {

            const a1 = [x + i, y + distance - i]
            const a2 = [x - i, y - distance + i]
            const a3 = [x + i, y - distance + i]
            const a4 = [x - i, y + distance - i]

            const collected = [...a1,...a2,...a3,...a4]

            let skip = false

            collected.forEach(c=>{
                if(c < 0 || c > 4000000) skip = true
            })

            if(skip) continue


            const a1Key = JSON.stringify(a1)
            const a2Key = JSON.stringify(a2)
            const a3Key = JSON.stringify(a3)
            const a4Key = JSON.stringify(a4)

            possibleMap[a1Key] = true
            possibleMap[a2Key] = true
            possibleMap[a3Key] = true
            possibleMap[a4Key] = true

            for (const sensorMapKey1 in sensorMap) {

                const dist2 = sensorMap[sensorMapKey1]
                const coords = JSON.parse(sensorMapKey1)
                if (manhattanDistance(...a1, coords[0], coords[1]) <= dist2) {
                    delete possibleMap[a1Key]
                }
                if (manhattanDistance(...a2, coords[0], coords[1]) <= dist2) {
                    delete possibleMap[a2Key]
                }
                if (manhattanDistance(...a3, coords[0], coords[1]) <= dist2) {
                    delete possibleMap[a3Key]
                }
                if (manhattanDistance(...a4, coords[0], coords[1]) <= dist2) {
                    delete possibleMap[a4Key]
                }
            }

        }

        console.timeEnd()
        if(Object.keys(possibleMap).length > 0) break
        //console.log(possibleMap)

    }



    const coord = JSON.parse(Object.keys(possibleMap)[0])

    console.log(coord[0]*4000000+coord[1])


    const getClosestBeacon = (beaconCoord) => {


    }


    /*const sum = numbers
        .reduce((acc, c) => {
            return acc + c
        }, 0)



    console.log(sum*4)

    for (let i = 0; i < (78355372*28); i++) {
        const x = 0
    }
*/


    /*    const rowToFind = 2000000


        let impossible = 0

        for (let i = xMin; i < xMax + 1; i++) {
            const coord = [i,rowToFind]


            if(beaconMap[JSON.stringify(coord)] || sensorMap[JSON.stringify(coord)]) continue
            let _impossible = false
            for (const sensorMapKey in sensorMap) {
                const sensorDistance = sensorMap[sensorMapKey]
                const sensorCoord = JSON.parse(sensorMapKey)
                if(manhattanDistance(sensorCoord[0],sensorCoord[1],coord[0],coord[1]) <= sensorDistance ){
                    _impossible = true
                }
            }
            if(_impossible){
                impossible += 1
            }
            //console.log(coord)
        }

        console.log(impossible)*/


}

// This was def not a good way to solve this problem....