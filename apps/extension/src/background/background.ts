console.log("PwmngerTS Background Service Worker Running");

let pendingEntry: any = null;

chrome.runtime.onInstalled.addListener(() => {
  console.log("PwmngerTS Extension Installed");
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "capture-credentials") {
    console.log("Captured credentials for:", message.site);
    pendingEntry = {
      site: message.site,
      username: message.username,
      password: message.password,
      timestamp: Date.now()
    };
    // Set badge to notify user
    chrome.action.setBadgeText({ text: "!" });
    chrome.action.setBadgeBackgroundColor({ color: "#1890ff" });
  }

  if (message.action === "get-pending-entry") {
    sendResponse(pendingEntry);
    // Clear once retrieved
    pendingEntry = null;
    chrome.action.setBadgeText({ text: "" });
  }
});

export {};
