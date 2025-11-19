const db = require('./db');

const clienteController = {

    // 1. LISTAR y FILTRAR (Cumple CRUD y Filtro por ciudad)
    // Requisito: GET /clientes?ciudad=Guayaquil [cite: 11]
    getAll: async (req, res) => {
        try {
            const { ciudad } = req.query;
            let query = 'SELECT * FROM clientes';
            let params = [];

            if (ciudad) {
                query += ' WHERE ciudad = ?';
                params.push(ciudad);
            }

            const [rows] = await db.query(query, params);
            res.json(rows);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // 2. BUSCAR POR ID (Cumple CRUD)
    // Requisito: GET /clientes/:id [cite: 11]
    getById: async (req, res) => {
        try {
            const [rows] = await db.query('SELECT * FROM clientes WHERE id = ?', [req.params.id]);
            if (rows.length === 0) return res.status(404).json({ message: 'Cliente no encontrado' });
            res.json(rows[0]);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // 3. CREAR (Cumple CRUD)
    // Requisito: POST /clientes [cite: 11]
    create: async (req, res) => {
        try {
            const { nombre, correo, telefono, ciudad, monto_compras } = req.body;
            // Validación básica requerida por rúbrica [cite: 11]
            if (!nombre || !correo || !ciudad) {
                return res.status(400).json({ message: 'Faltan datos obligatorios' });
            }
            
            const [result] = await db.query(
                'INSERT INTO clientes (nombre, correo, telefono, ciudad, monto_compras) VALUES (?, ?, ?, ?, ?)',
                [nombre, correo, telefono, ciudad, monto_compras || 0]
            );
            res.json({ id: result.insertId, ...req.body });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // 4. ACTUALIZAR (Cumple CRUD)
    // Requisito: PUT /clientes/:id [cite: 11]
    update: async (req, res) => {
        try {
            const { nombre, correo, telefono, ciudad, monto_compras } = req.body;
            const [result] = await db.query(
                'UPDATE clientes SET nombre = ?, correo = ?, telefono = ?, ciudad = ?, monto_compras = ? WHERE id = ?',
                [nombre, correo, telefono, ciudad, monto_compras || 0, req.params.id]
            );
            if (result.affectedRows === 0) return res.status(404).json({ message: 'Cliente no encontrado' });
            res.json({ message: 'Cliente actualizado correctamente' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // 5. ELIMINAR (Cumple CRUD)
    // Requisito: DELETE /clientes/:id [cite: 11]
    delete: async (req, res) => {
        try {
            const [result] = await db.query('DELETE FROM clientes WHERE id = ?', [req.params.id]);
            if (result.affectedRows === 0) return res.status(404).json({ message: 'Cliente no encontrado' });
            res.json({ message: 'Cliente eliminado correctamente' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // 6. CALCULO ADICIONAL (Funcionalidad Extra)
    // Requisito: GET /clientes/promedio-compras [cite: 11]
    getPromedio: async (req, res) => {
        try {
            const [rows] = await db.query('SELECT AVG(monto_compras) as promedio FROM clientes');
            // Formatear respuesta JSON
            const promedio = rows[0].promedio || 0;
            res.json({ 
                descripcion: "Promedio general de compras",
                valor: parseFloat(promedio).toFixed(2) 
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = clienteController;