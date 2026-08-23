// =========================================
// CAMPUSPULSE
// Dashboard JavaScript
// =========================================

console.log("CampusPulse dashboard.js loaded");


// =========================================
// GET ANALYSIS DATA
// =========================================

const storedData = localStorage.getItem("campusPulseAnalysis");

if (!storedData) {

    console.error("No CampusPulse analysis data found.");

}


// Convert saved JSON into JavaScript object

let analysisData = null;

try {

    analysisData = storedData
        ? JSON.parse(storedData)
        : null;

} catch (error) {

    console.error("Could not read analysis data:", error);

}


// =========================================
// CHART DEFAULTS
// =========================================

if (typeof Chart !== "undefined") {

    Chart.defaults.font.family =
        '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

    Chart.defaults.color = "#667085";

}


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
// UPDATE OVERVIEW CARDS
// =========================================

if (analysisData && analysisData.overview) {

    const overview = analysisData.overview;

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


    // Try to update common overview-card IDs

    const totalStudents =
        document.getElementById("totalStudents");

    const placementRate =
        document.getElementById("placementRate");

    const averageCgpa =
        document.getElementById("averageCgpa");

    const averagePackage =
        document.getElementById("averagePackage");


    if (totalStudents) {

        totalStudents.textContent =
            overview.total_students;

    }


    if (placementRate) {

        placementRate.textContent =
            overview.placement_rate + "%";

    }


    if (averageCgpa) {

        averageCgpa.textContent =
            overview.average_cgpa;

    }


    if (averagePackage) {

        averagePackage.textContent =
            "₹" + overview.average_package + " LPA";

    }

}


// =========================================
// BRANCH DATA
// =========================================

let branchLabels = [];
let branchPlacementRates = [];
let branchAveragePackages = [];


if (
    analysisData &&
    Array.isArray(analysisData.branch_data)
) {

    branchLabels =
        analysisData.branch_data.map(
            item => item.branch
        );


    branchPlacementRates =
        analysisData.branch_data.map(
            item => item.placement_rate
        );


    branchAveragePackages =
        analysisData.branch_data.map(
            item => item.average_package
        );

}


console.log(
    "Branch labels:",
    branchLabels
);

console.log(
    "Branch placement rates:",
    branchPlacementRates
);

console.log(
    "Branch average packages:",
    branchAveragePackages
);


// =========================================
// BRANCH CHART
// =========================================

const branchCtx =
    document.getElementById("branchChart");


let branchChart = null;


if (
    branchCtx &&
    analysisData &&
    typeof Chart !== "undefined"
) {

    branchChart = new Chart(
        branchCtx,
        {

            type: "bar",

            data: {

                labels: branchLabels,

                datasets: [{

                    label:
                        "Placement Rate (%)",

                    data:
                        branchPlacementRates,

                    backgroundColor:
                        "#315efb",

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
    Array.isArray(analysisData.cgpa_data) &&
    typeof Chart !== "undefined"
) {

    const cgpaLabels =
        analysisData.cgpa_data.map(
            item => item.group
        );


    const cgpaRates =
        analysisData.cgpa_data.map(
            item => item.placement_rate
        );


    new Chart(
        cgpaCtx,
        {

            type: "line",

            data: {

                labels: cgpaLabels,

                datasets: [{

                    label:
                        "Placement Rate (%)",

                    data:
                        cgpaRates,

                    borderColor:
                        "#315efb",

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
    Array.isArray(analysisData.internship_data) &&
    typeof Chart !== "undefined"
) {

    const internshipLabels =
        analysisData.internship_data.map(
            item => item.category
        );


    const internshipRates =
        analysisData.internship_data.map(
            item => item.placement_rate
        );


    new Chart(
        internshipCtx,
        {

            type: "doughnut",

            data: {

                labels:
                    internshipLabels,

                datasets: [{

                    data:
                        internshipRates,

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

const salaryCtx =
    document.getElementById("salaryChart");


if (
    salaryCtx &&
    analysisData &&
    typeof Chart !== "undefined"
) {

    new Chart(
        salaryCtx,
        {

            type: "bar",

            data: {

                labels:
                    branchLabels,

                datasets: [{

                    label:
                        "Average Package (LPA)",

                    data:
                        branchAveragePackages,

                    backgroundColor:
                        "#172033",

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

                        ticks: {

                            callback:
                                function(value) {

                                    return "₹" + value;

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
// BRANCH FILTER
// =========================================

const branchFilter =
    document.getElementById("branchFilter");


if (
    branchFilter &&
    branchChart &&
    analysisData
) {

    branchFilter.addEventListener(
        "change",
        function() {

            const selectedBranch =
                branchFilter.value;


            if (
                selectedBranch === "all"
            ) {

                branchChart.data.labels =
                    branchLabels;

                branchChart.data.datasets[0].data =
                    branchPlacementRates;

            }

            else {

                const index =
                    branchLabels.indexOf(
                        selectedBranch
                    );


                if (index !== -1) {

                    branchChart.data.labels =
                        [selectedBranch];

                    branchChart.data.datasets[0].data =
                        [branchPlacementRates[index]];

                }

            }


            branchChart.update();

        }
    );

}


// =========================================
// FINAL DEBUG MESSAGE
// =========================================

console.log(
    "CampusPulse dashboard initialization complete."
);