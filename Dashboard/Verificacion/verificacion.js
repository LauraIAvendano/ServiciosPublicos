// /verificacion/verificacion.js
document.addEventListener("DOMContentLoaded", () => {
  // Paso 1: Mostrar el mensaje "Acceso concedido"
  setTimeout(() => {
    const message = document.querySelector('.message');
    message.textContent = 'Acceso concedido ✅';

    // Paso 2: Esperar 2 segundos más y redirigir según el rol
    setTimeout(() => {
      const rol = sessionStorage.getItem("rol");

      if (rol === "Administrador") {
        window.location.href = "/Dashboard/AdministradorUI/Admin.html";
      } else if (rol === "Seguridad") {
        window.location.href = "/Dashboard/SeguridadUI/Seguridad.html";
      } else if (rol === "Propietario") {
        window.location.href = "/Dashboard/PropietarioUI/Propietario.html";
      } else {
        window.location.href = "/login/login.html"; // Fallback
      }
    }, 2000); // Espera adicional tras mostrar el mensaje
  }, 3000); // Simulación del escaneo facial
});
