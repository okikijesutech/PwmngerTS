import { wipe } from "@pwmnger/crypto";

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

interface PendingEntry {
  site: string;
  username: string;
  password: Uint8Array;
  timestamp: number;
  timer?: ReturnType<typeof setTimeout>;
}

let pendingEntry: PendingEntry | null = null;

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
      
      // Clear existing if any
      if (pendingEntry) {
        if (pendingEntry.timer) clearTimeout(pendingEntry.timer);
        wipe(pendingEntry.password);
      }

      const passwordBuffer = new TextEncoder().encode(message.password);
      
      pendingEntry = {
        site: message.site,
        username: message.username,
        password: passwordBuffer, 
        timestamp: Date.now(),
        timer: setTimeout(() => {
          if (pendingEntry) {
             log("Auto-clearing pending entry from memory");
             wipe(pendingEntry.password);
             pendingEntry = null;
             chrome.action.setBadgeText({ text: "" });
          }
        }, 60000) // Wiped after 60s
      };
      
      chrome.action.setBadgeText({ text: "!" });
      chrome.action.setBadgeBackgroundColor({ color: "#1890ff" });
    }

    if (message.action === "get-pending-entry") {
      if (pendingEntry) {
         // Convert back to string for UI (popup will handle encryption)
         const passwordStr = new TextDecoder().decode(pendingEntry.password);
         sendResponse({
           site: pendingEntry.site,
           username: pendingEntry.username,
           password: passwordStr,
           timestamp: pendingEntry.timestamp
         });

         // Clear immediately after retrieval
         if (pendingEntry.timer) clearTimeout(pendingEntry.timer);
         wipe(pendingEntry.password);
         pendingEntry = null;
         chrome.action.setBadgeText({ text: "" });
      } else {
        sendResponse(null);
      }
    }
  } catch (err) {
    safeError("Message Listener Failed", err);
    sendResponse({ error: "Processing failed" });
  }
  return true; // Keep channel open for async responses if needed
});

export {};
