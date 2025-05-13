const btn = document.getElementById("uploadBtn");
const spinner = document.getElementById("spinner");
const btnText = document.getElementById("btnText");
const uploadIcon = document.getElementById("uploadIcon");
const fileInput = document.getElementById("fileInput");

// Bloc success/erreur
const uploadSuccess = document.getElementById("uploadSuccess");
const uploadWentWrong = document.getElementById("uploadWentWrong");
const uploadSyntaxError = document.getElementById("uploadSyntaxError");

// Tactique buttons
const tacticButtons = document.querySelectorAll(".tactic-btn");
const startAnalysisBtn = document.querySelector(".start-analysis-btn");

fileInput.type = "file";
fileInput.accept = ".txt";
fileInput.style.display = "none";

// Gestion du clic sur le bouton Upload
btn.addEventListener("click", () => {
  fileInput.click();
});

fileInput.addEventListener("change", async () => {
  const file = fileInput.files[0];
  if (!file) return;

  // Reset UI
  if (btnText) btnText.textContent = "Uploading...";
  if (spinner) spinner.classList.remove("hidden");
  if (uploadIcon) uploadIcon.style.display = "none";
  if (uploadSuccess) uploadSuccess.classList.add("hidden");
  if (uploadWentWrong) uploadWentWrong.classList.add("hidden");
  if (uploadSyntaxError) uploadSyntaxError.classList.add("hidden");

  // Vérifie la taille et le type
  if (file.type !== "text/plain" || file.size > 1024 * 1024) {
    setTimeout(() => {
      spinner.classList.add("hidden");
      uploadIcon.style.display = "inline";
      btnText.textContent = "Upload a file";
    }, 1000);
    return;
  }

  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("http://localhost:8080/api/Tool/check-syntax", {
      method: "POST",
      body: formData
    });

    const result = await response.json();

    if (result.valid) {
      // Fichier accepté par le backend
      localStorage.setItem("fileId", result.fileId);
      localStorage.setItem("lastUploadedFileName", file.name);
      localStorage.setItem("lastUploadedFileSize", file.size);

      // Mise à jour de l'interface
      if (spinner) spinner.classList.add("hidden");
      if (uploadIcon) uploadIcon.style.display = "inline";
      if (btnText) btnText.textContent = "Upload a file";
      if (uploadSuccess) uploadSuccess.classList.remove("hidden");
      if (btn) btn.classList.add("hidden");
      const overlay = document.getElementById("overlay");
      if (overlay) overlay.classList.add("hidden");

    } else {
      throw new Error("Invalid syntax");
    }
  } catch (error) {
    console.error("Erreur lors de l'envoi :", error);
    spinner.classList.add("hidden");
    uploadIcon.style.display = "inline";
    btnText.textContent = "Upload a file";

    if (error.message === "Invalid syntax") {
      document.getElementById("uploadSyntaxError").classList.remove("hidden");
    } else {
      if (uploadWentWrong) uploadWentWrong.classList.remove("hidden");
    }
  }
});

// Sélection tactique (on click)
tacticButtons.forEach(button => {
  button.addEventListener("click", () => {
    tacticButtons.forEach(btn => btn.classList.remove("selected"));
    button.classList.add("selected");
  });
});

// Lancement de l'analyse
startAnalysisBtn.addEventListener("click", async () => {
  uploadSuccess.classList.add("hidden");
  uploadSyntaxError.classList.add("hidden");
  uploadWentWrong.classList.add("hidden");
  document.getElementById("uploadSyntaxError").classList.add("hidden");
  document.getElementById("uploadWentWrong").classList.add("hidden");

  const selectedTacticBtn = document.querySelector(".tactic-btn.selected");
  if (!selectedTacticBtn) {
    alert("Please select a tactic before starting the analysis.");
    return;
  }

  const tacticText = selectedTacticBtn.textContent.toLowerCase();
  let tactic = "performance"; // default fallback
  if (tacticText.includes("maintain data")) tactic = "security";
  else if (tacticText.includes("pingecho")) tactic = "availability";
  else tactic = "performance";

  const fileId = localStorage.getItem("fileId");

  if (!fileId) {
    alert("No valid file found. Please upload a file first.");
    return;
  }

  try {
    const formData = new FormData();
    formData.append("fileId", fileId);
    formData.append("choice", tactic);
    const response = await fetch("http://localhost:8080/api/Tool/process", {
      method: "POST",
      body: formData
    });

    const result = await response.json();
    console.log(result);

    localStorage.setItem("analysisResults", JSON.stringify(result));
    localStorage.setItem("analysisType", tactic);

    // Update analysisHistory as an array of analyzed file objects
    const historyRaw = localStorage.getItem("analysisHistory");
    let history = [];
    try {
      history = JSON.parse(historyRaw) || [];
    } catch (e) {
      history = [];
    }
    if (!Array.isArray(history)) {
      history = [];
    }
    const newEntry = {
      fileId: localStorage.getItem("fileId"),
      filename: localStorage.getItem("lastUploadedFileName"),
      size: localStorage.getItem("lastUploadedFileSize"),
      tactic: localStorage.getItem("analysisType"),
      analysisResults: result
    };
    // Remove any previous entry with the same fileId
    history = history.filter(item => item.fileId !== newEntry.fileId);
    history.unshift(newEntry);
    localStorage.setItem("analysisHistory", JSON.stringify(history.slice(0, 10)));

    window.location.href = "/result.html";
  } catch (err) {
    console.error("Erreur durant l'analyse :", err);
    alert("Error occurred during analysis. Please try again.");
  }
});

// 🟨 Select first tactic by default on reload
document.addEventListener("DOMContentLoaded", () => {
  const alreadySelected = document.querySelector(".tactic-btn.selected");
  if (!alreadySelected && tacticButtons.length > 0) {
    tacticButtons[0].classList.add("selected");
  }
});
