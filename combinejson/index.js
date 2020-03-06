const fs = require('fs');

const data1 = require('./data/1.json');
const data2 = require('./data/2.json');

const data1Keys = Object.keys(data1);
const data2Keys = Object.keys(data2);

let ret = {};

for (let d1Key of data1Keys) {
    ret[d1Key] = [];
    ret[d1Key] = data1[d1Key];
}

for (let d2Key of data2Keys) {
    ret[d2Key] = [];
    ret[d2Key] = data2[d2Key];
}

fs.writeFileSync('./output.json', JSON.stringify(ret));