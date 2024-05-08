let currentPage = null;

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "pageAction") {
    if (message.type === "pageChange") {
      currentPage = message.url;
      performActions(message.url); // pass page
    }
  }
});

// Look into what page and split the action and basically re-loop.
// Seems that first round of cuntions pointless and the others just loop through.
function performActions(url) {
  console.log("Performing actions on page:", url);

  if (url.includes("google.com")) {
    openNewTab("https://example.com");
  }
}

// Example Function
function openNewTab(url) {
  chrome.tabs.create({ url: url });
}
