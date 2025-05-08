// db.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./recibox.db');

db.serialize(() => {

  // Crear tabla de usuarios (para Propietarios)
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombres TEXT,
      apellidos TEXT,
      documento TEXT UNIQUE,
      celular TEXT,
      email TEXT,
      torre TEXT,
      apartamento TEXT,
      usuario TEXT UNIQUE,
      clave TEXT,
      rol TEXT
    );
  `);

  // Insertar datos predeterminados de usuarios (Administrador y Seguridad)
const insertUsuarios = `
INSERT OR IGNORE INTO users (nombres, apellidos, documento, celular, email, torre, apartamento, usuario, clave, rol)
VALUES
  ('Admin', 'Principal', '000000001', '1234567890', 'admin@recibox.com', 'N/A', 'N/A', '1234567890', '1234567890', 'Administrador'),
  ('Guardia', 'Recibox', '000000002', '0987654321', 'seguridad@recibox.com', 'N/A', 'N/A', 'seguridad', 'seguridad123', 'Seguridad');
`;
db.run(insertUsuarios, function(err) {
if (err) {
  console.error('Error al insertar usuarios predeterminados:', err.message);
} else {
  console.log('Usuarios predeterminados insertados.');
}
});


  // Crear tabla de entregas
  db.run(`
    CREATE TABLE IF NOT EXISTS entregas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      apartamento TEXT,
      torre TEXT,
      fecha TEXT,
      entregado_por TEXT,
      recibido_por TEXT
    );
  `);

  // Insertar datos de prueba de entregas
  const insertEntregas = `
    INSERT INTO entregas (apartamento, torre, fecha, entregado_por, recibido_por)
    VALUES
      ('101', 'Torre A', '2025-04-28', 'seguridad@recibox.com', 'juanperez@recibox.com'),
      ('302', 'Torre B', '2025-04-27', 'seguridad@recibox.com', 'lauragomez@recibox.com'),
      ('403', 'Torre A', '2025-04-25', 'seguridad@recibox.com', NULL),
      ('301', 'Torre C', '2025-04-26', 'seguridad@recibox.com', NULL);
  `;
  db.run(insertEntregas);

  // Crear tabla de reclamos
  db.run(`
    CREATE TABLE IF NOT EXISTS reclamos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id INTEGER,
      descripcion TEXT,
      fecha TEXT,
      resuelto INTEGER DEFAULT 0,
      FOREIGN KEY(usuario_id) REFERENCES users(id)
    );
  `);

  // Insertar reclamos para juanperez
  db.get(`SELECT id FROM users WHERE email = 'juanperez@recibox.com'`, (err, row) => {
    if (row) {
      const usuarioId = row.id;
      const insertReclamos = `
        INSERT INTO reclamos (usuario_id, descripcion, fecha, resuelto)
        VALUES
          (${usuarioId}, 'Factura incorrecta en locker 205', '2025-05-01', 0),
          (${usuarioId}, 'Factura duplicada en locker 109', '2025-05-02', 0),
          (${usuarioId}, 'Factura mal asignada en locker 110', '2025-05-02', 1);
      `;
      db.run(insertReclamos);
    }
  });

  console.log('Base de datos creada y datos de prueba cargados.');
});

module.exports = db;
