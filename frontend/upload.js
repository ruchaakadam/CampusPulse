// =========================================
// CAMPUSPULSE
// Upload Page JavaScript
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

const removeFile =
    document.getElementById("removeFile");

const validationMessage =
    document.getElementById(
        "validationMessage"
    );

const analyzeButton =
    document.getElementById(
        "analyzeButton"
    );

const analyzeText =
    document.getElementById(
        "analyzeText"
    );

const analyzeIcon =
    document.getElementById(
        "analyzeIcon"
    );

const templateButton =
    document.getElementById(
        "templateButton"
    );


// =========================================
// CONSTANTS
// =========================================

const MAX_FILE_SIZE =
    10 * 1024 * 1024;


// =========================================
// OPEN FILE SELECTOR
// =========================================

browseButton.addEventListener(
    "click",
    event => {

        event.stopPropagation();

        fileInput.click();

    }
);


dropZone.addEventListener(
    "click",
    event => {

        if (
            event.target === browseButton
        ) {
            return;
        }

        fileInput.click();

    }
);


// =========================================
// FILE SELECTED
// =========================================

fileInput.addEventListener(
    "change",
    () => {

        const file =
            fileInput.files[0];


        if (file) {

            processFile(file);

        }

    }
);


// =========================================
// DRAG OVER
// =========================================

dropZone.addEventListener(
    "dragover",
    event => {

        event.preventDefault();

        dropZone.classList.add(
            "drag-over"
        );

    }
);


// =========================================
// DRAG LEAVE
// =========================================

dropZone.addEventListener(
    "dragleave",
    () => {

        dropZone.classList.remove(
            "drag-over"
        );

    }
);


// =========================================
// DROP
// =========================================

dropZone.addEventListener(
    "drop",
    event => {

        event.preventDefault();

        dropZone.classList.remove(
            "drag-over"
        );


        const file =
            event.dataTransfer.files[0];


        if (file) {

            processFile(file);

        }

    }
);


// =========================================
// PROCESS FILE
// =========================================

function processFile(file) {

    clearValidation();


    // -----------------------------------------
    // FILE TYPE
    // -----------------------------------------

    const isCsv =
        file.name
            .toLowerCase()
            .endsWith(".csv");


    if (!isCsv) {

        showValidation(
            "Invalid file type. Please upload a CSV (.csv) file.",
            "error"
        );


        resetFile();

        return;

    }


    // -----------------------------------------
    // FILE SIZE
    // -----------------------------------------

    if (
        file.size >
        MAX_FILE_SIZE
    ) {

        showValidation(
            "File is too large. The maximum allowed size is 10 MB.",
            "error"
        );


        resetFile();

        return;

    }


    // -----------------------------------------
    // DISPLAY FILE
    // -----------------------------------------

    fileName.textContent =
        file.name;


    fileSize.textContent =
        formatFileSize(
            file.size
        );


    selectedFile.style.display =
        "flex";


    analyzeButton.disabled =
        false;


    showValidation(
        "File selected successfully. Ready for analysis.",
        "success"
    );


    console.log(
        "Selected file:",
        file.name
    );


    console.log(
        "File size:",
        formatFileSize(
            file.size
        )
    );

}


// =========================================
// REMOVE FILE
// =========================================

removeFile.addEventListener(
    "click",
    event => {

        event.stopPropagation();

        resetFile();

    }
);


function resetFile() {

    fileInput.value =
        "";


    selectedFile.style.display =
        "none";


    analyzeButton.disabled =
        true;


    setAnalyzeButtonNormal();


    clearValidation();

}


// =========================================
// VALIDATION MESSAGE
// =========================================

function showValidation(
    message,
    type
) {

    validationMessage.textContent =
        message;


    validationMessage.className =
        `validation-message ${type}`;


    validationMessage.style.display =
        "block";

}


function clearValidation() {

    validationMessage.textContent =
        "";


    validationMessage.className =
        "validation-message";


    validationMessage.style.display =
        "none";

}


