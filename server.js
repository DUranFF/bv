
// const express = require('express');
// const path = require('path');
// const fs = require('fs');
// const url = require('url');
// const os = require('os');

// const {
//   listarArchivos,
//   moverArchivosSeleccionados,
//   copiarArchivosSeleccionados,
//   obtenerDuplicados,
//   borrarDuplicados,
//   obtenerCarpetasDuplicadas,
//   compararDuplicadosEntreRutas
// } = require('./mover_archivos');

// const app = express();
// app.use(express.json());
// app.use(express.static(path.join(__dirname, 'public')));

// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

// // ✅ LISTAR ARCHIVOS
// app.post('/listar', async (req, res) => {
//   const { origen, filtros } = req.body;
//   try {
//     let archivos = await listarArchivos(origen);

//     if (filtros && Array.isArray(filtros)) {
//       const filtrosLimpios = filtros.map(f => f.toLowerCase().trim()).filter(Boolean);
//       if (filtrosLimpios.length > 0) {
//         archivos = archivos.filter(a =>
//           filtrosLimpios.some(filtro => a.nombre.toLowerCase().includes(filtro))
//         );
//       }
//     }

//     res.json({ archivos });
//   } catch (err) {
//     res.status(500).json({ mensaje: `❌ Error: ${err.message}` });
//   }
// });

// // ✅ MOVER ARCHIVOS
// app.post('/mover', async (req, res) => {
//   const { archivos, destino } = req.body;
//   try {
//     const movidos = await moverArchivosSeleccionados(archivos, destino);
//     res.json({ mensaje: `✅ ${movidos} archivos/carpetas movidos.` });
//   } catch (err) {
//     res.status(500).json({ mensaje: `❌ Error al mover: ${err.message}` });
//   }
// });

// // ✅ COPIAR ARCHIVOS Y CARPETAS
// app.post('/copiar', async (req, res) => {
//   const { archivos, destino } = req.body;
//   try {
//     const copiados = await copiarArchivosSeleccionados(archivos, destino);
//     res.json({ mensaje: `📋 ${copiados} archivos/carpetas copiados.` });
//   } catch (err) {
//     res.status(500).json({ mensaje: `❌ Error al copiar: ${err.message}` });
//   }
// });

// // ✅ OBTENER DUPLICADOS
// app.post('/duplicados', async (req, res) => {
//   const { origen } = req.body;
//   try {
//     const duplicados = await obtenerDuplicados(origen);
//     res.json({ duplicados });
//   } catch (err) {
//     res.status(500).json({ mensaje: `❌ Error: ${err.message}` });
//   }
// });

// // ✅ BORRAR DUPLICADOS
// app.post('/borrar-duplicados', async (req, res) => {
//   const { origen } = req.body;
//   try {
//     const borrados = await borrarDuplicados(origen);
//     res.json({ mensaje: `🗑️ ${borrados} duplicados eliminados.` });
//   } catch (err) {
//     res.status(500).json({ mensaje: `❌ Error: ${err.message}` });
//   }
// });

// // ✅ OBTENER CARPETAS DUPLICADAS
// app.post('/carpetas-duplicadas', async (req, res) => {
//   const { origen } = req.body;
//   try {
//     const duplicadas = await obtenerCarpetasDuplicadas(origen);
//     res.json({ duplicadas });
//   } catch (err) {
//     res.status(500).json({ mensaje: `❌ Error: ${err.message}` });
//   }
// });

// // ✅ COMPARAR DUPLICADOS ENTRE RUTAS
// app.post('/comparar-duplicados', async (req, res) => {
//   const { ruta1, ruta2 } = req.body;
//   try {
//     const comparacion = await compararDuplicadosEntreRutas(ruta1, ruta2);
//     res.json({ comparacion });
//   } catch (err) {
//     res.status(500).json({ mensaje: `❌ Error: ${err.message}` });
//   }
// });

// // ✅ ELIMINAR UN ARCHIVO
// app.post('/eliminar', (req, res) => {
//   const { ruta } = req.body;
//   try {
//     if (!ruta || !fs.existsSync(ruta)) {
//       return res.status(400).json({ mensaje: 'Archivo no encontrado' });
//     }
//     fs.unlinkSync(ruta);
//     res.json({ mensaje: `🗑️ Archivo eliminado: ${ruta}` });
//   } catch (err) {
//     res.status(500).json({ mensaje: `❌ Error al eliminar: ${err.message}` });
//   }
// });

