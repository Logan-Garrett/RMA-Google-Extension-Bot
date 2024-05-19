console.log("Running...");

let refreshTimesTime = 5;
let intervalId;
let isBotSupposedToBeOn = false;

function doWork(refreshTimesTime) {
  console.log("Doing Work.");
  // Needed to start process
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.reload(tabs[0].id);
  });
  chrome.tabs.onUpdated.addListener(
    function (tabId, changeInfo, tab, response) {
      if (changeInfo.status === "complete" && isBotSupposedToBeOn == true) {
        // contentScript.js
        chrome.tabs.sendMessage(tabId, {
          action: "gatherList",
          arguments: refreshTimesTime,
        });
        // Background.js
        chrome.tabs.sendMessage(tabId, {
          action: "startBot",
          arguments: refreshTimesTime,
        });
      }
    },
  );
}

// Update Status
function updateStatusLabel(status) {
  var label = document.getElementById("extensionStatusLabel");
  label.textContent = status;
}

// Update Refresh Time Label
function updateRefreshTimeLabel(status) {
  var refreshTimeLabel = document.getElementById("refreshTimeLabel");
  refreshTimeLabel.textContent = status;
}

// Update Refresh Time
function updateRefreshTime(time) {
  refreshTimesTime = time;
}

// Start Bot
function startBot(refreshTimesTime) {
  console.log("Bot has Entered the Room.");
  if (isBotSupposedToBeOn) {
    doWork(refreshTimesTime);
    // intervalId = setInterval(refreshPage, refreshTimesTime * 1000);
  }
}

// Restart Bot
function restartBot(refreshTimesTime) {
  startBot(refreshTimesTime);
}

// Stop Bot
function stopBot() {
  clearInterval(intervalId);
  // Needed to stop
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.reload(tabs[0].id);
  });
  chrome.tabs.onUpdated.addListener(
    function (tabId, changeInfo, tab, response) {
      if (changeInfo.status === "complete") {
        chrome.tabs.sendMessage(tabId, { action: "startTheStopProcess" });
      }
    },
  );
}

// Enable Extension button action
document
  .getElementById("enableExtension")
  .addEventListener("click", function () {
    updateStatusLabel("On");
    console.log("Extension enabled");
    isBotSupposedToBeOn = true;
    startBot(refreshTimesTime);
  });

// Disable Extension button action
document
  .getElementById("disableExtension")
  .addEventListener("click", function () {
    updateStatusLabel("Off");
    console.log("Extension disabled");
    isBotSupposedToBeOn = false;
    stopBot();
  });

// Client Name Button action
document
  .getElementById("clientNameButton")
  .addEventListener("click", function () {
    var clientName = document.getElementById("clientNameInput").value;
    console.log("Client name submitted: " + clientName);
    addToClientList(clientName);
  });

// Refresh Time Button
document
  .getElementById("refreshTimeButton")
  .addEventListener("click", function () {
    var refreshTime = document.getElementById("refreshTimeInput").value;
    updateRefreshTimeLabel(refreshTime);
    updateRefreshTime(refreshTime);
    restartBot(refreshTime);
  });

// Clear Client List
document
  .getElementById("deleteClientButton")
  .addEventListener("click", function () {
    var clientName = document.getElementById("clientNameInput").value;
    console.log("Client name submitted: " + clientName);
    deleteClient(clientName);
  });

// Refresh Client List
document.addEventListener("DOMContentLoaded", updateClientList);

// Update Client List Handler
function updateClientList() {
  chrome.storage.local.get({ clientList: [] }, function (result) {
    var clientList = result.clientList;
    var listContainer = document.getElementById("clientListContainer");
    listContainer.innerHTML = "";
    clientList.forEach(function (clientName) {
      var listItem = document.createElement("li");
      listItem.textContent = clientName;
      listContainer.appendChild(listItem);
    });
  });
}

// Add Client List Handler
function addToClientList(clientName) {
  chrome.storage.local.get({ clientList: [] }, function (result) {
    var clientList = result.clientList;
    clientList.push(clientName);
    chrome.storage.local.set({ clientList: clientList }, function () {
      console.log("Client added to the list: " + clientName);
      updateClientList();
    });
  });
}

// Delete Client List Handler
function deleteClient(clientNameToDelete) {
  chrome.storage.local.get({ clientList: [] }, function (result) {
    var clientList = result.clientList;
    var index = clientList.indexOf(clientNameToDelete);
    if (index !== -1) {
      clientList.splice(index, 1);
      chrome.storage.local.set({ clientList: clientList }, function () {
        console.log("Client deleted from the list: " + clientNameToDelete);
        updateClientList();
      });
    }
  });
}
