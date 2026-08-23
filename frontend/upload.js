// =========================================
// CAMPUSPULSE
// Upload Page JavaScript
// Supports CSV + XLSX
// =========================================


// =========================================
// ELEMENTS
// =========================================

const dropZone =
    document.getElementById("dropZone");

const browseButton =
    document.getElementById("browseButton");

const fileInput =
    document.getElementById("fileInput");

const selectedFile =
    document.getElementById("selectedFile");

const fileName =
    document.getElementById("fileName");

const fileSize =
    document.getElementById("fileSize");

const fileTypeIcon =
    document.getElementById("fileTypeIcon");

const removeFile =
    document.getElementById("removeFile");

const validationMessage =
    document.getElementById("validationMessage");

const analyzeButton =
    document.getElementById("analyzeButton");


// =========================================
// CONSTANTS
// =========================================

const MAX_FILE_SIZE =
    10 * 1024 * 1024; // 10 MB


const BACKEND_URL =
    "http://127.0.0.1:5000";


// =========================================
// CHECK ELEMENTS
// =========================================

console.log("CampusPulse upload.js loaded.");

console.log("dropZone:", dropZone);
console.log("browseButton:", browseButton);
console.log("fileInput:", fileInput);
console.log("analyzeButton:", analyzeButton);


// =========================================
// INITIAL STATE
// =========================================

if (analyzeButton) {
    analyzeButton.disabled = true;
}

if (selectedFile) {
    selectedFile.style.display = "none";
}


// =========================================
// BROWSE BUTTON
// =========================================

browseButton.addEventListener("click", function (event) {

    event.preventDefault();

    event.stopPropagation();

    console.log("Browse Files clicked.");

    fileInput.click();

});


// =========================================
// DROP ZONE CLICK
// =========================================

dropZone.addEventListener("click", function (event) {

    // Don't trigger twice when Browse Files is clicked

    if (event.target === browseButton) {
        return;
    }

    console.log("Drop zone clicked.");

    fileInput.click();

});


// =========================================
// FILE INPUT CHANGE
// =========================================

fileInput.addEventListener("change", function () {

    console.log("File input changed.");

    const file =
        fileInput.files[0];

    if (!file) {
        return;
    }

    console.log(
        "Selected file:",
        file.name
    );

    processFile(file);

});


// =========================================
// DRAG OVER
// =========================================

dropZone.addEventListener(
    "dragover",
    function (event) {

        event.preventDefault();

        dropZone.classList.add("drag-over");

    }
);


// =========================================
// DRAG LEAVE
// =========================================

dropZone.addEventListener(
    "dragleave",
    function () {

        dropZone.classList.remove("drag-over");

    }
);


// =========================================
// DROP
// =========================================

dropZone.addEventListener(
    "drop",
    function (event) {

        event.preventDefault();

        dropZone.classList.remove("drag-over");


        const file =
            event.dataTransfer.files[0];


        if (!file) {
            return;
        }


        console.log(
            "Dropped file:",
            file.name
        );


        // Put dropped file into file input

        try {

            const dataTransfer =
                new DataTransfer();

            dataTransfer.items.add(file);

            fileInput.files =
                dataTransfer.files;

        }

        catch (error) {

            console.warn(
                "Could not update file input:",
                error
            );

        }


        processFile(file);

    }
);


// =========================================
// PROCESS FILE
// =========================================

function processFile(file) {

    clearValidation();


    // -----------------------------------------
    // FILE EXTENSION
    // -----------------------------------------

    const fileNameLower =
        file.name.toLowerCase();


    const isCSV =
        fileNameLower.endsWith(".csv");


    const isXLSX =
        fileNameLower.endsWith(".xlsx");


    // -----------------------------------------
    // CHECK FILE TYPE
    // -----------------------------------------

    if (!isCSV && !isXLSX) {

        showValidation(
            "Invalid file type. Please upload a CSV or XLSX file.",
            "error"
        );

        resetFile();

        return;

    }


    // -----------------------------------------
    // CHECK FILE SIZE
    // -----------------------------------------

    if (file.size > MAX_FILE_SIZE) {

        showValidation(
            "File is too large. Maximum allowed size is 10 MB.",
            "error"
        );

        resetFile();

        return;

    }


    // -----------------------------------------
    // DISPLAY FILE NAME
    // -----------------------------------------

    fileName.textContent =
        file.name;


    // -----------------------------------------
    // DISPLAY FILE SIZE
    // -----------------------------------------

    fileSize.textContent =
        formatFileSize(file.size);


    // -----------------------------------------
    // DISPLAY FILE TYPE
    // -----------------------------------------

    if (isCSV) {

        fileTypeIcon.textContent =
            "CSV";

    }

    else if (isXLSX) {

        fileTypeIcon.textContent =
            "XLSX";

    }


    // -----------------------------------------
    // SHOW SELECTED FILE
    // -----------------------------------------

    selectedFile.style.display =
        "flex";


    // -----------------------------------------
    // ENABLE ANALYZE
    // -----------------------------------------

    analyzeButton.disabled =
        false;


    // -----------------------------------------
    // SUCCESS MESSAGE
    // -----------------------------------------

    showValidation(
        "File selected successfully. Ready for analysis.",
        "success"
    );


    console.log(
        "File processed successfully:",
        file.name
    );

}


