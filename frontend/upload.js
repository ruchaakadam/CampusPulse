// =========================================
// CAMPUSPULSE
// Upload Page JavaScript
// =========================================

const dropZone = document.getElementById("dropZone");
const browseButton = document.getElementById("browseButton");
const fileInput = document.getElementById("fileInput");

const selectedFile = document.getElementById("selectedFile");
const fileName = document.getElementById("fileName");
const fileSize = document.getElementById("fileSize");

const removeFile = document.getElementById("removeFile");

const validationMessage =
    document.getElementById("validationMessage");

const analyzeButton =
    document.getElementById("analyzeButton");


// =========================================
// CONSTANTS
// =========================================

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB


// =========================================
// IMPORTANT
// Store the actual selected file here
// =========================================

let currentFile = null;


// =========================================
// OPEN FILE SELECTOR
// =========================================

browseButton.addEventListener("click", (event) => {

    event.stopPropagation();

    fileInput.click();

});


// Allow clicking the drop zone
dropZone.addEventListener("click", () => {

    fileInput.click();

});


// =========================================
// FILE SELECTED USING BROWSE
// =========================================

fileInput.addEventListener("change", () => {

    const file = fileInput.files[0];

    if (file) {
        processFile(file);
    }

});


// =========================================
// DRAG & DROP
// =========================================

dropZone.addEventListener("dragover", (event) => {

    event.preventDefault();

    dropZone.classList.add("drag-over");

});


dropZone.addEventListener("dragleave", () => {

    dropZone.classList.remove("drag-over");

});


dropZone.addEventListener("drop", (event) => {

    event.preventDefault();

    dropZone.classList.remove("drag-over");

    const file = event.dataTransfer.files[0];

    if (file) {
        processFile(file);
    }

});


// =========================================
// PROCESS FILE
// =========================================

function processFile(file) {

    clearValidation();


    // Check file type
    if (!file.name.toLowerCase().endsWith(".csv")) {

        showValidation(
            "Please upload a CSV file.",
            "error"
        );

        resetFile();

        return;
    }


    // Check file size
    if (file.size > MAX_FILE_SIZE) {

        showValidation(
            "File is too large. Maximum allowed size is 10 MB.",
            "error"
        );

        resetFile();

        return;
    }


    // =========================================
    // SAVE THE ACTUAL FILE
    // =========================================

    currentFile = file;


    // =========================================
    // DISPLAY SELECTED FILE
    // =========================================

    fileName.textContent = file.name;

    fileSize.textContent = formatFileSize(file.size);

    selectedFile.style.display = "flex";

    analyzeButton.disabled = false;


    showValidation(
        "File selected successfully. Ready for analysis.",
        "success"
    );


    console.log("File stored successfully:", currentFile.name);
    console.log("File size:", currentFile.size);

}


// =========================================
// REMOVE FILE
// =========================================

removeFile.addEventListener("click", () => {

    resetFile();

});


function resetFile() {

    // Remove actual file
    currentFile = null;

    // Clear input
    fileInput.value = "";

    // Hide file card
    selectedFile.style.display = "none";

    // Disable analyze button
    analyzeButton.disabled = true;

    clearValidation();

}


// =========================================
// VALIDATION MESSAGE
// =========================================

function showValidation(message, type) {

    validationMessage.textContent = message;

    validationMessage.className =
        `validation-message ${type}`;

    validationMessage.style.display = "block";

}


function clearValidation() {

    validationMessage.textContent = "";

    validationMessage.className =
        "validation-message";

    validationMessage.style.display = "none";

}


// =========================================
// FILE SIZE
// =========================================

function formatFileSize(bytes) {

    if (bytes < 1024) {

        return `${bytes} Bytes`;

    }

    if (bytes < 1024 * 1024) {

        return `${(bytes / 1024).toFixed(1)} KB`;

    }

    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;

}


// =========================================
// ANALYZE DATASET
// =========================================

analyzeButton.addEventListener("click", async () => {


    // =========================================
    // USE currentFile INSTEAD OF fileInput.files
    // =========================================

    if (!currentFile) {

        showValidation(
            "Please select a CSV file first.",
            "error"
        );

        return;
    }


    console.log("=================================");
    console.log("Analyze button clicked");
    console.log("File:", currentFile.name);
    console.log("Size:", currentFile.size);
    console.log("Type:", currentFile.type);
    console.log("=================================");


    // Disable button while processing
    analyzeButton.disabled = true;

    analyzeButton.innerHTML =
        "Analyzing... <span>⏳</span>";


    try {


        // =========================================
        // CREATE FORM DATA
        // =========================================

        const formData = new FormData();

        formData.append("file", currentFile);


        console.log("Sending file to Flask...");


        // =========================================
        // SEND TO FLASK
        // =========================================

        const response = await fetch(
            "http://127.0.0.1:5000/analyze",
            {
                method: "POST",
                body: formData
            }
        );


        console.log(
            "Backend response status:",
            response.status
        );


        const result = await response.json();


        console.log(
            "Backend response:",
            result
        );


        // =========================================
        // CHECK RESPONSE
        // =========================================

        if (!response.ok) {

            throw new Error(
                result.error ||
                `Backend returned ${response.status}`
            );

        }


        // =========================================
        // SAVE RESULT
        // =========================================

        localStorage.setItem(
            "campusPulseAnalysis",
            JSON.stringify(result)
        );


        showValidation(
            "Analysis completed successfully!",
            "success"
        );


        // =========================================
        // GO TO DASHBOARD
        // =========================================

        setTimeout(() => {

            window.location.href =
                "dashboard.html";

        }, 500);


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


        analyzeButton.disabled = false;


        analyzeButton.innerHTML =
            'Analyze Dataset <span>→</span>';

    }

});