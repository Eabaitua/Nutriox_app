const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Ruta para obtener datos del perfil por ID de usuario
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password'); // Excluye password
    if (!user) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener el perfil' });
  }
});

// Ruta para actualizar perfil (nombre, email)
router.put('/:userId', async (req, res) => {
  const { nombre, email } = req.body;

  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    // Actualizamos campos si vienen en el body
    if (nombre) user.nombre = nombre;
    if (email) user.email = email;

    await user.save();

    res.json({ mensaje: 'Perfil actualizado', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar el perfil' });
  }
});

// Ruta para cambiar contraseña
router.put('/:userId/password', async (req, res) => {
  const { passwordActual, nuevaPassword } = req.body;

  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    // Comprobar password actual
    const esCorrecto = await bcrypt.compare(passwordActual, user.password);
    if (!esCorrecto) {
      return res.status(400).json({ mensaje: 'Contraseña actual incorrecta' });
    }

    // Hashear nueva contraseña y guardar
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(nuevaPassword, salt);
    await user.save();

    res.json({ mensaje: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al cambiar la contraseña' });
  }
});

module.exports = router;
