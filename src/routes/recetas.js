const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');

const Receta = require('../models/Receta');

// Validación para IDs de Mongo
const validarId = [
  param('id').isMongoId().withMessage('ID inválido'),
];

// Validación para creación y actualización de receta
const validarReceta = [
  body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
  body('ingredientes').isArray({ min: 1 }).withMessage('Debe haber al menos un ingrediente'),
  body('calorias').isNumeric().withMessage('Las calorías deben ser un número'),
  body('usuarioId').optional().isMongoId().withMessage('ID de usuario inválido'),
];

// Crear receta
router.post('/', validarReceta, async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  const { nombre, ingredientes, calorias, usuarioId } = req.body;

  try {
    const nuevaReceta = new Receta({
      nombre,
      ingredientes,
      calorias,
      usuario: usuarioId
    });

    const recetaGuardada = await nuevaReceta.save();
    res.status(201).json({ success: true, data: recetaGuardada });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al crear la receta.' });
  }
});

// Obtener todas las recetas de un usuario
router.get('/:usuarioId', [
  param('usuarioId').isMongoId().withMessage('ID de usuario inválido'),
], async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  try {
    const recetas = await Receta.find({ usuario: req.params.usuarioId });
    res.json({ success: true, data: recetas });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener las recetas.' });
  }
});

// Eliminar receta por ID
router.delete('/:id', validarId, async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  try {
    const receta = await Receta.findByIdAndDelete(req.params.id);
    if (!receta) {
      return res.status(404).json({ mensaje: 'Receta no encontrada.' });
    }

    res.json({ success: true, mensaje: 'Receta eliminada correctamente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al eliminar la receta.' });
  }
});

// Actualizar receta por ID
router.put('/:id', [...validarId, ...validarReceta], async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  const { nombre, ingredientes, calorias, usuarioId } = req.body;

  try {
    const receta = await Receta.findById(req.params.id);
    if (!receta) {
      return res.status(404).json({ mensaje: 'Receta no encontrada.' });
    }

    // Actualizamos solo los campos que vienen
    if (nombre) receta.nombre = nombre;
    if (ingredientes) receta.ingredientes = ingredientes;
    if (calorias) receta.calorias = calorias;
    if (usuarioId) receta.usuario = usuarioId;

    const recetaActualizada = await receta.save();

    res.json({ success: true, data: recetaActualizada });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar la receta.' });
  }
});

module.exports = router;
