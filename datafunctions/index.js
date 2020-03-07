const http = require('http');
const wFile = require('../data/waterconsum.json')
const wData = JSON.parse(wFile);
const data = [[]];
for(let obj of wData) {
    data.push(obj);
    convertToDate(obj);
}
const 

/*
Function converts epoch time to a date object.
@param gd = Given date as epochtime.
@returns Date object.{}
*/
function convertToDate(building) {
    const d = new Date();
    for (let objData of wData[building]) {
        d.setUTCSeconds(objData.date);
        data[building].date = d;    }
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




