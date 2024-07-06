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
                show: true,
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


function getNBAScores() {
    fetch("https://script.google.com/macros/s/AKfycbx9ACsO6cijCKM_FeHnjXadojygn-8-s2rPEt71buDHntVQy4AxcfNczrOIdNlRWswH/exec")
        .then(response => response.text())
        .then(result => displayScores(JSON.parse(result)))
        .catch(error => console.log('error', error));


}


function displayScores(data) {

    const scoresContainer = document.getElementById('scores-container');
    scoresContainer.innerHTML = '';
    for (var i in data.scoreboard.games) {
        const game = data.scoreboard.games[i];
        //console.log(game)
        //console.log(game)
        var winText
        var loseText

        // Extracting quarterly scores
        const quarterlyScores = game.homeTeam.periods.map((period, index) => ({
            quarter: index + 1,
            homeScore: period.score,
            awayScore: game.awayTeam.periods[index].score,
        }));
        var time = game.gameClock
        var color = '';
        if (time !== null && time !== "null" && time !== "") {
            color = 'danger';
        } else {
            color = 'success';
        }



        const cardTemplate = `
                  <div class="scoreboard-item card h-100">
                    <div class="card-body" style="padding-top:5px">
                        <!-- Row 1 -->
                        <div class="row mt-4 align-items-center">
                            <!-- Column 1: Knicks -->
                            <div class="col-6 d-flex justify-content-start">
                                <span style="width:40px;height: 40px;"><img src="../../assets/img/nba-logos/${getTeamName(game.awayTeam.teamName).toLowerCase()}.png" width="40px" height="40px"></span>
                                <span class="team-name">${game.awayTeam.teamName}</span>
                                <span class="score">${game.awayTeam.score}</span>
                            </div>
                            <!-- Column 2: Q4 and Time -->
                            <div class="col-6 justify-content-end text-align-right" style="position:absolute;right:-10%;top:25%">
                                <span class="quarter badge bg-${color}">${game.gameStatusText}</span><br>
                                <small class="total">Total: </small><br>
                                <span class="total-score">${game.awayTeam.score + game.homeTeam.score}</span>
                            </div>
                        </div>
                        <div style="position: absolute;width:70%;left:0px;height:60%; border-right:2px solid  #474E72;top:20%">
                        </div>
                        <!-- Row 2 -->
                        <div class="row mt-2 align-items-center">
                            <!-- Column 1: Celtics -->
                            <div class="col-6 d-flex justify-content-start">
                                <span style="width:40px;height: 40px;"><img src="../../assets/img/nba-logos/${getTeamName(game.homeTeam.teamName).toLowerCase()}.png" width="40px" height="40px"></span>
                                <span class="team-name">${game.homeTeam.teamName}</span>
                                <span class="score">${game.homeTeam.score}</span>
                            </div>
                            <!-- Column 2: Total -->
                           
                        </div>
                    </div>
                </div>
            </div> `;

        scoresContainer.innerHTML += cardTemplate;
        if (game.gameStatusText.includes("Final")) {

        } else {
            winText = "Winning"
            loseText = "Losing"
        }

    };

}


// Fetch and display scores initially
getNBAScores();

// Poll the API every minute to get the latest scores
setInterval(getNBAScores, 20000);

setInterval(function() {
    $(".card-title-od").css("background", "-webkit-linear-gradient(left, #FFE872, #00FFFF)");
    $(".card-title-od").css("-webkit-background-clip", "text");
    $(".card-title-od").css("-webkit-text-fill-color", "transparent");
    $("#scoreboard-spinner").css("display", "inline-block");
}, 20000);

setInterval(function() {
    $(".card-title-od").css("background", "white");
    $(".card-title-od").css("-webkit-background-clip", "text");
    $(".card-title-od").css("-webkit-text-fill-color", "transparent");
    $(".card-title-od").css("color", "white");
    $("#scoreboard-spinner").css("display", "none");
}, 21200);


const currentDate = new Date();
const options = { timeZone: 'America/New_York' };
const [month, day, year] = currentDate.toLocaleDateString('en-US', options)
    .split('/')
    .map((part) => part.padStart(2, '0'));
const formattedDate = `${year}-${month}-${day}`;

