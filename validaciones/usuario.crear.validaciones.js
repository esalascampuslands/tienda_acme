import { body } from 'express-validator';

const usuarioCrearValidaciones = [
  body('identificacion').notEmpty().withMessage('La identificación es obligatoria').isNumeric().withMessage('La identificación es numérica'),
  body('nombre').notEmpty().withMessage('El nombre es obligatorio').isString().withMessage('El nombre debe ser un texto').trim(),
  body('email').notEmpty().withMessage('El email obligatorio').isEmail().withMessage('El email debe ser válido').normalizeEmail()
];

export default usuarioCrearValidaciones;