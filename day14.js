import fs from 'fs'

fs.readFile('input.txt', 'utf-8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    solve2(data.split('\n'))
})

// This was def not a good way to solve this problem....

const solve2 = (input) => {

    const points = input.map(l => l.split(' -> '))

    const caveMap = {}

    points.forEach(coords => {
        for (let i = 0; i < coords.length - 1; i++) {
            const start = coords[i].split(',')
            const end = coords[i + 1].split(',')

            let diffX = Math.abs(end[0] - start[0])
            let diffY = Math.abs(end[1] - start[1])

            diffY += 1
            diffX += 1


            for (let j = 0; j < diffX; j++) {
                for (let k = 0; k < diffY; k++) {

                    const offsetStartX = end[0] >= start[0] ? start[0] : end[0]
                    const offsetStartY = end[1] >= start[1] ? start[1] : end[1]

                    const xCoord = parseInt(offsetStartX) + j
                    const yCoord = parseInt(offsetStartY) + k

                    caveMap[JSON.stringify([xCoord, yCoord])] = 1
                }
            }

        }
    })


    const findHighestY = () => {
        return Object.keys(caveMap).reduce((acc, c) => {
            const y = JSON.parse(c)[1]
            if (y > acc) return y
            return acc
        }, 0)
    }

    const findLowestX = () => {
        return Object.keys(caveMap).reduce((acc, c) => {
            const x = JSON.parse(c)[0]
            if (x < acc) return x
            return acc
        }, 100000000)
    }

    const findLowestY = () => {
        return Object.keys(caveMap).reduce((acc, c) => {
            const x = JSON.parse(c)[1]
            if (x < acc) return x
            return acc
        }, 100000000)
    }

    const findHighestX = () => {
        return Object.keys(caveMap).reduce((acc, c) => {
            const x = JSON.parse(c)[0]
            if (x > acc) return x
            return acc
        }, 0)
    }

    const findLowestYAtX = (x) => {
        return Object.keys(caveMap).reduce((acc, c) => {
            const y = JSON.parse(c)[1]
            if (JSON.parse(c)[0] !== x) return acc
            if (y < acc) return y
            return acc
        }, Infinity)
    }



    const xMaxStart = findHighestX()
    const xMinStart = findLowestX()

    const yMaxStart = findHighestY()
    const yMinStart = findLowestY()

    let startStr = ''
    for (let j = yMinStart; j <= yMaxStart; j++) {
        for (let i = xMinStart; i <= xMaxStart; i++) {

            const coord = JSON.stringify([i, j])

            if (caveMap[coord]) {
                startStr += caveMap[coord]
            } else {
                startStr += '.'
            }

        }
        startStr += '\n'
    }
    console.log(startStr)


    let keepGoing = true

    let sand = 0

    while (keepGoing) {

        const nodes = {}

        const xMax = findHighestX()
        const xMin = findLowestX()

        for (let i = 0; i < yMaxStart + 2; i++) {
            for (let j = xMin - 1; j < xMax + 2; j++) {
                const coord = [j, i]
                if (caveMap[JSON.stringify(coord)]) {
                    continue
                }
                if (i > yMaxStart) {
                    //console.log(coord)
                    nodes[JSON.stringify(coord)] = {
                        down: {},
                        left: {},
                        right: {},
                        end: false,
                        exists: true,
                        coord: coord
                    }
                    continue
                }
                /*                if (!caveMap[JSON.stringify([j, i + 1])]) {
                                    continue
                                }*/
                nodes[JSON.stringify(coord)] = {down: {}, left: {}, right: {}, end: false, exists: true, coord: coord}
            }
        }

        /*        let startStr = ''

                for (let j = 0; j <= yMaxStart+1; j++) {
                    for (let i = xMinStart-1; i <= xMaxStart+1; i++) {

                        const coord = JSON.stringify([i, j])

                        if (nodes[coord] && nodes[coord].end === false) {
                            startStr += '.'
                        } else if(nodes[coord] && nodes[coord].end === true) {
                           // console.log(coord)
                            startStr += 'e'
                        }
                        else {
                            startStr += '#'
                        }

                    }
                    startStr+='\n'
                }

                console.log(startStr)*/

        for (const nodesKey in nodes) {
            const node = nodes[nodesKey]

            const nodeCoord = JSON.parse(nodesKey)
            //console.log('start: ',nodeCoord)

            const leftCoord = JSON.stringify([nodeCoord[0] - 1, nodeCoord[1] + 1])
            const rightCoord = JSON.stringify([nodeCoord[0] + 1, nodeCoord[1] + 1])
            const downCoord = JSON.stringify([nodeCoord[0], nodeCoord[1] + 1])
            //console.log('left: ',leftCoord)

            if (node.end) continue

            if (nodes[downCoord]) {
                node.down[downCoord] = nodes[downCoord]
            }

            if (nodes[leftCoord]) {
                node.left[leftCoord] = nodes[leftCoord]
            }

            if (nodes[rightCoord]) {
                node.right[rightCoord] = nodes[rightCoord]
            }
        }
        const start = JSON.stringify([500, findLowestYAtX(500) - 1])

        let currNode = nodes[start]

        if (!currNode) break
        while (true) {

            let nextNodeKey = null

            if (Object.keys(currNode.down).length > 0) {
                nextNodeKey = Object.keys(currNode.down)
            } else if (Object.keys(currNode.left).length > 0) {
                nextNodeKey = Object.keys(currNode.left)
            } else if (Object.keys(currNode.right).length > 0) {
                nextNodeKey = Object.keys(currNode.right)
            }

            //console.log(currNode)
            if (!nextNodeKey) {
                //console.log('stop at', currNode.coord)
                caveMap[JSON.stringify(currNode.coord)] = 'O'
                break
            }

            const nextNode = nodes[nextNodeKey[0]]

            currNode = nextNode
            if (nextNode.end) break
        }

        if (currNode.end) {
            keepGoing = false
            break
        }

        sand += 1


        //console.log(Object.keys(caveMap).length)

    }

    //console.log(caveMap)


    const keys = Object.keys(caveMap).map(k => JSON.parse(k))

    const xMax1 = findHighestX()
    const xMin1 = findLowestX()

    const yMax1 = findHighestY()
    const yMin1 = findLowestY()

    let str = ''


    for (let j = yMin1; j <= yMax1; j++) {
        for (let i = xMin1; i <= xMax1; i++) {

            const coord = JSON.stringify([i, j])

            if (caveMap[coord]) {
                str += caveMap[coord]
            } else {
                str += '.'
            }

        }
        str += '\n'
    }

    console.log(str)

    console.log(sand)

}


