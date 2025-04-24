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

