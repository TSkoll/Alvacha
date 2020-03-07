var ctx = document.getElementById('yearly').getContext('2d');
var ctx2 = document.getElementById('building').getContext('2d');
var yearly = new Chart(ctx, {
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        datasets: [{
            label: 'Talo 1',
            borderColor: 'rgb(255, 99, 132)',
            data: [0, 10, 5, 2, 20, 30, 45, 30, 20, 5, 10, 2]
        }, {
            label: 'Talo 2',
            borderColor: '#FFFFF',
            data: [0, 11, 15, 20, 25, 33, 40, 32, 21, 2, 5, 10]
        }]
    },

    // Configuration options go here
    options: {}
});

var building = new Chart(ctx2, {
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
        labels: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00'],
        datasets: [{
            label: 'Test',
            borderColor: 'rgb(255, 99, 132)',
            data: []
        }]
    },

    // Configuration options go here
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});

fetch("./waterconsum.json")
    .then(async data => {
        const all = await data.json();
        let values = all[12].map(x => x.value);

        let dataPoints = [];
        for (let i = 0; i < values.length; i += 24) {
            let total = 0;
            let count = 0;
            for (let j = 0; j < 24; j++) {
                if (values[i + j] == undefined)
                    break;

                total += values[i + j];
                count++;
            }

            dataPoints.push(total);
        }

        console.log(dataPoints);
        building.data.labels = Array.from(new Array(dataPoints.length).keys());
        building.data.datasets[0].data = dataPoints;
        building.update();
    })