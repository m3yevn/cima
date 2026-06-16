import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/app/",
  build: {
    outDir: "../web/public/app",
    emptyOutDir: true,
  },
  server: {
    port: 5174,
    proxy: {
      "/api": { target: "http://localhost:4010", changeOrigin: true, rewrite: (p) => p.replace(/^\/api/, "") },
    },
  },
});
