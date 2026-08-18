// =========================================
// CAMPUSPULSE
// Dashboard JavaScript
// =========================================


// =========================================
// DEMO DATA
// =========================================

// These numbers are temporary.
// Later they will come from the Python backend.

const demoData = {

    branches: [
        "CSE",
        "IT",
        "ECE",
        "MECH"
    ],

    placementRates: [
        84,
        81,
        69,
        57
    ],

    averageSalary: [
        8.1,
        7.6,
        6.2,
        5.1
    ],

    cgpaGroups: [
        "Below 6",
        "6–7",
        "7–8",
        "8–9",
        "9+"
    ],

    cgpaPlacement: [
        48,
        56,
        69,
        84,
        91
    ],

    internshipLabels: [
        "Internship",
        "No Internship"
    ],

    internshipPlacement: [
        84,
        61
    ]

};


// =========================================
// CHART DEFAULTS
// =========================================

Chart.defaults.font.family =
    '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

Chart.defaults.color = "#667085";


// =========================================
// BRANCH CHART
// =========================================

const branchCtx =
    document.getElementById("branchChart");

const branchChart =
    new Chart(branchCtx, {

        type: "bar",

        data: {

            labels: demoData.branches,

            datasets: [{

                label: "Placement Rate (%)",

                data: demoData.placementRates,

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

                        callback: function(value) {
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

    });


// =========================================
// CGPA CHART
// =========================================

const cgpaCtx =
    document.getElementById("cgpaChart");

new Chart(cgpaCtx, {

    type: "line",

    data: {

        labels: demoData.cgpaGroups,

        datasets: [{

            label: "Placement Rate",

            data: demoData.cgpaPlacement,

            borderColor: "#315efb",

            backgroundColor: "rgba(49, 94, 251, 0.08)",

            borderWidth: 3,

            tension: 0.35,

            fill: true,

            pointRadius: 4,

            pointBackgroundColor: "#315efb"

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

                    callback: function(value) {
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

});


// =========================================
// INTERNSHIP CHART
// =========================================

const internshipCtx =
    document.getElementById("internshipChart");

new Chart(internshipCtx, {

    type: "doughnut",

    data: {

        labels: demoData.internshipLabels,

        datasets: [{

            data: demoData.internshipPlacement,

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

});


// =========================================
// SALARY CHART
// =========================================

const salaryCtx =
    document.getElementById("salaryChart");

new Chart(salaryCtx, {

    type: "bar",

    data: {

        labels: demoData.branches,

        datasets: [{

            label: "Average Package (LPA)",

            data: demoData.averageSalary,

            backgroundColor: "#172033",

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

                    callback: function(value) {
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

});


// =========================================
// BRANCH FILTER
// =========================================

const branchFilter =
    document.getElementById("branchFilter");

branchFilter.addEventListener("change", () => {

    const selectedBranch =
        branchFilter.value;

    if (selectedBranch === "all") {

        branchChart.data.labels =
            demoData.branches;

        branchChart.data.datasets[0].data =
            demoData.placementRates;

    } else {

        const index =
            demoData.branches.indexOf(selectedBranch);

        branchChart.data.labels =
            [selectedBranch];

        branchChart.data.datasets[0].data =
            [demoData.placementRates[index]];

    }

    branchChart.update();

});