import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { edgeCompilerPlugin } from "./src/plugin/edge-compiler";

export default defineConfig({
  plugins: [react(), edgeCompilerPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
