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


const calculatePrio = (stringChar) => {
    const UTFCode = stringChar.charCodeAt(stringChar)
    if(UTFCode > 96) return UTFCode-96

    return UTFCode - 38
}


const solve2 = (input) => {
    let prioSum = 0



    for (let i = 0; i < input.length; i+=3) {
        const sackMap = {}
        const first = input[i]
        const second = input[i+1]
        const third = input[i+2]

        for (let j = 0; j < first.length; j++) {
            sackMap[first[j]] ? sackMap[first[j]]['a'] = 1 : sackMap[first[j]] = {a: 1}
        }

        for (let j = 0; j < second.length; j++) {
            sackMap[second[j]] ? sackMap[second[j]]['b'] = 1 : sackMap[second[j]] = {b: 1}
        }

        for (let j = 0; j < third.length; j++) {
            sackMap[third[j]] ? sackMap[third[j]]['c'] = 1 : sackMap[third[j]] = {c: 1}
        }


        for (const sackMapKey in sackMap) {

            if(Object.keys(sackMap[sackMapKey]).length === 3 ) {
                prioSum += calculatePrio(sackMapKey)
            }
        }
    }

    console.log(prioSum)
}

const solve1 = (input) => {

    let prioSum = 0

    input.forEach(str=>{
        const sackMap = {}
        const uniqueMap1 = {}
        const uniqueMap2 = {}

        for (let i = 0; i < str.length/2; i++) {
            uniqueMap1[str[i]] = 0
            uniqueMap2[str[i+str.length/2]] = 0
        }


        for (const key in uniqueMap1) {
            sackMap[key] = sackMap[key] ? sackMap[key] + 1 : 1
        }

        for (const key in uniqueMap2) {
            sackMap[key] = sackMap[key] ? sackMap[key] + 1 : 1
        }


        for (const sackMapKey in sackMap) {

            if(sackMap[sackMapKey] > 1) {

                prioSum += calculatePrio(sackMapKey)

            }

        }

    })

    console.log(prioSum)
}