// =========================================
// FILE SIZE
// =========================================

function formatFileSize(bytes) {

    if (bytes < 1024) {

        return `${bytes} Bytes`;

    }


    if (
        bytes <
        1024 * 1024
    ) {

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
    async () => {

        const file =
            fileInput.files[0];


        // -------------------------------------
        // CHECK FILE
        // -------------------------------------

        if (!file) {

            showValidation(
                "Please select a CSV file first.",
                "error"
            );

            return;

        }


        // -------------------------------------
        // LOADING STATE
        // -------------------------------------

        setAnalyzeButtonLoading();


        clearValidation();


        console.log(
            "================================="
        );


        console.log(
            "CampusPulse analysis started"
        );


        console.log(
            "File:",
            file.name
        );


        try {

            // -------------------------------
            // FORM DATA
            // -------------------------------

            const formData =
                new FormData();


            formData.append(
                "file",
                file
            );


            console.log(
                "Sending dataset to Flask..."
            );


            // -------------------------------
            // REQUEST
            // -------------------------------

            const response =
                await fetch(
                    "https://campuspulse-c80h.onrender.com/analyze",
                    {
                        method: "POST",
                        body: formData
                    }
                );


            console.log(
                "Backend status:",
                response.status
            );


            // -------------------------------
            // RESPONSE
            // -------------------------------

            let result;


            try {

                result =
                    await response.json();

            } catch (jsonError) {

                throw new Error(
                    "The backend returned an invalid response."
                );

            }


            console.log(
                "Backend result:",
                result
            );


            // -------------------------------
            // BACKEND ERROR
            // -------------------------------

            if (!response.ok) {

                throw new Error(
                    result.error ||
                    `Backend returned ${response.status}`
                );

            }


            // -------------------------------
            // SUCCESS
            // -------------------------------

            localStorage.setItem(
                "campusPulseAnalysis",
                JSON.stringify(result)
            );


            localStorage.setItem(
                "campusPulseFilename",
                file.name
            );


            console.log(
                "Analysis saved successfully."
            );


            showValidation(
                "Analysis completed successfully! Opening dashboard...",
                "success"
            );


            // -------------------------------
            // GO DASHBOARD
            // -------------------------------

            setTimeout(
                () => {

                    window.location.href =
                        "dashboard.html";

                },
                700
            );

        }


        catch (error) {

            console.error(
                "CAMPUSPULSE ANALYSIS ERROR:",
                error
            );


            let message =
                error.message;


            // ---------------------------------
            // CONNECTION ERROR
            // ---------------------------------

            if (
                error.name ===
                "TypeError" &&
                (
                    message.includes(
                        "fetch"
                    ) ||
                    message.includes(
                        "Failed"
                    )
                )
            ) {

                message =
                    "Could not connect to the CampusPulse backend. Make sure Flask is running on port 5000.";

            }


            showValidation(
                "Analysis failed: " +
                message,
                "error"
            );


            setAnalyzeButtonNormal();

        }

    }
);


// =========================================
// BUTTON STATES
// =========================================

function setAnalyzeButtonLoading() {

    analyzeButton.disabled =
        true;


    analyzeText.textContent =
        "Analyzing dataset";


    analyzeIcon.textContent =
        "⏳";

}


function setAnalyzeButtonNormal() {

    analyzeButton.disabled =
        !fileInput.files[0];


    analyzeText.textContent =
        "Analyze Dataset";


    analyzeIcon.textContent =
        "→";

}


// =========================================
// TEMPLATE BUTTON
// =========================================

templateButton.addEventListener(
    "click",
    () => {

        const requirements =
            document.querySelector(
                ".requirements-card"
            );


        if (!requirements) {
            return;
        }


        requirements.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    }
);


// =========================================
// INITIAL STATE
// =========================================

resetFile();


console.log(
    "CampusPulse upload page loaded."
);