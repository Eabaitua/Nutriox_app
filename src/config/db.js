const mongoose = require('mongoose');

const conectarDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://edutenis_db_user:E8it9EYxBiG2Zlmw@cluster0.7ww4mpt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('🟢 Conectado a MongoDB');
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:', error.message);
    process.exit(1); // Detiene el servidor si falla la conexión
  }
};

module.exports = conectarDB;

