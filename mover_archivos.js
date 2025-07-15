
// const fs = require('fs');
// const path = require('path');
// const crypto = require('crypto');

// // Función para recorrer archivos y carpetas recursivamente
// async function listarArchivos(dir) {
//   let archivos = [];

//   async function recorrer(ruta) {
//     const items = await fs.promises.readdir(ruta, { withFileTypes: true });
//     for (const item of items) {
//       const rutaCompleta = path.join(ruta, item.name);
//       if (item.isDirectory()) {
//         archivos.push({ nombre: item.name, ruta: rutaCompleta, directorio: true });
//         await recorrer(rutaCompleta);
//       } else {
//         archivos.push({ nombre: item.name, ruta: rutaCompleta, directorio: false });
//       }
//     }
//   }

//   await recorrer(dir);
//   return archivos;
// }

// // Función para calcular hash SHA-256 de un archivo (usada para detectar duplicados)
// function hashArchivo(rutaArchivo) {
//   return new Promise((resolve, reject) => {
//     const hash = crypto.createHash('sha256');
//     const stream = fs.createReadStream(rutaArchivo);
//     stream.on('error', (err) => {
//       // Error al leer archivo, puede ser por permisos o archivo bloqueado
//       console.error(`Error al calcular hash: ${rutaArchivo}`, err.message);
//       resolve(null); // Retornamos null para ignorar este archivo
//     });
//     stream.on('data', (chunk) => hash.update(chunk));
//     stream.on('end', () => resolve(hash.digest('hex')));
//   });
// }

// // Función para obtener duplicados en una ruta (archivos con mismo hash)
// async function obtenerDuplicados(ruta) {
//   const archivos = await listarArchivos(ruta);
//   const hashMap = new Map();

//   for (const archivo of archivos) {
//     if (archivo.directorio) continue;
//     const hash = await hashArchivo(archivo.ruta);
//     if (!hash) continue; // Ignorar archivos con error de hash
//     if (!hashMap.has(hash)) hashMap.set(hash, []);
//     hashMap.get(hash).push(archivo.ruta);
//   }

//   // Solo devolver grupos con más de un archivo (duplicados)
//   return Array.from(hashMap.values()).filter(grupo => grupo.length > 1);
// }

// // Función para borrar archivos duplicados dejando uno por grupo
// async function borrarDuplicados(ruta) {
//   const duplicados = await obtenerDuplicados(ruta);
//   let contador = 0;

//   for (const grupo of duplicados) {
//     // Dejar el primer archivo y borrar los demás
//     for (let i = 1; i < grupo.length; i++) {
//       try {
//         await fs.promises.unlink(grupo[i]);
//         contador++;
//       } catch (err) {
//         console.error(`Error al borrar archivo ${grupo[i]}: ${err.message}`);
//       }
//     }
//   }
//   return contador;
// }

// // Función para obtener carpetas duplicadas (con mismo contenido hash)
// async function obtenerCarpetasDuplicadas(ruta) {
//   const archivos = await listarArchivos(ruta);
//   const carpetas = archivos.filter(a => a.directorio);

//   // Map de hash contenido carpeta a lista de rutas
//   const hashCarpetas = new Map();

//   for (const carpeta of carpetas) {
//     const hash = await hashContenidoCarpeta(carpeta.ruta);
//     if (!hash) continue;
//     if (!hashCarpetas.has(hash)) hashCarpetas.set(hash, []);
//     hashCarpetas.get(hash).push(carpeta.ruta);
//   }

//   // Solo grupos con más de una carpeta (duplicadas)
//   return Array.from(hashCarpetas.values()).filter(grupo => grupo.length > 1);
// }

// // Función para calcular hash del contenido de una carpeta (basado en hashes de archivos)
// async function hashContenidoCarpeta(rutaCarpeta) {
//   try {
//     const archivos = await listarArchivos(rutaCarpeta);
//     const hashes = [];

