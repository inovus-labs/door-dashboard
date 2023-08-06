

// Sample door log data for testing
let firebaseData = {
    "1691143935": {
        "date": {
            "dd": 6,
            "mm": 8,
            "yyyy": 2023
        },
        "owner": "Badhusha Shaji",
        "status": true,
        "tag": 40103283,
        "time": 1691143215
    },
    "1691143215": {
        "date": {
            "dd": 4,
            "mm": 8,
            "yyyy": 2023
        },
        "owner": "Arjun Krishna",
        "status": true,
        "tag": 40103283,
        "time": 1691143215
    },
    "1691143494": {
        "date": {
            "dd": 4,
            "mm": 8,
            "yyyy": 2023
        },
        "owner": "Nikhil T Das",
        "status": true,
        "tag": 60604821,
        "time": 1691143494
    },
    "1691144586": {
        "date": {
            "dd": 4,
            "mm": 8,
            "yyyy": 2023
        },
        "status": false,
        "time": 1691144586
    },
    "1691144215": {
        "date": {
            "dd": 5,
            "mm": 8,
            "yyyy": 2023
        },
        "owner": "Arjun Krishna",
        "status": true,
        "tag": 40103283,
        "time": 1691143215
    },
    "1699983494": {
        "date": {
            "dd": 5,
            "mm": 8,
            "yyyy": 2023
        },
        "owner": "Nikhil T Das",
        "status": true,
        "tag": 60604821,
        "time": 1691143494
    },
    "1699364586": {
        "date": {
            "dd": 5,
            "mm": 8,
            "yyyy": 2023
        },
        "status": false,
        "time": 1691144586
    }
}
// console.log(firebaseData);


let weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
let today = new Date();

// set today's date to 2023-08-06
// today = new Date(2023, 7, 10);

console.log("%cToday's date : " + today, "color: green;");


// get the number of days in this year
let year = today.getFullYear();
let daysInYear = 365;
if (year % 4 == 0) {
    daysInYear = 366;
}
console.log("Days in year : " + daysInYear);


// round it to upper multiple of 7
let daysInWeek = 7;
let weeksInYear = Math.ceil(daysInYear / daysInWeek);
console.log("Weeks in year : " + weeksInYear);


// get today's day of the week
let dayOfWeek = today.getDay();
console.log("Today's day of the week : " + dayOfWeek);



// get the last 365 days. This will be used to get the dates for the heatmap
let last365Days = [];
let lastDateofSet = null;
let value = 0;

for (let i = 0; i < daysInYear; i++) {
    let date = new Date(today);
    date.setDate(date.getDate() - i);
    
    let item = {
        date: {
            dd: date.getDate(),
            mm: date.getMonth() + 1,
            yyyy: date.getFullYear(),
            day: date.getDay(),
            weekDay: weekDays[date.getDay()],
        },
        fullDate: date,
        value: value
    };

    item = getNewFirebaseValues(item);
    
    last365Days.push(item);
    
    if (i == daysInYear - 1) {
        lastDateofSet = item
    }
}

console.log("\n\n\nLast 365 days : ");
console.log(last365Days);



// if lastDateofSet is not a Sunday, add the remaining days of the week to the last365Days array
// this is to make sure that the heatmap starts from a Sunday

let remainingDaysArray = [];
if (lastDateofSet.date.day != 0) {
    let remainingDays = lastDateofSet.date.day;
    for (let i = 1; i <= remainingDays; i++) {
        let date = new Date(lastDateofSet.fullDate);
        date.setDate(date.getDate() - i);

        let item = {
            date: {
                dd: date.getDate(),
                mm: date.getMonth() + 1,
                yyyy: date.getFullYear(),
                day: date.getDay(),
                weekDay: weekDays[date.getDay()],
            },
            fullDate: date,
            value: 0
        };

        item = getNewFirebaseValues(item);

        remainingDaysArray.push(item);
    }
}

console.log("\n\n\nRemaining days array : ");
console.log(remainingDaysArray);


// add the remaining days array to the last365Days array
let finalArray = last365Days.concat(remainingDaysArray);
// reverse the array
finalArray.reverse();
console.log("\n\n\nFinal array : ");
console.log(finalArray);


// seperate the data into 7 arrays for each day of the week
let dataSeries = {
    "Sun": [],
    "Mon": [],
    "Tue": [],
    "Wed": [],
    "Thu": [],
    "Fri": [],
    "Sat": [],
}

