const readxml = require('read-excel-file/node');
const fs = require('fs');

let write = {};
readxml('./xmlparser/data/v2.data').then(rows => {
    for (let i = 6; i < rows.length; i++) {
        const data = rows[i];

        for (let j = 0; j < data.length; j += 2) {
            const buildingId = j / 2;

            if (!write[buildingId])
                write[buildingId] = [];

            const date = data[j];
            const value = data[j + 1];

            write[buildingId].push({
                date,
                value
            });
        }
    }

    fs.writeFileSync("./output.json", JSON.stringify(write));
});