// =========================================
// REMOVE FILE
// =========================================

removeFile.addEventListener(
    "click",
    function (event) {

        event.preventDefault();

        event.stopPropagation();

        resetFile();

    }
);


// =========================================
// RESET FILE
// =========================================

function resetFile() {

    fileInput.value =
        "";


    selectedFile.style.display =
        "none";


    fileName.textContent =
        "";


    fileSize.textContent =
        "";


    fileTypeIcon.textContent =
        "FILE";


    analyzeButton.disabled =
        true;


    analyzeButton.innerHTML =
        'Analyze Dataset <span>→</span>';


    clearValidation();

}


// =========================================
// SHOW VALIDATION
// =========================================

function showValidation(
    message,
    type
) {

    validationMessage.textContent =
        message;


    validationMessage.className =
        "validation-message " + type;


    validationMessage.style.display =
        "block";

}


// =========================================
// CLEAR VALIDATION
// =========================================

function clearValidation() {

    validationMessage.textContent =
        "";


    validationMessage.className =
        "validation-message";


    validationMessage.style.display =
        "none";

}


// =========================================
// FORMAT FILE SIZE
// =========================================

function formatFileSize(bytes) {

    if (bytes < 1024) {

        return `${bytes} Bytes`;

    }


    if (bytes < 1024 * 1024) {

        return `${(
            bytes / 1024
        ).toFixed(1)} KB`;

    }


    return `${(
        bytes /
        (1024 * 1024)
    ).toFixed(2)} MB`;

}


// =========================================
// ANALYZE DATASET
// =========================================

analyzeButton.addEventListener(
    "click",
    async function () {

        const file =
            fileInput.files[0];


        // -----------------------------------------
        // CHECK FILE
        // -----------------------------------------

        if (!file) {

            showValidation(
                "Please select a CSV or XLSX file first.",
                "error"
            );

            return;

        }


        console.log(
            "================================="
        );

        console.log(
            "ANALYZE BUTTON CLICKED"
        );

        console.log(
            "File:",
            file.name
        );

        console.log(
            "Size:",
            file.size
        );


        // -----------------------------------------
        // DISABLE BUTTON
        // -----------------------------------------

        analyzeButton.disabled =
            true;


        analyzeButton.innerHTML =
            'Analyzing... <span>⏳</span>';


        try {

            // -----------------------------------------
            // CREATE FORM DATA
            // -----------------------------------------

            const formData =
                new FormData();


            formData.append(
                "file",
                file,
                file.name
            );


            console.log(
                "Sending file to Flask..."
            );


            // -----------------------------------------
            // SEND FILE TO FLASK
            // -----------------------------------------

            const response =
                await fetch(
                    `${BACKEND_URL}/analyze`,
                    {
                        method: "POST",
                        body: formData
                    }
                );


            console.log(
                "Backend response status:",
                response.status
            );


            // -----------------------------------------
            // READ JSON
            // -----------------------------------------

            const result =
                await response.json();


            console.log(
                "Backend response:",
                result
            );


            // -----------------------------------------
            // CHECK RESPONSE
            // -----------------------------------------

            if (!response.ok) {

                throw new Error(
                    result.error ||
                    `Backend returned ${response.status}`
                );

            }


            // -----------------------------------------
            // SAVE ANALYSIS
            // -----------------------------------------

            localStorage.setItem(
                "campusPulseAnalysis",
                JSON.stringify(result)
            );


            console.log(
                "Analysis saved successfully."
            );


            // -----------------------------------------
            // SUCCESS
            // -----------------------------------------

            showValidation(
                "Analysis completed successfully!",
                "success"
            );


            // -----------------------------------------
            // DASHBOARD
            // -----------------------------------------

            setTimeout(
                function () {

                    window.location.href =
                        "dashboard.html";

                },
                500
            );

        }


        catch (error) {

            console.error(
                "ANALYSIS ERROR:",
                error
            );


            showValidation(
                "Analysis failed: " +
                error.message,
                "error"
            );


            analyzeButton.disabled =
                false;


            analyzeButton.innerHTML =
                'Analyze Dataset <span>→</span>';

        }

    }
);