for (let i = 0; i < finalArray.length; i++) {
    dataSeries[finalArray[i].date.weekDay].push({
        x: finalArray[i].date.dd + "/" + finalArray[i].date.mm + "/" + finalArray[i].date.yyyy,
        y: finalArray[i].value
    });
}

console.log("\n\n\nData series : ");
console.log(dataSeries);



// define categories for x-axis
// length of categories should be equal to the length of dataSeries
let x_categories = [];
for (var i = 0; i < dataSeries["Sun"].length; i++) {
    x_categories.push(dataSeries["Sun"][i].x);
    
    // get month name from date
    var date = dataSeries["Sun"][i].x;
    var month = date.split("/")[1];
    var monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    month = monthNames[month - 1];
    x_categories[i] = month;
}


// loop through x_categories and replace the duplicate values with empty string, while preserving the order and length of the array
for (var i = 0; i < x_categories.length; i++) {
    for (var j = i + 1; j < x_categories.length; j++) {
        if (x_categories[i] == x_categories[j]) {
            x_categories[j] = "";
        }
    }
}

console.log("\n\n\nX categories : ");
console.log(x_categories);



let options = {
    chart: {
        height: 250,
        type: "heatmap",
        toolbar: {
            show: false
        },
    },
    colors: ["#2da44e"],
    plotOptions: {
        heatmap: {
            shadeIntensity: 1,
            // radius: 5,
        }
    },
    series: [
        {
            name: "Sat",
            data: dataSeries["Sat"]
        },
        {
            name: "Fri",
            data: dataSeries["Fri"]
        },
        {
            name: "Thu",
            data: dataSeries["Thu"]
        },
        {
            name: "Tue",
            data: dataSeries["Tue"]
        },
        {
            name: "Wed",
            data: dataSeries["Wed"]
        },
        {
            name: "Mon",
            data: dataSeries["Mon"]
        },
        {
            name: "Sun",
            data: dataSeries["Sun"]
        },
    ],
    stroke: {
        show: true,
        colors: ["#90A4AE"],
        width: 1, 
    },
    xaxis: {
        type: "category",
        position: 'top',
        categories: x_categories,
        tooltip: {
            enabled: false
        },
    },
    // yaxis: {
    //     reversed: true,
    // },
    zoom: {
        enabled: false,
    },
    dataLabels: {
        enabled: true
    },
    
    states: {
        hover: {
            filter: {
                type: 'none',
            }
        },
    },

    tooltip: {
        // custom message for tooltip "3 activity on Saturday, August 05, 2023"
        custom: function ({ series, seriesIndex, dataPointIndex, w }) {
            let date = w.globals.seriesX[seriesIndex][dataPointIndex];
            
            let dd = date.split("/")[0];
            let mm = date.split("/")[1];
            let yyyy = date.split("/")[2];
            
            // getDay()
            let d = new Date(yyyy, mm - 1, dd);
            let dayOfWeek = d.getDay();
            
            let monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
            let weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
            month = monthNames[month - 1];
            

            let activity = w.globals.series[seriesIndex][dataPointIndex];
            // let dayOfWeek = w.globals.series[seriesIndex][dataPointIndex + 1];

            return (
                "<div class='arrow_box'>" +
                "<span class='date'>" + (activity > 0 ? activity : "No") + (activity > 1 ? " activities" : " activity") + " on " + weekday[dayOfWeek] + ", " + monthNames[mm-1] + " " + dd + ", " + yyyy + "</span>" +
                "</div>"
            );
        }
        
        // custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        //     return w.globals.seriesX[seriesIndex][dataPointIndex];
        // }
    }
};


let chart = new ApexCharts(document.querySelector("#chart"), options);
chart.render();





function getNewFirebaseValues(item) {
    for (let key in firebaseData) {
        if (firebaseData.hasOwnProperty(key)) {
            let obj = firebaseData[key].date;

            if (obj.dd == item.date.dd && obj.mm == item.date.mm && obj.yyyy == item.date.yyyy) {
                item.value++;
            }
        }
    }
    return item;
}

function dummyDataSeries(series) {
    return series

    if(series.length == 53) {
        return series;
    } else {
        let newSeries = series;
        newSeries.push({
            x: "Not Available",
            y: null
        });
        return newSeries;
    }
}

