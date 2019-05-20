const fs = require('fs');

console.log("DB EDITOR");
let raw = fs.readFileSync('gymbuddy-666-series-export.json');
let series = JSON.parse(raw);
let newSeries = {}

for (let userId in series){
    for (let exerciseId in series[userId]) {
        for (let seriesId in series[userId][exerciseId]) {
            let currentSeries = series[userId][exerciseId][seriesId];
            let createDate = new Date(currentSeries.createDate).setHours(0,0,0,0);
            console.log(`${userId}/${exerciseId}/${seriesId}/${createDate}`); 

            if (!newSeries[userId]) newSeries[userId] = {[exerciseId]: {}}
            if (!newSeries[userId][exerciseId]) newSeries[userId][exerciseId] = {[createDate]: {} }
            if (!newSeries[userId][exerciseId][createDate]) newSeries[userId][exerciseId][createDate] = {[seriesId]: {}}
            newSeries[userId][exerciseId][createDate][seriesId] = currentSeries;
        }
    }
}
console.log(newSeries);
const data = JSON.stringify(newSeries);
fs.writeFileSync('gymbuddy-666-series-to-import.json', data);  
