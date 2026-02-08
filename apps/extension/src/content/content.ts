console.log("PwmngerTS Content Script Loaded");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "autofill") {
    const { username, password } = message;
    autofillFields(username, password);
  }
});

function autofillFields(user: string, pass: string) {
  const passwordInputs = document.querySelectorAll('input[type="password"]');

  if (passwordInputs.length === 0) {
    console.log("No password fields found for auto-fill");
    return;
  }

  for (const passInput of Array.from(passwordInputs) as HTMLInputElement[]) {
    // 1. Fill the password field
    setValue(passInput, pass);

    // 2. Try to find the username field associated with this password field
    const userInput = findUsernameField(passInput);
    if (userInput) {
      setValue(userInput, user);
    }
  }
}

function findUsernameField(passInput: HTMLInputElement): HTMLInputElement | null {
  const form = passInput.form;
  if (form) {
    // Look for common username/email patterns in the same form
    const selectors = [
      'input[type="email"]',
      'input[type="text"][name*="user"]',
      'input[type="text"][name*="email"]',
      'input[type="text"][id*="user"]',
      'input[type="text"][id*="email"]',
      'input[type="text"]' // Fallback to first text input in form
    ];
    
    for (const selector of selectors) {
      const el = form.querySelector(selector) as HTMLInputElement;
      if (el && el !== passInput) return el;
    }
  }

  // If no form, look for nearest input before the password field
  const allInputs = Array.from(document.querySelectorAll('input'));
  const passIndex = allInputs.indexOf(passInput);
  if (passIndex > 0) {
    for (let i = passIndex - 1; i >= 0; i--) {
      const input = allInputs[i] as HTMLInputElement;
      if (input.type === 'text' || input.type === 'email') return input;
    }
  }

  return null;
}

function setValue(input: HTMLInputElement, value: string) {
  input.value = value;
  // Trigger events for React/Vue/Angular etc.
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));
  input.dispatchEvent(new Event('blur', { bubbles: true }));
}

// --- Credential Capture ---
document.addEventListener('submit', (e) => {
  const form = e.target as HTMLFormElement;
  if (!form) return;

  const passwordInput = form.querySelector('input[type="password"]') as HTMLInputElement;
  if (!passwordInput || !passwordInput.value) return;

  const usernameInput = findUsernameField(passwordInput);
  const username = usernameInput ? usernameInput.value : '';
  const password = passwordInput.value;
  const site = window.location.hostname;

  if (password) {
    chrome.runtime.sendMessage({
      action: "capture-credentials",
      site,
      username,
      password
    });
  }
}, true);

export {};
