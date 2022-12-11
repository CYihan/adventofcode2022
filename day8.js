const fs = require('fs');

fs.readFile('input.txt', 'utf-8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    solve2(data.split('\n'))
})


const solve = (input) => {
    const grid = input


    /*  const edgeNum = (input[0].length + input.length) * 2 -4*/

    const visibleTrees = {}


    for (let i = 0; i < grid.length; i++) {
        let highestCurr = -1
        for (let j = 0; j < grid[i].length; j++) {
            const currVal = parseInt(grid[i][j])
            if (highestCurr < currVal) {
                const key = 'y' + i + 'x' + j
                visibleTrees[key] = true
                highestCurr = currVal
            }
        }

        let highestCurrRev = -1
        for (let j = grid[i].length - 1; j >= 0; j--) {
            const currVal = parseInt(grid[i][j])
            if (highestCurrRev < currVal) {
                const key = 'y' + i + 'x' + j
                visibleTrees[key] = true
                highestCurrRev = currVal
            }

        }
    }

    for (let i = 0; i < grid[0].length; i++) {
        let highestCurr = -1
        for (let j = 0; j < grid.length; j++) {
            const currVal = parseInt(grid[j][i])
            if (highestCurr < currVal) {
                const key = 'y' + j + 'x' + i
                visibleTrees[key] = true
                highestCurr = currVal
            }
        }
        let highestCurrRev = -1
        for (let j = grid.length - 1; j >= 0; j--) {
            const currVal = parseInt(grid[j][i])
            if (highestCurrRev < currVal) {
                const key = 'y' + j + 'x' + i
                visibleTrees[key] = true
                highestCurrRev = currVal
            }

        }
    }


    console.log(Object.keys(visibleTrees).length)


}


const solve2 = (input) => {
    const grid = input


    /*  const edgeNum = (input[0].length + input.length) * 2 -4*/
    const treeMap = new Map()

    let highest = 0
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            if (highest < parseInt(grid[i][j])) highest = parseInt(grid[i][j])
            treeMap.set(JSON.stringify([i, j]), parseInt(grid[i][j]))
        }
    }


    const sortedTreeMap = [...treeMap].map(tree => [JSON.parse(tree[0]), tree[1]])

    let highestScore = 0
    for (let i = 0; i <= highest; i++) {

        const filtered = sortedTreeMap.filter(s => s[1] >= i).map(f => f[0])

        //console.log(filtered)
        filtered.forEach(tree => {
            const interX = filtered.filter(f => f[0] === tree[0] && f[1] !== tree[1]).map(m => m[1])

            const [l, r] = interX.reduce((acc, curr) => {
                const dist = curr - tree[1]

                if (dist > 0) {
                    if (dist < acc[1]) {
                        return [acc[0], dist]
                    }
                } else {
                    if (dist > acc[0]) {
                        return [dist, acc[1]]
                    }
                }
                return acc
            }, [-tree[1], grid.length-1 - tree[1]])

            const interY = filtered.filter(f => f[1] === tree[1] && f[0] !== tree[0]).map(m => m[0])

            const [u, d] = interY.reduce((acc, curr) => {
                const dist = curr - tree[0]
                if (dist > 0) {
                    if (dist < acc[1]) {
                        return [acc[0], dist]
                    }
                } else {
                    if (dist > acc[0]) {
                        return [dist, acc[1]]
                    }
                }

                return acc
            }, [-tree[0], grid.length-1 - tree[0]])

            const score = (l * r * u * d)

            if (highestScore < score) {
                highestScore = score
            }

        })

    }

    console.log(highestScore)


}


/*const getDistScoreForward = (start,axis)=>{
        let dist = 0
        for (let i = start+1; i < grid.length; i++) {
            const coord = axis === 'y' ? [start, i] : [i, start]
            const compareTree = treeMap.get(JSON.stringify(coord))
            console.log(compareTree)
            console.log(dist)
            if (compareTree === highest) throw Error('test')
            dist += 1
        }
        return dist
    }

    const getDistScoreBackward = (start,axis)=>{
        let dist = 0
        for (let i = grid.length-1; i > start; i--) {
            const coord = axis === 'y' ? [start, i] : [i, start]
            const compareTree = treeMap.get(JSON.stringify(coord))
            if (compareTree === highest) break
            dist += 1
        }
        return dist
    }

    for (let i = 0; i < filtered.length; i++) {
        const treeY = filtered[i][0][0]
        const treeX = filtered[i][0][1]

        let scenicScore = 1

        scenicScore *= getDistScoreForward(treeY,'y')
        scenicScore *= getDistScoreBackward(treeY, 'y')
        scenicScore *= getDistScoreBackward(treeX, 'x')
        scenicScore *= getDistScoreForward(treeX, 'x')
        if (scenicScore > highestScenic) highestScenic = scenicScore
    }

    console.log(highestScenic)
*/