document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const roleSelect = document.getElementById("role");
  const errorMsg = document.getElementById("errorMsg");

  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    const role = roleSelect.value;

    if (!username || !password || !role) {
      errorMsg.textContent = "Completa todos los campos y selecciona un rol.";
      return;
    }

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, role }),
      });

      const data = await response.json();

      if (data.success) {
        sessionStorage.setItem("rol", role);
        window.location.href = "/Dashboard/Verificacion/verificacion.html";  // Redirige según el rol
  
      } else {
        errorMsg.textContent = data.message || "Usuario, contraseña o rol incorrectos.";
      }
    } catch (error) {
      errorMsg.textContent = "Error de conexión, intente nuevamente.";
    }
  });
});
