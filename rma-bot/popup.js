console.log("Running...");

let refreshTimesTime = 5;
let intervalId;
let isBotSupposedToBeOn = false;

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

// Refresh Page
function refreshPage() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.reload(tabs[0].id);
  });
}

// Start Bot
function startBot(refreshTimesTime) {
  if (isBotSupposedToBeOn) {
    intervalId = setInterval(refreshPage, refreshTimesTime * 1000);
  }
}

// Restart Bot
function restartBot(refreshTimesTime) {
  startBot(refreshTimesTime);
}

// Stop Bot
function stopBot() {
  clearInterval(intervalId);
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
  .getElementById("clearClientButton")
  .addEventListener("click", function () {
    var clientName = document.getElementById("clientNameInput").value;
    console.log("Client name submitted: " + clientName);
    deleteClient(clientName);
  });

//Refresh Client List
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
