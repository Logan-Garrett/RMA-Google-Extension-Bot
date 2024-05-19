let currentPage = null;
let botIsActive = false;
let intervelId;
let refreshIntervalId;

let callCount = 0;

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  // should just call once but keeps calling it seems.
  if (message.action === "startBot" && callCount < 1) {
    botIsActive = true;
    currentPage = message.url;
    console.log("Started Bot. Page is: ", currentPage);
    startRefreshingPage(5000);
    callCount += 1;
    // performActions(currentPage, botIsActive, message.arguments);
  }
  if (message.action === "stopBot") {
    botIsActive = false;
    console.log("Stopped Bot. Page is: ", currentPage);
    stopRefreshingPage();
  }
});

// Page run around going poop.
// Extension also going poof
async function performActions(url, botIsActive, refreshTimesTime) {
  console.log("Performing actions on page:", url);
  while (botIsActive) {
    // Should be info page
    if (url.includes("google.com")) {
      // will change url to correct one
      await sleep(3000); // Sleep for 2 seconds
      secondPageAction("https://example.com", botIsActive);
    } else if (url.includes("https://example.com")) {
      await sleep(3000); // Sleep for 2 seconds
      thirdPageAction("https://cars.com", botIsActive);
    } else if (url.includes("cars.com")) {
      await sleep(3000); // Sleep for 2 seconds
      // restart
      restartPerformActions("google.com", botIsActive);
      // restartPerformActions("google.com", botIsActive);
    } else {
      console.log("Should not reach here.");
    }
  }
}

// Second Page Action / View Engagment
function secondPageAction(url, botIsActive) {
  // Perform blah blah
  // SHould open next page

  chrome.tabs.update({ url: url }, function (tab) {
    console.log("New tab opened with URL:", url);
    // third page actions
    // Update URL go to third page
    performActions(url, botIsActive);
  });
}

// Third Page Action / Sign Agreemant

function thirdPageAction(url, botIsActive) {
  // Perform blah blah
  // SHould complete

  // Main page URL
  // SHOULD NOT SIMulate
  chrome.tabs.update({ url: url }, function (tab) {
    console.log("New tab opened with URL:", url);
    // Third Page actions
    // Update back to normal
    performActions(url, botIsActive);
  });
}

function restartPerformActions(url, botIsActive) {
  chrome.tabs.update({ url: url }, function (tab) {
    console.log("New tab opened with URL:", url);
    /*
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.reload(tabs[0].id);
      }); */
    performActions(url, botIsActive);
  });
}

// Restart Process????
// Look at table and call perfoem actions again?????

/// NEEDS interrept from button???/

// Function to start refreshing the current active tab every specified interval (in milliseconds)
function startRefreshingPage(interval) {
  refreshIntervalId = setInterval(() => {
    refreshPage();
  }, interval);
}

// Function to stop refreshing the page
function stopRefreshingPage() {
  if (refreshIntervalId) {
    clearInterval(refreshIntervalId);
    refreshIntervalId = null;
  }
}

// Function to refresh the current active tab
function refreshPage() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (tabs.length > 0) {
      chrome.tabs.reload(tabs[0].id, function () {
        console.log("Page refreshed");
      });
    }
  });
}

// Sleep function
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
