// et archivosTotales = [];
// let archivos = [];
// let indiceVisible = 0;
// const TAMANO_LOTE = 100; // Cantidad de archivos que se cargan por lote al hacer scroll

// const previewDiv = document.getElementById('preview');
// const resultadoDiv = document.getElementById('resultado');

// // Elemento sentinel para detectar scroll infinito
// const sentinela = document.createElement('div');
// sentinela.id = 'sentinela-scroll';
// sentinela.style.height = '1px';
// resultadoDiv.appendChild(sentinela);

// // Mostrar mensajes arriba del listado
// function mostrarMensaje(msg) {
//   const mensajeDivId = 'mensajeVistaPrevia';
//   let msgDiv = document.getElementById(mensajeDivId);
//   if (!msgDiv) {
//     msgDiv = document.createElement('div');
//     msgDiv.id = mensajeDivId;
//     msgDiv.style.marginBottom = '10px';
//     msgDiv.style.fontWeight = 'bold';
//     resultadoDiv.parentNode.insertBefore(msgDiv, resultadoDiv);
//   }
//   msgDiv.innerHTML = msg;
// }

// // Carga archivos desde backend con filtros
// async function cargarArchivos(origen, filtros = []) {
//   mostrarMensaje('🔍 Buscando archivos...');
//   try {
//     const res = await fetch('/listar', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ origen, filtros }),
//     });

//     const data = await res.json();
//     if (!res.ok) throw new Error(data.mensaje || 'Error desconocido');

//     archivosTotales = data.archivos.map(a => ({
//       ...a,
//       id: a.ruta + a.nombre,
//       mover: false,
//       eliminar: false,
//       copiar: false
//     }));
//     archivos = [...archivosTotales];
//     indiceVisible = 0;

//     mostrarMensaje(`✅ Se encontraron ${archivosTotales.length} archivos/carpetas.`);
//     // Habilitar botones que dependan de archivos cargados
//     document.getElementById('mover').disabled = false;
//     document.getElementById('copiar').disabled = false;
//     document.getElementById('verDuplicados').disabled = false;
//     document.getElementById('borrarDuplicados').disabled = false;
//     document.getElementById('eliminarSeleccionados').disabled = false;
//     document.getElementById('filtro').style.display = 'inline-block';

//     limpiarResultado();
//     renderizarArchivos(archivos);
//     return true;
//   } catch (err) {
//     mostrarMensaje(`❌ Error: ${err.message}`);
//     return false;
//   }
// }

// // Limpia listado y agrega el sentinel para scroll infinito
// function limpiarResultado() {
//   resultadoDiv.innerHTML = '';
//   resultadoDiv.appendChild(sentinela);
//   indiceVisible = 0;
// }

// // Renderiza un lote de archivos a partir del índiceVisible
// function renderizarArchivos(lista) {
//   const fragment = document.createDocumentFragment();
//   const max = Math.min(indiceVisible + TAMANO_LOTE, lista.length);

//   for (let i = indiceVisible; i < max; i++) {
//     const file = lista[i];
//     const li = document.createElement('li');

//     // Checkbox mover
//     const moverInput = document.createElement('input');
//     moverInput.type = 'checkbox';
//     moverInput.checked = file.mover;
//     moverInput.onchange = () => file.mover = moverInput.checked;

//     // Checkbox copiar
//     const copiarInput = document.createElement('input');
//     copiarInput.type = 'checkbox';
//     copiarInput.checked = file.copiar;
//     copiarInput.onchange = () => file.copiar = copiarInput.checked;

//     // Checkbox eliminar
//     const eliminarInput = document.createElement('input');
//     eliminarInput.type = 'checkbox';
//     eliminarInput.checked = file.eliminar;
//     eliminarInput.onchange = () => file.eliminar = eliminarInput.checked;

