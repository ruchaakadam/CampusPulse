// =========================================
// CAMPUSPULSE
// Main JavaScript
// =========================================


// Upload button
const uploadButton = document.getElementById("uploadButton");
const fileInput = document.getElementById("fileInput");

uploadButton.addEventListener("click", () => {
    fileInput.click();
});


// When a file is selected
fileInput.addEventListener("change", () => {

    const file = fileInput.files[0];

    if (!file) {
        return;
    }

    if (!file.name.toLowerCase().endsWith(".csv")) {

        alert("Please upload a CSV file.");

        fileInput.value = "";

        return;
    }

    alert(`Selected file: ${file.name}`);

});


// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener("click", function (event) {

        const targetId = this.getAttribute("href");

        const target = document.querySelector(targetId);

        if (!target) {
            return;
        }

        event.preventDefault();

        target.scrollIntoView({
            behavior: "smooth"
        });

    });

});