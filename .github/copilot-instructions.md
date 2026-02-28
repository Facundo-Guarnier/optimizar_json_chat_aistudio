---
applyTo: always_on
name: Instrucciones estrictas para el proyecto
description: Instrucciones detalladas y estrictas para el desarrollo del proyecto, incluyendo reglas obligatorias, filosofía de frontend, y procedimientos para interacciones con Supabase.
---

applyTo: always_on
name: Instrucciones estrictas para el proyecto Love Web App
description: Instrucciones detalladas y estrictas para el desarrollo del proyecto Love Web App, incluyendo reglas obligatorias, filosofía de frontend, y procedimientos para interacciones con Supabase.

---

## Contexto del Proyecto

**Proyecto:** Optimizar JSON Chat AI Studio
**Descripción:** Este proyecto tiene como objetivo optimizar el historial de chat en AI Studio utilizando JSON. Busca quitar cadenas de pensamiento y archivos para reducir el tamaño del historial, manteniendo solo la información esencial para la continuidad de la conversación.
**Filosofía UI:** Desktop-First, Reutilización sobre Creación (DRY), Feedback al Usuario, y Estricta Separación de Capas.

---

## 🚨 Reglas OBLIGATORIAS (NO NEGOCIABLES)

### 0. Comunicación y Finalización

- **Preguntas de Clarificación:** Si una instrucción es ambigua o falta información crítica (ej: no se especifica si el componente es móvil o desktop, o falta un esquema de datos), **NO asumas**. Detente y haz las preguntas necesarias al usuario antes de escribir código.
- **Marca de Finalización:** Al terminar CADA respuesta, es **OBLIGATORIO** ejecutar este comando para señalar el fin del proceso al sistema de logs:
  ```powershell
  echo "✅ Fin de la respuesta"
  ```

---

### 2. Filosofía Frontend (React + Tailwind)

#### A. Reutilización sobre Creación (DRY)

Antes de crear un archivo nuevo, pregúntate: _¿Existe algo parecido que pueda adaptar?_

```tsx
// ❌ INCORRECTO: Crear componentes específicos innecesarios
<MensWatchesGrid />
<WomensPerfumesGrid />

// ✅ CORRECTO: Usar componente genérico con Props
<CollectionGrid handle="mens-watches" title="Relojes" />
<CollectionGrid handle="womens-perfumes" title="Perfumes" />
```

#### B. Mobile-First Obligatorio

El CSS debe escribirse para pantallas pequeñas por defecto. Las _media queries_ son para pantallas grandes.

```tsx
// ❌ INCORRECTO: Escritorio por defecto (se rompe en móvil)
<div className="w-1/2 flex">...</div>

// ✅ CORRECTO: Móvil (full width) -> Escritorio (mitad de ancho)
<div className="w-full md:w-1/2 flex flex-col md:flex-row">...</div>
```

#### C. Feedback al Usuario

Nunca dejes al usuario adivinando.

- **Loading:** Muestra Skeleton o Spinners mientras se cargan datos.
- **Acciones:** Muestra Toasts ("Guardado correctamente") o Alertas de Error.
- **Errores:** Maneja los `try/catch` de forma elegante (No fallar silenciosamente).

---

### 3. Modo Auditoría (Cuando se solicite)

Si el usuario o el Arquitecto te pide una "Auditoría" o "Estado actual":

1.  **NO modifiques código.**
2.  Lee los archivos y consulta la base de datos/API.
3.  Reporta estrictamente lo que ves:
    - Nombres exactos de archivos.
    - Estructura real de tablas (columnas y tipos).
    - Lógica implementada actualmente.
