# M4-S26 · Diagnóstico técnico-económico de integración IA

Aplicación web estática para analizar la integración de IA generativa en la atención al cliente B2B. Forma parte de la actividad individual del módulo **M4-S26 — Desafíos Técnicos y Económicos en la Integración de IA** de la asignatura *Diseño de Sistemas de Información*.

> **Aviso académico.** Las cifras del caso son supuestos didácticos. No representan precios reales de ningún proveedor. La aplicación es académica y no debe usarse con datos personales reales ni información confidencial.

---

## 1. Objetivo

Apoyar al alumno en el análisis razonado de un caso de integración de IA: introducir datos del caso, calcular volumen de uso (consultas, tokens) y ahorro humano bruto, comparar dos alternativas arquitectónicas (API externa vs. plataforma cloud gestionada), levantar un mini-RAID y redactar una decisión final con métrica de éxito.

## 2. Problema que analiza

Una empresa mediana de servicios B2B atiende **12.000 tickets mensuales**. Cada ticket lo lee un agente humano (35 personas en soporte), que busca información, consulta CRM/ERP/base documental y redacta una respuesta. Se valora introducir IA generativa para resumir tickets, sugerir respuestas, buscar en documentación interna y reducir el tiempo medio de respuesta. Hay **datos personales en algunos tickets**, **revisión humana obligatoria** y **alta exigencia de trazabilidad**.

## 3. Funcionalidades

- **Formulario de datos** del caso con validación (campos vacíos, no numéricos, negativos, tiempo esperado mayor que actual).
- **Cálculos automáticos** con fórmulas visibles:
  - Consultas mensuales = tickets × consultas/ticket
  - Tokens entrada/salida mensuales = consultas × tokens/consulta
  - Tiempo ahorrado por ticket = tiempo actual − tiempo esperado
  - Minutos / horas ahorradas al mes
  - Ahorro humano bruto = horas × coste hora
- **Matriz comparativa editable** entre Opción A (API externa) y Opción B (cloud gestionado) sobre 8 criterios.
- **Mini-RAID editable** (Riesgo, Supuesto, Incidencia, Dependencia) con impacto y acción propuesta.
- **Decisión final estructurada** (recomendación, motivo, riesgo, control, métrica, trade-off).
- **Resumen exportable** copiable al portapapeles o descargable como `.txt` para pegar en la entrega.
- **Sin dependencias externas**: HTML + CSS + JavaScript puro. Funciona offline.

## 4. Cómo usar la aplicación

1. Abre la URL publicada en GitHub Pages.
2. En la sección **Datos**, pulsa **Cargar valores del caso** (o introduce los tuyos).
3. Pulsa **Calcular**. Se actualiza la tabla de resultados.
4. Completa la **Matriz comparativa** y el **Mini-RAID** haciendo clic en cada celda editable.
5. Rellena la **Decisión final**.
6. Pulsa **Generar resumen** y luego **Copiar resumen** (o **Descargar como .txt**) para llevarlo a la plantilla de entrega.

## 5. Estructura del repositorio

```
mi-app-integracion-ia/
├── index.html       # Estructura y secciones de la aplicación
├── style.css        # Estilos (tablas, formularios, navegación)
├── script.js        # Lógica de cálculo, matriz, RAID, resumen
├── README.md        # Este archivo
└── .nojekyll        # Evita procesado Jekyll en GitHub Pages
```

## 6. Publicación en GitHub Pages

1. Crear un repositorio en GitHub (público) con los archivos de esta carpeta.
2. En el repositorio, ir a **Settings → Pages**.
3. En **Build and deployment → Source**, elegir **Deploy from a branch**.
4. Seleccionar la rama `main` y carpeta `/ (root)`. Guardar.
5. Esperar 1-2 minutos. La URL aparecerá en la misma pantalla con el formato `https://<usuario>.github.io/<repositorio>/`.

## 7. Limitaciones reconocidas

- Las cifras del caso son académicas; no contemplan precios reales de proveedor ni el coste de IA, revisión, mantenimiento ni formación. El ahorro mostrado es **bruto**, no neto.
- La matriz y el RAID no se persisten al recargar (no hay almacenamiento por diseño, para evitar guardar datos sensibles por error).
- No se conecta a ningún backend, API ni base de datos: todo el procesamiento ocurre en el navegador.
- La aplicación no toma decisiones por el usuario; solo organiza el análisis.

## 8. Privacidad y uso responsable

- **No introducir datos personales reales** (nombres, correos, teléfonos, identificadores, contratos).
- **No subir credenciales** (claves API, tokens, contraseñas) al repositorio.
- La revisión humana sigue siendo obligatoria en cualquier flujo real de IA en atención al cliente.
- Cumplimiento mínimo a tener en cuenta: principio de minimización de datos (RGPD, art. 5).

## 9. Aprendizajes del proceso

Construir esta aplicación reforzó tres ideas: (1) integrar IA es una decisión de sistema de información completa, no solo una llamada a una API; (2) el coste real depende del volumen de tokens, la revisión humana y la operación, no solo del precio por consulta; (3) una decisión defendible necesita criterios observables, controles concretos y una métrica de éxito.

---

*M4-S26 · Diseño de Sistemas de Información · Material académico.*
