const mongoose = require('mongoose');

const recetaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  ingredientes: {
    type: [String], // Lista de ingredientes simples por ahora
    required: true
  },
  calorias: {
    type: Number,
    required: true
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  creadaEn: {
    type: Date,
    default: Date.now
  }
});

const Receta = mongoose.model('Receta', recetaSchema);

module.exports = Receta;
