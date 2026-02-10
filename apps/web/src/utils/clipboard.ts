export async function copyWithAutoClear(text: string, timeoutMs = 7000) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    console.error("Failed to copy to clipboard:", err);
  }

  setTimeout(async () => {
    try {
      const current = await navigator.clipboard.readText();
      if (current === text) {
        await navigator.clipboard.writeText("");
      }
    } catch {
      // Fail silently on clear if document is not focused
    }
  }, timeoutMs);
}
