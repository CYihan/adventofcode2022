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

    const youMap = {
        X: 0, Y: 3, Z: 6,
    }

    const shiftMap = {
        X: -1, Y: 0, Z: 1,
    }

    const themMap = {
        A: 1, B: 2, C: 3,
    }

    const calculatePoints = (them, you) => {

        const shift = shiftMap[you]

        let handPoint = themMap[them] + shift

        if (handPoint > 3) {
            handPoint = 1
        } else if (handPoint < 1) {
            handPoint = 3
        }


        return youMap[you] + handPoint
    }
    let points = 0
    input.forEach(line => {
        const arr = line.split(' ')
        points += calculatePoints(arr[0], arr[1])
    })


    console.log(points)


}


