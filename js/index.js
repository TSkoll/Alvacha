const chartDiv = document.getElementById("charts");
let consumption = {};
let metadata;
let comparer = "people";
let resolution;
let charts = {
    buildingCharts: [],
    other: []
}

Promise.all([
    fetchWaterConsum(),
    fetchMetaData()
]).then(values => {
    const tempConsumption = convertEpochToDate(values[0]);
    const tempKeys = Object.keys(tempConsumption);
    for (let tempKey of tempKeys) {
        consumption[tempKey] = values[0][tempKey].filter(x => x.date.getUTCFullYear() == 2019);
    }
    metadata = values[1];

    generateCharts();
    const data = generateData();
    updateCharts(data);
});

function generateCharts() {
    const keys = Object.keys(metadata);

    for (let key of keys) {
        const m = metadata[key];

        const title = document.createElement("h3")
        title.innerText = `Housing ${Number(key) + 1}`

        const description = document.createElement("p");
        description.innerText = `
        Built: ${m.year}
        Volume: ${m.volume || "Unknown"} Square meters
        Aparments: ${m.apartments || "Unknown"}
        Inhabitants: ${m.people || "Unknown"}
        `;

        chartDiv.appendChild(title);
        chartDiv.appendChild(description);

        const ctx = createCanvas(chartDiv);
        const chart = drawChart(ctx,
            "line",
            null,
            null);


        charts.buildingCharts.push({
            ctx,
            chart
        });
    }
}

function generateData() {
    const keys = Object.keys(consumption);

    const totals = [];
    const weekBuildings = {}
    let recent = [];
    for (let key of keys) {
        const c = consumption[key];
        const grouped = groupData(c, 0);
        const m = metadata[key];

<<<<<<< HEAD
        const grouped = groupData(c, 0, 0);

=======
>>>>>>> origin/dashboard
        totals.push({
            meta: m,
            values: grouped.reduce((a, b) => a + b, 0)
        });

        recent.push(grouped.map(x => x / m[comparer]));

        for (let i = 0; i < grouped.length; i++) {
            if (!weekBuildings[i]) {
                weekBuildings[i] = {
                    count: 0,
                    amount: 0,
                    people: 0,
                    volume: 0
                }
            }

            weekBuildings[i].count++;
            weekBuildings[i].amount += grouped[i];
            weekBuildings[i].people += m.people;
            weekBuildings[i].volume += m.volume;
        }
    }

    let avg = [];

    const wBKeys = Object.keys(weekBuildings);
    for (let i = 0; i < wBKeys.length; i++) {
        const wBK = wBKeys[i];
        const wB = weekBuildings[wBK];

<<<<<<< HEAD
        avg.push(wB.amount / wB["people"]);
    }
    console.log({
        weekBuildings,
        avg
    });

    for (let key of keys) {
        const c = consumption[key];
        let totals = groupData(c, 0, 0);
        const m = metadata[key];

        let present = totals.map(x => x / m["people"]);

        const title = document.createElement("h3");
        title.innerText = `Housing ${Number(key) + 1} - ${m.year}`;
        chartDiv.appendChild(title);

        const ctx = createCanvas(chartDiv);
        const chart = drawChart(ctx,
            'line',
            Array.from(new Array(totals.length - 1).keys()), [{
                    label: "Consumption",
                    borderColor: "rgb(255, 0, 0)",
                    data: present.slice(0, present.length - 1)
                },
                {
                    label: "Average",
                    borderColor: "rgb(0, 0, 255)",
                    data: avg.slice(0, avg.length - 1)
                }
            ], {
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
                    const pointDate = c[pointIndex * resolution].date;
                    totals = groupData(c, 1, pointDate.getUTCMonth() + 1);
                    console.log(totals);
                }
            }
        )

        charts.buildingCharts.push({
            ctx,
            chart
        });
=======
        avg.push(wB.amount / wB[comparer]);
>>>>>>> origin/dashboard
    }

    return {
        avg,
        totals,
        weekBuildings,
        recent
    }
}

function updateCharts(data) {
    charts.buildingCharts.forEach((item, i) => {
        const chart = item.chart;

        chart.data.labels = Array.from(new Array(data.recent[i].length - 1).keys());
        chart.data.datasets = [];
        chart.data.datasets.push({
            label: "Consumption",
            data: data.recent[i].slice(0, data.recent[i].length - 1),
            borderColor: "rgb(255, 0, 0)"
        });

        chart.data.datasets.push({
            label: "Average",
            data: data.avg.slice(0, data.avg.length - 1),
            borderColor: "rgb(0,0,255)"
        })

        chart.update();
    });
}

function createCanvas(hostdiv) {
    const e = document.createElement("canvas")
    hostdiv.appendChild(e);
    return e.getContext("2d");
}

function drawChart(ctx, type, labels, datasets, options) {
    return new Chart(ctx, {
        type,
        data: {
            labels,
            datasets
        },
        options
    });
}

<<<<<<< HEAD
function groupData(data, switchkey, month) {
    const yearlyData = data.filter(x => x.date.getUTCFullYear() == 2019);
    const monthlyData = [];
    for(let i = 0; i < 13; i++) {
        monthlyData[i] = yearlyData.filter(x => x.date.getUTCMonth() == i);
    }
    const yearvalues = yearlyData.map(x => x.value);
    let monthvalues = [];
    switch(month) {
        case 0:
            break;
        case 1:
            monthvalues = monthlyData[0].map(x => x.value);
            break;
        case 2:
            monthvalues = monthlyData[1].map(x => x.value);
            break;
        case 3:
            monthvalues = monthlyData[2].map(x => x.value);
            break;
        case 4:
            monthvalues = monthlyData[3].map(x => x.value);
            break;
        case 5:
            monthvalues = monthlyData[4].map(x => x.value);
            break;
        case 6:
            monthvalues = monthlyData[5].map(x => x.value);
            break;
        case 7:
            monthvalues = monthlyData[6].map(x => x.value);
            break;
        case 8:
            monthvalues = monthlyData[7].map(x => x.value);
            break;
        case 9:
            monthvalues = monthlyData[8].map(x => x.value);
            break;
        case 10:
            monthvalues = monthlyData[9].map(x => x.value);
            break; 
        case 11:
            monthvalues = monthlyData[10].map(x => x.value);
            break;
        case 12:
            monthvalues = monthlyData[11].map(x => x.value);
            break;
        default:
            break;
    }
=======
function groupData(data, switchkey) {
    const monthlyData = [];
    for (let i = 0; i < 13; i++) {
        monthlyData[i] = data.filter(x => x.date.getUTCMonth() == i);
    }
    const yearvalues = data.map(x => x.value);
    let monthvalues = monthlyData[0].map(x => x.value);
    let values = [];
    let resolution = 1;
>>>>>>> origin/dashboard

    switch (switchkey) {
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
    if (!element || element.length == 0) return 0;
    const keys = Object.keys(element[0]);
    let pIndex = 0;
    for (let key of keys) {
        let temp = element[0][key];
        if (key == '_index') {
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

document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('select');
    var instances = M.FormSelect.init(elems);
});

function changeChartData(value) {
    console.log(value);
    let data;
    switch (value) {
        case "1":
            comparer = "apartments";

            data = generateData();
            updateCharts(data);

            break;
        case "2":
            comparer = "volume";

            data = generateData();
            updateCharts(data);

            break;
        case "3":
            comparer = "people";

            data = generateData();
            updateCharts(data);

            break;
    }

    charts.buildingCharts.forEach(item => {
        item.chart.update();
    })
}