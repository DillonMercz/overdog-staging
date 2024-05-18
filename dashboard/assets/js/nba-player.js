/**
 *  Logistics Dashboard
 */

'use strict';

(function() {
    let cardColor, headingColor, labelColor, shadeColor, grayColor;
    if (isDarkStyle) {
        cardColor = config.colors_dark.cardColor;
        labelColor = config.colors_dark.textMuted;
        headingColor = config.colors_dark.headingColor;
        shadeColor = 'dark';
        grayColor = '#5E6692'; // gray color is for stacked bar chart
    } else {
        cardColor = config.colors.cardColor;
        labelColor = config.colors.textMuted;
        headingColor = config.colors.headingColor;
        shadeColor = '';
        grayColor = '#817D8D';
    }

    // Chart Colors
    const chartColors = {
        donut: {
            series1: config.colors.success,
            series2: '#28c76fb3',
            series3: '#28c76f80',
            series4: config.colors_label.success
        },
        line: {
            series1: config.colors.warning,
            series2: config.colors.primary,
            series3: 'var(--primary)29'
        }
    };

    // Shipment statistics Chart
    // --------------------------------------------------------------------
    const shipmentEl = document.querySelector('#shipmentStatisticsChart'),
        shipmentConfig = {
            series: [{
                    name: 'Shipment',
                    type: 'column',
                    data: [38, 45, 33, 38, 32, 50, 48, 40, 42, 37]
                },
                {
                    name: 'Delivery',
                    type: 'line',
                    data: [23, 28, 23, 32, 28, 44, 32, 38, 26, 34]
                }
            ],
            chart: {
                height: 270,
                type: 'line',
                stacked: false,
                parentHeightOffset: 0,
                toolbar: {
                    show: false
                },
                zoom: {
                    enabled: false
                }
            },
            markers: {
                size: 4,
                colors: [config.colors.white],
                strokeColors: chartColors.line.series2,
                hover: {
                    size: 6
                },
                borderRadius: 4
            },
            stroke: {
                curve: 'smooth',
                width: [0, 3],
                lineCap: 'round'
            },
            legend: {
                show: false,
                position: 'bottom',
                markers: {
                    width: 8,
                    height: 8,
                    offsetX: -3
                },
                height: 40,
                offsetY: 10,
                itemMargin: {
                    horizontal: 10,
                    vertical: 0
                },
                fontSize: '15px',
                fontFamily: 'Public Sans',
                fontWeight: 400,
                labels: {
                    colors: headingColor,
                    useSeriesColors: false
                },
                offsetY: 10
            },
            grid: {
                strokeDashArray: 8
            },
            colors: [chartColors.line.series1, chartColors.line.series2],
            fill: {
                opacity: [1, 1]
            },
            plotOptions: {
                bar: {
                    columnWidth: '30%',
                    startingShape: 'rounded',
                    endingShape: 'rounded',
                    borderRadius: 4
                }
            },
            dataLabels: {
                enabled: false
            },
            xaxis: {
                tickAmount: 10,
                categories: ['1 Jan', '2 Jan', '3 Jan', '4 Jan', '5 Jan', '6 Jan', '7 Jan', '8 Jan', '9 Jan', '10 Jan'],
                labels: {
                    style: {
                        colors: labelColor,
                        fontSize: '13px',
                        fontFamily: 'Public Sans',
                        fontWeight: 400
                    }
                },
                axisBorder: {
                    show: false
                },
                axisTicks: {
                    show: false
                }
            },
            yaxis: {
                tickAmount: 4,
                min: 10,
                max: 50,
                labels: {
                    style: {
                        colors: labelColor,
                        fontSize: '13px',
                        fontFamily: 'Public Sans',
                        fontWeight: 400
                    },
                    formatter: function(val) {
                        return val + '%';
                    }
                }
            },
            responsive: [{
                    breakpoint: 1400,
                    options: {
                        chart: {
                            height: 270
                        },
                        xaxis: {
                            labels: {
                                style: {
                                    fontSize: '10px'
                                }
                            }
                        },
                        legend: {
                            itemMargin: {
                                vertical: 0,
                                horizontal: 10
                            },
                            fontSize: '13px',
                            offsetY: 12
                        }
                    }
                },
                {
                    breakpoint: 1399,
                    options: {
                        chart: {
                            height: 415
                        },
                        plotOptions: {
                            bar: {
                                columnWidth: '50%'
                            }
                        }
                    }
                },
                {
                    breakpoint: 982,
                    options: {
                        plotOptions: {
                            bar: {
                                columnWidth: '30%'
                            }
                        }
                    }
                },
                {
                    breakpoint: 480,
                    options: {
                        chart: {
                            height: 250
                        },
                        legend: {
                            offsetY: 7
                        }
                    }
                }
            ]
        };
    if (typeof shipmentEl !== undefined && shipmentEl !== null) {
        const shipment = new ApexCharts(shipmentEl, shipmentConfig);
        shipment.render();
    }

    // Reasons for delivery exceptions Chart
    // --------------------------------------------------------------------
    const deliveryExceptionsChartE1 = document.querySelector('#deliveryExceptionsChart'),
        deliveryExceptionsChartConfig = {
            chart: {
                height: 420,
                parentHeightOffset: 0,
                type: 'donut'
            },
            labels: ['Incorrect address', 'Weather conditions', 'Federal Holidays', 'Damage during transit'],
            series: [13, 25, 22, 40],
            colors: [
                chartColors.donut.series1,
                chartColors.donut.series2,
                chartColors.donut.series3,
                chartColors.donut.series4
            ],
            stroke: {
                width: 0
            },
            dataLabels: {
                enabled: false,
                formatter: function(val, opt) {
                    return parseInt(val) + '%';
                }
            },
            legend: {
                show: true,
                position: 'bottom',
                offsetY: 10,
                markers: {
                    width: 8,
                    height: 8,
                    offsetX: -3
                },
                itemMargin: {
                    horizontal: 15,
                    vertical: 5
                },
                fontSize: '13px',
                fontFamily: 'Public Sans',
                fontWeight: 400,
                labels: {
                    colors: headingColor,
                    useSeriesColors: false
                }
            },
            tooltip: {
                theme: false
            },
            grid: {
                padding: {
                    top: 15
                }
            },
            states: {
                hover: {
                    filter: {
                        type: 'none'
                    }
                }
            },
            plotOptions: {
                pie: {
                    donut: {
                        size: '77%',
                        labels: {
                            show: true,
                            value: {
                                fontSize: '26px',
                                fontFamily: 'Public Sans',
                                color: headingColor,
                                fontWeight: 500,
                                offsetY: -30,
                                formatter: function(val) {
                                    return parseInt(val) + '%';
                                }
                            },
                            name: {
                                offsetY: 20,
                                fontFamily: 'Public Sans'
                            },
                            total: {
                                show: true,
                                fontSize: '.75rem',
                                label: 'AVG. Exceptions',
                                color: labelColor,
                                formatter: function(w) {
                                    return '30%';
                                }
                            }
                        }
                    }
                }
            },
            responsive: [{
                breakpoint: 420,
                options: {
                    chart: {
                        height: 360
                    }
                }
            }]
        };
    if (typeof deliveryExceptionsChartE1 !== undefined && deliveryExceptionsChartE1 !== null) {
        const deliveryExceptionsChart = new ApexCharts(deliveryExceptionsChartE1, deliveryExceptionsChartConfig);
        deliveryExceptionsChart.render();
    }
})();