//     for (const archivo of archivos) {
//       if (archivo.directorio) continue;
//       const hash = await hashArchivo(archivo.ruta);
//       if (hash) hashes.push(hash);
//     }

//     // Ordenar y concatenar hashes para un hash final representativo
//     hashes.sort();
//     const concatenado = hashes.join('');
//     const hashFinal = crypto.createHash('sha256').update(concatenado).digest('hex');
//     return hashFinal;
//   } catch (err) {
//     console.error(`Error al calcular hash carpeta ${rutaCarpeta}: ${err.message}`);
//     return null;
//   }
// }

// // Función para comparar duplicados entre dos rutas
// async function compararDuplicadosEntreRutas(ruta1, ruta2) {
//   const duplicados1 = await obtenerDuplicados(ruta1);
//   const duplicados2 = await obtenerDuplicados(ruta2);

//   // Precalcular hashes de los grupos en duplicados1
//   const gruposConHash1 = await Promise.all(
//     duplicados1.map(async (grupo) => {
//       if (grupo.length === 0) return null;
//       const hash = await hashArchivo(grupo[0]);
//       return { hash, grupo };
//     })
//   );

//   // Precalcular hashes de los grupos en duplicados2
//   const gruposConHash2 = await Promise.all(
//     duplicados2.map(async (grupo) => {
//       if (grupo.length === 0) return null;
//       const hash = await hashArchivo(grupo[0]);
//       return { hash, grupo };
//     })
//   );

//   // Filtrar nulos
//   const gruposFiltrados1 = gruposConHash1.filter(x => x !== null);
//   const gruposFiltrados2 = gruposConHash2.filter(x => x !== null);

//   // Crear mapa hash a grupos para duplicados2
//   const mapaHash2 = new Map();
//   for (const item of gruposFiltrados2) {
//     mapaHash2.set(item.hash, item.grupo);
//   }

//   const gruposComunes = [];

//   for (const item1 of gruposFiltrados1) {
//     const grupo2 = mapaHash2.get(item1.hash);
//     if (grupo2) {
//       // Unión sin duplicados
//       const union = [...new Set([...item1.grupo, ...grupo2])];
//       gruposComunes.push(union);
//     }
//   }

//   return gruposComunes;
// }

// // Funciones para mover y copiar archivos/carpetas
// async function moverArchivosSeleccionados(archivos, destino) {
//   let contador = 0;
//   for (const archivo of archivos) {
//     try {
//       const nombre = path.basename(archivo.ruta);
//       const destinoCompleto = path.join(destino, nombre);

//       // Si es carpeta, mover directorio completo
//       const stats = await fs.promises.stat(archivo.ruta);
//       if (stats.isDirectory()) {
//         await fs.promises.rename(archivo.ruta, destinoCompleto);
//       } else {
//         await fs.promises.rename(archivo.ruta, destinoCompleto);
//       }
//       contador++;
//     } catch (err) {
//       console.error(`Error moviendo ${archivo.ruta}: ${err.message}`);
//     }
//   }
//   return contador;
// }

// async function copiarArchivosSeleccionados(archivos, destino) {
//   let contador = 0;

//   async function copiarDirectorio(origen, destinoDir) {
//     await fs.promises.mkdir(destinoDir, { recursive: true });
//     const items = await fs.promises.readdir(origen, { withFileTypes: true });
//     for (const item of items) {
//       const rutaOrigen = path.join(origen, item.name);
//       const rutaDestino = path.join(destinoDir, item.name);
//       if (item.isDirectory()) {
//         await copiarDirectorio(rutaOrigen, rutaDestino);
//       } else {
//         try {
//           await fs.promises.copyFile(rutaOrigen, rutaDestino);
//           contador++;
//         } catch (err) {
//           console.error(`Error copiando archivo ${rutaOrigen}: ${err.message}`);
//         }
//       }
//     }
//   }

