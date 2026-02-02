console.log("PwmngerTS Background Service Worker Running");

chrome.runtime.onInstalled.addListener(() => {
  console.log("PwmngerTS Extension Installed");
});
