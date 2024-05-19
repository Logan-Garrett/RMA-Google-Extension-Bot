chrome.runtime.onMessage.addListener(
  function (message, sender, sendResponse, response) {
    if (message.action === "gatherList") {
      // Add Refresh here???
      gatherList();
      messageToStart();
    } else if (message.action === "startTheStopProcess") {
      messageToStop();
    }
  },
);

/*
 * ADJUST list to not include numbers
 */
function gatherList() {
  console.log("Gather List inside content script.");
  chrome.storage.local.get("clientList", function (data, response) {
    var clientList = data.clientList;
    console.log("Client List:", clientList);

    const tables = document.querySelectorAll("table");

    if (tables) {
      const lastTable = tables[tables.length - 1];
      const rows = lastTable.querySelectorAll("tr");
      const dataList = [];

      for (let i = 1; i < rows.length; i++) {
        const cells = rows[i].querySelectorAll("td");

        const billingCode = cells[1].innerText.trim();
        const hyperlink = cells[1].querySelector("a").href;

        const isInClientList = clientList.includes(billingCode);

        //console.log(
        //  `Billing Code: ${billingCode}, isInClientList: ${isInClientList}`,
        //);

        if (isInClientList) {
          dataList.push({ billingCode, hyperlink });
        }
      }

      console.log("Data List");
      console.log(dataList);
    }
  });
}

function messageToStart() {
  console.log("send message from content script to start.");
  chrome.runtime.sendMessage({
    action: "startBot",
    url: window.location.href,
  });
}

function messageToStop() {
  console.log("send message from content script to stop.");
  chrome.runtime.sendMessage({
    action: "stopBot",
    url: window.location.href,
  });
}