// DataTable (jquery)
// --------------------------------------------------------------------
$(function() {
    // Variable declaration for table
    var dt_dashboard_table = $('.dt-route-vehicles');

    // On route vehicles DataTable
    if (dt_dashboard_table.length) {
        var dt_dashboard = dt_dashboard_table.DataTable({
            ajax: assetsPath + 'json/logistics-dashboard.json',
            columns: [
                { data: 'id' },
                { data: 'id' },
                { data: 'location' },
                { data: 'start_city' },
                { data: 'end_city' },
                { data: 'warnings' },
                { data: 'progress' }
            ],
            columnDefs: [{
                    // For Responsive
                    className: 'control',
                    orderable: false,
                    searchable: false,
                    responsivePriority: 2,
                    targets: 0,
                    render: function(data, type, full, meta) {
                        return '';
                    }
                },
                {
                    // For Checkboxes
                    targets: 1,
                    orderable: false,
                    searchable: false,
                    checkboxes: true,
                    responsivePriority: 3,
                    render: function() {
                        return '<input type="checkbox" class="dt-checkboxes form-check-input">';
                    },
                    checkboxes: {
                        selectAllRender: '<input type="checkbox" class="form-check-input">'
                    }
                },
                {
                    // Icon and location
                    targets: 2,
                    responsivePriority: 1,
                    render: function(data, type, full, meta) {
                        var $location = full['location'];
                        // Creates full output for row
                        var $row_output =
                            '<div class="d-flex justify-content-start align-items-center user-name">' +
                            '<div class="avatar-wrapper">' +
                            '<div class="avatar me-2">' +
                            '<span class="avatar-initial rounded-circle bg-label-secondary text-body"><i class="ti ti-truck"></i></span>' +
                            '</div>' +
                            '</div>' +
                            '<div class="d-flex flex-column">' +
                            '<a class="text-body fw-medium" href="app-logistics-fleet.html">VOL-' +
                            $location +
                            '</a>' +
                            '</div>' +
                            '</div>';
                        return $row_output;
                    }
                },
                {
                    // starting route
                    targets: 3,
                    render: function(data, type, full, meta) {
                        var $start_city = full['start_city'],
                            $start_country = full['start_country'];
                        var $row_output = '<div class="text-body">' + $start_city + ', ' + $start_country + '</div >';
                        return $row_output;
                    }
                },
                {
                    // ending route
                    targets: 4,
                    render: function(data, type, full, meta) {
                        var $end_city = full['end_city'],
                            $end_country = full['end_country'];
                        var $row_output = '<div class="text-body">' + $end_city + ', ' + $end_country + '</div >';
                        return $row_output;
                    }
                },
                {
                    // warnings
                    targets: -2,
                    render: function(data, type, full, meta) {
                        var $status_number = full['warnings'];
                        var $status = {
                            1: { title: 'No Warnings', class: 'bg-label-success' },
                            2: {
                                title: 'Temperature Not Optimal',
                                class: 'bg-label-warning'
                            },
                            3: { title: 'Ecu Not Responding', class: 'bg-label-danger' },
                            4: { title: 'Oil Leakage', class: 'bg-label-info' },
                            5: { title: 'fuel problems', class: 'bg-label-primary' }
                        };
                        if (typeof $status[$status_number] === 'undefined') {
                            return data;
                        }
                        return (
                            '<span class="badge rounded ' +
                            $status[$status_number].class +
                            '">' +
                            $status[$status_number].title +
                            '</span>'
                        );
                    }
                },
                {
                    // progress
                    targets: -1,
                    render: function(data, type, full, meta) {
                        var $progress = full['progress'];
                        var $progress_output =
                            '<div class="d-flex align-items-center">' +
                            '<div div class="progress w-100" style="height: 8px;">' +
                            '<div class="progress-bar" role="progressbar" style="width:' +
                            $progress +
                            '%;" aria-valuenow="' +
                            $progress +
                            '" aria-valuemin="0" aria-valuemax="100"></div>' +
                            '</div>' +
                            '<div class="text-body ms-3">' +
                            $progress +
                            '%</div>' +
                            '</div>';
                        return $progress_output;
                    }
                }
            ],
            order: [2, 'asc'],
            dom: '<"table-responsive"t><"row d-flex align-items-center"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
            displayLength: 5,
            responsive: {
                details: {
                    display: $.fn.dataTable.Responsive.display.modal({
                        header: function(row) {
                            var data = row.data();
                            return 'Details of ' + data['location'];
                        }
                    }),
                    type: 'column',
                    renderer: function(api, rowIdx, columns) {
                        var data = $.map(columns, function(col, i) {
                            return col.title !== '' // ? Do not show row in modal popup if title is blank (for check box)
                                ?
                                '<tr data-dt-row="' +
                                col.rowIndex +
                                '" data-dt-column="' +
                                col.columnIndex +
                                '">' +
                                '<td>' +
                                col.title +
                                ':' +
                                '</td> ' +
                                '<td>' +
                                col.data +
                                '</td>' +
                                '</tr>' :
                                '';
                        }).join('');

                        return data ? $('<table class="table"/><tbody />').append(data) : false;
                    }
                }
            }
        });
        $('.dataTables_info').addClass('pt-0');
    }
});

