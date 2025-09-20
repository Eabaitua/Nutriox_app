const express = require('express');
const router = express.Router();

const Alimento = require('../models/Alimento');

// Crear un alimento nuevo
router.post('/', async (req, res) => {
  const { nombre, calorias, proteinas, grasas, carbohidratos } = req.body;

  if (!nombre || calorias == null || proteinas == null || grasas == null || carbohidratos == null) {
    return res.status(400).json({ mensaje: 'Faltan campos obligatorios.' });
  }

  try {
    // Verificar si ya existe un alimento con ese nombre
    const existe = await Alimento.findOne({ nombre });
    if (existe) {
      return res.status(400).json({ mensaje: 'El alimento ya existe.' });
    }

    const nuevoAlimento = new Alimento({
      nombre,
      calorias,
      proteinas,
      grasas,
      carbohidratos
    });

    const alimentoGuardado = await nuevoAlimento.save();
    res.status(201).json(alimentoGuardado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al crear el alimento.' });
  }
});

// Obtener todos los alimentos
router.get('/', async (req, res) => {
  try {
    const alimentos = await Alimento.find();
    res.json(alimentos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener los alimentos.' });
  }
});

// Obtener un alimento por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const alimento = await Alimento.findById(id);
    if (!alimento) {
      return res.status(404).json({ mensaje: 'Alimento no encontrado.' });
    }
    res.json(alimento);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener el alimento.' });
  }
});

// Actualizar un alimento por ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, calorias, proteinas, grasas, carbohidratos } = req.body;

  try {
    const alimento = await Alimento.findById(id);
    if (!alimento) {
      return res.status(404).json({ mensaje: 'Alimento no encontrado.' });
    }

    alimento.nombre = nombre || alimento.nombre;
    alimento.calorias = calorias != null ? calorias : alimento.calorias;
    alimento.proteinas = proteinas != null ? proteinas : alimento.proteinas;
    alimento.grasas = grasas != null ? grasas : alimento.grasas;
    alimento.carbohidratos = carbohidratos != null ? carbohidratos : alimento.carbohidratos;

    const alimentoActualizado = await alimento.save();
    res.json(alimentoActualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar el alimento.' });
  }
});

// Eliminar un alimento por ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const alimento = await Alimento.findByIdAndDelete(id);
    if (!alimento) {
      return res.status(404).json({ mensaje: 'Alimento no encontrado.' });
    }
    res.json({ mensaje: 'Alimento eliminado correctamente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al eliminar el alimento.' });
  }
});

module.exports = router;
