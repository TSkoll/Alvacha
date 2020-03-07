const chartDiv = document.getElementById("charts");
Promise.all([
    fetchWaterConsum(),
    fetchMetaData()
]).then(values => {
    const consumption = convertEpochToDate(values[0]);
    const metadata = values[1];

    const keys = Object.keys(consumption);

    const totals = {};
    const weekBuildings = {}
    let maxWeeks = 0;
    for (let key of keys) {
        const c = consumption[key];
        const m = metadata[key];

        const grouped = groupData(c);

        totals[key] = {
            meta: m,
            values: grouped.reduce((a, b) => a + b, 0)
        }

        if (grouped.length > maxWeeks)
            maxWeeks = grouped.length

        for (let i = 0; i < grouped.length; i++) {
            if (!weekBuildings[i]) {
                weekBuildings[i] = {
                    count: 0,
                    amount: 0,
                    people: 0,
                    volume: 0,
                };
            }

            weekBuildings[i].count++;
            weekBuildings[i].amount += grouped[i];
            weekBuildings[i].people += m.people;
            weekBuildings[i].volume += m.volume;
        }
    }

    console.log(totals)

    let avg = [];
    const wBKeys = Object.keys(weekBuildings);
    for (let i = 0; i < wBKeys.length; i++) {
        const wBK = wBKeys[i];
        const wB = weekBuildings[wBK];

        avg.push(wB.amount / wB.people);
    }

    let drawData = [];
    for (let key of keys) {
        const t = totals[key];
        const tma = t.meta.apartments;
        const tvp = t.meta.people;
        const tv = t.values;

        const avgPeople = tvp / tma;
        const avgConsumption = tv / tma / avgPeople;

        drawData.push({
            avgPeople,
            avgConsumption
        });
    }

    const canvas = document.createElement("canvas");
    chartDiv.appendChild(canvas);
    const ctx = canvas.getContext("2d");

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Array.from(new Array(drawData.length).keys()),
            datasets: [{
                    label: "Avg Consumption",
                    data: drawData.map(x => x.avgConsumption),
                    backgroundColor: "rgba(0, 0, 255, 0.1)"
                },
                {
                    label: "Avg people",
                    data: drawData.map(x => x.avgPeople),
                    yAxisID: 'B',
                    type: 'line',
                    borderColor: "rgb(255, 0, 0)"
                }
            ]
        },
        options: {
            scales: {
                yAxes: [{
                        id: 'A',
                        type: 'linear',
                        position: 'left',
                        ticks: {
                            max: 75,
                            stepsize: 10
                        }
                    },
                    {
                        id: 'B',
                        type: 'linear',
                        position: 'right',
                        ticks: {
                            max: 5,
                            stepsize: 1
                        }
                    }
                ]
            }
        }
    })

    /*for (let key of keys) {
        const c = consumption[key];
        const daily = groupData(c);
        const m = metadata[key]

        const present = daily.map(x => x / m.people);

        const title = document.createElement("h1");
        title.innerText = `Housing ${Number(key) + 1} - ${m.year}`;
        const canvas = document.createElement("canvas");
        canvas.id = key;
        chartDiv.appendChild(title);
        chartDiv.appendChild(canvas);

        const ctx = canvas.getContext("2d");
        const chart = new Chart(ctx, {
            type: "line",
            data: {
                labels: Array.from(new Array(daily.length - 1).keys()),
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
                }
            }
        });
    }*/
})

function groupData(data) {
    const yearlyData = data.filter(x => x.date.getUTCFullYear() == 2019);
    const values = yearlyData.map(x => x.value);

    let dataPoints = [];

    const resolution = 24 * 7;

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