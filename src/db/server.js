import jsonServer from 'json-server';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Convertir __filename y __dirname para módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Crear el servidor JSON
const server = jsonServer.create();

// Ruta al archivo bd.json
const filePath = path.join(__dirname, 'bd.json');

// Verificar si el archivo bd.json existe
if (!fs.existsSync(filePath)) {
  console.error('No se encontró el archivo bd.json en la ruta especificada.');
  process.exit(1);
}

// Cargar y parsear el contenido del archivo bd.json
const data = fs.readFileSync(filePath, 'utf-8');
const db = JSON.parse(data);

// Crear el router a partir de los datos cargados
const router = jsonServer.router(db);

// Middlewares por defecto de JSON Server
const middlewares = jsonServer.defaults();

// Usar los middlewares
server.use(middlewares);

// Reescribir las rutas
server.use(jsonServer.rewriter({
  '/api/*': '/$1',
  '/blog/:resource/:id/show': '/:resource/:id'
}));

// Usar el router
server.use(router);

// Iniciar el servidor en el puerto 3000
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
});

// Exportar el servidor para su uso en Vercel
export default server;
