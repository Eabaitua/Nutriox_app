const express = require('express');
const conectarDB = require('./config/db');

const app = express();
const port = 3000;

// Conectar a la base de datos
conectarDB();

// Middleware para leer JSON (para recibir datos en POST)
app.use(express.json());

// Servir archivos estáticos desde la carpeta "public"
app.use(express.static('public'));

// Rutas
const authRoutes = require('./routes/auth');
const dietasRoutes = require('./routes/dietas');
const recetasRoutes = require('./routes/recetas');
const alimentosRoutes = require('./routes/alimentos');
const profileRoutes = require('./routes/profile');  // <-- Añadida ruta perfil

// Usar rutas
app.use('/api/auth', authRoutes);
app.use('/api/dietas', dietasRoutes);
app.use('/api/recetas', recetasRoutes);
app.use('/api/alimentos', alimentosRoutes);
app.use('/api/profile', profileRoutes);  // <-- Usamos la ruta perfil

// Ruta principal (index.html)
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/../public/index.html');
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor Nutriox corriendo en http://localhost:${port}`);
});
