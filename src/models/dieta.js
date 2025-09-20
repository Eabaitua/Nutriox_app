const mongoose = require('mongoose');

const dietaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  descripcion: {
    type: String,
    trim: true
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
  recetas: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Receta'
    }
  ],
  creadaEn: {
    type: Date,
    default: Date.now
  }
});

const Dieta = mongoose.model('Dieta', dietaSchema);

module.exports = Dieta;