//     // Nombre archivo o carpeta clickeable
//     const nombreSpan = document.createElement('span');
//     nombreSpan.textContent = file.nombre;
//     nombreSpan.style.cursor = 'pointer';
//     nombreSpan.onclick = () => {
//       if (!file.directorio && window.VistaPrevia?.mostrar) {
//         window.VistaPrevia.mostrar(file);
//       }
//       mostrarMensaje(`📄 Vista previa de: ${file.nombre}`);
//     };

//     // Ruta pequeña debajo
//     const ruta = document.createElement('small');
//     ruta.textContent = file.ruta;

//     // Tipo: carpeta o archivo
//     const tipo = document.createElement('small');
//     tipo.textContent = file.directorio ? ' (Carpeta)' : ' (Archivo)';
//     tipo.style.color = file.directorio ? 'green' : 'black';

//     // Construir nodo
//     li.appendChild(moverInput);
//     li.appendChild(document.createTextNode(' Mover '));
//     li.appendChild(copiarInput);
//     li.appendChild(document.createTextNode(' Copiar '));
//     li.appendChild(eliminarInput);
//     li.appendChild(document.createTextNode(' Eliminar '));
//     li.appendChild(nombreSpan);
//     li.appendChild(tipo);
//     li.appendChild(document.createElement('br'));
//     li.appendChild(ruta);

//     fragment.appendChild(li);
//   }

//   // Insertar antes del sentinel para mantenerlo al final
//   resultadoDiv.insertBefore(fragment, sentinela);
//   indiceVisible = max;
// }

// // Intersection Observer para scroll infinito
// const observer = new IntersectionObserver(entries => {
//   if (entries[0].isIntersecting && indiceVisible < archivos.length) {
//     renderizarArchivos(archivos);
//   }
// }, {
//   root: resultadoDiv,
//   rootMargin: '0px',
//   threshold: 1.0
// });
// observer.observe(sentinela);

// // Eventos botones y filtros:

// document.getElementById('buscar').addEventListener('click', async () => {
//   const origen = document.getElementById('origen').value.trim();
//   if (!origen) return alert('Ingresa la carpeta origen');

//   const filtroInput = document.getElementById('filtro').value.trim();
//   const filtros = filtroInput ? filtroInput.split(',').map(s => s.trim()).filter(Boolean) : [];
//   await cargarArchivos(origen, filtros);
// });

// document.getElementById('filtro').addEventListener('input', () => {
//   const filtroInput = document.getElementById('filtro').value.toLowerCase();
//   const filtros = filtroInput.split(',').map(f => f.trim()).filter(Boolean);

//   archivos = filtros.length === 0 ? [...archivosTotales] : archivosTotales.filter(file =>
//     filtros.some(filtro => file.nombre.toLowerCase().includes(filtro))
//   );
//   limpiarResultado();
//   renderizarArchivos(archivos);
// });

// document.getElementById('mover').addEventListener('click', async () => {
//   const destino = document.getElementById('destino').value.trim();
//   if (!destino) return alert('Ingresa la carpeta destino');

//   const seleccionados = archivosTotales.filter(a => a.mover);
//   if (seleccionados.length === 0) return alert('Selecciona archivos o carpetas para mover');

//   mostrarMensaje('🚚 Moviendo archivos/carpetas...');

//   try {
//     const res = await fetch('/mover', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ archivos: seleccionados, destino })
//     });
//     const data = await res.json();
//     if (!res.ok) throw new Error(data.mensaje || 'Error desconocido');
//     mostrarMensaje(data.mensaje);
//     document.getElementById('buscar').click();
//   } catch (err) {
//     mostrarMensaje(`❌ Error: ${err.message}`);
//   }
// });

// document.getElementById('copiar').addEventListener('click', async () => {
//   const destino = document.getElementById('destino').value.trim();
//   if (!destino) return alert('Ingresa la carpeta destino');

//   const seleccionados = archivosTotales.filter(a => a.copiar);
//   if (seleccionados.length === 0) return alert('Selecciona archivos o carpetas para copiar');

//   mostrarMensaje('📋 Copiando archivos/carpetas...');