//   for (const archivo of archivos) {
//     try {
//       const nombre = path.basename(archivo.ruta);
//       const destinoCompleto = path.join(destino, nombre);

//       const stats = await fs.promises.stat(archivo.ruta);
//       if (stats.isDirectory()) {
//         await copiarDirectorio(archivo.ruta, destinoCompleto);
//       } else {
//         await fs.promises.copyFile(archivo.ruta, destinoCompleto);
//         contador++;
//       }
//     } catch (err) {
//       console.error(`Error copiando ${archivo.ruta}: ${err.message}`);
//     }
//   }

//   return contador;
// }

// module.exports = {
//   listarArchivos,
//   hashArchivo,
//   obtenerDuplicados,
//   borrarDuplicados,
//   obtenerCarpetasDuplicadas,
//   hashContenidoCarpeta,
//   compararDuplicadosEntreRutas,
//   moverArchivosSeleccionados,
//   copiarArchivosSeleccionados
// };
// mover_archivos.js
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const fsp = fs.promises;

// ✅ Listar archivos y carpetas recursivamente
async function listarArchivos(dir) {
  let archivos = [];

  async function recorrer(ruta) {
    const items = await fsp.readdir(ruta, { withFileTypes: true });
    for (const item of items) {
      const rutaCompleta = path.join(ruta, item.name);
      if (item.isDirectory()) {
        archivos.push({ nombre: item.name, ruta: rutaCompleta, directorio: true });
        await recorrer(rutaCompleta);
      } else {
        archivos.push({ nombre: item.name, ruta: rutaCompleta, directorio: false });
      }
    }
  }

  await recorrer(dir);
  return archivos;
}

// ✅ Hash SHA-256 de un archivo
function hashArchivo(rutaArchivo) {
  return new Promise((resolve) => {
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(rutaArchivo);
    stream.on('error', () => resolve(null));
    stream.on('data', chunk => hash.update(chunk));
    stream.on('end', () => resolve(hash.digest('hex')));
  });
}

// ✅ Duplicados por contenido (hash)
async function obtenerDuplicados(ruta) {
  const archivos = await listarArchivos(ruta);
  const hashMap = new Map();

  for (const archivo of archivos) {
    if (archivo.directorio) continue;
    const hash = await hashArchivo(archivo.ruta);
    if (!hash) continue;
    if (!hashMap.has(hash)) hashMap.set(hash, []);
    hashMap.get(hash).push(archivo.ruta);
  }

  return Array.from(hashMap.values()).filter(grupo => grupo.length > 1);
}

// ✅ Borrar duplicados dejando uno
async function borrarDuplicados(ruta) {
  const duplicados = await obtenerDuplicados(ruta);
  let contador = 0;
  for (const grupo of duplicados) {
    for (let i = 1; i < grupo.length; i++) {
      try {
        await fsp.unlink(grupo[i]);
        contador++;
      } catch (err) {
        console.error(`Error al borrar archivo ${grupo[i]}: ${err.message}`);
      }
    }
  }
  return contador;
}

// ✅ Hash del contenido de una carpeta
async function hashContenidoCarpeta(rutaCarpeta) {
  try {
    const archivos = await listarArchivos(rutaCarpeta);
    const hashes = [];

    for (const archivo of archivos) {
      if (archivo.directorio) continue;
      const hash = await hashArchivo(archivo.ruta);
      if (hash) hashes.push(hash);
    }

    hashes.sort();
    const concatenado = hashes.join('');
    const hashFinal = crypto.createHash('sha256').update(concatenado).digest('hex');
    return hashFinal;
  } catch (err) {
    console.error(`Error al calcular hash carpeta ${rutaCarpeta}: ${err.message}`);
    return null;
  }
}

