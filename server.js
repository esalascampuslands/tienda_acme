import express from 'express';
import cookieParser from 'cookie-parser';
import 'dotenv/config';

import productosRouter from './routes/productos.router.js';
import usuariosRouter from './routes/usuarios.router.js';

const server = express();

const PORT = process.env.SERVER_PORT || 3000;

server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cookieParser('LlaveDeCookie123*'));

// Aquí van las rutas
server.use('/productos', productosRouter);
server.use('/usuarios', usuariosRouter);

// Manejo de error ruta no existente
server.use((req, res)=>{
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejo erorr global (Cualquier otro error que ocurra)
server.use((err, req, res)=>{
  console.log('Error interno: ', err)
  res.status(404).json({ error: 'Error interno del servidor' });
});

server.use(manejadorErrores);

function manejadorErrores( err, req, res, next){
  res.status(err.statusCode || 500 ).json({
    mensaje: err.message || 'Error interno de servidor',
    errores: err.details || null
  })
}

server.listen( PORT, ()=> console.log(`Server running on http://localhost:${PORT}`));