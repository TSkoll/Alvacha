const fs = require('fs');
const data = require('./data/2.json');
const keys = Object.keys(data);

for (let key of keys) {
    const d = data[key];

    for (let i = 0; i < d.length; i++) {
        if (!d[i].date && !d[i].value)
            continue;

        const p = d[i];

        const date = p.date;
        const split = date.split(" ");
        
        const dateValues = split[1].split(".");

        const day = dateValues[0];
        const month = dateValues[1];
        const year = dateValues[2];

        const timeValues = split[2].split(".");

        const hour = timeValues[0];
        const minute = timeValues[0];
        const second = timeValues[0];

        const dt = new Date();

        dt.setUTCFullYear(year, month, day);
        dt.setUTCHours(hour);

        const datenum = dt.getTime();
        data[key][i].date = datenum;
    }
}

fs.writeFileSync("./numout.json", JSON.stringify(data));