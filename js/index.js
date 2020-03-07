const chartDiv = document.getElementById("charts");
let consumption;
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
    consumption = convertEpochToDate(values[0]);
    metadata = values[1];

    console.log(consumption);

    const keys = Object.keys(consumption);

    const totals = [];
    const weekBuildings = {}
    let maxWeeks = 0;
    for (let key of keys) {
        const c = consumption[key];
        const m = metadata[key];

        const grouped = groupData(c, 0, 0);

        totals.push({
            meta: m,
            values: grouped.reduce((a, b) => a + b, 0)
        });

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

        avg.push(wB.amount / wB["people"]);
    }
    console.log({
        weekBuildings,
        avg
    });

    for (let key of keys) {
        const c = consumption[key];
        const totals = groupData(c, 0, 0);
        const m = metadata[key];

        const present = totals.map(x => x / m["people"]);

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
                }
            }
        )

        charts.buildingCharts.push({
            ctx,
            chart
        });
    }

    totals.sort((a, b) => a.meta.year - b.meta.year);

    let totalConsumption = 0;
    let totalPeople = 0;
    for (let thot of totals) {
        totalConsumption += thot.values;
        totalPeople += thot.meta.people;
    }

    const avgComsumption = totalConsumption / totalPeople;
    const avgMin = avgComsumption * 0.75;
    const avgMinYellow = avgComsumption * 0.5;
    const avgMax = avgComsumption * 1.25;
    const avgMaxYellow = avgComsumption * 1.5;

    console.log({
        avgMax,
        avgMin,
        avgMinYellow,
        avgMaxYellow
    })

    const yearctx = createCanvas(chartDiv);
    const presentData = totals.map(x => x.values / x.meta.people);

    const yeargraph = drawChart(yearctx, 'bar', totals.map(x => x.meta.year), [{
            label: "Consumption (total)",
            data: presentData,
            backgroundColor: presentData.map(item => {
                if (item > avgMaxYellow)
                    return "rgba(255, 0, 0, 0.5)";
                else if (item > avgMax)
                    return "rgba(255, 125, 0, 0.5)";
                else if (item < avgMinYellow)
                    return "rgba(255, 125, 0, 0.5";
                else if (item < avgMin)
                    return "rgba(255, 0, 0, 0.5";
                else
                    return "rgba(0, 0, 200, 0.5";
            })
        },
        {
            label: "Max warning",
            data: new Array(presentData.length).fill(avgMax),
            type: "line",
            pointRadius: 0,
            backgroundColor: "rgba(0,0,0,0)",
            borderColor: "rgb(255, 0, 0)"
        },
        {
            label: "Min warning",
            data: new Array(presentData.length).fill(avgMin),
            type: "line",
            pointRadius: 0,
            backgroundColor: "rgba(0, 0, 0, 0)",
            borderColor: "rgb(255, 0, 0)"
        }
    ]);

    charts.other.push({
        ctx: yearctx,
        chart: yeargraph
    });

    console.log(yeargraph);
});

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
        let temp = element[0].key;
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

function changeChartData(value) {}