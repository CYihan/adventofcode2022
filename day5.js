const fs = require('fs');

fs.readFile('input.txt', 'utf-8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    const input = data.split('\n\n')

    altSolve(input)
})

class Crate {

    original
    current

    constructor(original) {
        this.original=original
        this.current = original
    }

    match(x,n) {
        return x === this.current[0] && (this.current[1] >= 1 && this.current[1] <= n)
    }

    move(current) {
        this.current = current
    }

    getCurrent(){
        return this.current
    }
}



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


//Over engineering for fun, clean up later
const altSolve = (input) =>{

    const instructions = input[1].split('\n')
    const reducedInstructions = instructions.map(l => {
        const words = l.split(' ')
        return [words[1], words[3], words[5]]
    })

    let crates = []

    const findCratesAtOriginal = (x) => {
        return crates.filter(c=>c.original[0]===x)
    }
    const findCratesAtCurrent = (x,n)=>{
        return crates.filter(c=>c.match(x,n))
    }
    const findCratesAtFuture = (y) => {
        return crates.filter(c=>c.current[0]===y)
    }
    const incrementCratesAtFuture = (n,y) => {
        const _crates = findCratesAtFuture(y)

        _crates.forEach(c=>{
            c.current[1]=c.current[1]+n
        })
    }

    const decreaseCratesAtCurrent = (x,n) => {
        const _crates = findCratesAtFuture(x)

        _crates.forEach(c=>{
            c.current[1]=c.current[1]-n
        })
    }
    const createCrates = (x,n,t) => {
        if(t <1) return []
        const originalCrates = findCratesAtOriginal(x).sort((a,b)=>{
            return  b.original[1] - a.original[1]
        })

        const start = originalCrates[0]?.original[1] ? originalCrates[0]?.original[1] : 0
        const _crates = []
        for (let i = 1; i <= t; i++) {
            _crates.push(new Crate([x,start+i]))
        }
        return _crates
    }

    const CrateMover9000 = (n,x,y) => {


        const foundCrates = findCratesAtCurrent(x,n).sort((a,b)=>{
            return  a.current[1] - b.current[1]
        })

        const t = n - foundCrates.length
        const newCrates = createCrates(x,n,t)

        const totalCrates = [...foundCrates,...newCrates]
        incrementCratesAtFuture(n,y)
        for (let i = 1; i <= n; i++) {
            totalCrates[i-1].move([y,n+1-i])
        }
        decreaseCratesAtCurrent(x,n)

        crates = [...crates, ...newCrates]

    }

    reducedInstructions.forEach(_i => {
        const i = _i.map(n => parseInt(n))
        CrateMover9000(i[0], i[1], i[2])
    })

    for (let i = 1; i <= 9; i++) {
        const _crate = findCratesAtFuture(i).sort((a,b)=>{
            return a.current[1] - b.current[1]
        })[0]

        console.log(_crate)

    }


}


