const chartDiv = document.getElementById("charts");
Promise.all([
    fetchWaterConsum(),
    fetchMetaData()
]).then(values => {
    const consumption = values[0];
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
                labels: Array.from(new Array(daily.length).keys()),
                datasets: [{
                    label: "Consumption",
                    borderColor: "rgb(255, 0, 0)",
                    data: present
                }, {
                    label: "Average",
                    borderColor: "rgb(0, 0, 255)",
                    data: avg
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
    }
})

function groupData(data) {
    const values = data.map(x => x.value);

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

async function fetchWaterConsum() {
    const data = await (await fetch("./waterconsum.json")).json();
    return data;
}

async function fetchMetaData() {
    const data = await (await fetch("./meta.json")).json();
    return data;
}