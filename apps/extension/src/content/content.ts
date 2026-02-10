import { generatePassword } from "../password/generator";

console.log("PwmngerTS Content Script Loaded");

// Styles for the generator icon
const styles = `
  .pwmnger-icon {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
    background-image: url('${chrome.runtime.getURL("icon.png")}'); 
    background-size: contain;
    background-repeat: no-repeat;
    cursor: pointer;
    z-index: 10000;
    opacity: 0.5;
    transition: opacity 0.2s;
  }
  .pwmnger-icon:hover {
    opacity: 1;
  }
  .pwmnger-wrapper {
    position: relative;
    display: inline-block;
    width: 100%;
  }
`;

const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

// --- Message Listener ---
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "autofill") {
    const { username, password } = message;
    autofillFields(username, password);
  }
});

// --- Autofill Logic ---
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
      'input[name*="user"]',
      'input[name*="email"]',
      'input[name*="login"]',
      'input[id*="user"]',
      'input[id*="email"]',
      'input[autocomplete="username"]',
      'input[type="text"]' // Fallback
    ];
    
    for (const selector of selectors) {
      const el = form.querySelector(selector) as HTMLInputElement;
      if (el && el !== passInput && el.type !== 'hidden' && el.type !== 'submit') return el;
    }
  }

  // If no form, look for nearest input before the password field
  const allInputs = Array.from(document.querySelectorAll('input'));
  const passIndex = allInputs.indexOf(passInput);
  if (passIndex > 0) {
    for (let i = passIndex - 1; i >= 0; i--) {
      const input = allInputs[i] as HTMLInputElement;
      if ((input.type === 'text' || input.type === 'email') && input.style.display !== 'none') return input;
    }
  }

  return null;
}

function setValue(input: HTMLInputElement, value: string) {
  input.focus();
  input.value = value;
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));
  input.blur();
}

// --- Generator UI Injection ---
function injectGeneratorIcons() {
  const passwordInputs = document.querySelectorAll('input[type="password"]');
  
  passwordInputs.forEach((input: any) => {
    if (input.dataset.pwmngerInjected) return;
    
    // Only inject on likely registration fields or empty fields
    // if (input.autocomplete === "new-password" || !input.value) {
      
      const wrapper = document.createElement("div");
      wrapper.className = "pwmnger-wrapper";
      
      // We need to insert wrapper and move input inside, preventing layout breakage is hard.
      // A better approach is to position the icon relative to the input's parent if relative, or simply float it.
      // For stability, let's just create the icon and position it floating over the input using getBoundingClientRect
      
      // Simpler approach: Parent container shim
      // NOTE: Modifying DOM structure can break sites. 
      // Safest: Position absolute overlay appended to body, tracked on scroll/resize.
      
      // For this demo, let's append a sibling icon and use negative margin or absolute positioning if parent has relative.
      
      const parent = input.parentElement;
      if (parent) {
         const parentStyle = window.getComputedStyle(parent);
         if (parentStyle.position === 'static') {
           parent.style.position = 'relative'; 
         }
         
         const icon = document.createElement("div");
         icon.className = "pwmnger-icon";
         icon.title = "Generate Secure Password";
         icon.onclick = (e) => {
           e.preventDefault();
           e.stopPropagation();
           const password = generatePassword({
             length: 16,
             lowercase: true,
             uppercase: true,
             numbers: true,
             symbols: true
           });
           setValue(input as HTMLInputElement, password);
           
           // Notify background/popup to save this? 
           // Probably just fill it for now.
         };
         
         parent.appendChild(icon);
         input.dataset.pwmngerInjected = "true";
      }
    // }
  });
}

// Run injection periodically to handle dynamic forms
setInterval(injectGeneratorIcons, 2000);
injectGeneratorIcons();


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