// ✅ Carpetas duplicadas por contenido
async function obtenerCarpetasDuplicadas(ruta) {
  const archivos = await listarArchivos(ruta);
  const carpetas = archivos.filter(a => a.directorio);
  const hashCarpetas = new Map();

  for (const carpeta of carpetas) {
    const hash = await hashContenidoCarpeta(carpeta.ruta);
    if (!hash) continue;
    if (!hashCarpetas.has(hash)) hashCarpetas.set(hash, []);
    hashCarpetas.get(hash).push(carpeta.ruta);
  }

  return Array.from(hashCarpetas.values()).filter(grupo => grupo.length > 1);
}

// ✅ Comparar duplicados entre dos rutas
async function compararDuplicadosEntreRutas(ruta1, ruta2) {
  const duplicados1 = await obtenerDuplicados(ruta1);
  const duplicados2 = await obtenerDuplicados(ruta2);

  const gruposConHash1 = await Promise.all(
    duplicados1.map(async grupo => {
      const hash = await hashArchivo(grupo[0]);
      return hash ? { hash, grupo } : null;
    })
  );

  const gruposConHash2 = await Promise.all(
    duplicados2.map(async grupo => {
      const hash = await hashArchivo(grupo[0]);
      return hash ? { hash, grupo } : null;
    })
  );

  const mapaHash2 = new Map();
  for (const item of gruposConHash2.filter(Boolean)) {
    mapaHash2.set(item.hash, item.grupo);
  }

  const comunes = [];
  for (const item of gruposConHash1.filter(Boolean)) {
    const otroGrupo = mapaHash2.get(item.hash);
    if (otroGrupo) {
      const union = [...new Set([...item.grupo, ...otroGrupo])];
      comunes.push(union);
    }
  }

  return comunes;
}

// ✅ Mover archivos o carpetas
async function moverArchivosSeleccionados(archivos, destino) {
  let contador = 0;
  for (const archivo of archivos) {
    try {
      const nombre = path.basename(archivo.ruta);
      const destinoCompleto = path.join(destino, nombre);
      const stats = await fsp.stat(archivo.ruta);
      await fsp.rename(archivo.ruta, destinoCompleto);
      contador++;
    } catch (err) {
      console.error(`Error moviendo ${archivo.ruta}: ${err.message}`);
    }
  }
  return contador;
}

// ✅ Copiar archivos o carpetas
async function copiarArchivosSeleccionados(archivos, destino) {
  let contador = 0;

  async function copiarDirectorio(origen, destinoDir) {
    await fsp.mkdir(destinoDir, { recursive: true });
    const items = await fsp.readdir(origen, { withFileTypes: true });
    for (const item of items) {
      const rutaOrigen = path.join(origen, item.name);
      const rutaDestino = path.join(destinoDir, item.name);
      if (item.isDirectory()) {
        await copiarDirectorio(rutaOrigen, rutaDestino);
      } else {
        try {
          await fsp.copyFile(rutaOrigen, rutaDestino);
          contador++;
        } catch (err) {
          console.error(`Error copiando archivo ${rutaOrigen}: ${err.message}`);
        }
      }
    }
  }

  for (const archivo of archivos) {
    try {
      const nombre = path.basename(archivo.ruta);
      const destinoCompleto = path.join(destino, nombre);
      const stats = await fsp.stat(archivo.ruta);
      if (stats.isDirectory()) {
        await copiarDirectorio(archivo.ruta, destinoCompleto);
      } else {
        await fsp.copyFile(archivo.ruta, destinoCompleto);
        contador++;
      }
    } catch (err) {
      console.error(`Error copiando ${archivo.ruta}: ${err.message}`);
    }
  }

  return contador;
}

module.exports = {
  listarArchivos,
  hashArchivo,
  obtenerDuplicados,
  borrarDuplicados,
  obtenerCarpetasDuplicadas,
  hashContenidoCarpeta,
  compararDuplicadosEntreRutas,
  moverArchivosSeleccionados,
  copiarArchivosSeleccionados
};
