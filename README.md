<div align="center">

# ⚡ aistudio-chat-cleaner

**Herramienta web para limpiar y optimizar el historial de chat exportado desde Google AI Studio**

[![Made with React](https://img.shields.io/badge/Made%20with-React%2019-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS%204-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

</div>

---

## 🎯 ¿Qué hace?

Los archivos JSON exportados desde **Google AI Studio** incluyen cadenas de pensamiento (`isThought`) y campos internos que inflan considerablemente el tamaño del historial. Esta herramienta:

- **Elimina chunks con `isThought`** (cadenas de pensamiento del modelo)
- **Conserva solo `role` y `text`** de cada chunk, descartando campos internos
- **Reduce drásticamente el tamaño** del archivo, manteniendo la conversación intacta

---

## ✨ Características

- 📂 **Múltiples formas de entrada** — Arrastrar y soltar, pegar texto, o explorador de archivos
- 📊 **Tabla comparativa** — Visualiza chunks, tamaño, caracteres y roles antes/después con % de cambio
- 📋 **Copiar o descargar** — Obtén el JSON limpio con un clic
- 🌙 **Modo claro/oscuro** — Tema adaptable con toggle flotante
- 🎨 **Color de acento personalizable** — 6 presets de color con sistema dinámico
- ⚡ **100% en el navegador** — No se envía ningún dato a servidores externos
- 📱 **Responsive** — Funciona en escritorio y móvil

---

## 🚀 Instalación

**Requisitos:** Node.js 18+

```bash
# Clonar el repositorio
git clone https://github.com/Facundo-Guarnier/optimizar_json_chat_aistudio.git
cd optimizar_json_chat_aistudio

# Instalar dependencias
npm install

# Iniciar en modo desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

---

## 🛠️ Scripts disponibles

| Comando           | Descripción                         |
| ----------------- | ----------------------------------- |
| `npm run dev`     | Inicia el servidor de desarrollo    |
| `npm run build`   | Genera la build de producción       |
| `npm run preview` | Previsualiza la build de producción |

---

## 📁 Estructura del proyecto

```
optimizar_json_chat_aistudio/
├── public/
│   └── assets/          # Favicon e imágenes estáticas
├── src/
│   ├── components/
│   │   ├── BrandFooter.tsx        # Footer con info del proyecto
│   │   └── FloatingThemeToggle.tsx # Toggle de tema y color de acento
│   ├── context/
│   │   └── ThemeContext.tsx        # Proveedor de tema (dark/light + accent)
│   ├── App.tsx           # UI principal (input, tabla comparativa, output)
│   ├── cleanChat.ts      # Lógica de limpieza del JSON
│   ├── index.css         # Tailwind + tokens de tema personalizados
│   └── main.tsx          # Punto de entrada
├── clean_chat.py         # Script original en Python (referencia)
├── index.html            # HTML shell
├── vite.config.ts        # Configuración de Vite + alias + env vars
├── tsconfig.json         # Configuración de TypeScript (strict)
└── package.json          # Dependencias y metadatos
```

---

## 🏗️ Tecnologías

| Tecnología         | Uso                 |
| ------------------ | ------------------- |
| **React 19**       | Biblioteca de UI    |
| **TypeScript**     | Tipado estático     |
| **Vite 7**         | Build tool          |
| **Tailwind CSS 4** | Estilos utilitarios |
| **Lucide React**   | Iconografía         |

---

## 📐 ¿Cómo funciona la limpieza?

1. Se parsea el JSON del chat exportado de AI Studio
2. Se recorren los chunks en `chunkedPrompt.chunks`
3. Se filtran los chunks donde `isThought === true`
4. De cada chunk restante se conserva solo `{ role, text }`
5. Se genera un JSON limpio listo para reutilizar

**Ejemplo de reducción típica:** 40-70% menos en tamaño de archivo.

---

## 📊 Métricas mostradas

La tabla comparativa muestra para cada métrica los valores **Original vs Resultado** con el porcentaje de cambio:

| Métrica        | Descripción                               |
| -------------- | ----------------------------------------- |
| **Chunks**     | Cantidad total de bloques de conversación |
| **Tamaño**     | Peso del archivo en KB/MB                 |
| **Caracteres** | Total de caracteres de texto              |
| **Roles**      | Desglose por rol (user, model, thought)   |

---

## 📄 Licencia

Este proyecto está bajo la licencia **MIT**. Ver el archivo [LICENSE](./LICENSE) para más detalles.

---

<div align="center">

### ⚡ Optimiza tus chats de AI Studio en segundos

</div>