//   try {
//     const res = await fetch('/copiar', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ archivos: seleccionados, destino })
//     });
//     const data = await res.json();
//     if (!res.ok) throw new Error(data.mensaje || 'Error desconocido');
//     mostrarMensaje(data.mensaje);
//     document.getElementById('buscar').click();
//   } catch (err) {
//     mostrarMensaje(`❌ Error: ${err.message}`);
//   }
// });

// document.getElementById('eliminarSeleccionados').addEventListener('click', async () => {
//   const seleccionados = archivosTotales.filter(a => a.eliminar);
//   if (!seleccionados.length) return alert('Selecciona archivos o carpetas para eliminar');
//   if (!confirm(`¿Eliminar ${seleccionados.length} ítems seleccionados?`)) return;

//   mostrarMensaje('🗑️ Eliminando archivos/carpetas...');

//   try {
//     for (const archivo of seleccionados) {
//       await fetch('/eliminar', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ ruta: archivo.ruta }),
//       });
//     }
//     mostrarMensaje(`🗑️ Se eliminaron ${seleccionados.length} ítems.`);
//     document.getElementById('buscar').click();
//   } catch (err) {
//     mostrarMensaje('❌ Error al eliminar: ' + err.message);
//   }
// });

// document.getElementById('verDuplicados').addEventListener('click', async () => {
//   const origen = document.getElementById('origen').value.trim();
//   if (!origen) return alert('Ingresa la carpeta origen');

//   mostrarMensaje('🔁 Buscando duplicados...');

//   try {
//     const res = await fetch('/duplicados', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ origen }),
//     });

//     const data = await res.json();
//     if (!res.ok) throw new Error(data.mensaje || 'Error desconocido');

//     mostrarDuplicados(data.duplicados, 'unico');
//     mostrarMensaje(`🔁 Se encontraron ${data.duplicados.length} duplicados.`);
//   } catch (err) {
//     mostrarMensaje(`❌ Error: ${err.message}`);
//   }
// });

// document.getElementById('borrarDuplicados').addEventListener('click', async () => {
//   const origen = document.getElementById('origen').value.trim();
//   if (!origen) return alert('Ingresa la carpeta origen');
//   if (!confirm('¿Estás seguro de borrar todos los archivos duplicados?')) return;

//   mostrarMensaje('🗑️ Borrando duplicados...');

//   try {
//     const res = await fetch('/borrar-duplicados', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ origen }),
//     });

//     const data = await res.json();
//     if (!res.ok) throw new Error(data.mensaje || 'Error desconocido');

//     mostrarMensaje(data.mensaje);
//     document.getElementById('verDuplicados').click();
//     document.getElementById('buscar').click();
//   } catch (err) {
//     mostrarMensaje(`❌ Error: ${err.message}`);
//   }
// });

// document.getElementById('verCarpetasDuplicadas').addEventListener('click', async () => {
//   const origen = document.getElementById('origen').value.trim();
//   if (!origen) return alert('Ingresa la carpeta origen');

//   mostrarMensaje('📂 Buscando carpetas duplicadas...');

//   try {
//     const res = await fetch('/carpetas-duplicadas', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ origen }),
//     });

//     const data = await res.json();
//     if (!res.ok) throw new Error(data.mensaje || 'Error desconocido');

//     mostrarDuplicados(data.duplicadas, 'unico');
//     mostrarMensaje(`📂 ${data.duplicadas.length ? 'Se encontraron' : 'No hay'} carpetas duplicadas.`);
//   } catch (err) {
//     mostrarMensaje(`❌ Error: ${err.message}`);
//   }
// });

// document.getElementById('compararDuplicados').addEventListener('click', async () => {
//   const ruta1 = document.getElementById('ruta1').value.trim();
//   const ruta2 = document.getElementById('ruta2').value.trim();
//   if (!ruta1 || !ruta2) return alert('Debes ingresar ambas rutas');

//   mostrarMensaje('🔎 Comparando rutas...');

