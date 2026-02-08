import { defineConfig } from "vitest/config";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const cjsRequire = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));

const reactPath = cjsRequire.resolve("react");
const reactDomPath = cjsRequire.resolve("react-dom");

// Programmatically resolve package source paths
const storagePath = resolve(__dirname, "../../packages/storage/src");
const cryptoPath = resolve(__dirname, "../../packages/crypto/src");
const vaultPath = resolve(__dirname, "../../packages/vault/src");
const uiPath = resolve(__dirname, "../../packages/ui/src");
const appLogicPath = resolve(__dirname, "../../packages/appLogic/src");

export default defineConfig({
  base: "./",
  resolve: {
    preserveSymlinks: true,
    alias: {
      "@pwmnger/crypto": cryptoPath,
      "@pwmnger/vault": vaultPath,
      "@pwmnger/storage": storagePath,
      "@pwmnger/ui": uiPath,
      "@pwmnger/app-logic": appLogicPath,
    },
    dedupe: ["react", "react-dom"],
  },
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        popup: resolve(__dirname, "popup.html"),
        background: resolve(__dirname, "src/background/background.ts"),
        content: resolve(__dirname, "src/content/content.ts"),
      },
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "assets/[name].[hash].js",
        assetFileNames: "assets/[name].[hash].[ext]",
      },
    },
  },
  test: {
    alias: {
      react: reactPath,
      "react-dom": reactDomPath,
      "@pwmnger/storage": storagePath,
      "@pwmnger/crypto": cryptoPath,
      "@pwmnger/vault": vaultPath,
      "@pwmnger/app-logic": appLogicPath,
      "@pwmnger/ui": uiPath,
    },
    server: {
      deps: {
        inline: [
          "react", 
          "react-dom", 
          "@pwmnger/storage", 
          "@pwmnger/crypto", 
          "@pwmnger/vault", 
          "@pwmnger/app-logic", 
          "@pwmnger/ui"
        ],
      },
    },
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test-setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
  },
});
