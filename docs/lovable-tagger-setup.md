# Configuración de Lovable Tagger

## ¿Qué es?

`lovable-tagger` es un plugin de Vite que agrega atributos `data-lov-id` y `data-lov-name` a los componentes de React en modo desarrollo, permitiendo que Lovable identifique y edite componentes directamente desde la vista previa.

## ⚠️ Versión requerida

**USAR la versión `1.1.10`**. Las versiones posteriores (1.1.11+) cambiaron la implementación interna y ya NO agregan atributos `data-lov-id` visibles al DOM. En su lugar usan `Symbol` internos y `window.sourceElementMap`, lo cual no es útil para debugging visual.

```bash
# ✅ CORRECTO — agrega data-lov-id al DOM
npm install lovable-tagger@1.1.10 --save-dev

# ❌ INCORRECTO — no agrega atributos visibles
npm install lovable-tagger@latest
```

## Pasos para implementarlo en cualquier proyecto

### 1. Instalar la dependencia (versión fija)

```bash
npm install lovable-tagger@1.1.10 --save-dev
```

### 2. Configurar `vite.config.ts`

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(
    Boolean,
  ),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
```

### Puntos clave

- **`({ mode })`**: Se desestructura `mode` del argumento de `defineConfig` para saber si estamos en desarrollo o producción.
- **`mode === 'development' && componentTagger()`**: El plugin solo se activa en desarrollo, no en producción.
- **`.filter(Boolean)`**: Filtra los valores `false` del array de plugins (cuando `mode` no es `'development'`).

### Verificación

Al levantar el dev server (`npm run dev`), abrir el inspector del navegador (F12 → Elements). Los elementos del DOM deben tener estos atributos:

- `data-lov-id` — Identificador único para Lovable
- `data-lov-name` — Nombre del componente React
- `data-component-path` — Ruta del archivo fuente
- `data-component-line` — Línea en el archivo fuente
- `data-component-file` — Nombre del archivo
- `data-component-name` — Nombre del componente

Si NO ves estos atributos, verificar:

1. Que la versión sea **1.1.10** (`npm ls lovable-tagger`)
2. Que el servidor esté en modo development (`npm run dev`, no `npm run build`)
3. Que el plugin esté antes de `.filter(Boolean)` en el array de plugins

### Notas

- No requiere variables de entorno (`LOVABLE_DEV_SERVER` NO es necesaria para la v1.1.10).
- Solo afecta el entorno de desarrollo; no tiene impacto en el build de producción.
- Compatible con `@vitejs/plugin-react` y `@vitejs/plugin-react-swc`.
