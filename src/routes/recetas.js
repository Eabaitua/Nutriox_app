const express = require('express');
const router = express.Router();

const Receta = require('../models/Receta');

// ➤ Crear una receta
router.post('/', async (req, res) => {
  const { nombre, ingredientes, calorias, usuarioId } = req.body;

  if (!nombre || !ingredientes || !calorias || !usuarioId) {
    return res.status(400).json({ mensaje: 'Faltan campos obligatorios.' });
  }

  try {
    const nuevaReceta = new Receta({
      nombre,
      ingredientes,
      calorias,
      usuario: usuarioId
    });

    const recetaGuardada = await nuevaReceta.save();
    res.status(201).json(recetaGuardada);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al crear la receta.' });
  }
});

// ➤ Obtener todas las recetas de un usuario
router.get('/:usuarioId', async (req, res) => {
  const { usuarioId } = req.params;

  try {
    const recetas = await Receta.find({ usuario: usuarioId });
    res.json(recetas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener las recetas.' });
  }
});

// ➤ Eliminar una receta por su ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const receta = await Receta.findByIdAndDelete(id);
    if (!receta) {
      return res.status(404).json({ mensaje: 'Receta no encontrada.' });
    }

    res.json({ mensaje: 'Receta eliminada correctamente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al eliminar la receta.' });
  }
});
// ➤ Actualizar una receta por su ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, ingredientes, calorias } = req.body;

  try {
    const recetaActualizada = await Receta.findByIdAndUpdate(
      id,
      { nombre, ingredientes, calorias },
      { new: true } // para que devuelva el documento actualizado
    );

    if (!recetaActualizada) {
      return res.status(404).json({ mensaje: 'Receta no encontrada.' });
    }

    res.json(recetaActualizada);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar la receta.' });
  }
});

module.exports = router;