function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}



function getTeamName(teamName) {
    const areas = ['Atlanta', 'Boston', 'Brooklyn', 'Charlotte', 'Chicago', 'Cleveland', 'Dallas', 'Denver', 'Detroit', 'Golden State', 'Houston', 'Indiana', 'Los Angeles', 'LA', 'Memphis', 'Miami', 'Milwaukee', 'Minnesota', 'New Orleans', 'New York', 'Oklahoma City', 'Orlando', 'Philadelphia', 'Phoenix', 'Portland', 'Sacramento', 'San Antonio', 'Toronto', 'Utah', 'Washington', 'LA', 'Los Angeles'];
    let strippedName = teamName;
    for (let area of areas) {
        if (teamName.includes(area)) {
            strippedName = teamName.replace(area + ' ', ''); // Remove the city/area name
            if (strippedName == "Timberwolves") {
                strippedName = 'Timber Wolves'
            }
            break; // Stop after finding the first match
        }
    }
    if (teamName == "Timberwolves") {
        strippedName = "Timber Wolves"
    }else if (teamName == "sixers") {
        strippedName = "76ers"
    }
    console.log(strippedName)
    return strippedName.trim() // Trim any leading or trailing spaces
}


//stats chart
var games
var myChart
var selectedStat = "PTS"

