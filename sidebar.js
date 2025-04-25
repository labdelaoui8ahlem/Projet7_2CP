document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const sidebar = document.getElementById("sidebar");
  const closeBtn = document.getElementById("closeBtn");
  const searchInput = document.querySelector(".search-box input");
  const startAnalysisBtn = document.querySelector(".start-analysis-btn");

  const categories = {
    performance: document.getElementById("performanceList"),
    security: document.getElementById("securityList"),
    availability: document.getElementById("availabilityList"),
  };

  function updateEmptyMessages() {
    Object.values(categories).forEach((ul) => {
      const hasItems = ul.querySelectorAll("li.history-item").length > 0;
      const msg = ul.querySelector(".empty-msg");
      if (msg) msg.style.display = hasItems ? "none" : "block";
    });
  }

  function addFileToHistory(type, filename, size) {
    const list = categories[type];
    const emptyMsg = list.querySelector(".empty-msg");
    if (emptyMsg) emptyMsg.remove();
  
    const item = document.createElement("li");
    item.classList.add("history-item");
  
    // Création des éléments pour le nom du fichier et la taille
    const fileNameElement = document.createElement("span");
    fileNameElement.classList.add("file-name");
    fileNameElement.textContent = filename;
  
    const fileSizeElement = document.createElement("span");
    fileSizeElement.classList.add("file-size");
    fileSizeElement.textContent = `${(size / 1024).toFixed(2)} KB`;
  
    // Ajout des éléments dans l'item
    item.appendChild(fileNameElement);
    item.appendChild(fileSizeElement);
  
    // Ajout de l'élément dans la liste
    list.appendChild(item);
  
    // Sauvegarde dans le localStorage
    const savedHistory = JSON.parse(localStorage.getItem("analysisHistory") || "{}");
    if (!savedHistory[type]) savedHistory[type] = [];
    savedHistory[type].push({ filename, size });
    localStorage.setItem("analysisHistory", JSON.stringify(savedHistory));
  }
  
  function loadHistoryFromStorage() {
    const savedHistory = JSON.parse(localStorage.getItem("analysisHistory") || "{}");
  
    for (const type in savedHistory) {
      const list = categories[type];
      const emptyMsg = list.querySelector(".empty-msg");
      if (emptyMsg) emptyMsg.remove();
  
      savedHistory[type].forEach(({ filename, size }) => {
        const item = document.createElement("li");
        item.classList.add("history-item");
  
        // Création des éléments pour le nom du fichier et la taille
        const fileNameElement = document.createElement("span");
        fileNameElement.classList.add("file-name");
        fileNameElement.textContent = filename;
  
        const fileSizeElement = document.createElement("span");
        fileSizeElement.classList.add("file-size");
        fileSizeElement.textContent = `${(size / 1024).toFixed(2)} KB`;
  
        // Ajout des éléments dans l'item
        item.appendChild(fileNameElement);
        item.appendChild(fileSizeElement);
  
        // Ajout de l'élément dans la liste
        list.appendChild(item);
      });
    }
  }
  

  // Event listeners (avec vérif de nullité)
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const filter = searchInput.value.toLowerCase();
      Object.values(categories).forEach((ul) => {
        ul.querySelectorAll(".history-item").forEach((item) => {
          const text = item.textContent.toLowerCase();
          item.style.display = text.includes(filter) ? "block" : "none";
        });
      });
    });
  }

  if (startAnalysisBtn) {
    startAnalysisBtn.addEventListener("click", () => {
      const filename = localStorage.getItem("lastUploadedFileName");
      const size = localStorage.getItem("lastUploadedFileSize");

      if (filename && size) {
        addFileToHistory("performance", filename, size);
        updateEmptyMessages();
      }
    });
  }

  if (menuToggle && sidebar) {
    menuToggle.addEventListener("click", () => {
      sidebar.classList.add("active");
    });
  }

  if (closeBtn && sidebar) {
    closeBtn.addEventListener("click", () => {
      sidebar.classList.remove("active");
    });
  }

  loadHistoryFromStorage();
  updateEmptyMessages();
});
