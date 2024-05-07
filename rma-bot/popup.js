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
    // Your code to handle client name submission goes here
    var clientName = document.getElementById("clientNameInput").value;
    console.log("Client name submitted: " + clientName);
    addToClientList(clientName);
    // Optionally, you can display the submitted client name
    /* document.getElementById("displayClientList").innerText =
      "Submitted Client Name: " + clientName;
    */
  });

// Refresh Time Button
document
  .getElementById("refreshTimeButton")
  .addEventListener("click", function () {
    // Update Refresh Time
    var refreshTime = document.getElementById("refreshTimeInput").value;
    updateRefreshTimeLabel(refreshTime);
    updateRefreshTime(refreshTime);
    restartBot(refreshTime);
  });

// Clear Client List
document
  .getElementById("clearClientButton")
  .addEventListener("click", function () {
    clearClientList();
  });

document.addEventListener("DOMContentLoaded", updateClientList);

// Update Client List Handler
function updateClientList() {
  chrome.storage.local.get({ clientList: [] }, function (result) {
    var clientList = result.clientList;
    var listContainer = document.getElementById("clientListContainer");
    listContainer.innerHTML = ""; // Clear the previous list content
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

// Clear Client List Handler
function clearClientList() {
  chrome.storage.local.get({ clientList: [] }, function (result) {
    var clientList = result.clientList;
    if (clientList.length > 0) {
      clientList.pop(); // Remove the last item from the array
      chrome.storage.local.set({ clientList: clientList }, function () {
        console.log("Last client removed from the list.");
        updateClientList(); // Update the displayed client list
      });
    }
  });
}
