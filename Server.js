const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// --- LOGIN ---
app.post('/api/login', (req, res) => {
  const { username, password, role } = req.body;
  const query = `SELECT * FROM users WHERE usuario = ? AND rol = ?`;
  db.get(query, [username, role], (err, row) => {
    if (err) return res.status(500).json({ success: false, message: 'Error en la base de datos' });
    if (row && row.clave === password) {
      res.json({ success: true });
    } else {
      res.status(401).json({ success: false, message: 'Usuario, contraseña o rol incorrectos.' });
    }
  });
});

// --- REGISTRO (solo propietarios) ---
app.post('/api/registro', (req, res) => {
  const { nombres, apellidos, documento, celular, email, torre, apartamento, usuario, clave, rol } = req.body;
  if (rol !== 'Propietario') {
    return res.status(403).json({ success: false, message: 'Solo los propietarios pueden registrarse.' });
  }
  const query = `INSERT INTO users (nombres, apellidos, documento, celular, email, torre, apartamento, usuario, clave, rol)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  db.run(query, [nombres, apellidos, documento, celular, email, torre, apartamento, usuario, clave, rol], function (err) {
    if (err) return res.status(500).json({ success: false, message: 'Error al registrar el usuario' });
    res.json({ success: true, message: 'Registro completado con éxito' });
  });
});

// --- ENDPOINTS FUNCIONALES PARA ADMIN ---

// Obtener historial de entregas
app.get('/api/historial', (req, res) => {
  db.all(`
    SELECT e.id, e.apartamento, e.torre, e.fecha, e.entregado_por, e.recibido_por, u.nombres AS 'entregado_por_nombre', u2.nombres AS 'recibido_por_nombre'
    FROM entregas e
    LEFT JOIN users u ON e.entregado_por = u.usuario
    LEFT JOIN users u2 ON e.recibido_por = u2.usuario
  `, (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: 'Error al obtener historial' });
    res.json(rows);
  });
});

// Obtener reclamos
app.get('/api/reclamos', (req, res) => {
  db.all(`
    SELECT r.id, r.descripcion, r.fecha, r.resuelto, u.nombres AS 'usuario_nombre', u.apellidos AS 'usuario_apellidos'
    FROM reclamos r
    JOIN users u ON r.usuario_id = u.id
  `, (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: 'Error al obtener reclamos' });
    res.json(rows);
  });
});

// Obtener usuarios
app.get('/api/usuarios', (req, res) => {
  db.all(`SELECT id, nombres, apellidos, email, usuario, rol FROM users`, (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: 'Error al obtener usuarios' });
    res.json(rows);
  });
});

// Resolver reclamo
app.post('/api/reclamos/:id/resolver', (req, res) => {
  const { id } = req.params;
  db.run(`UPDATE reclamos SET resuelto = 1 WHERE id = ?`, [id], function (err) {
    if (err) return res.status(500).json({ success: false, message: 'Error al resolver reclamo' });
    res.json({ success: true });
  });
});

// Eliminar usuario
app.delete('/api/usuarios/:id', (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM users WHERE id = ?`, [id], function (err) {
    if (err) return res.status(500).json({ success: false, message: 'Error al eliminar usuario' });
    res.json({ success: true });
  });
});

// Modificar usuario
app.put('/api/usuarios/:id', (req, res) => {
  const { id } = req.params;
  const { nombres, apellidos, celular, email, torre, apartamento, clave } = req.body;

  const query = `
    UPDATE users 
    SET nombres = ?, apellidos = ?, celular = ?, email = ?, torre = ?, apartamento = ?, clave = ?
    WHERE id = ?
  `;

  db.run(query, [nombres, apellidos, celular, email, torre, apartamento, clave, id], function (err) {
    if (err) return res.status(500).json({ success: false, message: 'Error al actualizar usuario' });
    res.json({ success: true });
  });
});

// Página principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
