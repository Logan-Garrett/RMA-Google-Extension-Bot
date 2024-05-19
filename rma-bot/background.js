let currentPage = null;

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "pageOpened") {
    currentPage = message.url;
    console.log("Page opened:", currentPage);
    performActions(currentPage);
  }
});

function performActions(url) {
  console.log("Performing actions on page:", url);

  if (url.includes("google.com")) {
    secondPageAction("https://example.com");
  } else if (url.includes("https://example.com")) {
    thirdPageAction("amazon.com");
  }
}

// Second Page Action / View Engagment
function secondPageAction(url) {
  chrome.tabs.update({ url: url }, function (tab) {
    console.log("New tab opened with URL:", url);
    // Open page??
    chrome.runtime.sendMessage({
      action: "pageOpened",
      url: url,
    });
  });
}

// Third Page Action / Sign Agreemant
function thirdPageAction(url) {
  chrome.tabs.update({ url: url }, function (tab) {
    console.log("New tab opened with URL:", url);
  });
}

// Restart Process????