const solve = (input) => {

    const points = input.map(l => l.split(' -> '))

    const caveMap = {}

    points.forEach(coords => {
        for (let i = 0; i < coords.length - 1; i++) {
            const start = coords[i].split(',')
            const end = coords[i + 1].split(',')

            let diffX = Math.abs(end[0] - start[0])
            let diffY = Math.abs(end[1] - start[1])

            diffY += 1
            diffX += 1

            /*if (diffX === 0) diffX = 1
            if (diffY === 0) diffY = 1*/

            for (let j = 0; j < diffX; j++) {
                for (let k = 0; k < diffY; k++) {

                    const offsetStartX = end[0] >= start[0] ? start[0] : end[0]
                    const offsetStartY = end[1] >= start[1] ? start[1] : end[1]

                    const xCoord = parseInt(offsetStartX) + j
                    const yCoord = parseInt(offsetStartY) + k

                    caveMap[JSON.stringify([xCoord, yCoord])] = 1
                }
            }

        }
    })


    const findHighestY = () => {
        return Object.keys(caveMap).reduce((acc, c) => {
            const y = JSON.parse(c)[1]
            if (y > acc) return y
            return acc
        }, 0)
    }

    const findLowestX = () => {
        return Object.keys(caveMap).reduce((acc, c) => {
            const x = JSON.parse(c)[0]
            if (x < acc) return x
            return acc
        }, 100000000)
    }

    const findLowestY = () => {
        return Object.keys(caveMap).reduce((acc, c) => {
            const x = JSON.parse(c)[1]
            if (x < acc) return x
            return acc
        }, 100000000)
    }

    const findHighestX = () => {
        return Object.keys(caveMap).reduce((acc, c) => {
            const x = JSON.parse(c)[0]
            if (x > acc) return x
            return acc
        }, 0)
    }

    const findLowestYAtX = (x) => {
        return Object.keys(caveMap).reduce((acc, c) => {
            const y = JSON.parse(c)[1]
            if (JSON.parse(c)[0] !== x) return acc
            if (y < acc) return y
            return acc
        }, Infinity)
    }



    const xMaxStart = findHighestX()
    const xMinStart = findLowestX()

    const yMaxStart = findHighestY()
    const yMinStart = findLowestY()

    let startStr = ''
    for (let j = yMinStart; j <= yMaxStart; j++) {
        for (let i = xMinStart; i <= xMaxStart; i++) {

            const coord = JSON.stringify([i, j])

            if (caveMap[coord]) {
                startStr += caveMap[coord]
            } else {
                startStr += '.'
            }

        }
        startStr += '\n'
    }
    console.log(startStr)


    let keepGoing = true

    let sand = 0

    while (keepGoing) {

        const nodes = {}
        //console.log(caveMap)
        for (let i = 0; i < yMaxStart + 2; i++) {
            for (let j = xMinStart - 1; j < xMaxStart + 2; j++) {
                const coord = [j, i]
                if (caveMap[JSON.stringify(coord)]) {
                    continue
                }
                if (i > yMaxStart) {
                    //console.log(coord)
                    nodes[JSON.stringify(coord)] = {
                        down: {},
                        left: {},
                        right: {},
                        end: true,
                        exists: true,
                        coord: coord
                    }
                    continue
                }
                /*                if (!caveMap[JSON.stringify([j, i + 1])]) {
                                    continue
                                }*/
                nodes[JSON.stringify(coord)] = {down: {}, left: {}, right: {}, end: false, exists: true, coord: coord}
            }
        }

        /*        let startStr = ''

                for (let j = 0; j <= yMaxStart+1; j++) {
                    for (let i = xMinStart-1; i <= xMaxStart+1; i++) {

                        const coord = JSON.stringify([i, j])

                        if (nodes[coord] && nodes[coord].end === false) {
                            startStr += '.'
                        } else if(nodes[coord] && nodes[coord].end === true) {
                           // console.log(coord)
                            startStr += 'e'
                        }
                        else {
                            startStr += '#'
                        }

                    }
                    startStr+='\n'
                }

                console.log(startStr)*/

        for (const nodesKey in nodes) {
            const node = nodes[nodesKey]

            const nodeCoord = JSON.parse(nodesKey)
            //console.log('start: ',nodeCoord)

            const leftCoord = JSON.stringify([nodeCoord[0] - 1, nodeCoord[1] + 1])
            const rightCoord = JSON.stringify([nodeCoord[0] + 1, nodeCoord[1] + 1])
            const downCoord = JSON.stringify([nodeCoord[0], nodeCoord[1] + 1])
            //console.log('left: ',leftCoord)

            if (node.end) continue

            if (nodes[downCoord]) {
                node.down[downCoord] = nodes[downCoord]
            }

            if (nodes[leftCoord]) {
                node.left[leftCoord] = nodes[leftCoord]
            }

            if (nodes[rightCoord]) {
                node.right[rightCoord] = nodes[rightCoord]
            }
        }
        const start = JSON.stringify([500, findLowestYAtX(500) - 1])

        let currNode = nodes[start]

        if (!currNode) break
        while (true) {

            let nextNodeKey = null

            if (Object.keys(currNode.down).length > 0) {
                nextNodeKey = Object.keys(currNode.down)
            } else if (Object.keys(currNode.left).length > 0) {
                nextNodeKey = Object.keys(currNode.left)
            } else if (Object.keys(currNode.right).length > 0) {
                nextNodeKey = Object.keys(currNode.right)
            }

            //console.log(currNode)
            if (!nextNodeKey) {
                //console.log('stop at', currNode.coord)
                caveMap[JSON.stringify(currNode.coord)] = 'O'
                break
            }

            const nextNode = nodes[nextNodeKey[0]]

            currNode = nextNode
            if (nextNode.end) break
        }

        if (currNode.end) {
            keepGoing = false
            break
        }

        sand += 1


        //console.log(Object.keys(caveMap).length)

    }

    //console.log(caveMap)


    const keys = Object.keys(caveMap).map(k => JSON.parse(k))

    const xMax1 = findHighestX()
    const xMin1 = findLowestX()

    const yMax1 = findHighestY()
    const yMin1 = findLowestY()

    let str = ''


    for (let j = yMin1; j <= yMax1; j++) {
        for (let i = xMin1; i <= xMax1; i++) {

            const coord = JSON.stringify([i, j])

            if (caveMap[coord]) {
                str += caveMap[coord]
            } else {
                str += '.'
            }

        }
        str += '\n'
    }

    console.log(str)

    console.log(sand)

}