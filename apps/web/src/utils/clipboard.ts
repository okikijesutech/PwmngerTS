export async function copyWithAutoClear(text: string, timeoutMs = 7000) {
  await navigator.clipboard.writeText(text);

  setTimeout(async () => {
    const current = await navigator.clipboard.readText();
    if (current === text) {
      await navigator.clipboard.writeText("");
    }
  }, timeoutMs);
}