//   try {
//     const res = await fetch('/comparar-duplicados', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ ruta1, ruta2 }),
//     });

//     const data = await res.json();
//     if (!res.ok) throw new Error(data.mensaje || 'Error desconocido');

//     mostrarDuplicados(data.comparacion, 'comparacion');
//     mostrarMensaje(`🔍 Comparación completa. Coincidencias: ${data.comparacion.length}`);
//   } catch (err) {
//     mostrarMensaje(`❌ Error: ${err.message}`);
//   }
// });

// // Función para mostrar duplicados en el panel correspondiente
// function mostrarDuplicados(duplicados, modo = 'unico') {
//   const div = document.getElementById('duplicadosLista');
//   if (!duplicados.length) {
//     div.innerHTML = '<p>No se encontraron duplicados.</p>';
//     return;
//   }

//   if (modo === 'comparacion') {
//     let html = `<div class="fila">
//       <div class="columna izquierda scroll">
//         <h3>📁 Carpeta comparación</h3>
//         <ul>`;
//     duplicados.forEach(({ nombre, rutas }) => {
//       if (rutas[1]) {
//         html += `<li><strong>${nombre}</strong><br>${rutas[1]}</li>`;
//       }
//     });
//     html += `</ul></div>`;

//     html += `<div class="columna derecha scroll">
//       <h3>📂 Carpeta origen</h3>
//       <ul>`;
//     duplicados.forEach(({ nombre, rutas }) => {
//       if (rutas[0]) {
//         html += `<li><strong>${nombre}</strong><br>${rutas[0]}</li>`;
//       }
//     });
//     html += `</ul></div></div>`;
//     div.innerHTML = html;
//   } else {
//     let html = '<ul>';
//     duplicados.forEach(({ nombre, rutas }) => {
//       html += `<li><strong>${nombre}</strong><ul>`;
//       rutas.forEach((ruta, i) => {
//         html += `<li>${i === 0 ? '<em>Original</em>' : 'Duplicado'}: ${ruta}</li>`;
//       });
//       html += '</ul></li>';
//     });
//     html += '</ul>';
//     div.innerHTML = html;
//   }
// }


let archivosTotales = [];
let archivos = [];
let indiceVisible = 0;
const TAMANO_LOTE = 1000;

const previewDiv = document.getElementById('preview');
const resultadoDiv = document.getElementById('resultado');

const sentinela = document.createElement('div');
sentinela.id = 'sentinela-scroll';
sentinela.style.height = '1px';
resultadoDiv.appendChild(sentinela);

function mostrarMensaje(msg) {
  const mensajeDivId = 'mensajeVistaPrevia';
  let msgDiv = document.getElementById(mensajeDivId);
  if (!msgDiv) {
    msgDiv = document.createElement('div');
    msgDiv.id = mensajeDivId;
    msgDiv.style.marginBottom = '10px';
    msgDiv.style.fontWeight = 'bold';
    resultadoDiv.parentNode.insertBefore(msgDiv, resultadoDiv);
  }
  msgDiv.innerHTML = msg;
}

