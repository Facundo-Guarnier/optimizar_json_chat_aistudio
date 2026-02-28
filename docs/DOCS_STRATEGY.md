# 📚 DOCS_STRATEGY.md

## La Tríada de Documentación: Arquitecto vs. Constructor

Este proyecto utiliza una estrategia de división de roles para maximizar la eficiencia de la IA y minimizar alucinaciones.

### 1. `ARCHITECTURE.md` (La Constitución)
*   **Qué es:** La fuente de verdad técnica inmutable.
*   **Quién lo lee:** Ambos (Arquitecto y Constructor).
*   **Objetivo:** Define el stack, la estructura de carpetas y las reglas "duras" (ej: "Usar Tailwind", "No usar jQuery"). Evita que la IA invente arquitecturas nuevas en cada prompt.

### 2. `ARCHITECT_INSTRUCTIONS.md` (El Cerebro)
*   **Para quién:** Para el LLM de alto nivel (ChatGPT, Claude) que usas en el navegador.
*   **Función:** Este modelo mantiene el contexto del negocio, la lógica funcional y el historial de decisiones.
*   **Por qué existe:** Los modelos de chat tienen ventanas de contexto limitadas. No pueden "ver" todo tu código. Este archivo le enseña a pedir auditorías para orientarse y a generar prompts técnicos precisos sin escribir el código final.
*   **Clave:** Se enfoca en el "Qué" (Reglas de negocio) y delega el "Cómo" (Implementación).

### 3. `BUILDER_INSTRUCTIONS.md` (Las Manos)
*   **Para quién:** Para el Agente de Código (Cursor, Copilot, Lovable) que tiene acceso a tus archivos.
*   **Función:** Este agente es un ejecutor táctico. No necesita saber la historia del proyecto hace 3 meses, solo necesita saber cómo construir la tarea actual sin romper las reglas de estilo.
*   **Por qué existe:** Para imponer disciplina (Mobile-First, MCP, Idempotencia) y evitar errores de novato en la sintaxis o estructura.

### Flujo de Trabajo Típico

1.  **Tú (Humano):** Le pides al Arquitecto: *"Quiero agregar un sistema de reviews para los productos"*.
2.  **Arquitecto (LLM):** Analiza la petición, verifica si necesita auditar la DB actual, y genera un prompt técnico detallado (tablas necesarias, componentes UI requeridos).
3.  **Tú (Humano):** Copias ese prompt y se lo pegas al Constructor (Cursor/Lovable).
4.  **Constructor (Agente):** Lee `BUILDER_INSTRUCTIONS.md`, ejecuta el prompt, modifica los archivos y confirma con el `echo`.