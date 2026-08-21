// =========================================
// CAMPUSPULSE
// Dashboard JavaScript
// =========================================


// =========================================
// GET ANALYSIS DATA
// =========================================

const storedData =
    localStorage.getItem("campusPulseAnalysis");


// If there is no data
if (!storedData) {

    console.error(
        "No CampusPulse analysis data found."
    );

}


// Convert saved JSON into JavaScript object
const analysisData =
    storedData
        ? JSON.parse(storedData)
        : null;


// =========================================
// CHART DEFAULTS
// =========================================

Chart.defaults.font.family =
    '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

Chart.defaults.color = "#667085";


// =========================================
// CHECK DATA
// =========================================

if (analysisData) {

    console.log(
        "CampusPulse analysis data:",
        analysisData
    );

}


// =========================================
// BRANCH CHART
// =========================================

const branchCtx =
    document.getElementById("branchChart");

let branchChart = null;


if (
    branchCtx &&
    analysisData &&
    analysisData.branch_data
) {

    const branches =
        analysisData.branch_data.map(
            item => item.branch
        );

    const placementRates =
        analysisData.branch_data.map(
            item => item.placement_rate
        );


    branchChart = new Chart(
        branchCtx,
        {

            type: "bar",

            data: {

                labels: branches,

                datasets: [{

                    label:
                        "Placement Rate (%)",

                    data: placementRates,

                    backgroundColor: "#315efb",

                    borderRadius: 7,

                    borderSkipped: false

                }]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {
                        display: false
                    }

                },

                scales: {

                    y: {

                        beginAtZero: true,

                        max: 100,

                        ticks: {

                            callback:
                                function(value) {

                                    return value + "%";

                                }

                        }

                    },

                    x: {

                        grid: {
                            display: false
                        }

                    }

                }

            }

        }
    );

}


// =========================================
// CGPA CHART
// =========================================

const cgpaCtx =
    document.getElementById("cgpaChart");


if (
    cgpaCtx &&
    analysisData &&
    analysisData.cgpa_data
) {

    const groups =
        analysisData.cgpa_data.map(
            item => item.group
        );

    const placementRates =
        analysisData.cgpa_data.map(
            item => item.placement_rate
        );


    new Chart(
        cgpaCtx,
        {

            type: "line",

            data: {

                labels: groups,

                datasets: [{

                    label:
                        "Placement Rate",

                    data: placementRates,

                    borderColor: "#315efb",

                    backgroundColor:
                        "rgba(49, 94, 251, 0.08)",

                    borderWidth: 3,

                    tension: 0.35,

                    fill: true,

                    pointRadius: 4,

                    pointBackgroundColor:
                        "#315efb"

                }]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {
                        display: false
                    }

                },

                scales: {

                    y: {

                        beginAtZero: true,

                        max: 100,

                        ticks: {

                            callback:
                                function(value) {

                                    return value + "%";

                                }

                        }

                    },

                    x: {

                        grid: {
                            display: false
                        }

                    }

                }

            }

        }
    );

}


// =========================================
// INTERNSHIP CHART
// =========================================

const internshipCtx =
    document.getElementById("internshipChart");


if (
    internshipCtx &&
    analysisData &&
    analysisData.internship_data
) {

    const labels =
        analysisData.internship_data.map(
            item => item.category
        );

    const placementRates =
        analysisData.internship_data.map(
            item => item.placement_rate
        );


    new Chart(
        internshipCtx,
        {

            type: "doughnut",

            data: {

                labels: labels,

                datasets: [{

                    data: placementRates,

                    backgroundColor: [
                        "#315efb",
                        "#dfe4ec"
                    ],

                    borderWidth: 0

                }]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                cutout: "68%",

                plugins: {

                    legend: {

                        position: "bottom",

                        labels: {

                            padding: 20

                        }

                    }

                }

            }

        }
    );

}


// =========================================
// SALARY CHART
// =========================================

// Your current Flask backend does not yet
// return branch-wise average salary data.
//
// So we will add this chart after the first
// three charts are confirmed working.


// =========================================
// BRANCH FILTER
// =========================================

const branchFilter =
    document.getElementById("branchFilter");


if (
    branchFilter &&
    branchChart &&
    analysisData &&
    analysisData.branch_data
) {

    const branches =
        analysisData.branch_data.map(
            item => item.branch
        );

    const rates =
        analysisData.branch_data.map(
            item => item.placement_rate
        );


    branchFilter.addEventListener(
        "change",
        () => {

            const selectedBranch =
                branchFilter.value;


            if (selectedBranch === "all") {

                branchChart.data.labels =
                    branches;

                branchChart.data.datasets[0].data =
                    rates;

            }

            else {

                const index =
                    branches.indexOf(
                        selectedBranch
                    );


                if (index !== -1) {

                    branchChart.data.labels =
                        [selectedBranch];

                    branchChart.data.datasets[0].data =
                        [rates[index]];

                }

            }


            branchChart.update();

        }
    );

}


// =========================================
// UPDATE OVERVIEW CARDS
// =========================================

if (analysisData) {

    const overview =
        analysisData.overview;


    console.log(
        "Total Students:",
        overview.total_students
    );


    console.log(
        "Placement Rate:",
        overview.placement_rate
    );


    console.log(
        "Average CGPA:",
        overview.average_cgpa
    );


    console.log(
        "Average Package:",
        overview.average_package
    );

}