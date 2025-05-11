document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const sidebar = document.getElementById("sidebar");
  const closeBtn = document.getElementById("closeBtn");
  const searchInput = document.querySelector(".search-box input");
  const startAnalysisBtn = document.querySelector(".start-analysis-btn");
  const mainContent = document.getElementById("main-content");
  const footer = document.querySelector("footer");

  const categories = {
    performance: document.getElementById("performanceList"),
    security: document.getElementById("securityList"),
    availability: document.getElementById("availabilityList"),
  };

  document.getElementById("pingecho-btn")?.addEventListener("click", () => {
    localStorage.setItem("analysisType", "pingecho");
  });

  document.getElementById("multiplecopies-btn")?.addEventListener("click", () => {
    localStorage.setItem("analysisType", "multiplecopies");
  });

  document.getElementById("ID-btn")?.addEventListener("click", () => {
    localStorage.setItem("analysisType", "id");
  });

  function updateEmptyMessages() {
    Object.entries(categories).forEach(([cat, ul]) => {
      if (!ul) return;
      // Remove any existing empty-msg
      let msg = ul.querySelector('.empty-msg');
      if (msg) msg.remove();
      const hasItems = ul.querySelectorAll('li.history-item').length > 0;
      if (!hasItems) {
        msg = document.createElement('div');
        msg.className = 'empty-msg';
        msg.textContent = 'No previous analysis';
        msg.style.color = '#6c757d';
        msg.style.fontSize = '1rem';
        msg.style.margin = '8px 0 8px 0';
        ul.appendChild(msg);
      }
    });
  }

  function formatFileSize(size) {
    if (!size) return "Unknown size";
    const kb = size / 1024;
    return kb < 1024 ? `${kb.toFixed(2)} KB` : `${(kb / 1024).toFixed(2)} MB`;
  }

  function removeFromHistory(type, fileId) {
    let history = localStorage.getItem("analysisHistory");
    try {
      history = JSON.parse(history) || [];
    } catch (e) {
      history = [];
    }
    if (!Array.isArray(history)) {
      history = [];
    }
    history = history.filter(item => item.fileId !== fileId);
    localStorage.setItem("analysisHistory", JSON.stringify(history));
    // Remove from UI
    const list = categories[type];
    const item = list.querySelector(`[data-file-id="${fileId}"]`);
    if (item) item.remove();
    updateEmptyMessages();
  }

  function loadHistoryFromStorage() {
    let savedHistory = localStorage.getItem("analysisHistory");
    try {
      savedHistory = JSON.parse(savedHistory) || [];
    } catch (e) {
      savedHistory = [];
    }
    // If it's an object (old format), convert to array
    if (!Array.isArray(savedHistory)) {
      savedHistory = Object.values(savedHistory)
        .flat()
        .filter(item => item && item.fileId);
    }
    Object.values(categories).forEach((ul) => {
      if (ul) ul.innerHTML = '';
    });
    savedHistory.forEach(item => {
      addToSidebar(item.tactic, item.filename, item.size, item.fileId, item.analysisResults);
    });
    updateEmptyMessages();
  }

  function addToSidebar(type, filename, size, fileId, analysisResults) {
    let correctedType;
    const lowerType = type.toLowerCase();
    switch(lowerType) {
      case "pingecho":
      case "availability":
        correctedType = "availability";
        break;
      case "multiplecopies":
      case "performance":
        correctedType = "performance";
        break;
      case "id":
      case "security":
        correctedType = "security";
        break;
      default:
        console.error("Invalid tactic type:", type);
        return;
    }
    const list = categories[correctedType];
    if (!list) return;
    const existingItem = list.querySelector(`[data-file-id="${fileId}"]`);
    if (existingItem) existingItem.remove();
    const item = document.createElement("li");
    item.classList.add("history-item");
    item.setAttribute("data-file-id", fileId);
    item.style.cursor = "pointer";
    const fileInfo = document.createElement("div");
    fileInfo.style.display = "flex";
    fileInfo.style.justifyContent = "space-between";
    fileInfo.style.width = "100%";
    const contentDiv = document.createElement("div");
    contentDiv.style.cursor = "pointer";
    const nameDiv = document.createElement("div");
    nameDiv.textContent = filename;
    nameDiv.className = "sidebar-filename";
    const sizeDiv = document.createElement("div");
    sizeDiv.textContent = formatFileSize(size);
    sizeDiv.className = "sidebar-filesize";
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "×";
    removeBtn.className = "sidebar-remove-btn";
    removeBtn.title = "Remove from history";
    removeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      removeFromHistory(correctedType, fileId);
    });
    contentDiv.appendChild(nameDiv);
    contentDiv.appendChild(sizeDiv);
    fileInfo.appendChild(contentDiv);
    fileInfo.appendChild(removeBtn);
    item.appendChild(fileInfo);
    item.addEventListener("click", () => {
      localStorage.setItem("fileId", fileId);
      localStorage.setItem("lastUploadedFileName", filename);
      localStorage.setItem("lastUploadedFileSize", size);
      localStorage.setItem("analysisType", correctedType);
      localStorage.setItem("analysisResults", JSON.stringify(analysisResults));
      window.location.href = "/result.html";
    });
    list.insertBefore(item, list.firstChild);
    updateEmptyMessages();
  }

  if (startAnalysisBtn) {
    startAnalysisBtn.addEventListener("click", () => {
      const filename = localStorage.getItem("lastUploadedFileName");
      const size = parseInt(localStorage.getItem("lastUploadedFileSize"));
      const fileId = localStorage.getItem("fileId");
      const tactic = localStorage.getItem("analysisType");
      const content = localStorage.getItem("lastUploadedFileContent");

      console.log("Start analysis clicked with:", { filename, size, fileId, tactic, content });

      if (filename && size && fileId && tactic && content) {
        fetch('/api/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            content: content,
            tactic: tactic,
            fileId: fileId
          })
        })
            .then(response => response.json())
            .then(data => {
              localStorage.setItem("currentDetectionSummary", data.detectionSummary || "");
              console.log("Calling addToSidebar after analysis", { tactic, filename, size, fileId, content });
              addToSidebar(tactic, filename, size, fileId, data.analysisResults);
            })
            .catch(error => {
              console.error('Error:', error);
              alert('Error processing file. Please try again.');
            });
      } else {
        console.warn("Missing data for analysis, not calling addToSidebar");
      }
    });
  }

  if (menuToggle && sidebar && mainContent) {
    menuToggle.addEventListener("click", () => {
      sidebar.classList.add("active");
      mainContent.style.marginLeft = "250px";
      mainContent.style.width = "calc(100% - 250px)";
      if (footer) {
        footer.style.marginLeft = "250px";
        footer.style.width = "calc(100% - 250px)";
      }
    });
  }

  if (closeBtn && sidebar && mainContent) {
    closeBtn.addEventListener("click", () => {
      sidebar.classList.remove("active");
      mainContent.style.marginLeft = "100px";
      mainContent.style.width = "calc(100% - 100px)";
      if (footer) {
        footer.style.marginLeft = "100px";
        footer.style.width = "calc(100% - 100px)";
      }
    });
  }

  loadHistoryFromStorage();
  updateEmptyMessages();
});