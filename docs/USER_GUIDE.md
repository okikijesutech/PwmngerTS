# User Guide

Welcome to **PwmngerTS**, a Zero-Knowledge Password Manager designed for privacy and security.

## 🚀 Getting Started

### 1. Account Creation

- Visit your Vault URL.
- Click **"Create new Vault"**.
- **Important**: Your **Master Password** is the key to your vault. We cannot reset it for you. Do not lose it.

### 2. Safeguarding Your Vault

- **Recovery Kit**: Immediately after creating your account, go to the Dashboard and click **"Download Recovery Kit"**. Store this file securely (e.g., printed in a safe, or on an encrypted USB drive).
- **Two-Factor Authentication (2FA)**: Go to **Security Settings** and enable 2FA using an app like Google Authenticator or Authy. Once enabled, you will be prompted for your 6-digit code every time you unlock your vault from a new device.

## 🌍 Browser Extension

The PwmngerTS Extension allows you to access your vault directly from your browser toolbar.

1. **Install**: Follow the [README](../README.md#build-the-extension) instructions to build and load the extension.
2. **Setup**: Click the extension icon and enter your Vault URL (e.g., `http://localhost:5173`).
3. **Usage**: Unlock with your Master Password to search and copy credentials.

## 📂 Organizing Passwords

- **Folders**: Use the sidebar to create folders (e.g., "Work", "Personal", "Finance").
- **Move Entries**: Select an entry and use the "Move" dropdown to organize it.

## ☁️ Cloud Sync

Sync happens automatically whenever you unlock your vault or save a new entry.
- **Fast Sync**: We use response compression to ensure sync is fast even on mobile data.
- **Offline Access**: Your vault is saved locally in your browser's secure storage (IndexedDB), so you can still access it without an internet connection.

## 🛡️ Security Features

- **Zero-Knowledge**: Your password is encrypted _on your device_ before it ever reaches our server. We cannot see your data.
- **Recovery Kit**: If you lose your Master Password, your data is lost forever *unless* you have your Recovery Kit.
- **Health Check**: Periodically run the **"Check Health"** tool to find weak or reused passwords.
