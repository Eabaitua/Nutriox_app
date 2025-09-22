const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

const Alimento = require('../models/Alimento');

// Middleware para validar inputs
const validarAlimento = [
  body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
  body('calorias').isNumeric().withMessage('Calorías debe ser un número'),
  body('proteinas').isNumeric().withMessage('Proteínas debe ser un número'),
  body('grasas').isNumeric().withMessage('Grasas debe ser un número'),
  body('carbohidratos').isNumeric().withMessage('Carbohidratos debe ser un número'),
];

// Crear un alimento nuevo
router.post('/', validarAlimento, async (req, res) => {
  // Validar errores de express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }

  const { nombre, calorias, proteinas, grasas, carbohidratos } = req.body;

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
    res.status(201).json({ success: true, data: alimentoGuardado, mensaje: 'Alimento creado exitosamente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, mensaje: 'Error al crear el alimento.' });
  }
});

// Obtener todos los alimentos
router.get('/', async (req, res) => {
  try {
    const alimentos = await Alimento.find();
    res.json({ success: true, data: alimentos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, mensaje: 'Error al obtener los alimentos.' });
  }
});

// Obtener un alimento por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const alimento = await Alimento.findById(id);
    if (!alimento) {
      return res.status(404).json({ success: false, mensaje: 'Alimento no encontrado.' });
    }
    res.json({ success: true, data: alimento });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, mensaje: 'Error al obtener el alimento.' });
  }
});

// Actualizar un alimento por ID
router.put('/:id', validarAlimento, async (req, res) => {
  const { id } = req.params;

  // Validar errores de express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }

  const { nombre, calorias, proteinas, grasas, carbohidratos } = req.body;

  try {
    const alimento = await Alimento.findById(id);
    if (!alimento) {
      return res.status(404).json({ success: false, mensaje: 'Alimento no encontrado.' });
    }

    alimento.nombre = nombre || alimento.nombre;
    alimento.calorias = calorias != null ? calorias : alimento.calorias;
    alimento.proteinas = proteinas != null ? proteinas : alimento.proteinas;
    alimento.grasas = grasas != null ? grasas : alimento.grasas;
    alimento.carbohidratos = carbohidratos != null ? carbohidratos : alimento.carbohidratos;

    const alimentoActualizado = await alimento.save();
    res.json({ success: true, data: alimentoActualizado, mensaje: 'Alimento actualizado correctamente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, mensaje: 'Error al actualizar el alimento.' });
  }
});

// Eliminar un alimento por ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const alimento = await Alimento.findByIdAndDelete(id);
    if (!alimento) {
      return res.status(404).json({ success: false, mensaje: 'Alimento no encontrado.' });
    }
    res.json({ success: true, mensaje: 'Alimento eliminado correctamente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, mensaje: 'Error al eliminar el alimento.' });
  }
});

module.exports = router;
