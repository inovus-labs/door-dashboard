

var firebaseData = {}, last365Days = [];

(async () => {
    let response = await fetch("https://inovus-smart-door-default-rtdb.asia-southeast1.firebasedatabase.app/logs.json")
    firebaseData = await response.json();

    console.log(firebaseData);
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
console.log(firebaseData);



var last365Days = [];

for (var i = 365; i >= 0; i--) {

    var date = new Date();
    var d = new Date(date.getTime() - (i * 24 * 60 * 60 * 1000));

    var dayOfWeek = d.getDay();
    var weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    dayOfWeek = weekDays[dayOfWeek];

    var day = d.getDate();
    var month = d.getMonth() + 1;
    var year = d.getFullYear();

    // handle remaining days of last week
    let specialDay;
    if (i == 365) {
        specialDay = d.getDay();
        // console.log(specialDay);
    }

    var value = 0;

    for (var key in firebaseData) {
        if (firebaseData.hasOwnProperty(key)) {
            var obj = firebaseData[key];
            var date = obj.date;

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
        for (var j = 0; j < specialDay; j++) {
            var dayOfWeek = j;
            var weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            dayOfWeek = weekDays[dayOfWeek];

            var day = d.getDate() - (specialDay - j);
            var month = d.getMonth() + 1;
            var year = d.getFullYear();

            var value = 0;

            for (var key in firebaseData) {
                if (firebaseData.hasOwnProperty(key)) {
                    var obj = firebaseData[key];
                    var date = obj.date;

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

for (var i = 0; i < last365Days.length; i++) {
    var day = last365Days[i].date.day;
    dataSeries[day].push({
        x: last365Days[i].date.dd + "/" + last365Days[i].date.mm + "/" + last365Days[i].date.yyyy,
        y: last365Days[i].value
    });
}

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

// console.log(x_categories);








var options = {
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
            var date = w.globals.seriesX[seriesIndex][dataPointIndex];
            
            var dd = date.split("/")[0];
            var mm = date.split("/")[1];
            var yyyy = date.split("/")[2];
            
            // getDay()
            var d = new Date(yyyy, mm - 1, dd);
            var dayOfWeek = d.getDay();
            
            var monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
            var weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
            month = monthNames[month - 1];
            

            var activity = w.globals.series[seriesIndex][dataPointIndex];
            // var dayOfWeek = w.globals.series[seriesIndex][dataPointIndex + 1];

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


var chart = new ApexCharts(document.querySelector("#chart"), options);
chart.render();