async function cargarArchivos(origen, filtros = []) {
  mostrarMensaje('🔍 Buscando archivos...');
  try {
    const res = await fetch('/listar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ origen, filtros }),
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Error HTTP ${res.status}: ${errorText}`);
    }
    const data = await res.json();
    archivosTotales = data.archivos.map(a => ({
      ...a,
      id: a.ruta + a.nombre,
      mover: false,
      eliminar: false,
      copiar: false
    }));
    archivos = [...archivosTotales];
    indiceVisible = 0;
    mostrarMensaje(`✅ Se encontraron ${archivosTotales.length} archivos/carpetas.`);
    document.getElementById('mover').disabled = false;
    document.getElementById('copiar').disabled = false;
    document.getElementById('verDuplicados').disabled = false;
    document.getElementById('borrarDuplicados').disabled = false;
    document.getElementById('eliminarSeleccionados').disabled = false;
    document.getElementById('filtro').style.display = 'inline-block';
    limpiarResultado();
    renderizarArchivos(archivos);
    return true;
  } catch (err) {
    mostrarMensaje(`❌ Error: ${err.message}`);
    return false;
  }
}

function limpiarResultado() {
  resultadoDiv.innerHTML = '';
  resultadoDiv.appendChild(sentinela);
  indiceVisible = 0;
}

function renderizarArchivos(lista) {
  const fragment = document.createDocumentFragment();
  const max = Math.min(indiceVisible + TAMANO_LOTE, lista.length);
  for (let i = indiceVisible; i < max; i++) {
    const file = lista[i];
    const li = document.createElement('li');

    // Checkbox Mover
    const moverInput = document.createElement('input');
    moverInput.type = 'checkbox';
    moverInput.checked = file.mover;
    moverInput.classList.add('casilla-mover');
    moverInput.onchange = () => file.mover = moverInput.checked;

    const moverLabel = document.createElement('span');
    moverLabel.textContent = 'Mover ';
    moverLabel.classList.add('texto-mover');

    // Checkbox Copiar
    const copiarInput = document.createElement('input');
    copiarInput.type = 'checkbox';
    copiarInput.checked = file.copiar;
    copiarInput.classList.add('casilla-copiar');
    copiarInput.onchange = () => file.copiar = copiarInput.checked;

    const copiarLabel = document.createElement('span');
    copiarLabel.textContent = 'Copiar ';
    copiarLabel.classList.add('texto-copiar');

    // Checkbox Eliminar
    const eliminarInput = document.createElement('input');
    eliminarInput.type = 'checkbox';
    eliminarInput.checked = file.eliminar;
    eliminarInput.classList.add('casilla-eliminar');
    eliminarInput.onchange = () => file.eliminar = eliminarInput.checked;

    const eliminarLabel = document.createElement('span');
    eliminarLabel.textContent = 'Eliminar ';
    eliminarLabel.classList.add('texto-eliminar');

    // Nombre con vista previa
    const nombreSpan = document.createElement('span');
    nombreSpan.textContent = file.nombre;
    nombreSpan.style.cursor = 'pointer';
    nombreSpan.onclick = () => {
      if (!file.directorio && window.VistaPrevia?.mostrar) {
        window.VistaPrevia.mostrar(file);
      }
      mostrarMensaje(`📄 Vista previa de: ${file.nombre}`);
    };

    // Ruta y tipo
    const ruta = document.createElement('small');
    ruta.textContent = file.ruta;

    const tipo = document.createElement('small');
    tipo.textContent = file.directorio ? ' (Carpeta)' : ' (Archivo)';
    tipo.style.color = file.directorio ? 'green' : 'blue';

    // Ensamblar
    li.appendChild(moverInput);
    li.appendChild(moverLabel);
    li.appendChild(copiarInput);
    li.appendChild(copiarLabel);
    li.appendChild(eliminarInput);
    li.appendChild(eliminarLabel);
    li.appendChild(nombreSpan);
    li.appendChild(tipo);
    li.appendChild(document.createElement('br'));
    li.appendChild(ruta);

    fragment.appendChild(li);
  }

  resultadoDiv.insertBefore(fragment, sentinela);
  indiceVisible = max;
}


const observer = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting && indiceVisible < archivos.length) {
    renderizarArchivos(archivos);
  }
}, {
  root: resultadoDiv,
  rootMargin: '0px',
  threshold: 1.0
});
observer.observe(sentinela);

document.getElementById('seleccionarCopiarCarpetas').addEventListener('click', () => {
  archivosTotales.forEach(a => {
    if (a.directorio) a.copiar = true;
  });
  limpiarResultado();
  renderizarArchivos(archivos);
});

document.getElementById('quitarSeleccionCarpetas').addEventListener('click', () => {
  archivosTotales.forEach(a => {
    if (a.directorio) a.copiar = false;
  });
  limpiarResultado();
  renderizarArchivos(archivos);
});
document.getElementById('seleccionarCopiarCarpetas').addEventListener('click', () => {
  archivosTotales.forEach(a => {
    if (a.directorio) a.copiar = true;
  });
  limpiarResultado();
  renderizarArchivos(archivos);
});

document.getElementById('quitarSeleccionCarpetas').addEventListener('click', () => {
  archivosTotales.forEach(a => {
    if (a.directorio) a.copiar = false;
  });
  limpiarResultado();
  renderizarArchivos(archivos);
});

document.getElementById('buscar').addEventListener('click', async () => {
  const origen = document.getElementById('origen').value.trim();
  if (!origen) return alert('Ingresa la carpeta origen');
  const filtroInput = document.getElementById('filtro').value.trim();
  const filtros = filtroInput ? filtroInput.split(',').map(s => s.trim()).filter(Boolean) : [];
  await cargarArchivos(origen, filtros);
});

document.getElementById('filtro').addEventListener('input', () => {
  const filtroInput = document.getElementById('filtro').value.toLowerCase();
  const filtros = filtroInput.split(',').map(f => f.trim()).filter(Boolean);
  archivos = filtros.length === 0 ? [...archivosTotales] : archivosTotales.filter(file =>
    filtros.some(filtro => file.nombre.toLowerCase().includes(filtro))
  );
  limpiarResultado();
  renderizarArchivos(archivos);
});

document.getElementById('mover').addEventListener('click', async () => {
  const destino = document.getElementById('destino').value.trim();
  if (!destino) return alert('Ingresa la carpeta destino');
  const seleccionados = archivosTotales.filter(a => a.mover);
  if (seleccionados.length === 0) return alert('Selecciona archivos o carpetas para mover');
  mostrarMensaje('🚚 Moviendo archivos/carpetas...');
  try {
    const res = await fetch('/mover', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ archivos: seleccionados, destino })
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Error HTTP ${res.status}: ${errText}`);
    }
    const data = await res.json();
    mostrarMensaje(data.mensaje);
    document.getElementById('buscar').click();
  } catch (err) {
    mostrarMensaje(`❌ Error: ${err.message}`);
  }
});