document.addEventListener('sbAPILoaded', function() {
const myHeaders = new Headers();
myHeaders.append("Authorization", `Bearer ${sbApiAuthToken.access_token}`);
const requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow"
};
fetch("https://cdn.overdogbets.com/nba/player/" + getParameterByName('player'), requestOptions)
    .then((response) => response.json()) // Use response.json() to parse JSON
    .then(async (result) => {
        console.log(result); // Log the parsed JSON object
        games = result.games; // Access the 'games' array directly
        console.log(games); // Log the 'games' array

        // Now you can work with the 'games' array as needed
        const defaultStat = 'PTS';
        const defaultOption = '5';
        let displayGames = games.slice(0, parseInt(defaultOption));
        const initialLabels = displayGames.map(game => game.GAME_DATE);
        const initialData = displayGames.map(game => game[defaultStat]);
        const average = calculateAverage(initialData);
        myChart = createBarChart(initialLabels, initialData, "Points", average);
        calculateLast5(games.map(game => game), selectedStat);
        calculateLast10(games.map(game => game), selectedStat);
        calculateLast15(games.map(game => game), selectedStat);
        await processPlayerInfo(result.playerInfo);
    })
    .catch((error) => console.error(error));


})
// Function to create bar chart
function createBarChart(labels, data, statLabel, average) {
    const options = {
        chart: {
            type: 'bar',
            height: 400
        },
        legend: {
            show: false
        },
        plotOptions: {
            bar: {
                horizontal: false,
                distributed: true,
                colors: {
                    backgroundBarRadius: 10
                },
                dataLabels: {
                    position: 'top'
                },
                legend: {
                    show: false
                },
                borderRadius: 5
            }
        },
        series: [{
            name: statLabel,
            data: data
        }],
        xaxis: {
            categories: labels,

        },
        yaxis: {
            title: {
                text: statLabel
            }
        },
        colors: data.map(val => val < average ? 'rgba(255, 99, 132)' : 'rgba(54, 235, 178)'), // Red for below average, green for above average
        annotations: {
            yaxis: [{
                y: average,
                borderColor: '#775DD0',
                strokeDashArray: 0,
                label: {
                    borderColor: "#775DD0",
                    borderSize:10,
                    style: {
                        color: "#fff",
                        background: "#775DD0"
                    },
                    text: 'Average ' + statLabel + ': ' + average.toFixed(2),
                }
            }]
        }
    };

    const chart = new ApexCharts(document.querySelector("#statChart"), options);
    chart.render();
    return chart;
}





