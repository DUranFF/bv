const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const fsp = fs.promises;

class Comparador {

  // Recorrer archivos y carpetas recursivamente
  static async listarArchivos(dir) {
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

  // Calcular hash SHA-256 archivo
  static hashArchivo(rutaArchivo) {
    return new Promise((resolve) => {
      const hash = crypto.createHash('sha256');
      const stream = fs.createReadStream(rutaArchivo);
      stream.on('error', () => resolve(null));
      stream.on('data', chunk => hash.update(chunk));
      stream.on('end', () => resolve(hash.digest('hex')));
    });
  }

  // Obtener archivos duplicados (mismo hash)
  static async obtenerDuplicados(ruta) {
    const archivos = await this.listarArchivos(ruta);
    const hashMap = new Map();

    for (const archivo of archivos) {
      if (archivo.directorio) continue;
      const hash = await this.hashArchivo(archivo.ruta);
      if (!hash) continue;
      if (!hashMap.has(hash)) hashMap.set(hash, []);
      hashMap.get(hash).push(archivo.ruta);
    }

    return Array.from(hashMap.values()).filter(grupo => grupo.length > 1);
  }

  // Borrar duplicados dejando uno por grupo
  static async borrarDuplicados(ruta) {
    const duplicados = await this.obtenerDuplicados(ruta);
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

  // Calcular hash del contenido de carpeta (hash concat de hashes archivos)
  static async hashContenidoCarpeta(rutaCarpeta) {
    try {
      const archivos = await this.listarArchivos(rutaCarpeta);
      const hashes = [];

      for (const archivo of archivos) {
        if (archivo.directorio) continue;
        const hash = await this.hashArchivo(archivo.ruta);
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

  // Obtener carpetas duplicadas (mismo contenido)
  static async obtenerCarpetasDuplicadas(ruta) {
    const archivos = await this.listarArchivos(ruta);
    const carpetas = archivos.filter(a => a.directorio);
    const hashCarpetas = new Map();

    for (const carpeta of carpetas) {
      const hash = await this.hashContenidoCarpeta(carpeta.ruta);
      if (!hash) continue;
      if (!hashCarpetas.has(hash)) hashCarpetas.set(hash, []);
      hashCarpetas.get(hash).push(carpeta.ruta);
    }

    return Array.from(hashCarpetas.values()).filter(grupo => grupo.length > 1);
  }

  // Comparar duplicados entre dos rutas (unir duplicados comunes)
  static async compararDuplicadosEntreRutas(ruta1, ruta2) {
    const duplicados1 = await this.obtenerDuplicados(ruta1);
    const duplicados2 = await this.obtenerDuplicados(ruta2);

    const gruposConHash1 = await Promise.all(
      duplicados1.map(async grupo => {
        const hash = await this.hashArchivo(grupo[0]);
        return hash ? { hash, grupo } : null;
      })
    );

    const gruposConHash2 = await Promise.all(
      duplicados2.map(async grupo => {
        const hash = await this.hashArchivo(grupo[0]);
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

}

module.exports = Comparador;
