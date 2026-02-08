// Security-First Logging: Avoid logging PII or sensitive parameters
const log = (message: string, ...args: any[]) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[PwmngerTS] ${message}`, ...args);
  }
};

const safeError = (message: string, error: any) => {
  // Sanitize error object to prevent leaking stack traces or sensitive data in production
  const sanitizedMessage = error instanceof Error ? error.message : "Internal Error";
  console.error(`[PwmngerTS][SECURITY-AUDIT] ${message}: ${sanitizedMessage}`);
};

log("Background Service Worker Initializing");

let pendingEntry: any = null;

chrome.runtime.onInstalled.addListener(() => {
  log("Extension Installed");
});

// Guard against malicious external messages
chrome.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {
  log("External message blocked from origin:", sender.origin);
  sendResponse({ error: "Unauthorized access" });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  try {
    if (message.action === "capture-credentials") {
      log("Capturing credentials for:", message.site);
      pendingEntry = {
        site: message.site,
        username: message.username,
        password: message.password, // This is expected to be encrypted/handled securely in the UI
        timestamp: Date.now()
      };
      
      chrome.action.setBadgeText({ text: "!" });
      chrome.action.setBadgeBackgroundColor({ color: "#1890ff" });
    }

    if (message.action === "get-pending-entry") {
      sendResponse(pendingEntry);
      pendingEntry = null;
      chrome.action.setBadgeText({ text: "" });
    }
  } catch (err) {
    safeError("Message Listener Failed", err);
    sendResponse({ error: "Processing failed" });
  }
  return true; // Keep channel open for async responses if needed
});

export {};
