import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import pkg from "./package.json";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    // Sin esto Vite ve el puerto ocupado y levanta OTRO server en silencio: cada `npm run dev`
    // cree que es el primero y se acumulan. En Windows quedan vivos aunque cierres el editor
    // (no existe "matar el arbol": los hijos quedan reparentados). Ver guarnold-hub/ENTORNO.md.
    strictPort: true,
  },
  plugins: [
    react(),
    tailwindcss(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
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
}));
