// Get references to DOM elements FIRST
const btn = document.getElementById("uploadBtn");
const spinner = document.getElementById("spinner");
const btnText = document.getElementById("btnText");
const uploadIcon = document.getElementById("uploadIcon");
const fileInput = document.getElementById("fileInput");

// Success/Error blocks
const uploadSuccess = document.getElementById("uploadSuccess");
const uploadError = document.getElementById("uploadWentWrong");

// Tactic buttons
const tacticButtons = document.querySelectorAll(".tactic-btn");
const startAnalysisBtn = document.querySelector(".start-analysis-btn");

// Setup file input behavior
fileInput.type = "file";
fileInput.accept = ".txt";
fileInput.style.display = "none";

// Button click opens file chooser
btn.addEventListener("click", () => {
  fileInput.click();
});




fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (!file) return;

  // Reset all visuals first
  btnText.textContent = "Uploading...";
  spinner.classList.remove("hidden");
  uploadIcon.style.display = "none";
  uploadSuccess.classList.add("hidden");
  uploadError.classList.add("hidden");

  // Validate file size and type
  if (!file.name.endsWith(".txt") || file.size > 1024 * 1024) {
    console.log("Selected file size:", file.size);
    spinner.classList.add("hidden");
    uploadIcon.style.display = "inline";
    btnText.textContent = "Upload a file";
    uploadError.classList.remove("hidden");
    return;
  }

  // Prepare and send file to backend
  const formData = new FormData();
  formData.append("file", file);

  fetch("http://localhost:63342/api/Tool/check-syntax", {
    method: "POST",
    body: formData,
  })
      .then(response => response.json())
      .then(result => {
        spinner.classList.add("hidden");
        uploadIcon.style.display = "inline";
        btnText.textContent = "Upload a file";

        if (result.valid && result.fileId) {
          localStorage.setItem("lastUploadedFileName", file.name);
          localStorage.setItem("lastUploadedFileSize", file.size);
          localStorage.setItem("fileId", result.fileId);

          uploadSuccess.classList.remove("hidden");
          btn.classList.add("hidden");
          document.getElementById("overlay").classList.add("hidden");
        } else {
          uploadError.classList.remove("hidden");
        }
      })
      .catch(error => {
        console.error("Erreur lors de l'envoi du fichier :", error);
        spinner.classList.add("hidden");
        uploadIcon.style.display = "inline";
        btnText.textContent = "Upload a file";
        uploadError.classList.remove("hidden");
      });
});
