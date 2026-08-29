// =========================================
// CAMPUSPULSE
// Dashboard JavaScript
// =========================================


// =========================================
// GLOBAL CHART REFERENCES
// =========================================

let branchChart = null;
let cgpaChart = null;
let internshipChart = null;
let salaryChart = null;


// =========================================
// GET STORED DATA
// =========================================

const storedData =
    localStorage.getItem("campusPulseAnalysis");


console.log(
    "CampusPulse dashboard.js loaded"
);


console.log(
    "Stored analysis data:",
    storedData
);


// =========================================
// CHECK DATA
// =========================================

if (!storedData) {

    console.error(
        "No CampusPulse analysis data found."
    );

    showNoDataMessage();

}


let analysisData = null;


try {

    analysisData =
        storedData
            ? JSON.parse(storedData)
            : null;

} catch (error) {

    console.error(
        "Could not parse analysis data:",
        error
    );

}


// =========================================
// INITIALIZE
// =========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        if (!analysisData) {
            return;
        }

        console.log(
            "CampusPulse analysis data:",
            analysisData
        );


        initializeDashboard();

    }
);


// =========================================
// MAIN INITIALIZATION
// =========================================

function initializeDashboard() {

    updateDatasetName();

    updateOverview();

    populateBranchFilter();

    createBranchChart();

    createCgpaChart();

    createInternshipChart();

    createSalaryChart();

    generateInsights();

    setupNavigation();

    setupNewDatasetButton();


    console.log(
        "CampusPulse dashboard initialization complete."
    );

}


// =========================================
// DATASET NAME
// =========================================

function updateDatasetName() {

    const element =
        document.getElementById("datasetName");


    if (!element) {
        return;
    }


    element.textContent =
        analysisData.filename ||
        "Uploaded dataset";

}


// =========================================
// OVERVIEW CARDS
// =========================================

function updateOverview() {

    const overview =
        analysisData.overview;


    if (!overview) {

        console.error(
            "Overview data missing."
        );

        return;

    }


    const totalStudents =
        document.getElementById(
            "totalStudents"
        );


    const placementRate =
        document.getElementById(
            "placementRate"
        );


    const averageCgpa =
        document.getElementById(
            "averageCgpa"
        );


    const averagePackage =
        document.getElementById(
            "averagePackage"
        );


    if (totalStudents) {

        totalStudents.textContent =
            Number(
                overview.total_students
            ).toLocaleString(
                "en-IN"
            );

    }


    if (placementRate) {

        placementRate.textContent =
            `${Number(
                overview.placement_rate
            ).toFixed(2)}%`;

    }


    if (averageCgpa) {

        averageCgpa.textContent =
            Number(
                overview.average_cgpa
            ).toFixed(2);

    }


    if (averagePackage) {

        averagePackage.textContent =
            `₹${Number(
                overview.average_package
            ).toFixed(2)} LPA`;

    }


    console.log(
        "Overview updated:",
        overview
    );

}


// =========================================
// BRANCH FILTER
// =========================================

function populateBranchFilter() {

    const filter =
        document.getElementById(
            "branchFilter"
        );


    if (!filter) {
        return;
    }


    filter.innerHTML = "";


    const allOption =
        document.createElement("option");


    allOption.value = "all";

    allOption.textContent =
        "All Branches";


    filter.appendChild(
        allOption
    );


    const branchData =
        analysisData.branch_data || [];


    branchData.forEach(
        item => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                item.branch;

            option.textContent =
                item.branch;


            filter.appendChild(
                option
            );

        }
    );


    filter.addEventListener(
        "change",
        handleBranchFilter
    );

}


// =========================================
// BRANCH FILTER HANDLER
// =========================================

function handleBranchFilter() {

    const selected =
        document.getElementById(
            "branchFilter"
        ).value;


    const branchData =
        analysisData.branch_data || [];


    if (!branchChart) {
        return;
    }


    let filteredData;


    if (selected === "all") {

        filteredData =
            branchData;

    } else {

        filteredData =
            branchData.filter(
                item =>
                    item.branch === selected
            );

    }


    branchChart.data.labels =
        filteredData.map(
            item => item.branch
        );


    branchChart.data.datasets[0].data =
        filteredData.map(
            item =>
                Number(
                    item.placement_rate
                )
        );


    branchChart.update();

}


