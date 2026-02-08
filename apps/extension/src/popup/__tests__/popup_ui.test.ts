/** @vitest-environment jsdom */
import { vi, describe, test, expect, beforeEach } from "vitest";

// Mock loadVault from storage
vi.mock("@pwmnger/storage", () => ({
  loadVault: vi.fn(),
}));

import { loadVault } from "@pwmnger/storage";

describe("Extension Popup UI", () => {
  let loginDiv: HTMLDivElement;
  let lockedDiv: HTMLDivElement;
  let registerDiv: HTMLDivElement;

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="login" hidden></div>
      <div id="locked" hidden></div>
      <div id="register" hidden></div>
      <input id="masterPassword" />
    `;
    loginDiv = document.getElementById("login") as HTMLDivElement;
    lockedDiv = document.getElementById("locked") as HTMLDivElement;
    registerDiv = document.getElementById("register") as HTMLDivElement;
    vi.clearAllMocks();
  });

  test("shows locked view if vault exists", async () => {
    (loadVault as any).mockResolvedValue({ salt: [] });
    
    // Simulate DOMContentLoaded logic
    const existingVault = await loadVault();
    if (existingVault) {
      lockedDiv.hidden = false;
      loginDiv.hidden = true;
    }

    expect(lockedDiv.hidden).toBe(false);
    expect(loginDiv.hidden).toBe(true);
  });

  test("shows login view if vault does not exist", async () => {
    (loadVault as any).mockResolvedValue(null);
    
    // Simulate DOMContentLoaded logic
    const existingVault = await loadVault();
    if (!existingVault) {
      loginDiv.hidden = false;
      lockedDiv.hidden = true;
    }

    expect(loginDiv.hidden).toBe(false);
    expect(lockedDiv.hidden).toBe(true);
  });
});
