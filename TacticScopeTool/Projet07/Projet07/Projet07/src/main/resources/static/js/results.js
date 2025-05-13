const tacticsMeta = {
  "availability": {
    goal: "Ensure availability by detecting failure through 'ping' from one component to another.",
    impacts: [
      "Enhanced Monitoring and Diagnostics",
      "Faster Recovery",
      "Improved Availability"
    ]
  },
  "performance": {
    goal: "Increase availability and integrity by maintaining multiple copies of critical data.",
    impacts: [
      "Redundancy Assurance",
      "Reduced Data Loss Risk",
      "Better Fault Tolerance"
    ]
  },
  "security": {
    goal: "Ensure data confidentiality by securing access using identification and authentication mechanisms.",
    impacts: [
      "Improved Access Control",
      "Protection Against Unauthorized Access",
      "Enhanced Confidentiality"
    ]
  }
};

// Load result from localStorage
const resultData = {
  occurrences: JSON.parse(localStorage.getItem("analysisResults")),
  selectedTactic: localStorage.getItem("analysisType")
};

if (!resultData.occurrences || !resultData.selectedTactic) {
  alert("No result data found. Please run an analysis first.");
  window.location.href = "Tool.html";
}

const tacticName = resultData.selectedTactic;
const tacticMeta = tacticsMeta[tacticName];

if (!tacticMeta) {
  alert("Selected tactic metadata not found.");
  window.location.href = "Tool.html";
}

// Inject basic tactic data
document.getElementById("tactic-name").textContent = tacticName;
document.getElementById("tactic-goal").textContent = tacticMeta.goal;
document.getElementById("occurrence-count").textContent = resultData.occurrences.length;

// Render occurrence strings with proper formatting
const occurrenceList = document.getElementById("occurrence-list");
occurrenceList.innerHTML = "";

resultData.occurrences.forEach((occText, index) => {
  const div = document.createElement("div");
  div.className = "occurrence";

  // Convert \n to <br> for HTML formatting
  const formatted = occText.replace(/\n/g, "<br>");

  div.innerHTML = `<h3>${ordinalSuffix(index + 1)} Occurrence</h3><p>${formatted}</p>`;
  occurrenceList.appendChild(div);
});

// Render impacts
const impactList = document.getElementById("impact-list");
impactList.innerHTML = "";
tacticMeta.impacts.forEach(impact => {
  const li = document.createElement("li");
  li.textContent = impact;
  impactList.appendChild(li);
});

// Ordinal suffix helper
function ordinalSuffix(i) {
  const j = i % 10, k = i % 100;
  if (j == 1 && k != 11) return i + "st";
  if (j == 2 && k != 12) return i + "nd";
  if (j == 3 && k != 13) return i + "rd";
  return i + "th";
}

// Handle "Get New Analysis" button
document.addEventListener("DOMContentLoaded", () => {
  const getAnalysisBtn = document.querySelector(".get-analysis-btn");
  if (getAnalysisBtn) {
    getAnalysisBtn.addEventListener("click", () => {
      window.location.href = "Tool.html";
    });
  }
});

// Export functionality
function exportReport() {
  const tacticName = document.getElementById('tactic-name').innerText.trim();
  const tacticGoal = document.getElementById('tactic-goal').innerText.trim();
  const occurrenceCount = document.getElementById('occurrence-count').innerText.trim();

  // Load from the same dynamic source used in rendering
  const rawOccurrences = JSON.parse(localStorage.getItem("analysisResults"));
  const exportType = document.getElementById('export-type').value;

  const reportData = {
    "Tactic Overview": {
      "Tactic Name": tacticName,
      "Goal": tacticGoal
    },
    "Detection Summary": {
      "Frequency": occurrenceCount,
      "Occurrences": rawOccurrences
    }
  };

  let fileContent = '';
  let fileName = '';

  if (exportType === 'json') {
    fileContent = JSON.stringify(reportData, null, 2);
    fileName = "report.json";
  } else if (exportType === 'txt') {
    fileContent += `Tactic Overview\n`;
    fileContent += `Tactic Name: ${tacticName}\n`;
    fileContent += `Goal: ${tacticGoal}\n\n`;
    fileContent += `Detection Summary\n`;
    fileContent += `Frequency: ${occurrenceCount} Times\n\n`;

    rawOccurrences.forEach((occurrence, index) => {
      fileContent += `Occurrence ${index + 1}:\n${occurrence}\n\n`;
    });

    fileName = "report.txt";
  }

  const blob = new Blob([fileContent], { type: exportType === 'json' ? 'application/json' : 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}

document.querySelector('.export-btn').addEventListener('click', exportReport);
