const fs = require('fs');

fs.readFile('input.txt', 'utf-8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    solve(data.split('\n'))
})


const solve = (input) => {

    const dirMap = {}

    const visitedFiles = {}

    let currDir = []


    const maxSize = 100000

    let sumDirSize = 0

    const diskSpace = 70000000
    const spaceUpdate = 30000000

    input.forEach(line => {

        const lineParts = line.split(' ')

        if (lineParts[0] === '$') {

            const command = lineParts[1]

            if (command === 'cd') {
                if (lineParts[2] === '..') {
                    if (currDir.length === 1) return
                    currDir.pop()
                    return
                }
                currDir.push(lineParts[2])
            }

            return
        }

        if (parseInt(lineParts[0])) {

            if (visitedFiles[JSON.stringify(currDir) + JSON.stringify(lineParts)]) return

            visitedFiles[JSON.stringify(currDir) + JSON.stringify(lineParts)] = true

            let dirArr = [...currDir]

            while (dirArr.length > 0) {
                const key = JSON.stringify(dirArr)
                dirMap[key] ? dirMap[key].sizeSum += parseInt(lineParts[0]) : dirMap[key] = {sizeSum: parseInt(lineParts[0])}
                dirArr.pop()
            }

        }

    })


    const currSpace = dirMap['["/"]'].sizeSum
    const spaceRemain = diskSpace - currSpace
    const spaceNeeded = spaceUpdate - spaceRemain

    let minDir = diskSpace

    for (const dirMapKey in dirMap) {
        const dir = dirMap[dirMapKey]

        //First star
        if (dir.sizeSum <= maxSize) sumDirSize += dir.sizeSum

        //Second star
        if (dir.sizeSum >= spaceNeeded && dir.sizeSum < minDir) {
            minDir = dir.sizeSum
        }
    }

    console.log(sumDirSize)
    console.log(minDir)


}





