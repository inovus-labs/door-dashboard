


function generateData(count, yrange) {
    let i = 0;
    let series = [];
    while (i < count) {
        let x = (i + 1).toString();
        let y =
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

let options = {
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

let chart = new ApexCharts(document.querySelector("#chart"), options);

chart.render();
