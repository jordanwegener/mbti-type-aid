import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import process from "node:process";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@src": "/src",
      "@components": "/src/components",
      "@domain": "/src/domain",
      "@data": "/src/data",
      "@utils": "/src/utils"
    }
  },
  // Vercel and local previews serve the app from the domain root. Deployments
  // under a subpath (such as GitHub Pages) must opt in via the build environment.
  base: process.env.VITE_BASE_PATH || "/",
});
