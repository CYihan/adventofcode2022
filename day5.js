const fs = require('fs');

fs.readFile('input.txt', 'utf-8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    const input = data.split('\n\n')

    solve(input)
})



const solve = (input) => {

    const instructions = input[1].split('\n')
    const reducedInstructions = instructions.map(l => {
        const words = l.split(' ')
        return [words[1], words[3], words[5]]
    })


    const start = input[0].split('\n')

    const startMap = new Map()
    for (let i = 0; i < start.length - 1; i++) {
        let id = 1
        for (let j = 1; j < start[i].length; j += 4) {
            if (start[i][j] === ' ') {
                id += 1
                continue
            }
            const val = startMap.get(id) ? startMap.get(id) + start[i][j] : start[i][j]
            startMap.set(id, val)
            id += 1
        }
    }
    const CrateMover9001 = (n, x, y) => {

        const xToMove = startMap.get(x).slice(0, n)
        const xRemain = startMap.get(x).slice(n)
        startMap.set(x,xRemain)
        startMap.set(y, xToMove + startMap.get(y))

    }


    const CrateMover9000 = (n, x, y) => {

        const xToMove = startMap.get(x).slice(0, n)
        const xRemain = startMap.get(x).slice(n)
        startMap.set(x,xRemain)
        startMap.set(y, xToMove.split("").reverse().join("") + startMap.get(y))

    }

    reducedInstructions.forEach(_i => {
        const i = _i.map(n => parseInt(n))
        CrateMover9000(i[0], i[1], i[2])
    })


    let ans = ''

    for (let i = 1; i < startMap.size+1; i++) {
        ans += startMap.get(i)[0]
    }

    console.log(ans)
}


