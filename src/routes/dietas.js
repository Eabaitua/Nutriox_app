const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');

const Dieta = require('../models/Dieta');

// Middleware para validar creación de dieta
const validarCrearDieta = [
  body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
  body('calorias').isNumeric().withMessage('Calorías debe ser un número'),
  body('usuarioId').notEmpty().withMessage('El ID de usuario es obligatorio'),
];

// Middleware para validar receta en dieta
const validarReceta = [
  body('recetaId').notEmpty().withMessage('Falta el ID de la receta'),
];

// Middleware para validar parámetros de ruta
const validarId = [
  param('usuarioId').notEmpty().withMessage('ID de usuario es obligatorio'),
];

// Crear una dieta nueva
router.post('/', validarCrearDieta, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errores: errors.array() });

  const { nombre, descripcion, calorias, usuarioId } = req.body;

  try {
    const nuevaDieta = new Dieta({
      nombre,
      descripcion,
      calorias,
      usuario: usuarioId,
    });

    const dietaGuardada = await nuevaDieta.save();
    res.status(201).json({ success: true, data: dietaGuardada, mensaje: 'Dieta creada correctamente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, mensaje: 'Error al crear la dieta.' });
  }
});

// Obtener todas las dietas de un usuario
router.get('/:usuarioId', validarId, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errores: errors.array() });

  const { usuarioId } = req.params;

  try {
    const dietas = await Dieta.find({ usuario: usuarioId });
    res.json({ success: true, data: dietas });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, mensaje: 'Error al obtener las dietas.' });
  }
});

// Eliminar una dieta por su ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const dieta = await Dieta.findByIdAndDelete(id);
    if (!dieta) return res.status(404).json({ success: false, mensaje: 'Dieta no encontrada.' });

    res.json({ success: true, mensaje: 'Dieta eliminada correctamente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, mensaje: 'Error al eliminar la dieta.' });
  }
});

// Añadir una receta a una dieta
router.post('/:dietaId/recetas', validarReceta, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errores: errors.array() });

  const { dietaId } = req.params;
  const { recetaId } = req.body;

  try {
    const dieta = await Dieta.findById(dietaId);
    if (!dieta) return res.status(404).json({ success: false, mensaje: 'Dieta no encontrada.' });

    if (dieta.recetas.includes(recetaId)) {
      return res.status(400).json({ success: false, mensaje: 'La receta ya está en la dieta.' });
    }

    dieta.recetas.push(recetaId);
    await dieta.save();

    res.status(200).json({ success: true, mensaje: 'Receta añadida a la dieta correctamente.', data: dieta });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, mensaje: 'Error al añadir la receta a la dieta.' });
  }
});

// Obtener una dieta con sus recetas (populate)
router.get('/:id/completa', async (req, res) => {
  const { id } = req.params;

  try {
    const dieta = await Dieta.findById(id).populate('recetas');
    if (!dieta) return res.status(404).json({ success: false, mensaje: 'Dieta no encontrada.' });

    res.json({ success: true, data: dieta });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, mensaje: 'Error al obtener la dieta.' });
  }
});

module.exports = router;
