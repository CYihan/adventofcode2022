const fs = require('fs');

let input = []

fs.readFile('input.txt', 'utf-8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    input = data.split('\n')
    solve(input)
})

const solve = (input) => {
    const elfs = []
    let i = 0
    input.forEach(c => {
        if (c.length < 1) {
            i += 1
            return
        }
        if (!elfs[i]) {
            elfs[i] = parseInt(c)
            return
        }
        elfs[i] += parseInt(c)
    })

    elfs.sort((a,b) => b-a)

    console.log(elfs[0]+elfs[1]+elfs[2])
}


