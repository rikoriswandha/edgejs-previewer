import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import nodepod from "@scelar/nodepod/vite";
export default defineConfig({
  plugins: [react(), nodepod()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});