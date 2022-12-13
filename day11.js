const fs = require('fs');

fs.readFile('example.txt', 'utf-8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    solve(data.split(/Monkey \d:/))
})


const solve = (input) => {
    const filtered = input.filter(l => l.length > 0).map(f => f.split('\n').filter(l => l.length > 0)).map(f => {
        const startingItems = f[0].split('Starting items: ')[1].split(',').map(p => parseInt(p))
        const operation = f[1].split('Operation: ')[1].replace('new', 'newLevel')


        const test = {
            divisor: parseInt(f[2].split('Test: divisible by ')[1]),
            'true': parseInt(f[3].split('    If true: throw to monkey ')[1]),
            'false': parseInt(f[4].split('    If false: throw to monkey ')[1])
        }
        return {startingItems, operation, test, inspected: 0}

    })

    const checkArr = [1, 20, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000]


    const commonDivisor = filtered.reduce((acc, c)=>{
        return acc *= c.test.divisor
    },1)

    let maxOld = 0

    for (let i = 0; i < 10000; i++) {
        filtered.forEach((f) => {
            f.startingItems.forEach(item => {
                let newLevel
                const old = item
                let operation = f.operation

                eval(operation)
                newLevel = newLevel % commonDivisor

                f.inspected += 1

                const key = newLevel % f.test.divisor === 0 ? 'true' : 'false'
                filtered[f.test[key]].startingItems.push(newLevel)
            })
            f.startingItems = []
        })

        if (checkArr.some(c => c === (i + 1))) {
            console.log(filtered.map(f => f.inspected))
        }

    }


}