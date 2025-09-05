# Limpiador de Código Universal

Una herramienta web sencilla y potente para limpiar y normalizar código copiado desde editores como Figma, Word, y otras fuentes que suelen introducir caracteres extraños, espaciado inconsistente o puntuación tipográfica.

![Captura de pantalla de la aplicación Limpiador de Código](https://i.imgur.com/example.png)

## ✨ Características Principales

- **Limpieza Multi-Lenguaje:** Soporte especializado para `HTML`, `CSS`, `JavaScript` y `Texto Plano`.
- **Normalización Inteligente:**
  - Convierte puntuación tipográfica (comillas curvas, guiones largos) a sus equivalentes ASCII estándar.
  - Elimina caracteres invisibles y de control que pueden causar errores.
  - Estandariza los saltos de línea a `\n`.
  - Ajusta el espaciado de forma inteligente, conservando la indentación.
- **Interfaz Sencilla:** Un diseño limpio con dos paneles: uno para tu código sucio y otro para el resultado limpio.
- **Funcionalidad Rápida:** Botones para "Limpiar", "Copiar" el resultado y "Borrar" la entrada con un solo clic.

## 🚀 Cómo Empezar

Usar la aplicación es muy fácil:

1.  **Pega tu código:** Pega el código que has copiado en el área de texto de la izquierda ("Messy Code").
2.  **Selecciona el lenguaje:** Usa el menú desplegable para elegir el lenguaje de tu código (`HTML`, `CSS`, `JS`, o `Text`). Esto asegura que se apliquen las reglas de limpieza correctas.
3.  **Limpia el código:** Haz clic en el botón **"Clean My Code"**.
4.  **Copia el resultado:** El código limpio aparecerá instantáneamente en el panel derecho. Usa el botón de copiar para guardarlo en tu portapapeles.
5.  **Limpia la entrada:** Si quieres empezar de nuevo, usa el botón con el icono de la papelera para borrar el texto del panel izquierdo.

## 🛠️ Despliegue

Este proyecto está configurado para un despliegue sencillo en [Vercel](https://vercel.com/).

1.  **Sube tu código a un repositorio de Git** (GitHub, GitLab, etc.).
2.  **Importa el proyecto en Vercel.** Vercel detectará automáticamente que es una aplicación de Next.js.
3.  **Despliega.** No se necesita configuración adicional. El archivo `vercel.json` incluido optimiza el manejo de las funciones del servidor.
