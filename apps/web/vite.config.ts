import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
      react: path.resolve(__dirname, "node_modules/react"),
      "react-dom": path.resolve(__dirname, "node_modules/react-dom"),
    },
  },
});
