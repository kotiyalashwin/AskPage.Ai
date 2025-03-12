chrome.tabs.onUpdated.addListener((_tabId, changeInfo) => {
  if (changeInfo.url) {
    // Clear local storage when the URL of the active tab changes
    chrome.storage.local.clear(() => {
      console.log("Local storage cleared due to URL change.");
    });
  }
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (tab.url) {
      // Clear local storage when the active tab changes
      chrome.storage.local.clear(() => {
        console.log("Local storage cleared due to tab change.");
      });
    }
  });
});
