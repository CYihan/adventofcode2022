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

//Over engineering for fun, clean up later
const altSolve = (input) =>{

    const instructions = input[1].split('\n')
    const reducedInstructions = instructions.map(l => {
        const words = l.split(' ')
        return [words[1], words[3], words[5]]
    })

    let crates = []


    // x is current column, y is destinationColumn, n is amount of crates to be moved

    const findCratesWithOriginalAtColumn = (x) => {
        return crates.filter(c=>c.original[0]===x)
    }
    const findCratesAtCurrentColumn = (x,n)=>{
        return crates.filter(c=>c.match(x,n))
    }
    const findCratesAtColumn = (y) => {
        return crates.filter(c=>c.current[0]===y)
    }
    const incrementCratesAtDestinationColumn = (n,y) => {
        const _crates = findCratesAtColumn(y)

        _crates.forEach(c=>{
            c.current[1]=c.current[1]+n
        })
    }

    const decreaseCratesAtCurrentColumn = (x,n) => {
        const _crates = findCratesAtColumn(x)

        _crates.forEach(c=>{
            c.current[1]=c.current[1]-n
        })
    }
    const createCrates = (x,n,t) => {
        if(t <1) return []
        const originalCrates = findCratesWithOriginalAtColumn(x).sort((a,b)=>{
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


        const foundCrates = findCratesAtCurrentColumn(x,n).sort((a,b)=>{
            return  a.current[1] - b.current[1]
        })

        const t = n - foundCrates.length
        const newCrates = createCrates(x,n,t)

        const totalCrates = [...foundCrates,...newCrates]
        incrementCratesAtDestinationColumn(n,y)
        for (let i = 1; i <= n; i++) {
            totalCrates[i-1].move([y,n+1-i]) //Change here for 2nd star
        }
        decreaseCratesAtCurrentColumn(x,n)

        crates = [...crates, ...newCrates]

    }

    reducedInstructions.forEach(_i => {
        const i = _i.map(n => parseInt(n))
        CrateMover9000(i[0], i[1], i[2])
    })

    for (let i = 1; i <= 9; i++) {
        const _crate = findCratesAtColumn(i).sort((a,b)=>{
            return a.current[1] - b.current[1]
        })[0]

        console.log(_crate)

    }


}


