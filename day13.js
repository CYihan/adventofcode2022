import fs from 'fs'

fs.readFile('input.txt', 'utf-8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    solve(data.split('\n\n'))
    solve2(data.replace(/10/g, 9).split('\n\n'))
})

const solve2 = (input) => {
    const pairs = input.map(line => line.split('\n'))
    let all = []
    pairs.forEach(( curr, i) => {
        let parsed = [JSON.parse(curr[0]), JSON.parse(curr[1])]

        parsed.forEach(p=>all.push(p))
    })

    all.push([[2]])
    all.push([[6]])

    all.sort()

    const start = all.findIndex(p=>JSON.stringify(p) === '[[2]]') + 1

    const end = all.findIndex(p=>JSON.stringify(p) === '[[6]]') + 1


    console.log((start)*(end))


}


const solve = (input) => {

    const pairs = input.map(line => line.split('\n'))

    let correctSum = 0
    const breakList = []
    const recursiveArraySearch = (parsed, currPair) => {
        const left = parsed[0]
        const right = parsed[1]


        for (let i = 0; i < parsed[0].length; i++) {

            if (typeof left[i] === 'object' || typeof right[i] === 'object') {
                let leftArr = left[i]
                let rightArr = right[i]
                if (typeof leftArr !== 'object') leftArr = [leftArr]
                if (typeof rightArr !== 'object') rightArr = [rightArr]
                recursiveArraySearch([leftArr, rightArr], currPair)
                if (breakList.includes(currPair)) {

                    return
                }
            }


            if (right[i] === undefined) {
                breakList.push(currPair)
                return
            }

            if (typeof left[i] === 'number' && typeof right[i] === 'number') {
                if (left[i] < right[i]) {

                    breakList.push(currPair)
                    correctSum += currPair
                    return
                }
                if (left[i] === right[i]) {
                    continue
                }
                if (left[i] > right[i]) {

                    breakList.push(currPair)
                    /*                    console.log(parsed)
                                        console.log('left is bigger')
                                        console.log(breakList)*/
                    return
                }
            }


        }

        if (breakList.includes(currPair)) {
            return
        }

        if (right.length === 0 && left.length === 0) return

        if (right[left.length] !== undefined) {
            correctSum += currPair
            breakList.push(currPair)
        }
    }

    pairs.forEach(( curr, i) => {
        let parsed = [JSON.parse(curr[0]), JSON.parse(curr[1])]

        recursiveArraySearch(parsed, i + 1)

    })


    console.log(correctSum)

}