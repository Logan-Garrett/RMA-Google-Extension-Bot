chrome.runtime.onMessage.addListener(
  function (message, sender, sendResponse, response) {
    if (message.action === "callFunction") {
      myFunction();
    }
  },
);

function myFunction() {
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

        console.log(
          `Billing Code: ${billingCode}, isInClientList: ${isInClientList}`,
        );

        if (isInClientList) {
          dataList.push({ billingCode, hyperlink });
        }
      }

      console.log("Data List");
      console.log(dataList);

      dataList.forEach((item) => {
        // var link = document.createElement("a");
        // link.href = item.hyperlink;
        // link.click();
        var link = document.createElement("a");
        link.href = "https://www.google.com";

        // Simulate a click event
        link.click();

        chrome.runtime.sendMessage({
          action: "pageOpened",
          url: window.location.href,
        });
      });
    }
  });
}