document.addEventListener('sbAPILoaded', function() {

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${sbApiAuthToken.access_token}`);

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };

    fetch(`https://cdn.overdogbets.com/predictions/${formattedDate}_predictions.json`, requestOptions)
        .then(response => response.text())
        .then(result => {
            buildPredictions(JSON.parse(result))
            getNBAProps()
        })
        .catch(error => console.log('error', error));

})

function getPremium() {
    // Handle the logic for upgrading to premium
    openPaymentModal()
    //console.log('User clicked Get Premium');
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
    }
    return strippedName.trim() // Trim any leading or trailing spaces
}






function buildPredictions(predictions) {
    //buildParlays(predictions)
    const aiContainer = document.getElementById('picks');
    aiContainer.innerHTML = '';
    for (var i in predictions) {
        const game = predictions[i]
        /*if (game.under_over === "UNDER") {
            game.total = game.total += 5
        } else if (game.under_over === "OVER") {
            game.total = game.total -= 5
        }*/
        if (game.expected_value_colors.home_color == "RED" && game.expected_value_colors.away_color == "RED") {
            var WinningTeam = "AI UNSURE"
        } else if (game.expected_value_colors.home_color == "RED" && game.expected_value_colors.away_color == "GREEN") {
            WinningTeam = game.home_team
        } else {
            var WinningTeam = game.away_team
        }
        const cardTemplate = `
        <div class="col-lg-3 col-sm-6 mb-4 ai-pick">
          <div class="card h-100">
              <div class="card-header">
                  <center>
                      <h4 class="card-title mb-1">${WinningTeam}<span class="badge bg-danger" id="${WinningTeam}-moneyline-status" style="display:none; margin-left:10px"></span></a></h4>
              </center>
              <br>
              <center class="text-success"><small id="bulls-status">To Win</small></center>
          </div>
          <div class="card-body">
              <div class="row">
                  <div class="col-4">
                      <div class="d-flex  align-items-center mb-2">
                          <span><img src="../../assets/img/nba-logos/${getTeamName(game.away_team).toLowerCase()}.png" width="40px" height="40px"></span>
                          <p class="team-name1 mb-0 team-away">${getTeamName(game.away_team)}</p>
                      </div>
                      
                  </div>
                  <div class="col-4">
                      <div class="divider divider-vertical">
                          <div class="divider-text" style="border-radius:50%">
                              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<rect width="40" height="40" fill="url(#pattern0_79_9)"/>
<defs>
<pattern id="pattern0_79_9" patternContentUnits="objectBoundingBox" width="1" height="1">
<use xlink:href="#image0_79_9" transform="scale(0.002)"/>
</pattern>
<image id="image0_79_9" width="500" height="500" xlink:href="data:image/png;base64,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"/>
</defs>
</svg>
                          </div>
                      </div>
                  </div>
                  <div class="col-4 text-end">
                      <div class="d-flex  justify-content-end align-items-center mb-2">
                          <p class=" team-name1 mb-0 team-home">${getTeamName(game.home_team)}</p>
                          <span><img src="../../assets/img/nba-logos/${getTeamName(game.home_team).toLowerCase()}.png" width="40px" height="40px"></span>
                      </div>
                      
                  </div>
              </div>
              <center><small>Game Total:</small></center>
              <center>
                  <h4 class="card-title mb-1">${game.under_over} ${game.total}</h4>
              </center>
          </div>
      </div>
  </div>
    `;

        aiContainer.innerHTML += cardTemplate;
    }
}





