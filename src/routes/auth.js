const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Ruta para registrar un usuario nuevo
router.post('/registro', async (req, res) => {
  const { nombre, email, password } = req.body;

  // Validar datos básicos
  if (!nombre || !email || !password) {
    return res.status(400).json({ mensaje: 'Por favor, completa todos los campos.' });
  }

  try {
    // Verificar si el usuario ya existe
    let usuario = await User.findOne({ email });
    if (usuario) {
      return res.status(400).json({ mensaje: 'El usuario ya existe.' });
    }

    // Crear usuario nuevo
    usuario = new User({ nombre, email, password });

    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    usuario.password = await bcrypt.hash(password, salt);

    // Guardar en la base de datos
    await usuario.save();

    res.status(201).json({ mensaje: 'Usuario registrado correctamente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error del servidor.' });
  }
});

// Ruta para login de usuario
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Validar datos básicos
  if (!email || !password) {
    return res.status(400).json({ mensaje: 'Por favor, completa todos los campos.' });
  }

  try {
    // Buscar usuario
    const usuario = await User.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ mensaje: 'Usuario o contraseña incorrectos.' });
    }

    // Comparar contraseña
    const esPasswordCorrecto = await bcrypt.compare(password, usuario.password);
    if (!esPasswordCorrecto) {
      return res.status(400).json({ mensaje: 'Usuario o contraseña incorrectos.' });
    }

    res.json({ mensaje: 'Login exitoso.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error del servidor.' });
  }
});

module.exports = router;
