const chartDiv = document.getElementById("charts");
Promise.all([
    fetchWaterConsum(),
    fetchMetaData()
]).then(values => {
    const consumption = convertEpochToDate(values[0]);
    const metadata = values[1];

    console.log(consumption);

    const keys = Object.keys(consumption);
    let pointIndex = 0;

    const totals = {};
    const weekBuildings = {}
    let maxWeeks = 0;
    for (let key of keys) {
        const c = consumption[key];
        const m = metadata[key];

        const grouped = groupData(c, 0);
        
        totals[key] = {
            meta: m,
            values: grouped
        }

        if (grouped.length > maxWeeks)
            maxWeeks = grouped.length

        for (let i = 0; i < grouped.length; i++) {
            if (!weekBuildings[i]) {
                weekBuildings[i] = {
                    count: 0,
                    amount: 0,
                    people: 0
                };
            }

            weekBuildings[i].count++;
            weekBuildings[i].amount += grouped[i];
            weekBuildings[i].people += m.people;
        }
    }

    let avg = [];
    const wBKeys = Object.keys(weekBuildings);
    for (let i = 0; i < wBKeys.length; i++) {
        const wBK = wBKeys[i];
        const wB = weekBuildings[wBK];

        avg.push(wB.amount / wB.people);
    }
    console.log({
        weekBuildings,
        avg
    });

    for (let key of keys) {
        const c = consumption[key];
        const totals = groupData(c, 0);
        const m = metadata[key];

        const present = totals.map(x => x / m.people);

        const title = document.createElement("h3");
        title.innerText = `Housing ${Number(key) + 1} - ${m.year}`;
        const canvas = document.createElement("canvas");
        canvas.id = key;
        chartDiv.appendChild(title);
        chartDiv.appendChild(canvas);

        const ctx = canvas.getContext("2d");
        const chart = new Chart(ctx, {
            type: "line",
            data: {
                labels: Array.from(new Array(totals.length - 1).keys()),
                datasets: [{
                    label: "Consumption",
                    borderColor: "rgb(255, 0, 0)",
                    data: present.slice(0, present.length - 1)
                }, {
                    label: "Average",
                    borderColor: "rgb(0, 0, 255)",
                    data: avg.slice(0, avg.length - 1)
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        display: true,
                        ticks: {
                            max: 2,
                            stepsize: 0.1
                        }
                    }]
                },
                onClick: function(evt) {
                    const element = chart.getElementAtEvent(evt);
                    pointIndex = chartClickEvent(evt, element);
                }
            }
        });
    }
})

function groupData(data, switchkey) {
    const yearlyData = data.filter(x => x.date.getUTCFullYear() == 2019);
    const monthlyData = [];
    for(let i = 0; i < 13; i++) {
        monthlyData[i] = yearlyData.filter(x => x.date.getUTCMonth() == i);
    }
    const yearvalues = yearlyData.map(x => x.value);
    let monthvalues = monthlyData[0].map(x => x.value);
    let values = [];
    let resolution = 1;

    switch(switchkey) {
        case 0:
            values = yearvalues;
            resolution = 24 * 7;
            break;
        case 1:
            values = monthvalues;
            resolution = 1;
            break;
        default:
            values = yearvalues;
            resolution = 24 * 7;
            break;
    }
    let dataPoints = [];

    for (let i = 0; i < values.length; i += resolution) {
        let total = 0;
        let count = 0;
        for (let j = 0; j < resolution; j++) {
            if (values[i + j] == undefined)
                break;

            total += values[i + j];
            count++;
        }

        dataPoints.push(total);
    }
    return dataPoints;
}

function chartClickEvent(evt, element) {
    if(!element || element.length == 0) return 0;
    const keys = Object.keys(element[0]);
    let pIndex = 0;
    for(let key of keys) {
        let temp = element[0][key];
        if(key == '_index') {
            pIndex = temp;
            break;
        }
    }
    return pIndex;
}

function convertEpochToDate(data) {
    const keys = Object.keys(data);
    for (let key of keys) {
        let d = data[key];
        d = convertBuildingToDate(d);
    }
    return data;
}

async function convertBuildingToDate(building) {
    for (let i = 0; i < building.length; i++) {
        building[i].date = convertToDate(building[i].date);
    }
    return building;
}

function convertToDate(date) {
    const nDate = new Date(date);
    return nDate;
}

async function fetchWaterConsum() {
    const data = await (await fetch("./waterconsum.json")).json();
    return data;
}

async function fetchMetaData() {
    const data = await (await fetch("./meta.json")).json();
    return data;
}