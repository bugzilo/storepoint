---
title: "Guía: Mejores Prácticas de Obsidian para Documentar el Proyecto"
type: guide
status: active
category: documentation
tags:
  - guide
  - obsidian
  - pkm
  - best-practices
updated: 2026-09-27
---

# 💎 Guía: Mejores Prácticas de Obsidian para Documentar el Proyecto

Esta guía recopila las **mejores prácticas de la industria y la comunidad de Obsidian** aplicadas a la ingeniería de software y gestión del conocimiento técnico en repositorios de código.

---

## 🚪 1. Cómo Abrir esta Bóveda en Obsidian

1. Abre la aplicación de escritorio o móvil de **Obsidian**.
2. Selecciona **Open folder as vault** (Abrir carpeta como bóveda).
3. Selecciona la carpeta **`storePointWeb/docs`** (¡no la raíz del proyecto!).

> [!TIP]
> **¿Por qué abrir `docs/` y no la raíz del repositorio?**
> Un repositorio Angular contiene `node_modules/`, `.angular/` y carpetas de build con más de 60,000 archivos JavaScript y JSON. Si abres la raíz, el motor de indexación de Obsidian se ralentizará enormemente. Aislar la bóveda en `docs/` garantiza que Obsidian vuele en milisegundos, mantenga el grafo limpio y sea 100% portable.

---

## 🗺️ 2. Filosofía MOC (Maps of Content) vs Carpetas Rígidas

El error más común al documentar software en Obsidian es crear 10 niveles de subcarpetas anidadas (`docs/frontend/angular/features/sale/drawers/cart/...`). Esto provoca fatiga mental, enlaces rotos y notas huérfanas.

### La Regla de Oro:
- **Las carpetas organizan la *categoría* o *tipo de documento*** (ej. `Architecture`, `Features`, `Design System`, `Decisions (ADR)`, `Guides`).
- **Los enlaces (`[[Wikilinks]]`) y MOCs organizan las *relaciones semánticas***.

Cada categoría cuenta con una nota central llamada **MOC** (ej. [[Architecture MOC]], [[Features MOC]], [[Design System MOC]]). Los MOCs actúan como índices vivos y contextuales.

---

## 🔗 3. Enlaces Bidireccionales & Notas Atómicas

- Escribe en formato Wikilink: `[[NombreDeLaNota]]`.
- Usa alias cuando el flujo del texto requiera otra conjugación: `[[Modal & Drawer Pattern|nuestro patrón de drawers]]`.
- Enlaza a secciones específicas con `#`: `[[UI Components Catalog#stp-button|botón compartido]]`.
- Cada nota debe ser **atómica**: explicar un concepto, feature o componente a fondo, sin mezclar responsabilidades no relacionadas.

---

## 🏷️ 4. Propiedades y Metadatos (YAML Frontmatter)

Toda nota en la bóveda debe iniciar con un encabezado frontmatter estándar para permitir búsquedas semánticas y consultas con Dataview:

```yaml
---
title: "Título de la Nota"
type: feature # moc | architecture | feature | component | adr | guide
status: active # planned | in-development | active | deprecated
tags:
  - feature
  - domain
updated: 2026-09-27
---
```

---

## 📝 5. Uso de Plantillas Estandarizadas

Dentro de `docs/Templates/` dispones de esquemas listos:
1. `ADR-Template.md`: Para registrar decisiones arquitectónicas y técnicas.
2. `Feature-Template.md`: Para documentar nuevas vistas o flujos de usuario.
3. `Component-Template.md`: Para componentes de UI compartidos.
4. `Technical-Guide-Template.md`: Para manuales técnicos y procedimentales.

**Cómo insertar una plantilla en Obsidian:**
1. Crea una nueva nota (`Cmd + N`).
2. Presiona `Cmd + P` (Paleta de comandos).
3. Escribe `Templates: Insert template` y selecciona la plantilla correspondiente.

---

## 🔌 6. Plugins Recomendados de Obsidian

Para potenciar al máximo la bóveda en el equipo, se recomienda habilitar los siguientes plugins de la comunidad:

| Plugin | Propósito | Configuración Recomendada |
| :--- | :--- | :--- |
| **Dataview** | Genera tablas dinámicas de notas basadas en tags o status. | Tablas automáticas en MOCs (ej. listar todos los `#feature`). |
| **Templater** | Inserción dinámica de fechas, títulos y variables al crear notas. | Carpeta de templates asignada a `Templates/`. |
| **Obsidian Git** | Git pull, commit y push automático desde la barra de estado de Obsidian. | Auto backup cada 30 minutos o al guardar. |
| **Linter** | Estandariza espacios, títulos y frontmatter automáticamente al guardar. | Activar "Lint on save". |
| **Excalidraw** | Pizarra interactiva para bocetar flujos UX y diagramas a mano alzada. | Guardar dibujos en `Assets/`. |

---

## 🎨 7. Obsidian Canvas & Mermaid

- Para diagramas secuenciales y flujos de datos, usa bloques nativos `mermaid` (renderizados automáticamente tanto en GitHub como en Obsidian).
- Para la vista espacial de arquitectura del sistema, explora y amplía [[StorePoint Architecture.canvas]].

---

## 🤝 8. Complementariedad con Graphify

En este repositorio conviven dos herramientas de conocimiento complementarias:
1. **Graphify (`graphify-out/`)**: Genera el grafo de dependencias de código fuente de bajo nivel (AST, funciones, clases, imports). Se actualiza con `graphify update .`.
2. **Obsidian Vault (`docs/`)**: Provee la documentación arquitectónica de alto nivel, decisiones de negocio, intenciones de diseño, guías de onboarding y especificaciones de componentes.

---

## 🔗 Referencias
- [[00 - Home (Dashboard)]]
- [[Architecture MOC]]
- [[Decisions MOC]]
