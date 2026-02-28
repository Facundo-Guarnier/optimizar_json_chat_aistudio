> **INSTRUCCIÓN CRÍTICA PARA AGENTES DE IA (Copilot, Cursor, etc.):**
> Este archivo es la ÚNICA fuente de verdad para la arquitectura del proyecto. Antes de generar o modificar código, lee este documento.
> 1.  No instales librerías nuevas sin permiso explícito.
> 2.  Sigue estrictamente la estructura de directorios definida.
> 3.  Respeta las "Reglas de Oro" (Sección 5) bajo cualquier circunstancia.

---

## 1. Stack Tecnológico (Core Inmutable)

El núcleo del proyecto está estandarizado y no debe cambiarse:

*   **Frontend Framework:** React 18+ (Vite).
*   **Lenguaje:** TypeScript (Estricto).
*   **Estilos:** Tailwind CSS v3.4+.
*   **Enrutado:** React Router DOM v6+.
*   **Iconos:** `lucide-react`.

---

## 2. Estructura de Directorios y Patrón Arquitectónico

El proyecto debe adherirse estrictamente a UNO de los siguientes patrones. No mezclar filosofías.

### 🏛️ Patrón: Arquitectura por Capas (Layered)
**Filosofía:** Separación por "tipo de archivo". La lógica fluye de arriba hacia abajo: Page -> Hook -> Service.

```text
src/
├── components/       # UI compartida
│   ├── ui/           # Átomos (Botones, Inputs)
│   └── layout/       # Estructuras globales
├── hooks/            # Custom Hooks (Lógica de vista)
├── pages/            # Rutas / Vistas
├── services/         # Llamadas a API (Axios/Supabase)
├── types/            # Interfaces globales
└── utils/            # Funciones puras
```
**Regla de Oro:** Un componente de UI nunca debe llamar directamente a un servicio/API. Debe hacerlo a través de un Custom Hook.


---

## 3. Sistema de Diseño (UI Architecture)


### Shadcn/ui & Atomicidad
*   **Librería Base:** Shadcn/ui (basado en Radix UI).
*   **Filosofía:** Componentes copiados en `src/components/ui` que son dueños de sus propios estilos.
*   **Utilidades:** Uso obligatorio de `cn()` (clsx + tailwind-merge) para combinar clases condicionales.
*   **Formularios:** React Hook Form + Zod (Validación de esquemas).
*   **Estilos:** Tailwind clases directas. Preferir `w-full` y contenedores flexibles.



## 4. Almacenamiento y Persistencia

### Local (LocalStorage)
*   **Patrón de Datos:** `React Context API` + `useReducer` (o useState complejo).
*   **Sincronización:**
    *   Custom Hooks (`useLocalStorage`) que suscriben el estado a cambios.
    *   Lectura inicial con `JSON.parse` dentro de un `useEffect` para evitar hidratación incorrecta.
*   **Límites:** Usar solo para configuraciones, estados de juego temporales o datos no sensibles.

---

## 5. 🚫 Reglas de Oro (Invariantes)

Cualquier código generado que viole estas reglas será rechazado.

1.  **Prohibido el Hardcoding Visual:** Nunca usar valores arbitrarios "mágicos" (`bg-[#123456]`, `w-[350px]`). Todo debe salir de **Tokens de Diseño** (`bg-primary`) o variables de configuración en `/constants`.
2.  **TypeScript Estricto:** El uso de `any` está **PROHIBIDO**. Todo prop, estado o respuesta de API debe tener una interfaz definida en `src/types`.
3.  **Mobile-First Obligatorio:** Todo CSS debe escribirse pensando primero en móviles (clases base) y usar prefijos (`md:`, `lg:`) solo para adaptar a escritorio.
    *   *Correcto:* `class="w-full md:w-1/2"`
    *   *Incorrecto:* `class="w-1/2 block"` (asume desktop por defecto).
4.  **Importaciones Absolutas:** Usar siempre el alias `@/` definido en `tsconfig`.
    *   *Correcto:* `import Button from '@/components/ui/button'`
    *   *Incorrecto:* `import Button from '../../../components/ui/button'`
5.  **Separación de Responsabilidades:**
    *   Los componentes en `/ui` son "tontos" (solo reciben props y renderizan).
    *   La lógica de negocio compleja y llamadas a APIs viven exclusivamente en `/hooks`.

---

## 6. Convenciones de Código

*   **Componentes:** Functional Components. Nombrado PascalCase (`UserProfile.tsx`).
*   **Exportaciones:** Preferir `export default` para páginas y `export { Component }` para UI reusables.
*   **Gestión de Errores:** Usar bloques `try/catch` en servicios y mostrar feedback visual al usuario (Toast/Alert) en caso de fallo, nunca fallar silenciosamente.