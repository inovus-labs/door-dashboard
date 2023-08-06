
// Anonymous function to fetch data from firebase, process it and then call processData_Heatmap()
(async function () {

    let firebaseData = {};

    // fetch data from firebase
    await fetch("https://inovus-smart-door-default-rtdb.asia-southeast1.firebasedatabase.app/logs.json").then(response => response.json()
        .then(data => firebaseData = data)
        .then((firebaseData) => {

            console.log("%cFirebase data fetched successfully", "color: yellow;");
            console.log(firebaseData);

            let today = new Date();
            // today = new Date(2023, 7, 10);

            console.log("%cToday's date : " + today, "color: pink;");

            // process the data and generate the heatmap
            processData_Heatmap(today, firebaseData);

        })
    );

})();






function processData_Heatmap(today, firebaseData) {

    let weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // get the number of days in this year
    let year = today.getFullYear();
    let daysInYear = 365;
    if (year % 4 == 0) {
        daysInYear = 366;
    }
    console.log("Days in year : " + daysInYear);


    // get the last 365 days.
    // This will be used to get the dates for the heatmap

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

        // Check if the date is present in the firebase data
        // If yes, then update the value of the item
        // Else, keep the value as 0

        item = processFirebaseData(item, firebaseData);
        last365Days.push(item);

        // Save the last date of the set for later use
        // This will be used to check if the last date of the set is a Sunday or not
        // If not, then we will add the remaining days of the week to the last365Days array
        // This is to make sure that the heatmap starts from a Sunday
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

        // add the remaining days to the array
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

            // Check if the date is present in the firebase data
            // If yes, then update the value of the item
            // Else, keep the value as 0
            item = processFirebaseData(item, firebaseData);
            remainingDaysArray.push(item);
        }
    }

    console.log("\n\n\nRemaining days array : ");
    console.log(remainingDaysArray);


    // add the remaining days array to the last365Days array to get the final array
    let finalArray = last365Days.concat(remainingDaysArray);

    // reverse the array so that the latest date is at the end  of the array
    finalArray.reverse();

    console.log("\n\n\nFinal array : ");
    console.log(finalArray);


    // seperate the data into 7 arrays for each day of the week for the heatmap
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
        var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
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





    // --------------------------------- add the heatmap chart --------------------------------- //


    // define the heatmap chart options
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
        fontFamily: 'Poppins, sans-serif',
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
                name: "Wed",
                data: dataSeries["Wed"]
            },
            {
                name: "Tue",
                data: dataSeries["Tue"]
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
            axisTicks: {
                show: false
            },
            axisBorder: {
                show: false
            },
            labels: {
                style: {
                    colors: "#90A4AE",
                    fontFamily: 'Poppins, sans-serif',
                },
            },
        },
        yaxis: {
            labels: {
                style: {
                    colors: "#90A4AE",
                    fontFamily: 'Poppins, sans-serif',
                },
            },
        },
        grid: {
            show: false,
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

                let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                let weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                month = monthNames[month - 1];


                let activity = w.globals.series[seriesIndex][dataPointIndex];
                // let dayOfWeek = w.globals.series[seriesIndex][dataPointIndex + 1];

                return (
                    "<div class='arrow_box'>" +
                    "<span class='date'>" + (activity > 0 ? activity : "No") + (activity > 1 ? " activities" : " activity") + " on " + weekday[dayOfWeek] + ", " + monthNames[mm - 1] + " " + dd + ", " + yyyy + "</span>" +
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

}





// --------------------------------- reusable functions --------------------------------- //


// function to process the firebase data and check if the date is already present in the array
// if the date is present, increment the value by 1 for each entry
function processFirebaseData(item, firebaseData) {
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