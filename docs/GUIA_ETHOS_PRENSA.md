# Ethos Prensa: guía de redacción

Ethos Prensa es la sala de redacción de Ethos Noticias. Se entra en **ethosia.tech/prensa** con el correo autorizado por la gerencia, mediante un enlace de acceso que llega al correo. No se usa contraseña.

## Roles
| Rol | Puede |
|---|---|
| Redactor | Crear notas, editarlas mientras están en borrador o revisión y enviarlas a revisión |
| Editor | Todo lo del redactor, más: editar cualquier nota, publicar, programar, despublicar y archivar |
| Administrador | Todo lo anterior, más eliminar definitivamente |

La gerencia asigna los roles en la tabla `miembros` de Supabase, columna `rol`: `redactor`, `editor` o `admin`.

## Publicar una nota, paso a paso
1. **Nueva noticia.** Escribe el título. La dirección web se genera sola y no se cambia una vez publicada.
2. **Bajada:** una o dos frases que resuman la noticia. Es lo que Google muestra; ideal, menos de 155 caracteres.
3. **Imagen principal:** sube la foto tal como sale de la cámara. El sistema la reduce y la convierte a WebP. Son obligatorios:
   - el **texto alternativo**, que describe lo que se ve, por ejemplo «Marlon Pérez en el set de Radar Económico»;
   - el **crédito**, es decir, quién tomó la foto.
4. **Cuerpo:** agrega bloques en el orden que quieras y muévelos con ↑ ↓. Los tipos son párrafo, subtítulo, lista, cita, foto, video de YouTube o Vimeo y video corto.
   - **Videos largos:** súbelos a YouTube y pega el enlace. El sitio muestra la miniatura y solo carga el reproductor cuando el lector hace clic, así la página sigue rápida.
   - **Video corto:** máximo 80 MB, en MP4 o WebM.
5. **Fuentes:** al menos un enlace `https` que respalde la nota (publicación oficial, documento, video).
6. Revisa el recuadro **«Así se verá en Google»**.
7. **Si eres redactor:** pulsa **Enviar a revisión**.
8. **Si eres editor:** pulsa **Publicar ahora** o elige una fecha en **Programar para**.

Al publicar, la nota aparece en segundos en `/noticias`, en el sitemap y en el sitemap de Google News, y se avisa a los buscadores. No hace falta tocar código ni volver a desplegar el sitio.

## Reglas de estilo de la casa
- **Español formal**, en tercera persona y con datos verificables.
- **Frases que el sistema bloquea:** «próximamente», «en construcción» y otras que sugieren una obra inconclusa.
- **Sin fotos ni capturas inventadas:** solo material real y con su crédito.
- **Una idea por párrafo**, y la información más importante va primero.

## Corregir, despublicar o borrar
- **Corregir:** abre la nota, edita y pulsa **Guardar**. Cada guardado crea una versión, y en **Versiones** se puede restaurar cualquier versión anterior.
- **Despublicar:** la nota vuelve a borrador y deja de verse en el sitio.
- **Archivar:** equivale a borrar del sitio; la nota se conserva en el panel.
- **Eliminar definitivamente:** solo el administrador puede hacerlo, y no se puede deshacer.