document.getElementById('copiar').addEventListener('click', async () => {
  const destino = document.getElementById('destino').value.trim();
  if (!destino) return alert('Ingresa la carpeta destino');
  const seleccionados = archivosTotales.filter(a => a.copiar);
  if (seleccionados.length === 0) return alert('Selecciona archivos o carpetas para copiar');
  mostrarMensaje('📋 Copiando archivos/carpetas...');
  try {
    const res = await fetch('/copiar', { // ojo: debes implementar esta ruta en el server
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ archivos: seleccionados, destino })
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Error HTTP ${res.status}: ${errText}`);
    }
    const data = await res.json();
    mostrarMensaje(data.mensaje);
    document.getElementById('buscar').click();
  } catch (err) {
    mostrarMensaje(`❌ Error: ${err.message}`);
  }
});

document.getElementById('eliminarSeleccionados').addEventListener('click', async () => {
  const seleccionados = archivosTotales.filter(a => a.eliminar);
  if (!seleccionados.length) return alert('Selecciona archivos o carpetas para eliminar');
  if (!confirm(`¿Eliminar ${seleccionados.length} ítems seleccionados?`)) return;
  mostrarMensaje('🗑️ Eliminando archivos/carpetas...');
  try {
    for (const archivo of seleccionados) {
      await fetch('/eliminar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ruta: archivo.ruta }),
      });
    }
    mostrarMensaje(`🗑️ Se eliminaron ${seleccionados.length} ítems.`);
    document.getElementById('buscar').click();
  } catch (err) {
    mostrarMensaje('❌ Error al eliminar: ' + err.message);
  }
});

document.getElementById('verDuplicados').addEventListener('click', async () => {
  const origen = document.getElementById('origen').value.trim();
  if (!origen) return alert('Ingresa la carpeta origen');
  mostrarMensaje('🔁 Buscando duplicados...');
  try {
    const res = await fetch('/duplicados', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ origen }),
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Error HTTP ${res.status}: ${errText}`);
    }
    const data = await res.json();
    mostrarDuplicados(data.duplicados, 'unico');
    mostrarMensaje(`🔁 Se encontraron ${data.duplicados.length} duplicados.`);
  } catch (err) {
    mostrarMensaje(`❌ Error: ${err.message}`);
  }
});

