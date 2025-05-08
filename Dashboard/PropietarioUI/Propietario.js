// script.js

// Datos simulados (en un proyecto real estos datos vendrán del servidor)
const notifications = [
    { message: "Tu factura de energía ha sido depositada en el locker A1." },
    { message: "Tu factura de agua ha sido retirada por el propietario el 25 de abril." },
  ];
  
  const history = [
    { date: "2023-04-01", amount: "$50" },
    { date: "2023-03-01", amount: "$45" },
    { date: "2023-02-01", amount: "$60" },
  ];
  
  // Función para cargar las notificaciones
  function loadNotifications() {
    const notificationsList = document.getElementById('notifications-list');
    notificationsList.innerHTML = notifications.map(notification => `
      <div class="notification-item">
        <p>${notification.message}</p>
      </div>
    `).join('');
  }
  
  // Función para cargar el historial de facturación
  function loadHistory() {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = history.map(entry => `
      <div class="history-item">
        <p>Fecha: ${entry.date} - Monto: ${entry.amount}</p>
      </div>
    `).join('');
  }
  
  // Función para recoger factura
  function collectInvoice() {
    alert("Factura recogida con éxito. ¡Gracias!");
    // Aquí puedes agregar lógica para actualizar el sistema
  }
  
  // Función para cerrar sesión
  function logout() {
    alert("Has cerrado sesión.");
    window.location.href = "/index.html";
  }
  
  // Llamada a las funciones de carga de datos
  loadNotifications();
  loadHistory();
  