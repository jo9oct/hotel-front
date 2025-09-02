import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  server: {
    host: "0.0.0.0",  // allow access from all network interfaces
    allowedHosts: [
      "localhost",                       // local development
      "hotel-menu-21.onrender.com",      // your Render frontend domain
    ],
  },
  plugins: [
    react(),  // React plugin for Vite
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),  // use @ to reference src folder
    },
  },
  build: {
    target: "esnext",  // modern JS output
  },
});
