const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  edad: Number,
  sexo: String,
  altura: Number, // en cm
  peso: Number,   // en kg
  objetivo: String, // ejemplo: "bajar peso", "ganar músculo"
  creadoEn: {
    type: Date,
    default: Date.now
  }
});

// Middleware para encriptar la contraseña antes de guardar
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Método para comparar contraseña al login
userSchema.methods.compararPassword = async function(passwordRecibido) {
  return await bcrypt.compare(passwordRecibido, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
