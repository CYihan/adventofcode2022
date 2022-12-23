import fs from 'fs'

fs.readFile('input.txt', 'utf-8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    solve(data.split(''))
})


const solve = (input) => {

    let inputCopy = [...input]
    const shape1 = {occupied: [{x: 0, y: 0}, {x: 1, y: 0}, {x: 2, y: 0}, {x: 3, y: 0}], anchor: 1}
    const shape2 = {
        occupied: [{x: 1, y: 0}, {x: 0, y: 1}, {x: 1, y: 1}, {x: 2, y: 1}, {x: 1, y: 2}], anchor: 2
    }
    const shape3 = {
        occupied: [{x: 0, y: 0}, {x: 1, y: 0}, {x: 2, y: 0}, {x: 2, y: 1}, {x: 2, y: 2}], anchor: 3
    }

    const shape4 = {occupied: [{x: 0, y: 0}, {x: 0, y: 1}, {x: 0, y: 2}, {x: 0, y: 3}], anchor: 4}

    const shape5 = {occupied: [{x: 0, y: 0}, {x: 0, y: 1}, {x: 1, y: 1}, {x: 1, y: 0}], anchor: 5}

    const floor = {occupied: []}

    for (let i = 0; i < 7; i++) {
        floor.occupied.push({x: i, y: 0})
    }

    const shapes = [shape1, shape2, shape3, shape4, shape5]


    shapes.forEach(s => {
        s.occupied.forEach(coord => {
            //console.log(coord)
            coord.x = coord.x + 2
        })
    })


    let totalShapes = 0

    let fallenShapes = [floor]
    const fallenShapesMap = {}
    floor.occupied.forEach(f => {
        fallenShapesMap[JSON.stringify(f)] = -1
    })

    let highestTop = 0

    let currShapes = JSON.parse(JSON.stringify(shapes))

    function addToFallenShapes(nextShape) {

        //fallenShapes.unshift(nextShape)

        nextShape.occupied.forEach(f => {
            if (f.y > highestTop) highestTop = f.y
            fallenShapesMap[JSON.stringify(f)] = nextShape.anchor
        })

    }

    function MoveX(nextShape, step) {
        const copyCoord = JSON.parse(JSON.stringify(nextShape.occupied))
        let discard = false
        for (let i = 0; i < nextShape.occupied.length; i++) {
            copyCoord[i].x += step
            //console.log( copyCoord[i].x)
            if (fallenShapesMap[JSON.stringify(copyCoord[i])] !== undefined) {
                discard = true
                break
            }

            if (copyCoord[i].x > 6 || copyCoord[i].x < 0) {
                discard = true
                break
            }
        }
        if (!discard) {
            nextShape.occupied = copyCoord
        }
    }

    function MoveY(nextShape) {
        const copyCoord = JSON.parse(JSON.stringify(nextShape.occupied))
        let discard = false
        for (let i = 0; i < nextShape.occupied.length; i++) {
            copyCoord[i].y -= 1
            if (fallenShapesMap[JSON.stringify(copyCoord[i])] !== undefined) {
                discard = true
                break
            }
        }
        if (!discard) {
            nextShape.occupied = copyCoord
            return true
        } else {
            addToFallenShapes(nextShape)
            return false
        }

    }

    const fallenShapePlotter = (fallenShapesMap, nextShape) => {
        const highestY = highestTop + 7

        let plot = ''

        for (let y = highestY; y >= 0; y--) {

            for (let x = -1; x < 8; x++) {
                if (x === -1) {
                    plot += '|'
                    continue
                }

                if (x === 7) {
                    plot += '|' + y
                    continue
                }
                if (y === 0) {
                    plot += '-'
                    continue
                }

                if (fallenShapesMap[JSON.stringify({x, y})] !== undefined) {
                    plot += fallenShapesMap[JSON.stringify({x, y})]
                    continue
                }

                if (nextShape.occupied.some(c => c.x === x && c.y === y)) {
                    plot += 'o'
                    continue
                }

                plot += '.'

            }

            plot += '\n'

        }

        console.log(plot)


    }

    let topArr = [[0, 0, 0]]
    let period = 0
    let lowerY = 143570
    let remainY = 0


    while (totalShapes < 100000) {

        totalShapes += 1

        if (totalShapes % 8475 === 0) {
            console.log(totalShapes, highestTop)
        }

        if (totalShapes === 93234 + 2492) {
            remainY = highestTop
        }


        let notStill = true


        if (currShapes.length < 1) {
            currShapes = JSON.parse(JSON.stringify(shapes))
        }
        const nextShape = currShapes.shift()


        const startY = highestTop + 4
        //console.log(startY)

        nextShape.occupied.forEach(s => {
            s.y += startY
        })

        while (notStill) {
            let action = inputCopy.shift()
            //console.log(action)


            if (action === '<') {
                MoveX(nextShape, -1);
            }
            if (action === '>') {
                MoveX(nextShape, 1)
            }
            //fallenShapePlotter(fallenShapesMap, nextShape)
            //const a = 0
            notStill = MoveY(nextShape)
            //fallenShapePlotter(fallenShapesMap, nextShape)
            //const b = 0


            //fallenShapePlotter(fallenShapesMap,nextShape)

            period += 1

            if (inputCopy.length < 1) {
                /*                console.log(input.length)
                                console.log(totalShapes)*/

                //console.log(totalShapes,findHighestStop(fallenShapesMap))
                inputCopy = [...input]
            }

            if (period % 50455 === 0) {
                const topArrLine = [highestTop, highestTop - topArr[topArr.length - 1][0], totalShapes]
                topArr.push(topArrLine)
                //console.log(highestTop)
            }
        }

    }

    console.log(topArr)
    console.log(fallenShapes.length - 1)


    const totalShapesGoal = 10 ** 12
    const a1 = topArr[topArr.length - 1]
    const a2 = topArr[topArr.length - 2]

    // Find through analysis of topArr table

    const dH = 13050
    const ds = 8475

    const x = 93234
    const h = 143570

    const shapesRemain = (totalShapesGoal - x)

    console.log('shapesRemain: ', shapesRemain % 8475)

    const fullCycles = (shapesRemain - 2491) / 8475

    console.log(fullCycles)

    const halfCycleHeight = remainY - lowerY

    const ans = h + fullCycles * dH + halfCycleHeight

    console.log(ans)



}

