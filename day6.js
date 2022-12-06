const fs = require('fs');

fs.readFile('input.txt', 'utf-8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    solve(data)
})

const solve = (input) => {

    const arr = input.split('')
    let ans = -1

    for (let i = 0; i < arr.length; i++) {
        const marker = {}
        for (let j = 0; j < 14; j++) {
            marker[arr[i+j]] = 1
        }
        if (Object.keys(marker).length === 14) {
            console.log(marker)
            ans = i + 14
            break
        }

    }

    console.log(ans)
}



