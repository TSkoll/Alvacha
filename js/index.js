const chartDiv = document.getElementById("charts");
let consumption = {};
let metadata;
let comparer = "people";
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
        Volume: ${m.volume || "Unknown"} Cubic meters
        Apartments: ${m.apartments || "Unknown"}
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
                    volume: 0,
                    apartments: 0
                }
            }

            weekBuildings[i].count++;
            weekBuildings[i].amount += grouped[i];
            weekBuildings[i].people += m.people;
            weekBuildings[i].volume += m.volume;
            weekBuildings[i].apartments += m.apartments;
        }
    }

    let avg = [];

    const wBKeys = Object.keys(weekBuildings);
    for (let i = 0; i < wBKeys.length; i++) {
        const wBK = wBKeys[i];
        const wB = weekBuildings[wBK];

        console.log(wB);
        avg.push(wB.amount / wB[comparer]);
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

function groupData(data, switchkey) {
    const monthlyData = [];
    for (let i = 0; i < 13; i++) {
        monthlyData[i] = data.filter(x => x.date.getUTCMonth() == i);
    }
    const yearvalues = data.map(x => x.value);
    let monthvalues = monthlyData[0].map(x => x.value);
    let values = [];
    let resolution = 1;

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