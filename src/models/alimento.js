const mongoose = require('mongoose');

const AlimentoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    unique: true,
  },
  calorias: {
    type: Number,
    required: true,
  },
  proteinas: {
    type: Number,
    required: true,
  },
  grasas: {
    type: Number,
    required: true,
  },
  carbohidratos: {
    type: Number,
    required: true,
  }
});

module.exports = mongoose.model('Alimento', AlimentoSchema);
