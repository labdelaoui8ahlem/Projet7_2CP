const btn = document.getElementById("uploadBtn");
const spinner = document.getElementById("spinner");
const btnText = document.getElementById("btnText");
const uploadIcon = document.getElementById("uploadIcon");
const fileInput = document.getElementById("fileInput");

// Bloc success/erreur
const uploadSuccess = document.getElementById("uploadSuccess");
const uploadError = document.getElementById("uploadWentWrong");

// Tactique buttons
const tacticButtons = document.querySelectorAll(".tactic-btn");
const startAnalysisBtn = document.querySelector(".start-analysis-btn");

fileInput.type = "file";
fileInput.accept = ".txt";
fileInput.style.display = "none"; // Invisible

// Écouteurs d'événements pour gérer le clic sur le bouton
btn.addEventListener("click", () => {
  fileInput.click(); // Ouvre le sélecteur de fichier
});

fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (!file) return; // Si aucun fichier n'est sélectionné, on ne fait rien

  // Réinitialiser les visuels pour un nouvel upload
  btnText.textContent = "Uploading...";
  spinner.classList.remove("hidden");
  uploadIcon.style.display = "none";
  uploadSuccess.classList.add("hidden");
  uploadError.classList.add("hidden");

  // Simuler un "upload"
  setTimeout(() => {
    spinner.classList.add("hidden");
    uploadIcon.style.display = "inline";
    btnText.textContent = "Upload a file";

    // Vérifier la validité du fichier (type .txt et taille <= 1MB)
    if (file.type !== "text/plain" || file.size > 1024 * 1024) {
      uploadError.classList.remove("hidden");
    } else {
      localStorage.setItem("lastUploadedFileName", file.name);
      localStorage.setItem("lastUploadedFileSize", file.size);

      uploadSuccess.classList.remove("hidden");
      btn.classList.add("hidden");

      // Assure que rien ne bloque les clics sur le reste de la page
      document.getElementById("overlay").classList.add("hidden");
    }
  }, 1500);
});

// Lorsque l'utilisateur clique sur "Start Analysis"
startAnalysisBtn.addEventListener("click", () => {
  const selectedTactic = document.querySelector(".tactic-btn.selected");
  if (selectedTactic) {
    // Tu peux ici ajouter la logique pour utiliser la tactique choisie
    // Par exemple, passer la tactique à une autre page d'analyse
    localStorage.setItem("selectedTactic", selectedTactic.textContent);

    // Redirection vers une autre page d'analyse
    window.location.href = "result.html";  // Modifie ce lien selon ta page cible
  } else {
    alert("Please select a tactic before starting the analysis.");
  }
});

// Gérer la sélection d'une tactique
tacticButtons.forEach(button => {
  button.addEventListener("click", () => {
    // Désélectionner tous les boutons
    tacticButtons.forEach(btn => btn.classList.remove("selected"));

    // Sélectionner le bouton sur lequel l'utilisateur a cliqué
    button.classList.add("selected");
  });
});
