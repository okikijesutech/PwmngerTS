import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock global chrome
(globalThis as any).chrome = {
  runtime: {
    onInstalled: { addListener: vi.fn() },
    onMessage: { addListener: vi.fn() },
    sendMessage: vi.fn(),
  },
  action: {
    setBadgeText: vi.fn(),
    setBadgeBackgroundColor: vi.fn(),
  }
};

describe('Background Script', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('registers onInstalled listener', async () => {
    // Import the background script to trigger its execution
    await import('./background');
    
    expect(chrome.runtime.onInstalled.addListener).toHaveBeenCalled();
  });
});
