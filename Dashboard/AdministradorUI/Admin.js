document.addEventListener("DOMContentLoaded", () => {
  // Botones para cambiar de sección
  const historialBtn = document.querySelector(".opciones button:nth-child(1)");
  const reclamosBtn = document.querySelector(".opciones button:nth-child(2)");
  const usuariosBtn = document.querySelector(".opciones button:nth-child(3)");

  // Secciones de la página
  const seccionHistorial = document.getElementById("historial");
  const seccionReclamos = document.getElementById("reclamos");
  const seccionUsuarios = document.getElementById("usuarios");

  // Función para ocultar todas las secciones
  function ocultarTodas() {
    seccionHistorial.classList.remove("visible");
    seccionReclamos.classList.remove("visible");
    seccionUsuarios.classList.remove("visible");
  }

  // Manejadores de eventos
  historialBtn.addEventListener("click", () => {
    ocultarTodas();
    seccionHistorial.classList.add("visible");
  });

  reclamosBtn.addEventListener("click", () => {
    ocultarTodas();
    seccionReclamos.classList.add("visible");
  });

  usuariosBtn.addEventListener("click", () => {
    ocultarTodas();
    seccionUsuarios.classList.add("visible");
  });

  // Cargar los datos al inicio
  loadData();
});

// Función para cargar los datos dinámicamente
function loadData() {
  // Cargar historial de entregas
  fetch('/api/historial')
    .then(response => response.json())
    .then(data => {
      const historialTable = document.getElementById('historial-table');
      historialTable.innerHTML = ''; // Limpiar tabla antes de agregar datos
      data.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${row.apartamento}</td><td>${row.fecha}</td><td>${row.locker}</td>`;
        historialTable.appendChild(tr);
      });
    })
    .catch(error => console.error('Error al cargar el historial de entregas:', error));

  // Cargar reclamos
  fetch('/api/reclamos')
    .then(response => response.json())
    .then(data => {
      const reclamosList = document.getElementById('reclamos-list');
      reclamosList.innerHTML = ''; // Limpiar lista de reclamos antes de agregar nuevos
      data.forEach(reclamo => {
        const li = document.createElement('li');
        li.innerHTML = `${reclamo.descripcion} - Locker ${reclamo.locker} <button onclick="resolverReclamo(${reclamo.id})">Resolver</button>`;
        reclamosList.appendChild(li);
      });
    })
    .catch(error => console.error('Error al cargar los reclamos:', error));

  // Cargar usuarios
  fetch('/api/usuarios')
    .then(response => response.json())
    .then(data => {
      const usuariosList = document.getElementById('usuarios-list');
      usuariosList.innerHTML = ''; // Limpiar lista de usuarios antes de agregar nuevos
      data.forEach(user => {
        const li = document.createElement('li');
        li.innerHTML = `${user.nombres} ${user.apellidos} - ${user.usuario} <button onclick="eliminarUsuario(${user.id})">Eliminar</button>`;
        usuariosList.appendChild(li);
      });
    })
    .catch(error => console.error('Error al cargar los usuarios:', error));

  // Cargar indicadores de facturas entregadas, pendientes y reclamos
  fetch('/api/historial')
    .then(response => response.json())
    .then(data => {
      const entregadas = data.filter(item => item.estado === 'entregada').length;
      const pendientes = data.filter(item => item.estado === 'pendiente').length;
      document.getElementById('facturas-entregadas').innerText = entregadas;
      document.getElementById('facturas-pendientes').innerText = pendientes;
    })
    .catch(error => console.error('Error al cargar los indicadores de facturas:', error));
}

// Función para resolver un reclamo
function resolverReclamo(id) {
  fetch(`/api/reclamos/${id}/resolver`, { method: 'POST' })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert('Reclamo resuelto');
        loadData(); // Recargar datos después de resolver el reclamo
      } else {
        alert('Error al resolver reclamo');
      }
    })
    .catch(error => console.error('Error al resolver el reclamo:', error));
}

// Función para eliminar un usuario
function eliminarUsuario(id) {
  if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
    fetch(`/api/usuarios/${id}`, { method: 'DELETE' })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          alert('Usuario eliminado');
          loadData(); // Recargar datos después de eliminar el usuario
        } else {
          alert('Error al eliminar usuario');
        }
      })
      .catch(error => console.error('Error al eliminar el usuario:', error));
  }
}

// Función para cerrar sesión
function logout() {
  alert("Has cerrado sesión.");
  window.location.href = "/index.html";
}