// Function to update chart with new data
function updateChart(chart, labels, data, statLabel, average) {
    chart.updateSeries([{
        name: statLabel,
        data: data
    }]);
    chart.updateOptions({
        xaxis: {
            categories: labels
        },
        yaxis: {
            title: {
                text: statLabel
            }
        },
        colors: data.map(val => val < average ? 'rgba(255, 99, 132)' : 'rgba(54, 235, 178)'), // Red for below average, green for above average
        annotations: {
            yaxis: [{
                y: average,
                borderColor: '#775DD0',
                strokeDashArray: 0,
                label: {
                    borderColor: "#775DD0",
                    style: {
                        color: "#fff",
                        background: "#775DD0"
                    },
                    text: 'Average ' + statLabel + ': ' + average.toFixed(2),
                }
            }]
        }
    });
}

// Function to handle game selection change
document.getElementById('gameSelect').addEventListener('change', function() {
    const selectedOption = this.value;
    let displayGames;
    if (selectedOption === 'all') {
        displayGames = games;
    } else {
        displayGames = games.slice(0, parseInt(selectedOption));
    }
    const labels = displayGames.map(game => game.GAME_DATE);
    const data = displayGames.map(game => game[selectedStat]);
    var statLabel = "Points"
    const average = calculateAverage(data);
    updateChart(myChart, labels, data, statLabel, average);
});

// Function to handle stat selection change
document.querySelectorAll('.nav-link').forEach(button => {
    button.addEventListener('click', function() {
        selectedStat = this.textContent;
        const selectedOption = document.getElementById('gameSelect').value;
        let displayGames;
        if (selectedOption === 'all') {
            displayGames = games;
        } else {
            displayGames = games.slice(0, parseInt(selectedOption));
        }
        const labels = displayGames.map(game => game.GAME_DATE);
        const data = displayGames.map(game => game[selectedStat]);
        const statLabel = selectedStat; // Use the text content of the clicked button as the stat label
        const average = calculateAverage(data);
        calculateLast5(games.map(game => game), selectedStat);
        calculateLast10(games.map(game => game), selectedStat);
        calculateLast15(games.map(game => game), selectedStat);
        updateChart(myChart, labels, data, statLabel, average);;
    });
});

// Function to calculate average
function calculateAverage(data) {
    const sum = data.reduce((acc, val) => acc + val, 0);
    return sum / data.length;
}

function calculateLast5(data, stat){
    const statData = data.map(game => game[stat]);
    console.log(statData); // Log the statData array to check if it contains the correct data
    const first5Data = statData.slice(0, 5);
    const sum = first5Data.reduce((acc, val) => acc + val, 0);
    const average = sum / 5; // Calculate average of first 5 games
    const aboveOrEqualAverage = first5Data.filter(val => val >= average).length;
    const percentage = (aboveOrEqualAverage / 5) * 100;
    document.getElementById("last5").innerHTML = `${percentage.toFixed(1)}%`
    console.log(`Percentage of the first 5 games for ${stat} at or above average: ${percentage.toFixed(2)}%`);
}
function calculateLast10(data, stat){
    const statData = data.map(game => game[stat]);
    console.log(statData); // Log the statData array to check if it contains the correct data
    const first5Data = statData.slice(0, 10);
    const sum = first5Data.reduce((acc, val) => acc + val, 0);
    const average = sum / 10; // Calculate average of first 5 games
    const aboveOrEqualAverage = first5Data.filter(val => val >= average).length;
    const percentage = (aboveOrEqualAverage / 10) * 100;
    document.getElementById("last10").innerHTML = `${percentage.toFixed(1)}%`
    console.log(`Percentage of the first 10 games for ${stat} at or above average: ${percentage.toFixed(2)}%`);
}

