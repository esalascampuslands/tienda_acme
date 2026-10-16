import { Router } from 'express';
import { validationResult } from 'express-validator';
import { hashSync } from 'bcrypt';

import pool from './../config/db.js';
import UsuarioCrearDTO from '../dto/usuario.crear.dto.js';
import UsuarioObtenerDTO from '../dto/usuario.obtener.dto.js';

import usuarioCrearValidaciones from '../validaciones/usuario.crear.validaciones.js';
import autorizarUsuario from '../util/autorizar-usuario.js';

const usuariosRouter = Router();


usuariosRouter.get('/:id', autorizarUsuario, async ( req, res, next )=>{
  try{
    const [ rows ] = await pool.execute('SELECT * FROM usuarios WHERE id = ?', [ req.params.id ]);
    if(rows.length === 0){
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    const usuario = new UsuarioObtenerDTO(rows[0]);
    res.json(usuario.data);
  }
  catch(error){
    next(error);
  }
});

usuariosRouter.post('/', usuarioCrearValidaciones, manejadorErroresValidacion, async ( req, res, next )=>{
  try{
    const usuario = new UsuarioCrearDTO({
      ...req.body,
      contrasena: hashSync(req.body.contrasena, 10)
    });
    const [ result ] = await pool.execute(
      'INSERT INTO usuarios(DPI, nombre, email, telefono, contrasena) VALUES ( ?, ?, ?, ?, ?)',
      [ usuario.identificacion, usuario.nombre, usuario.email, usuario.telefono, usuario.contrasena ]
    );
    res.status(201).json({
      id: result.insertId,
      mensaje: 'Usuario registrado con éxito.'
    });
  }
  catch(error){
    next(error);
  }
});

usuariosRouter.post('/login', async (req, res, next )=>{
  try{
    const { email, contrasena } = req.body;
    const [ rows ] = await pool.execute('SELECT * FROM usuarios WHERE email = ?', [ email ]);
    if(rows.length === 0){
      return res.status(401).json({ error: 'Usuario o contraseña inválida' });
    }
    else{
      const usuario = rows[0];
      if(usuario.contrasena === contrasena){
        const usuario = new UsuarioObtenerDTO(rows[0]);
        res.cookie('auth', usuario.identificacion, { 
          signed: true,
          maxAge: 2*60*60*1000
         });
        res.json(usuario.data);
      }
      else{
        res.status(401).json({ error: 'Usuario o contraseña inválida' });
      }
    }
  }
  catch(error){
    next(error);
  }
})

function manejadorErroresValidacion(req, res, next){
  const errores = validationResult(req);
  if(!errores.isEmpty()){
    const err = new Error('Errores de validación');
    err.statusCode = 400;
    err.details = errores.array()
    return next(err);
  }
  next();
}

export default usuariosRouter;