/*function buildParlays(data) {
    const numGames = data.length;
    const parlays = [];

    // Iterate through games for the first leg
    for (let i = 0; i < numGames - 2; i++) {
        // Iterate through games for the second leg
        for (let j = i + 1; j < numGames - 1; j++) {
            // Iterate through games for the third leg
            for (let k = j + 1; k < numGames; k++) {
                // Build the parlay array and push it to the parlays array
                parlays.push([data[i], data[j], data[k]]);
            }
        }
    }

    //console.log(parlays);
    buildUI(parlays)
}


function buildUI(parlays) {
    //console.log(parlays)
    var cardsHTML = "";
    var winners = []
    var losers = []

    for (parlayIndex in parlays) {
        var parlay = parlays[parlayIndex];
        var isLoser = false;

        for (gameIndex in parlay) {
            var gameData = parlay[gameIndex];
            if (gameData.away_team.includes('Hornets') || gameData.away_team.includes('Bucks') || gameData.away_team.includes('Raptors') || gameData.away_team.includes('Hawks')) {
                isLoser = true;
                break; // If any game includes one of the specified teams, mark the entire parlay as a loser
            }
        }

        if (isLoser) {
            //console.log("found a loser")
            losers.push(parlay);
        } else {
            winners.push(parlay);
        }

        var parlayCard = "";
        //console.log(parlay)
        for (gameIndex in parlay) {
            var gameData = parlay[gameIndex];
            var total1 = gameData.total
            if (gameData.under_over === "UNDER") {
                total1 = total1 += 5
            } else if (gameData.under_over === "OVER") {
                total1 = total1 -= 5
            }
            parlayCard = parlayCard + `
                <div class="card-body">
                    <h3 id="${gameData.home_team}-stats">${gameData.under_over} ${total1}</h3>
                    <p style="display:inline; color:${gameData.expected_value_colors.home_color} !important">${gameData.away_team}</p> <p style="display:inline;">vs</p> <p style="display:inline; color:${gameData.expected_value_colors.away_color} !important">${gameData.home_team}</p>
                    <br>
                </div>
            `;
        }

        cardsHTML = cardsHTML + `
        <div class="swiper-slide">  
            <div class="pd4">
                ${parlayCard}
            </div>
        </div>
            <br>
            <br>
        `;
    }
    // Initialize Swiper
    const swiper = new Swiper('#cards-wrapper', {
        slidesPerView: 'auto',
        freeMode: true,
        spaceBetween: 16,
        touchRatio: 1,
        scrollbar: {
            el: '.swiper-scrollbar',
            hide: false,
        },
    });


    var cards = document.getElementById("cards");
    cards.innerHTML = cards.innerHTML + cardsHTML;
    //console.log("winners", winners)
    //console.log("losers", losers)
}
*/


//props

function getNBAProps() {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${sbApiAuthToken.access_token}`);

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };

    fetch(`https://cdn.overdogbets.com/predictions/nba_props/${formattedDate}.json`, requestOptions)
        .then((response) => response.json())
        .then((result) => processProps(result))
        .catch((error) => console.error(error));
}


function processProps(props) {
    console.log(props)

    const propsContainer = document.getElementById('props-picks');
    propsContainer.innerHTML = '';
    for (var i in props) {
        if (!props[i].predictions) {
            //skip
        } else {
            const cardTemplate = `
        <div class="col-lg-3 col-sm-6 mb-4 ai-pick">
          <div class="card h-100">
              <div class="card-header">
                  <center>
                      <a style="color:white" href="./nba-player.html?player=${props[i].PLAYER}"><h4 class="card-title mb-1" style="font-family: 'OVERDOG';color:white !important">${props[i].PLAYER}</a></h4>
              </center>
              <br>
              <center class="text-success"><small id="bulls-status">${props[i].POSITION}</small></center>
          </div>
          <div class="card-body">
              <div class="row">
                  <div class="col-4"> 
                  </div>
                  <div class="col-4">
                      <div class="divider divider-vertical">
                          <div class="divider-text" style="border-radius:50%">
                              <img width="40px" height="35px"  src="https://cdn.nba.com/headshots/nba/latest/1040x760/${props[i].PLAYER_ID}.png">
                          </div>
                      </div>
                  </div>
              <center><small>Predictions:</small></center><br><br>
                    <center>
                        <div class="d-flex justify-content-center">
                            <div class="table-responsive">
                                <table class="table table-bordered ">
                                    <thead>
                                        <tr>
                                            <th scope="col">PTS</th>
                                            <th scope="col">AST</th>
                                            <th scope="col">REB</th>
                                            <th scope="col">BLK</th>
                                            <th scope="col">STL</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td id="PTS">${Math.round(props[i].predictions.PTS)}</td>
                                            <td id="AST">${Math.round(props[i].predictions.AST)}</td>
                                            <td id="REB">${Math.round(props[i].predictions.REB)}</td>
                                            <td id="BLK">${Math.round(props[i].predictions.BLK)}</td>
                                            <td id="STL">${Math.round(props[i].predictions.STL)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                </center>
            </div>
        </div>
    </div>
    `;

            propsContainer.innerHTML += cardTemplate;
        }
    }
}

