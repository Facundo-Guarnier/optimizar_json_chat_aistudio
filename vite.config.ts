import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import pkg from "./package.json";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  define: {
    "import.meta.env.VITE_APP_NAME": JSON.stringify(
      (pkg as Record<string, unknown>).screenName ?? pkg.name,
    ),
    "import.meta.env.VITE_APP_VERSION": JSON.stringify(pkg.version),
    "import.meta.env.VITE_BRAND_NAME": JSON.stringify("Guarnold"),
    "import.meta.env.VITE_BRAND_URL": JSON.stringify("https://guarnold.com.ar"),
    "import.meta.env.VITE_REPO_URL": JSON.stringify(
      (pkg as Record<string, unknown>).gitURL ?? "",
    ),
  },
});
