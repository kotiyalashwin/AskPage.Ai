chrome.tabs.onUpdated.addListener((_tabId, changeInfo) => {
  if (changeInfo.url) {
    chrome.storage.local.get("sessionId", (result) => {
      const sessionId = result.sessionId;

      if (sessionId) {
        fetch(`http://localhost:8080/clearsession?sessionId=${sessionId}`, {
          method: "DELETE",
        })
          .then((response) => {
            if (response.ok) {
              console.log("Backend delete request successful (on URL change).");
            } else {
              console.error(
                "Backend delete request failed (on URL change):",
                response.status
              );
            }
          })
          .catch((error) => {
            console.error(
              "Error sending backend delete request (on URL change):",
              error
            );
          });
      }
      chrome.storage.local.clear(() => {
        console.log("Local storage cleared due to URL change.");
      });
    });
  }
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (tab.url) {
      chrome.storage.local.get("sessionId", (result) => {
        const sessionId = result.sessionId;

        if (sessionId) {
          fetch(`http://localhost:8080/clearsession?sessionId=${sessionId}`, {
            method: "DELETE",
          })
            .then((response) => {
              if (response.ok) {
                console.log(
                  "Backend delete request successful (on tab change)."
                );
              } else {
                console.error(
                  "Backend delete request failed (on tab change):",
                  response.status
                );
              }
            })
            .catch((error) => {
              console.error(
                "Error sending backend delete request (on tab change):",
                error
              );
            });
        }
        chrome.storage.local.clear(() => {
          console.log("Local storage cleared due to tab change.");
        });
      });
    }
  });
});
