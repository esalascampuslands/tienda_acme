import { Router } from 'express';

import pool from './../config/db.js';
import autorizarUsuario from '../util/autorizar-usuario.js';

const productosRouter = Router();

productosRouter.get('/', autorizarUsuario, async ( req, res, next )=>{
  try{
    const [ rows ] = await pool.query('SELECT id, codigo, nombre, descripcion, precio, activo, creado_en FROM productos');
    res.json(rows);
  }
  catch(error){
    next(error);
  }
});

// Obtener la info de un producto por id
productosRouter.get('/:id', async ( req, res, next )=>{
  try{
    const [ rows ] = await pool.execute('SELECT id, codigo, nombre, descripcion, precio, activo, creado_en FROM productos WHERE id = ?', [ req.params.id ]);
    if(rows.length === 0){
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(rows[0]);
  }
  catch(error){
    next(error);
  }
});

productosRouter.post('/', async ( req, res, next )=>{
  try{
    const { codigo, nombre, descripcion, precio } = req.body;
    if(!codigo || !nombre || !precio ){
      return res.status(400).json({ error: 'Código, nombre y precio son obligatorios' });
    }
    const [ result ] = await pool.execute('INSERT INTO productos(codigo, nombre, descripcion, precio) VALUES ( ?, ?, ?, ? )', [ codigo, nombre, descripcion || '', precio ]);
    res.status(201).json({
      id: result.insertId,
      mensaje: 'Producto registrado con éxito.'
    });
  }catch(error){
    next(error);
  }
});

productosRouter.put('/:id', async ( req, res, next )=>{
  try{
    const { id } = req.params;
    const { codigo, nombre, descripcion, precio, activo } = req.body;
    console.log(codigo, nombre);
    
    const [ result ] = await pool.execute('UPDATE productos SET codigo=IFNULL(?, codigo), nombre=IFNULL(?, nombre), descripcion=IFNULL(?, descripcion), precio=IFNULL(?, precio), activo=IFNULL(?, activo) WHERE id = ?', [codigo || null, nombre || null, descripcion || null, precio || null, activo !== 0 ? true: false, id]);

    if( result.affectedRows === 0 ){
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json({ mensaje: 'Producto actualizado correctamente'});

  }catch(error){
    next(error);
  }
});

export default productosRouter;