document.getElementById('borrarDuplicados').addEventListener('click', async () => {
  const origen = document.getElementById('origen').value.trim();
  if (!origen) return alert('Ingresa la carpeta origen');
  if (!confirm('¿Estás seguro de borrar todos los archivos duplicados?')) return;
  mostrarMensaje('🗑️ Borrando duplicados...');
  try {
    const res = await fetch('/borrar-duplicados', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ origen }),
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Error HTTP ${res.status}: ${errText}`);
    }
    const data = await res.json();
    mostrarMensaje(data.mensaje);
    document.getElementById('buscar').click();
  } catch (err) {
    mostrarMensaje(`❌ Error: ${err.message}`);
  }
});

document.getElementById('verCarpetasDuplicadas').addEventListener('click', async () => {
  const origen = document.getElementById('origen').value.trim();
  if (!origen) return alert('Ingresa la carpeta origen');
  mostrarMensaje('📂 Buscando carpetas duplicadas...');
  try {
    const res = await fetch('/carpetas-duplicadas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ origen }),
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Error HTTP ${res.status}: ${errText}`);
    }
    const data = await res.json();
    mostrarDuplicados(data.duplicadas, 'carpetas');
    mostrarMensaje(`📂 Se encontraron ${data.duplicadas.length} carpetas duplicadas.`);
  } catch (err) {
    mostrarMensaje(`❌ Error: ${err.message}`);
  }
});

document.getElementById('compararDuplicados').addEventListener('click', async () => {
  const ruta1 = document.getElementById('ruta1').value.trim();
  const ruta2 = document.getElementById('ruta2').value.trim();
  if (!ruta1 || !ruta2) return alert('Ingresa ambas rutas para comparar');
  mostrarMensaje('🔍 Comparando duplicados entre carpetas...');
  try {
    const res = await fetch('/comparar-duplicados', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ruta1, ruta2 }),
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Error HTTP ${res.status}: ${errText}`);
    }
    const data = await res.json();
    mostrarComparacionDuplicados(data.comparacion);
    mostrarMensaje('🔍 Comparación completada.');
  } catch (err) {
    mostrarMensaje(`❌ Error: ${err.message}`);
  }
});

function mostrarDuplicados(duplicados, tipo = 'unico') {
  const div = tipo === 'carpetas' ? document.getElementById('duplicadosLista') : document.getElementById('duplicadosLista');
  div.innerHTML = '';
  if (!duplicados || duplicados.length === 0) {
    div.innerHTML = '<p>No se encontraron duplicados.</p>';
    return;
  }
  let html = '<ul>';
  duplicados.forEach(grupo => {
    html += '<li><strong>Grupo duplicado:</strong><ul>';
    grupo.forEach(item => {
      html += `<li>${item}</li>`;
    });
    html += '</ul></li>';
  });
  html += '</ul>';
  div.innerHTML = html;
}

function mostrarComparacionDuplicados(comparacion) {
  const div = document.getElementById('comparacionRutasLista');
  div.innerHTML = '';
  if (!comparacion || comparacion.length === 0) {
    div.innerHTML = '<p>No se encontraron duplicados comunes entre carpetas.</p>';
    return;
  }
  let html = '<ul>';
  comparacion.forEach(grupo => {
    html += '<li><strong>Duplicados comunes:</strong><ul>';
    grupo.forEach(item => {
      html += `<li>${item}</li>`;
    });
    html += '</ul></li>';
  });
  html += '</ul>';
  div.innerHTML = html;
}
