const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./routes');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors()); // Permite conexión desde Angular/Frontend
app.use(bodyParser.json());

// Rutas Base
// Todas las rutas de clientes empezarán con /clientes
app.use('/clientes', routes);

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});