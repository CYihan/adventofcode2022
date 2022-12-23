import fs from "fs";

let input
let example
fs.readFile('input.txt', 'utf-8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    input = data

    checkData()

})


fs.readFile('example.txt', 'utf-8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    example = data

    checkData()

})



const checkData = () =>{

    console.log(input?.length)
    console.log(example?.length)


}

