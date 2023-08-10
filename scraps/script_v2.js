

let firebaseData = {}, last365Days = [];

(async () => {
    let response = await fetch("https://inovus-smart-door-default-rtdb.asia-southeast1.firebasedatabase.app/logs.json")
    firebaseData = await response.json();

    // console.log(firebaseData);
})();




firebaseData = {
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



let last365Days = [];

for (let i = 365; i >= 0; i--) {

    let date = new Date();
    let d = new Date(date.getTime() - (i * 24 * 60 * 60 * 1000));

    let dayOfWeek = d.getDay();
    let weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    dayOfWeek = weekDays[dayOfWeek];

    let day = d.getDate();
    let month = d.getMonth() + 1;
    let year = d.getFullYear();

    // handle remaining days of last week
    let specialDay;
    if (i == 365) {
        specialDay = d.getDay();
        // console.log(specialDay);
    }

    let value = 0;

    for (let key in firebaseData) {
        if (firebaseData.hasOwnProperty(key)) {
            let obj = firebaseData[key];
            let date = obj.date;

            if (date.dd == day && date.mm == month && date.yyyy == year) {
                value++;
            }
            
        }
    }
    
    last365Days.push({
        date: {
            yyyy: year,
            mm: month,
            dd: day,
            day: dayOfWeek,
        },
        value: value
    });

    // add the remaining days of last week
    if (i == 365) {
        for (let j = 0; j < specialDay; j++) {
            let dayOfWeek = j;
            let weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            dayOfWeek = weekDays[dayOfWeek];

            let day = d.getDate() - (specialDay - j);
            let month = d.getMonth() + 1;
            let year = d.getFullYear();

            let value = 0;

            for (let key in firebaseData) {
                if (firebaseData.hasOwnProperty(key)) {
                    let obj = firebaseData[key];
                    let date = obj.date;

                    if (date.dd == day && date.mm == month && date.yyyy == year) {
                        value++;
                    }
                }
            }

            last365Days.push({
                date: {
                    yyyy: year,
                    mm: month,
                    dd: day,
                    day: dayOfWeek,
                },
                value: value
            });
        }
    }

}

// console.log(last365Days);


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

for (let i = 0; i < last365Days.length; i++) {
    let day = last365Days[i].date.day;
    dataSeries[day].push({
        x: last365Days[i].date.dd + "/" + last365Days[i].date.mm + "/" + last365Days[i].date.yyyy,
        y: last365Days[i].value
    });
}

// define categories for x-axis
// length of categories should be equal to the length of dataSeries
let x_categories = [];
for (let i = 0; i < dataSeries["Sun"].length; i++) {
    x_categories.push(dataSeries["Sun"][i].x);
    
    // get month name from date
    let date = dataSeries["Sun"][i].x;
    let month = date.split("/")[1];
    let monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    month = monthNames[month - 1];
    x_categories[i] = month;

}

// loop through x_categories and replace the duplicate values with empty string, while preserving the order and length of the array
for (let i = 0; i < x_categories.length; i++) {
    for (let j = i + 1; j < x_categories.length; j++) {
        if (x_categories[i] == x_categories[j]) {
            x_categories[j] = "";
        }
    }
}

console.log(dataSeries);








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
            name: "Sun",
            data: dataSeries["Sun"]
        },
        {
            name: "Mon",
            data: dataSeries["Mon"]
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
            name: "Thu",
            data: dataSeries["Thu"]
        },
        {
            name: "Fri",
            data: dataSeries["Fri"]
        },
        {
            name: "Sat",
            data: dataSeries["Sat"]
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
    yaxis: {
        reversed: true,
    },
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
