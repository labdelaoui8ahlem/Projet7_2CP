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

    const fileNameElement = document.createElement("span");
    fileNameElement.classList.add("file-name");
    fileNameElement.textContent = filename;

    const fileSizeElement = document.createElement("span");
    fileSizeElement.classList.add("file-size");
    fileSizeElement.textContent = `${(size / 1024).toFixed(2)} KB`;

    item.appendChild(fileNameElement);
    item.appendChild(fileSizeElement);
    list.appendChild(item);

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

        const fileNameElement = document.createElement("span");
        fileNameElement.classList.add("file-name");
        fileNameElement.textContent = filename;

        const fileSizeElement = document.createElement("span");
        fileSizeElement.classList.add("file-size");
        fileSizeElement.textContent = `${(size / 1024).toFixed(2)} KB`;

        item.appendChild(fileNameElement);
        item.appendChild(fileSizeElement);
        list.appendChild(item);
      });
    }
  }

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

  // Resizing logic
  const originalMainMargin = "100px";
  const originalMainWidth = "calc(100% - 100px)";
  const originalFooterWidth = "calc(100% - 100px)";

  if (mainContent) {
    mainContent.style.transition = "all 0.3s ease";
    mainContent.style.marginLeft = originalMainMargin;
    mainContent.style.width = originalMainWidth;
  }

  if (footer) {
    footer.style.transition = "all 0.3s ease";
    footer.style.marginLeft = originalMainMargin;
    footer.style.width = originalFooterWidth;
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
      mainContent.style.marginLeft = originalMainMargin;
      mainContent.style.width = originalMainWidth;
      if (footer) {
        footer.style.marginLeft = originalMainMargin;
        footer.style.width = originalFooterWidth;
      }
    });
  }

  loadHistoryFromStorage();
  updateEmptyMessages();
});
