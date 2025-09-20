const express = require('express');
const router = express.Router();

const Dieta = require('../models/Dieta');
const User = require('../models/User'); // Por si lo necesitas más adelante

// Crear una dieta nueva
router.post('/', async (req, res) => {
  const { nombre, descripcion, calorias, usuarioId } = req.body;

  if (!nombre || !calorias || !usuarioId) {
    return res.status(400).json({ mensaje: 'Faltan campos obligatorios.' });
  }

  try {
    const nuevaDieta = new Dieta({
      nombre,
      descripcion,
      calorias,
      usuario: usuarioId
    });

    const dietaGuardada = await nuevaDieta.save();
    res.status(201).json(dietaGuardada);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al crear la dieta.' });
  }
});

// Obtener todas las dietas de un usuario
router.get('/:usuarioId', async (req, res) => {
  const { usuarioId } = req.params;

  try {
    const dietas = await Dieta.find({ usuario: usuarioId });
    res.json(dietas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener las dietas.' });
  }
});

// Eliminar una dieta por su ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const dieta = await Dieta.findByIdAndDelete(id);
    if (!dieta) {
      return res.status(404).json({ mensaje: 'Dieta no encontrada.' });
    }

    res.json({ mensaje: 'Dieta eliminada correctamente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al eliminar la dieta.' });
  }
});


// ✅ Añadir una receta a una dieta
router.post('/:dietaId/recetas', async (req, res) => {
  const { dietaId } = req.params;
  const { recetaId } = req.body;

  if (!recetaId) {
    return res.status(400).json({ mensaje: 'Falta el ID de la receta.' });
  }

  try {
    const dieta = await Dieta.findById(dietaId);
    if (!dieta) {
      return res.status(404).json({ mensaje: 'Dieta no encontrada.' });
    }

    if (dieta.recetas.includes(recetaId)) {
      return res.status(400).json({ mensaje: 'La receta ya está en la dieta.' });
    }

    dieta.recetas.push(recetaId);
    await dieta.save();

    res.status(200).json({ mensaje: 'Receta añadida a la dieta correctamente.', dieta });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al añadir la receta a la dieta.' });
  }
});


// ✅ Obtener una dieta con sus recetas (populate)
router.get('/:id/completa', async (req, res) => {
  const { id } = req.params;

  try {
    const dieta = await Dieta.findById(id).populate('recetas');
    if (!dieta) {
      return res.status(404).json({ mensaje: 'Dieta no encontrada.' });
    }

    res.json(dieta);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener la dieta.' });
  }
});

module.exports = router;
