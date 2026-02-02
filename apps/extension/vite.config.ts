import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@pwmnger/crypto": resolve(__dirname, "../../packages/crypto/src"),
      "@pwmnger/vault": resolve(__dirname, "../../packages/vault/src"),
      "@pwmnger/storage": resolve(__dirname, "../../packages/storage/src"),
      "@pwmnger/ui": resolve(__dirname, "../../packages/ui/src"),
    },
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
        entryFileNames: "[name]/[name].js",
      },
    },
  },
});
