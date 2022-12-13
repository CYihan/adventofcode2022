const fs = require('fs');

fs.readFile('input.txt', 'utf-8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    solve(data.split('\n'))
})


const solve = (input) => {
    const x = [1]
    const commandsList = []

    input.forEach(line => {

        const commands = line.split(' ')

        if (commands[0] === 'noop') {
            x.push(x[x.length - 1])
            commandsList.push('noop')
            return
        }

        if (commands[0] === 'addx') {
            const val = parseInt(commands[1])
            commandsList.push(commands)
            commandsList.push(commands)
            x.push(x[x.length - 1])
            x.push(x[x.length - 1] + val)
        }

    })


    const cyclesToCheck = [20, 60, 100, 140, 180, 220]


    /*    cyclesToCheck.forEach(cycle => {
            //console.log( x[cycle - 2])
            console.log(cycle * x[cycle - 2])
        })*/

    /*    const results = cyclesToCheck.reduce((acc, cycle) => {
            //console.log( x[cycle - 2])
            return acc + cycle * x[cycle - 2]
        }, 0)*/

    let screen = ''


    x.forEach((val, i) => {
        const cycle = i % 40 + 1
        const currVal = x[i] + 1

        //console.log(currVal)

        if (cycle === currVal - 1 || cycle === currVal || cycle === currVal + 1) {
            screen += '#'

        } else {
            screen += '.'
        }
        if (cycle === 40) {
            screen += '\n'
        }
    })

    console.log(screen)


}