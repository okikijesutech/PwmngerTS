import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const cjsRequire = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const reactPath = cjsRequire.resolve("react");
const reactDomPath = cjsRequire.resolve("react-dom");
const jsxRuntimePath = cjsRequire.resolve("react/jsx-runtime");
const jsxDevRuntimePath = cjsRequire.resolve("react/jsx-dev-runtime");

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@pwmnger/crypto": path.resolve(__dirname, "../../packages/crypto/src"),
      "@pwmnger/vault": path.resolve(__dirname, "../../packages/vault/src"),
      "@pwmnger/storage": path.resolve(__dirname, "../../packages/storage/src"),
      "@pwmnger/app-logic": path.resolve(
        __dirname,
        "../../packages/appLogic/src",
      ),
      "@pwmnger/ui": path.resolve(__dirname, "../../packages/ui/src"),
    },
    dedupe: ["react", "react-dom", "react-router-dom", "react-is"],
  },
  test: {
    alias: {
      react: reactPath,
      "react-dom": reactDomPath,
      "react/jsx-runtime": jsxRuntimePath,
      "react/jsx-dev-runtime": jsxDevRuntimePath,
    },
    server: {
      deps: {
        inline: ["@pwmnger/ui", "react", "react-dom", "react-is", "react/jsx-runtime", "react/jsx-dev-runtime"],
      },
    },
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test-setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
        },
      },
    },
  },
});
