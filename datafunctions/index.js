const http = require('http');
const wFile = require('../data/waterconsum.json')
const wData = JSON.parse(JSON.stringify(wFile));
const dates = [];

/*
Function converts epoch time to a date object.
@param gd = Given date as epochtime.
@returns Date object.
*/
function convertToDate() {
    const d = new Date();
    for(let jo of wData ) {
        for (let objData of jo) {
            d.setUTCSeconds(objData.date);
            dates.push(d);
        }
    }
}

/*
Function calculates the average water consumption per year.
*/
function avgYearly() {
    // TODO
}

/*
Function calculates the average water consumption per month.
*/
function avgMonthly() {
    // TODO
}

/*
Function calculates the average water consumption per week.
*/
function avgWeekly() {
    // TODO
}

/*
Function calculates the average water consumption per day.
*/
function avgDaily() {
    // TODO
}




