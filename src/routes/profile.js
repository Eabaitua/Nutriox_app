const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { body, param, validationResult } = require('express-validator');

// Validaciones comunes
const validarUserId = [
  param('userId').isMongoId().withMessage('ID de usuario inválido'),
];

// Validación para actualizar perfil
const validarActualizarPerfil = [
  body('nombre').optional().isLength({ min: 2 }).withMessage('Nombre debe tener al menos 2 caracteres'),
  body('email').optional().isEmail().withMessage('Email inválido'),
];

// Validación para cambiar contraseña
const validarCambiarPassword = [
  body('passwordActual').notEmpty().withMessage('Contraseña actual es requerida'),
  body('nuevaPassword').isLength({ min: 6 }).withMessage('La nueva contraseña debe tener al menos 6 caracteres'),
];

// Obtener datos del perfil por ID
router.get('/:userId', validarUserId, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errores: errors.array() });

  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

    res.json({ success: true, data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener el perfil' });
  }
});

// Actualizar perfil (nombre, email)
router.put('/:userId', [...validarUserId, ...validarActualizarPerfil], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errores: errors.array() });

  const { nombre, email } = req.body;

  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

    if (nombre) user.nombre = nombre;
    if (email) user.email = email;

    await user.save();

    res.json({ success: true, mensaje: 'Perfil actualizado', data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar el perfil' });
  }
});

// Cambiar contraseña
router.put('/:userId/password', [...validarUserId, ...validarCambiarPassword], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errores: errors.array() });

  const { passwordActual, nuevaPassword } = req.body;

  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

    const esCorrecto = await bcrypt.compare(passwordActual, user.password);
    if (!esCorrecto) return res.status(400).json({ mensaje: 'Contraseña actual incorrecta' });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(nuevaPassword, salt);
    await user.save();

    res.json({ success: true, mensaje: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al cambiar la contraseña' });
  }
});

module.exports = router;