// =========================================
// BRANCH CHART
// =========================================

function createBranchChart() {

    const canvas =
        document.getElementById(
            "branchChart"
        );


    if (!canvas) {
        return;
    }


    const branchData =
        analysisData.branch_data || [];


    const labels =
        branchData.map(
            item => item.branch
        );


    const values =
        branchData.map(
            item =>
                Number(
                    item.placement_rate
                )
        );


    console.log(
        "Branch labels:",
        labels
    );


    console.log(
        "Branch placement rates:",
        values
    );


    branchChart =
        new Chart(
            canvas,
            {

                type: "bar",

                data: {

                    labels: labels,

                    datasets: [{

                        label:
                            "Placement Rate (%)",

                        data: values,

                        backgroundColor:
                            "#315efb",

                        borderRadius: 8,

                        borderSkipped:
                            false

                    }]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio:
                        false,

                    animation: {

                        duration: 700

                    },

                    plugins: {

                        legend: {

                            display: false

                        },

                        tooltip: {

                            callbacks: {

                                label:
                                    function(context) {

                                        return (
                                            "Placement: " +
                                            Number(
                                                context.raw
                                            ).toFixed(2) +
                                            "%"
                                        );

                                    }

                            }

                        }

                    },

                    scales: {

                        y: {

                            beginAtZero: true,

                            max: 100,

                            ticks: {

                                callback:
                                    function(value) {

                                        return (
                                            value +
                                            "%"
                                        );

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

function createCgpaChart() {

    const canvas =
        document.getElementById(
            "cgpaChart"
        );


    if (!canvas) {
        return;
    }


    const cgpaData =
        analysisData.cgpa_data || [];


    const labels =
        cgpaData.map(
            item => item.group
        );


    const values =
        cgpaData.map(
            item =>
                Number(
                    item.placement_rate
                )
        );


    console.log(
        "CGPA data:",
        cgpaData
    );


    cgpaChart =
        new Chart(
            canvas,
            {

                type: "line",

                data: {

                    labels: labels,

                    datasets: [{

                        label:
                            "Placement Rate (%)",

                        data: values,

                        borderColor:
                            "#315efb",

                        backgroundColor:
                            "rgba(49, 94, 251, 0.08)",

                        borderWidth: 3,

                        tension: 0.35,

                        fill: true,

                        pointRadius: 5,

                        pointHoverRadius: 7,

                        pointBackgroundColor:
                            "#315efb"

                    }]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio:
                        false,

                    animation: {

                        duration: 700

                    },

                    plugins: {

                        legend: {

                            display: false

                        },

                        tooltip: {

                            callbacks: {

                                label:
                                    function(context) {

                                        return (
                                            "Placement: " +
                                            Number(
                                                context.raw
                                            ).toFixed(2) +
                                            "%"
                                        );

                                    }

                            }

                        }

                    },

                    scales: {

                        y: {

                            beginAtZero: true,

                            max: 100,

                            ticks: {

                                callback:
                                    function(value) {

                                        return (
                                            value +
                                            "%"
                                        );

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

function createInternshipChart() {

    const canvas =
        document.getElementById(
            "internshipChart"
        );


    if (!canvas) {
        return;
    }


    const internshipData =
        analysisData.internship_data || [];


    const labels =
        internshipData.map(
            item => item.category
        );


    const values =
        internshipData.map(
            item =>
                Number(
                    item.placement_rate
                )
        );


    console.log(
        "Internship data:",
        internshipData
    );


    internshipChart =
        new Chart(
            canvas,
            {

                type: "doughnut",

                data: {

                    labels: labels,

                    datasets: [{

                        data: values,

                        backgroundColor: [

                            "#315efb",

                            "#dfe4ec"

                        ],

                        borderWidth: 0,

                        hoverOffset: 5

                    }]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio:
                        false,

                    cutout: "68%",

                    plugins: {

                        legend: {

                            position:
                                "bottom",

                            labels: {

                                padding: 22,

                                usePointStyle:
                                    true,

                                pointStyle:
                                    "circle"

                            }

                        },

                        tooltip: {

                            callbacks: {

                                label:
                                    function(context) {

                                        return (
                                            context.label +
                                            ": " +
                                            Number(
                                                context.raw
                                            ).toFixed(2) +
                                            "%"
                                        );

                                    }

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

function createSalaryChart() {

    const canvas =
        document.getElementById(
            "salaryChart"
        );


    if (!canvas) {
        return;
    }


    const branchData =
        analysisData.branch_data || [];


    const labels =
        branchData.map(
            item => item.branch
        );


    const values =
        branchData.map(
            item =>
                Number(
                    item.average_package
                )
        );


    console.log(
        "Average packages:",
        values
    );


    salaryChart =
        new Chart(
            canvas,
            {

                type: "bar",

                data: {

                    labels: labels,

                    datasets: [{

                        label:
                            "Average Package (LPA)",

                        data: values,

                        backgroundColor:
                            "#172033",

                        borderRadius: 8,

                        borderSkipped:
                            false

                    }]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio:
                        false,

                    animation: {

                        duration: 700

                    },

                    plugins: {

                        legend: {

                            display: false

                        },

                        tooltip: {

                            callbacks: {

                                label:
                                    function(context) {

                                        return (
                                            "Average Package: ₹" +
                                            Number(
                                                context.raw
                                            ).toFixed(2) +
                                            " LPA"
                                        );

                                    }

                            }

                        }

                    },

                    scales: {

                        y: {

                            beginAtZero: true,

                            ticks: {

                                callback:
                                    function(value) {

                                        return (
                                            "₹" +
                                            value
                                        );

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
// AUTOMATED INSIGHTS
// =========================================

function generateInsights() {

    generateInternshipInsight();

    generateAcademicInsight();

    generateBranchInsight();

}


// =========================================
// INTERNSHIP INSIGHT
// =========================================

function generateInternshipInsight() {

    const element =
        document.getElementById(
            "internshipInsight"
        );

    if (!element) {
        return;
    }

    const data =
        analysisData.internship_data || [];

    if (data.length < 2) {

        element.textContent =
            "Insufficient internship data available.";

        return;

    }

    const internship =
        data.find(item =>
            item.category
                .toLowerCase()
                .includes("internship")
        );

    const noInternship =
        data.find(item =>
            item.category
                .toLowerCase()
                .includes("no")
        );

    if (!internship || !noInternship) {

        element.textContent =
            "A direct internship comparison could not be generated.";

        return;

    }

    const internshipRate =
        Number(
            internship.placement_rate
        );

    const noInternshipRate =
        Number(
            noInternship.placement_rate
        );

    const difference =
        internshipRate -
        noInternshipRate;


    if (difference > 0) {

        element.textContent =
            `Students with internship experience have a ${difference.toFixed(2)} percentage-point higher placement rate (${internshipRate.toFixed(2)}%) than students without internships (${noInternshipRate.toFixed(2)}%).`;

    }

    else if (difference < 0) {

        element.textContent =
            `Students without internship experience have a ${Math.abs(difference).toFixed(2)} percentage-point higher placement rate than students with internships in this dataset.`;

    }

    else {

        element.textContent =
            "Students with and without internship experience have the same placement rate in this dataset.";

    }

}


// =========================================
// ACADEMIC INSIGHT
// =========================================

function generateAcademicInsight() {

    const element =
        document.getElementById(
            "academicInsight"
        );

    if (!element) {
        return;
    }

    const data =
        analysisData.cgpa_data || [];

    if (data.length === 0) {

        element.textContent =
            "CGPA placement data is unavailable.";

        return;

    }


    const sorted =
        [...data].sort(
            (a, b) =>
                Number(
                    b.placement_rate
                ) -
                Number(
                    a.placement_rate
                )
        );


    const highest =
        sorted[0];


    const lowest =
        sorted[sorted.length - 1];


    element.textContent =
        `The ${highest.group} CGPA group has the highest placement rate at ${Number(highest.placement_rate).toFixed(2)}%. The lowest rate is ${Number(lowest.placement_rate).toFixed(2)}% for the ${lowest.group} group.`;

}


// =========================================
// BRANCH INSIGHT
// =========================================

function generateBranchInsight() {

    const element =
        document.getElementById(
            "branchInsight"
        );

    if (!element) {
        return;
    }

    const data =
        analysisData.branch_data || [];

    if (data.length === 0) {

        element.textContent =
            "Branch placement data is unavailable.";

        return;

    }


    // -----------------------------------------
    // BEST PLACEMENT BRANCH
    // -----------------------------------------

    const bestPlacement =
        [...data].sort(
            (a, b) =>
                Number(
                    b.placement_rate
                ) -
                Number(
                    a.placement_rate
                )
        )[0];


    // -----------------------------------------
    // LOWEST PLACEMENT BRANCH
    // -----------------------------------------

    const lowestPlacement =
        [...data].sort(
            (a, b) =>
                Number(
                    a.placement_rate
                ) -
                Number(
                    b.placement_rate
                )
        )[0];


    // -----------------------------------------
    // HIGHEST PACKAGE BRANCH
    // -----------------------------------------

    const highestPackage =
        [...data].sort(
            (a, b) =>
                Number(
                    b.average_package
                ) -
                Number(
                    a.average_package
                )
        )[0];


    element.textContent =
        `${bestPlacement.branch} has the highest placement rate at ${Number(bestPlacement.placement_rate).toFixed(2)}%, while ${lowestPlacement.branch} has the lowest at ${Number(lowestPlacement.placement_rate).toFixed(2)}%. ${highestPackage.branch} records the highest average package at ₹${Number(highestPackage.average_package).toFixed(2)} LPA.`;

}
// =========================================
// NAVIGATION
// =========================================

function setupNavigation() {

    const links =
        document.querySelectorAll(
            ".nav-links a"
        );


    links.forEach(
        link => {

            link.addEventListener(
                "click",
                event => {

                    const targetId =
                        link
                            .getAttribute(
                                "href"
                            )
                            .replace(
                                "#",
                                ""
                            );


                    const target =
                        document.getElementById(
                            targetId
                        );


                    if (!target) {
                        return;
                    }


                    event.preventDefault();


                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }
            );

        }
    );

}


// =========================================
// NEW DATASET
// =========================================

function setupNewDatasetButton() {

    const button =
        document.getElementById(
            "newDatasetButton"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        () => {

            localStorage.removeItem(
                "campusPulseAnalysis"
            );


            window.location.href =
                "upload.html";

        }
    );

}


// =========================================
// NO DATA MESSAGE
// =========================================

function showNoDataMessage() {

    const body =
        document.body;


    if (!body) {
        return;
    }


    const message =
        document.createElement(
            "div"
        );


    message.style.position =
        "fixed";

    message.style.inset =
        "0";

    message.style.background =
        "#f6f8fc";

    message.style.display =
        "flex";

    message.style.flexDirection =
        "column";

    message.style.alignItems =
        "center";

    message.style.justifyContent =
        "center";

    message.style.zIndex =
        "9999";

    message.innerHTML = `

        <div style="
            font-size: 22px;
            font-weight: 800;
            color: #172033;
            margin-bottom: 10px;
        ">
            No dataset found
        </div>

        <div style="
            color: #667085;
            margin-bottom: 22px;
        ">
            Please upload a dataset first.
        </div>

        <button
            id="goUpload"
            style="
                border: none;
                background: #315efb;
                color: white;
                padding: 13px 22px;
                border-radius: 10px;
                font-size: 15px;
                font-weight: 700;
                cursor: pointer;
            "
        >
            Upload Dataset
        </button>

    `;


    body.appendChild(
        message
    );


    document
        .getElementById("goUpload")
        ?.addEventListener(
            "click",
            () => {

                window.location.href =
                    "upload.html";

            }
        );

}