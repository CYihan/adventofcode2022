const fs = require('fs');

let input = []

fs.readFile('input.txt', 'utf-8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    input = data.split('\n')
    solve2(input)
})




const solve2 = (input) => {

    let pairs = 0

    input.forEach(str=>{
        const number = str.split(',').map(p=> p.split('-'))

        if( parseInt(number[0][1]) >= parseInt(number[1][0]) && parseInt(number[1][1]) >= parseInt(number[0][1])){
            pairs+=1
            return
        }

        if( parseInt(number[0][1]) >= parseInt(number[1][1]) && parseInt(number[1][1]) >= parseInt(number[0][0])){
            pairs+=1
            return
        }
    })
    console.log(pairs)
}

const solve1 = (input) => {

    let pairs = 0

    input.forEach(str=>{
       const number = str.split(',').map(p=> p.split('-'))

        if(number[0][0]-number[1][0] >= 0 && number[0][1]-number[1][1] <= 0){
            pairs+=1
        } else if(number[0][0]-number[1][0] <= 0 && number[0][1]-number[1][1] >= 0) {
            pairs+=1
        }
    })

    console.log(pairs)
}

