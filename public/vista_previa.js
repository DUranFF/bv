
// window.VistaPrevia = {
//   mostrar(file) {
//     const ext = file.nombre.split('.').pop().toLowerCase();
//     const fileUrl = `/archivo?path=${encodeURIComponent(file.ruta)}`;
//     const previewDiv = document.getElementById('preview');

//     const contenido = `<h3>Vista previa de: ${file.nombre}</h3>`;
//     const abrirLink = `<p><a href="${fileUrl}" target="_blank" rel="noopener noreferrer" style="font-weight:bold; color:#0078d7;">Abrir archivo completo en nueva pestaña</a></p>`;

//     // Limpia antes de cargar contenido nuevo
//     previewDiv.innerHTML = contenido;

//     if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext)) {
//       const img = new Image();
//       img.src = fileUrl;
//       img.style.maxWidth = '100%';
//       img.style.border = '1px solid #aaa';
//       img.alt = file.nombre;

//       img.onload = () => {
//         previewDiv.innerHTML = contenido;
//         previewDiv.appendChild(img);
//         previewDiv.innerHTML += abrirLink;
//       };

//       img.onerror = () => {
//         previewDiv.innerHTML = contenido + `<p>❌ No se pudo cargar la imagen.</p>` + abrirLink;
//       };

//     } else if (ext === 'pdf') {
//       const xhr = new XMLHttpRequest();
//       xhr.open('GET', fileUrl, true);
//       xhr.responseType = 'blob';

//       xhr.onload = function () {
//         if (xhr.status === 200) {
//           const blob = new Blob([xhr.response], { type: 'application/pdf' });
//           const objectUrl = URL.createObjectURL(blob);
//           previewDiv.innerHTML = contenido +
//             `<iframe src="${objectUrl}" width="100%" height="500px" style="border:none;"></iframe>` +
//             abrirLink;
//         } else {
//           previewDiv.innerHTML = contenido + `<p>❌ No se pudo cargar el PDF (status ${xhr.status}).</p>` + abrirLink;
//         }
//       };

//       xhr.onerror = function () {
//         previewDiv.innerHTML = contenido + `<p>❌ Error al cargar el archivo PDF.</p>` + abrirLink;
//       };

//       xhr.send();

//     } else if (['txt', 'html', 'js', 'json', 'css', 'md', 'php', 'log', 'csv'].includes(ext)) {
//       previewDiv.innerHTML = contenido + `<p>Cargando vista previa parcial...</p>` + abrirLink;
//       fetch(fileUrl, { headers: { 'Range': 'bytes=0-50000' } })
//         .then(res => {
//           if (!(res.ok || res.status === 206)) throw new Error('No se pudo leer el archivo');
//           return res.text();
//         })
//         .then(texto => {
//           const safe = texto
//             .replace(/&/g, '&amp;')
//             .replace(/</g, '&lt;')
//             .replace(/>/g, '&gt;');
//           previewDiv.innerHTML = contenido +
//             `<pre style="background:#f4f4f4; border:1px solid #ccc; padding:10px; overflow:auto; white-space:pre-wrap; max-height: 400px;">${safe}</pre>` +
//             abrirLink;
//         })
//         .catch(() => {
//           previewDiv.innerHTML = contenido + `<p>❌ No se pudo cargar el archivo de texto.</p>` + abrirLink;
//         });

//     } else {
//       previewDiv.innerHTML = contenido + `<p>🔒 No se puede previsualizar este tipo de archivo.</p>` + abrirLink;
//     }
//   }
// };
window.VistaPrevia = {
  mostrar(file) {
    const ext = file.nombre.split('.').pop().toLowerCase();
    const fileUrl = `/archivo?path=${encodeURIComponent(file.ruta)}`;
    const previewDiv = document.getElementById('preview');

    const contenido = `<h3>Vista previa de: ${file.nombre}</h3>`;
    const abrirLink = `<p><a href="${fileUrl}" target="_blank" rel="noopener noreferrer" style="font-weight:bold; color:#0078d7;">Abrir archivo completo en nueva pestaña</a></p>`;

    // Limpia antes de cargar contenido nuevo
    previewDiv.innerHTML = contenido;

    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext)) {
      const img = new Image();
      img.src = fileUrl;
      img.style.maxWidth = '100%';
      img.style.border = '1px solid #aaa';
      img.alt = file.nombre;

      img.onload = () => {
        previewDiv.innerHTML = contenido;
        previewDiv.appendChild(img);
        previewDiv.innerHTML += abrirLink;
      };

      img.onerror = () => {
        previewDiv.innerHTML = contenido + `<p>❌ No se pudo cargar la imagen.</p>` + abrirLink;
      };

    } else if (ext === 'pdf') {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', fileUrl, true);
      xhr.responseType = 'blob';

      xhr.onload = function () {
        if (xhr.status === 200) {
          const blob = new Blob([xhr.response], { type: 'application/pdf' });
          const objectUrl = URL.createObjectURL(blob);
          previewDiv.innerHTML = contenido +
            `<iframe src="${objectUrl}" width="100%" height="500px" style="border:none;"></iframe>` +
            abrirLink;
        } else {
          previewDiv.innerHTML = contenido + `<p>❌ No se pudo cargar el PDF (status ${xhr.status}).</p>` + abrirLink;
        }
      };

      xhr.onerror = function () {
        previewDiv.innerHTML = contenido + `<p>❌ Error al cargar el archivo PDF.</p>` + abrirLink;
      };

      xhr.send();

    } else if (['txt', 'html', 'js', 'json', 'css', 'md', 'php', 'log', 'csv'].includes(ext)) {
      previewDiv.innerHTML = contenido + `<p>Cargando vista previa parcial...</p>` + abrirLink;
      fetch(fileUrl, { headers: { 'Range': 'bytes=0-50000' } })
        .then(res => {
          if (!(res.ok || res.status === 206)) throw new Error('No se pudo leer el archivo');
          return res.text();
        })
        .then(texto => {
          const safe = texto
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
          previewDiv.innerHTML = contenido +
            `<pre style="background:#f4f4f4; border:1px solid #ccc; padding:10px; overflow:auto; white-space:pre-wrap; max-height: 400px;">${safe}</pre>` +
            abrirLink;
        })
        .catch(() => {
          previewDiv.innerHTML = contenido + `<p>❌ No se pudo cargar el archivo de texto.</p>` + abrirLink;
        });

    } else {
      previewDiv.innerHTML = contenido + `<p>🔒 No se puede previsualizar este tipo de archivo.</p>` + abrirLink;
    }
  }
};
