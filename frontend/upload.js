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
// FILE SELECTED
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


    // Display selected file

    fileName.textContent = file.name;

    fileSize.textContent = formatFileSize(file.size);

    selectedFile.style.display = "flex";

    analyzeButton.disabled = false;

    showValidation(
        "File selected successfully. Ready for analysis.",
        "success"
    );

}


// =========================================
// REMOVE FILE
// =========================================

removeFile.addEventListener("click", () => {

    resetFile();

});


function resetFile() {

    fileInput.value = "";

    selectedFile.style.display = "none";

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
// ANALYZE BUTTON
// =========================================

analyzeButton.addEventListener("click", () => {

    const file = fileInput.files[0];

    if (!file) {
        return;
    }

    window.location.href = "dashboard.html";

});