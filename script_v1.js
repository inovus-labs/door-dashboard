


function generateData(count, yrange) {
    var i = 0;
    var series = [];
    while (i < count) {
        var x = (i + 1).toString();
        var y =
            Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

        series.push({
            x: x,
            y: y
        });
        i++;
    }

    console.log(series);
    
    return series;
}

var options = {
    chart: {
        height: 250,
        type: "heatmap"
    },
    colors: ["#008FFB"],
    plotOptions: {
        heatmap: {
            shadeIntensity: 1
        }
    },
    dataLabels: {
        enabled: false
    },
    series: [
        {
            name: "",
            data: generateData(52, {
                min: 0,
                max: 90
            })
        },
        {
            name: "Fri",
            data: generateData(52, {
                min: 0,
                max: 90
            })
        },
        {
            name: "",
            data: generateData(52, {
                min: 0,
                max: 90
            })
        },
        {
            name: "Wed",
            data: generateData(53, {
                min: 0,
                max: 90
            })
        },
        {
            name: "",
            data: generateData(53, {
                min: 0,
                max: 90
            })
        },
        {
            name: "Mon",
            data: generateData(53, {
                min: 0,
                max: 90
            })
        },
        {
            name: "",
            data: generateData(53, {
                min: 0,
                max: 90
            })
        },
    ],
    tooltip: {
        custom: function ({ series, seriesIndex, dataPointIndex, w }) {
            if (w.globals.seriesNames[seriesIndex] !== "") {
                return series[seriesIndex][dataPointIndex];
            } else {
                return "";
            }
        }
    }
};

var chart = new ApexCharts(document.querySelector("#chart"), options);

chart.render();