// // ✅ VER ARCHIVO (PDF, JPG, PNG, etc.)
// app.get('/archivo', (req, res) => {
//   const queryObject = url.parse(req.url, true).query;
//   const filePath = queryObject.path;
//   if (!filePath || !path.isAbsolute(filePath)) {
//     return res.status(400).send('Ruta inválida');
//   }
//   if (!fs.existsSync(filePath)) {
//     return res.status(404).send('Archivo no encontrado');
//   }

//   const stat = fs.statSync(filePath);
//   const fileSize = stat.size;
//   const ext = path.extname(filePath).toLowerCase();

//   const tiposMime = {
//     '.pdf': 'application/pdf',
//     '.jpg': 'image/jpeg',
//     '.jpeg': 'image/jpeg',
//     '.png': 'image/png',
//     '.gif': 'image/gif',
//     '.bmp': 'image/bmp',
//     '.webp': 'image/webp',
//     '.txt': 'text/plain',
//     '.html': 'text/html',
//     '.js': 'application/javascript',
//     '.json': 'application/json',
//     '.css': 'text/css',
//     '.php': 'application/x-httpd-php',
//     '.log': 'text/plain',
//     '.csv': 'text/csv',
//     '.md': 'text/markdown'
//   };

//   const tipo = tiposMime[ext] || 'application/octet-stream';
//   res.setHeader('Content-Type', tipo);

//   const range = req.headers.range;
//   if (range) {
//     const partes = range.replace(/bytes=/, "").split("-");
//     const inicio = parseInt(partes[0], 10);
//     const fin = partes[1] ? parseInt(partes[1], 10) : fileSize - 1;

//     if (inicio >= fileSize || fin >= fileSize) {
//       res.status(416).send('Requested range not satisfiable');
//       return;
//     }

//     res.status(206);
//     res.setHeader('Content-Range', `bytes ${inicio}-${fin}/${fileSize}`);
//     res.setHeader('Accept-Ranges', 'bytes');
//     res.setHeader('Content-Length', (fin - inicio) + 1);

//     const stream = fs.createReadStream(filePath, { start: inicio, end: fin });
//     stream.pipe(res);
//   } else {
//     res.setHeader('Content-Length', fileSize);
//     const stream = fs.createReadStream(filePath);
//     stream.pipe(res);
//   }
// });

// const PORT = 3005;
// const ip = Object.values(os.networkInterfaces())
//   .flat()
//   .find(i => i.family === 'IPv4' && !i.internal)?.address || 'localhost';

// app.listen(PORT, '0.0.0.0', () => {
//   console.log(`🟢 Servidor corriendo en:
//   👉 Local:     http://localhost:${PORT}
//   🌐 Red local: http://${ip}:${PORT}`);
// });
const express = require('express');
const path = require('path');
const fs = require('fs');
const url = require('url');
const os = require('os');

const {
  listarArchivos,
  moverArchivosSeleccionados,
  copiarArchivosSeleccionados
} = require('./mover_archivos');

const Comparador = require('./comparador'); // ✅ nueva clase para comparar y duplicados

const app = express();

// 🔧 Aumentar límite de tamaño del body a 100MB
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/listar', async (req, res) => {
  const { origen, filtros } = req.body;
  try {
    let archivos = await listarArchivos(origen);
    if (filtros && Array.isArray(filtros)) {
      const filtrosLimpios = filtros.map(f => f.toLowerCase().trim()).filter(Boolean);
      if (filtrosLimpios.length > 0) {
        archivos = archivos.filter(a =>
          filtrosLimpios.some(filtro => a.nombre.toLowerCase().includes(filtro))
        );
      }
    }
    res.json({ archivos });
  } catch (err) {
    res.status(500).json({ mensaje: `❌ Error: ${err.message}` });
  }
});

app.post('/mover', async (req, res) => {
  const { archivos, destino } = req.body;
  try {
    const movidos = await moverArchivosSeleccionados(archivos, destino);
    res.json({ mensaje: `✅ ${movidos} archivos/carpetas movidos.` });
  } catch (err) {
    res.status(500).json({ mensaje: `❌ Error al mover: ${err.message}` });
  }
});

