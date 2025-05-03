const resultData = {
  selectedTactic: "PingEcho",
  occurrences: [
    {
      pingSender: "Object1",
      pingReceiver: "Object2",
      faultyComponent: "Object1",
      startingLine: 10,
      calls: [
        "CALLER: o[1], METHOD: ping(), CALLEE: o[2]",
        "CALLER: o[2], METHOD: pong(), CALLEE: o[3]"
      ]
    },
    {
      pingSender: "Sensor",
      pingReceiver: "Gateway",
      faultyComponent: "Sensor",
      startingLine: 5,
      calls: [
        "CALLER: o[2], METHOD: send(), CALLEE: o[5]"
      ]
    }
  ]
};

const tacticsMeta = {
  "PingEcho": {
    goal: "Ensure availability by detecting failure through'ping' from one component to another.",
    impacts: [
      "Enhanced Monitoring and Diagnostics",
      "Faster Recovery",
      "Improved Availability"
    ],
    roles: {
      pingSender: "Ping Sender",
      pingReceiver: "Ping Receiver",
      faultyComponent: "Faulty Component"
    }
  },
  "Maintain Multiple Copies": {
    goal: "Increase availability and integrity by maintaining multiple copies of critical data.",
    impacts: [
      "Redundancy Assurance",
      "Reduced Data Loss Risk",
      "Better Fault Tolerance"
    ],
    roles: {
      primaryCopy: "Primary Copy",
      replica: "Replica",
      syncManager: "Synchronization Manager"
    }
  },
  "ID/Password Confidentiality": {
    goal: "Ensure data confidentiality by securing access using identification and authentication mechanisms.",
    impacts: [
      "Improved Access Control",
      "Protection Against Unauthorized Access",
      "Enhanced Confidentiality"
    ],
    roles: {
      idProvider: "ID Provider",
      passwordValidator: "Password Validator"
    }
  }
};

// Inject data into the DOM
const tacticName = resultData.selectedTactic;
const tacticMeta = tacticsMeta[tacticName];

document.getElementById("tactic-name").textContent = tacticName;
document.getElementById("tactic-goal").textContent = tacticMeta.goal;
document.getElementById("occurrence-count").textContent = resultData.occurrences.length;

const occurrenceList = document.getElementById("occurrence-list");
occurrenceList.innerHTML = "";

resultData.occurrences.forEach((occ, index) => {
  const occDiv = document.createElement("div");
  occDiv.className = "occurrence";

  // Générer dynamiquement les rôles pour cette tactique
  let roleHtml = "";
  for (const roleKey in tacticMeta.roles) {
    const roleLabel = tacticMeta.roles[roleKey];
    const roleValue = occ[roleKey] ?? "(N/A)";
    roleHtml += `<p><strong>${roleLabel}:</strong> ${roleValue}</p>`;
  }

  occDiv.innerHTML = `
    <h3>${ordinalSuffix(index + 1)} Occurrence</h3>
    ${roleHtml}
    <p><strong>Starting Line:</strong> ${occ.startingLine}</p>
    <pre>${occ.calls.join("\n")}</pre>
  `;

  occurrenceList.appendChild(occDiv);
});

const impactList = document.getElementById("impact-list");
impactList.innerHTML = "";
tacticMeta.impacts.forEach(impact => {
  const li = document.createElement("li");
  li.textContent = impact;
  impactList.appendChild(li);
});

function ordinalSuffix(i) {
  const j = i % 10, k = i % 100;
  if (j == 1 && k != 11) return i + "st";
  if (j == 2 && k != 12) return i + "nd";
  if (j == 3 && k != 13) return i + "rd";
  return i + "th";
}

// Rediriger vers une autre page lorsque le bouton "Get New Analysis" est cliqué
document.addEventListener("DOMContentLoaded", () => {
  const getAnalysisBtn = document.querySelector(".get-analysis-btn");
  if (getAnalysisBtn) {
    getAnalysisBtn.addEventListener("click", () => {
      window.location.href = "Tool.html"; // Change ce nom selon ta nouvelle page
    });
  }
});

// Fonction pour exporter les données sous forme de fichier
function exportReport() {
  const tacticName = document.getElementById('tactic-name').innerText.trim();
  const tacticGoal = document.getElementById('tactic-goal').innerText.trim();
  const occurrenceCount = document.getElementById('occurrence-count').innerText.trim();
  
  const occurrenceElements = document.querySelectorAll('#occurrence-list .occurrence');
  const occurrences = Array.from(occurrenceElements).map(el => el.innerText.trim());

  const exportType = document.getElementById('export-type').value;

  // Construire l'objet à exporter
  const reportData = {
    "Tactic Overview": {
      "Tactic Name": tacticName,
      "Goal": tacticGoal
    },
    "Detection Summary": {
      "Frequency": occurrenceCount,
      "Occurrences": occurrences
    }
  };

  let fileContent = '';
  let fileName = '';

  if (exportType === 'json') {
    fileContent = JSON.stringify(reportData, null, 2); // Beau format JSON
    fileName = "report.json";
  } else if (exportType === 'txt') {
    // Format texte brut
    fileContent = `Tactic Overview\n`;
    fileContent += `Tactic Name: ${tacticName}\n`;
    fileContent += `Goal: ${tacticGoal}\n\n`;
    fileContent += `Detection Summary\n`;
    fileContent += `Frequency: ${occurrenceCount} Times\n\n`;

    occurrences.forEach((occurrence, index) => {
      fileContent += `Occurrence ${index + 1}: ${occurrence}\n`;
    });

    fileName = "report.txt";
  }

  // Créer un lien de téléchargement
  const blob = new Blob([fileContent], { type: exportType === 'json' ? 'application/json' : 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}

// Associer la fonction au bouton Export
document.querySelector('.export-btn').addEventListener('click', exportReport);
