const express = require('express');
const router = express.Router();
const clienteController = require('./clienteController');

// Rutas CRUD
router.get('/', clienteController.getAll);          // Listar y Filtro (?ciudad=X)
router.post('/', clienteController.create);         // Crear
router.get('/promedio-compras', clienteController.getPromedio); // Endpoint Adicional (IMPORTANTE: Poner antes de :id)
router.get('/:id', clienteController.getById);      // Buscar por ID
router.put('/:id', clienteController.update);       // Actualizar
router.delete('/:id', clienteController.delete);    // Eliminar

module.exports = router;