// Standings

fetch("https://script.google.com/macros/s/AKfycbxdTMdW4mUJXq33LRjvVnBCey7xELhTy4VdG0tJVeIRGWXOxCGREgqaaVDaoHqLiUdg5g/exec")
    .then(response => response.text())
    .then(text => {
        // Create a DOMParser object
        const parser = new DOMParser();
        // Parse the plain text response as HTML
        const htmlDoc = parser.parseFromString(text, 'text/html');
        // Now you can work with the HTML document as you normally would
        var tables = htmlDoc.getElementsByTagName('table')
        //document.getElementById('eastern-standings').append(tables[0])

        extractEasternData(tables[0], western)
        extractWesternData(tables[1], eastern)
    })
    .catch(error => console.error('Error:', error));

var eastern = []
var western = []

function extractEasternData(table_html, conference) {
    const tableRows = table_html.querySelectorAll('.bsp_row_item');

    const data = [];

    tableRows.forEach((row) => {
        const columns = row.children;
        const team = columns[0].textContent.trim();
        const wL = columns[2].textContent.trim();
        const pct = columns[3].textContent.trim();
        const gb = columns[4].textContent.trim();
        const conf = columns[5].textContent.trim();
        const div = columns[6].textContent.trim();
        const strk = columns[7].textContent.trim();

        data.push({
            Team: team.replace(/^(\d+)(?:([A-Z][a-z]+))$/, '$1. $2'),
            'W-L': wL,
            PCT: pct,
            GB: gb,
            CONF: conf,
            DIV: div,
            STRK: strk,
        });
    });
    conference = data


    buildEasternTable(conference)

}

function buildEasternTable(eastern) {
    var template
    console.log('pussy')
    for (var i in eastern) {
        if (eastern[i].Team.includes('76ers')) {
            eastern[i].Team = eastern[i].Team.replace("76ers", ". 76ers")
        }
        var template = `
                    <td>${eastern[i].Team}</td>
                    <td class="" style="">${eastern[i]['W-L']}</td>
                    <td class="" style="">${eastern[i].PCT}</td>
                    <td style="">${eastern[i].GB}</td>
                    <td style="">${eastern[i].CONF}</td>
                    <td style="">${eastern[i].DIV}</td>
                    <td>${eastern[i].STRK}</td>`
        const row = document.createElement('tr');
        row.innerHTML = template;
        document.getElementById('eastern-standings').append(row);
    }
}

function extractWesternData(table_html, conference) {
    const tableRows = table_html.querySelectorAll('.bsp_row_item');

    const data = [];

    tableRows.forEach((row) => {
        const columns = row.children;
        const team = columns[0].textContent.trim();
        const wL = columns[2].textContent.trim();
        const pct = columns[3].textContent.trim();
        const gb = columns[4].textContent.trim();
        const conf = columns[5].textContent.trim();
        const div = columns[6].textContent.trim();
        const strk = columns[7].textContent.trim();

        data.push({
            Team: team.replace(/^(\d+)(?:([A-Z][a-z]+))$/, '$1. $2'),
            'W-L': wL,
            PCT: pct,
            GB: gb,
            CONF: conf,
            DIV: div,
            STRK: strk,
        });
    });
    conference = data

    buildWesternTable(conference)

}

function buildWesternTable(eastern) {
    var template
    console.log('pussy')
    for (var i in eastern) {
        var template = `
                    <td>${eastern[i].Team}</td>
                    <td class="" style="">${eastern[i]['W-L']}</td>
                    <td class="" style="">${eastern[i].PCT}</td>
                    <td style="">${eastern[i].GB}</td>
                    <td style="">${eastern[i].CONF}</td>
                    <td style="">${eastern[i].DIV}</td>
                    <td>${eastern[i].STRK}</td>`
        const row = document.createElement('tr');
        row.innerHTML = template;
        document.getElementById('western-standings').append(row);
    }
}