app.post('/copiar', async (req, res) => {
  const { archivos, destino } = req.body;
  try {
    const copiados = await copiarArchivosSeleccionados(archivos, destino);
    res.json({ mensaje: `📋 ${copiados} archivos/carpetas copiados.` });
  } catch (err) {
    res.status(500).json({ mensaje: `❌ Error al copiar: ${err.message}` });
  }
});

app.post('/duplicados', async (req, res) => {
  const { origen } = req.body;
  try {
    const duplicados = await Comparador.obtenerDuplicados(origen);
    res.json({ duplicados });
  } catch (err) {
    res.status(500).json({ mensaje: `❌ Error: ${err.message}` });
  }
});

app.post('/borrar-duplicados', async (req, res) => {
  const { origen } = req.body;
  try {
    const borrados = await Comparador.borrarDuplicados(origen);
    res.json({ mensaje: `🗑️ ${borrados} duplicados eliminados.` });
  } catch (err) {
    res.status(500).json({ mensaje: `❌ Error: ${err.message}` });
  }
});

app.post('/carpetas-duplicadas', async (req, res) => {
  const { origen } = req.body;
  try {
    const duplicadas = await Comparador.obtenerCarpetasDuplicadas(origen);
    res.json({ duplicadas });
  } catch (err) {
    res.status(500).json({ mensaje: `❌ Error: ${err.message}` });
  }
});

app.post('/comparar-duplicados', async (req, res) => {
  const { ruta1, ruta2 } = req.body;
  try {
    if (!ruta1 || !ruta2) {
      return res.status(400).json({ mensaje: '❌ Faltan rutas para comparar.' });
    }
    const comparacion = await Comparador.compararDuplicadosEntreRutas(ruta1, ruta2);
    res.json({ comparacion });
  } catch (err) {
    res.status(500).json({ mensaje: `❌ Error: ${err.message}` });
  }
});

app.post('/eliminar', (req, res) => {
  const { ruta } = req.body;
  try {
    if (!ruta || !fs.existsSync(ruta)) {
      return res.status(400).json({ mensaje: 'Archivo no encontrado' });
    }
    fs.unlinkSync(ruta);
    res.json({ mensaje: `🗑️ Archivo eliminado: ${ruta}` });
  } catch (err) {
    res.status(500).json({ mensaje: `❌ Error al eliminar: ${err.message}` });
  }
});

app.get('/archivo', (req, res) => {
  const queryObject = url.parse(req.url, true).query;
  const filePath = queryObject.path;
  if (!filePath || !path.isAbsolute(filePath)) {
    return res.status(400).send('Ruta inválida');
  }
  if (!fs.existsSync(filePath)) {
    return res.status(404).send('Archivo no encontrado');
  }

  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const ext = path.extname(filePath).toLowerCase();

  const tiposMime = {
    '.pdf': 'application/pdf',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.bmp': 'image/bmp',
    '.webp': 'image/webp',
    '.txt': 'text/plain',
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.css': 'text/css',
    '.php': 'application/x-httpd-php',
    '.log': 'text/plain',
    '.csv': 'text/csv',
    '.md': 'text/markdown'
  };

  const tipo = tiposMime[ext] || 'application/octet-stream';
  res.setHeader('Content-Type', tipo);

  const range = req.headers.range;
  if (range) {
    const partes = range.replace(/bytes=/, "").split("-");
    const inicio = parseInt(partes[0], 10);
    const fin = partes[1] ? parseInt(partes[1], 10) : fileSize - 1;

    if (inicio >= fileSize || fin >= fileSize) {
      res.status(416).send('Requested range not satisfiable');
      return;
    }

    res.status(206);
    res.setHeader('Content-Range', `bytes ${inicio}-${fin}/${fileSize}`);
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Content-Length', (fin - inicio) + 1);

    const stream = fs.createReadStream(filePath, { start: inicio, end: fin });
    stream.pipe(res);
  } else {
    res.setHeader('Content-Length', fileSize);
    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  }
});

const PORT = 3005;
const ip = Object.values(os.networkInterfaces())
  .flat()
  .find(i => i.family === 'IPv4' && !i.internal)?.address || 'localhost';

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🟢 Servidor corriendo en:\n👉 Local:     http://localhost:${PORT}\n🌐 Red local: http://${ip}:${PORT}`);
});