function calculateLast15(data, stat){
    const statData = data.map(game => game[stat]);
    console.log(statData); // Log the statData array to check if it contains the correct data
    const first5Data = statData.slice(0, 15);
    const sum = first5Data.reduce((acc, val) => acc + val, 0);
    const average = sum / 15; // Calculate average of first 5 games
    const aboveOrEqualAverage = first5Data.filter(val => val >= average).length;
    const percentage = (aboveOrEqualAverage / 15) * 100;
    document.getElementById("last15").innerHTML = `${percentage.toFixed(1)}%`
    console.log(`Percentage of the first 15 games for ${stat} at or above average: ${percentage.toFixed(2)}%`);
}

//function to handle playerinfo data

function processPlayerInfo(data) {

    console.log(data)
    document.getElementById('jumbotron').style.backgroundImage = `url("../../assets/img/nba-logos/${getTeamName(data.CommonPlayerInfo.TEAM_CODE)}.png")`
    document.getElementById('headshot').src = `https://cdn.nba.com/headshots/nba/latest/1040x760/${data.CommonPlayerInfo.PERSON_ID}.png`
    document.getElementById('playerName').innerText = data.CommonPlayerInfo.DISPLAY_FIRST_LAST.toUpperCase()
    document.getElementById('player-subheading').innerText = `${data.CommonPlayerInfo.TEAM_CITY} ${data.CommonPlayerInfo.TEAM_NAME} | #${data.CommonPlayerInfo.JERSEY} | ${data.CommonPlayerInfo.POSITION}`
    //height weight draft experience
    document.getElementById('height').innerText = data.CommonPlayerInfo.HEIGHT
    document.getElementById('weight').innerText = data.CommonPlayerInfo.WEIGHT
    document.getElementById('draft').innerText = `${data.CommonPlayerInfo.DRAFT_YEAR} R${data.CommonPlayerInfo.DRAFT_ROUND} Pick ${data.CommonPlayerInfo.DRAFT_NUMBER}`
    document.getElementById('experience').innerText = `${data.CommonPlayerInfo.TO_YEAR -= data.CommonPlayerInfo.FROM_YEAR} YEARS`

    //stats pts reb ast

    document.getElementById('header-stats-points').innerText = `PTS: ${data.PlayerHeadlineStats.PTS}`
    document.getElementById('header-stats-rebounds').innerText = `REB: ${data.PlayerHeadlineStats.REB}`
    document.getElementById('header-stats-assists').innerText = `AST: ${data.PlayerHeadlineStats.AST}`

    scrapeBio(`https://www.nba.com/player/${data.CommonPlayerInfo.PERSON_ID}/${data.CommonPlayerInfo.PLAYER_SLUG}/bio`)


}



function scrapeBio(link) {
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

const urlencoded = new URLSearchParams();
urlencoded.append("url", link);

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: urlencoded,
  redirect: "follow"
};

fetch("https://script.google.com/macros/s/AKfycbzy-J6Iaw5pMk3gbpuyd9AzihCbWsihfh4fUu5j95pWfoY1FRtprdumZXG___PGkMpsXA/exec", requestOptions)
  .then((response) => response.text())
  .then((result) => {
    // Convert text response to HTML
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(result, 'text/html');
    
    // Find the element with class "cplayer-bio__content" and get its text content
    const bioContent = htmlDoc.querySelectorAll('.cplayer-bio__content');
    console.log(bioContent[0].textContent)

    // Update the text content of an element with id "bio" with the scraped content
    document.getElementById("bio").innerText = bioContent[0].textContent;
  })
  .catch((error) => console.error(error));

}
// Scroll right by a certain amount of pixels
function scrollRight() {
    const container = document.querySelector('#stats-pills');
    container.scrollBy({
        left: 200, // Adjust the value as needed for scrolling distance
        behavior: 'smooth' // Optionally, use smooth scrolling
    });
}
