import { describe, it, expect, vi, beforeEach } from 'vitest';

// Basic mock for chrome API
const chromeMock = {
  runtime: {
    onInstalled: {
      addListener: vi.fn(),
    },
  },
};

// @ts-ignore
global.chrome = chromeMock;

describe('Background Script', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('registers onInstalled listener', async () => {
    // Import the background script to trigger its execution
    await import('./background');
    
    expect(chromeMock.runtime.onInstalled.addListener).toHaveBeenCalled();
  });
});
