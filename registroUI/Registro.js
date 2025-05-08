function mostrarPaso(paso) {
  const pasos = document.querySelectorAll('.form-step');
  pasos.forEach((form, index) => {
    form.classList.remove('active');
    if (index === paso - 1) {
      form.classList.add('active');
    }
  });
}

document.querySelector('button[onclick="mostrarPaso(2)"]').onclick = () => {
  if (validarPaso1()) {
    mostrarPaso(2);
  }
};

document.querySelector('button[onclick="mostrarPaso(3)"]').onclick = () => {
  if (validarPaso2()) {
    mostrarPaso(3);
  }
};

document.querySelector('#paso3').addEventListener('submit', async (e) => {
  e.preventDefault();

  const nombres = document.getElementById('nombres').value;
  const apellidos = document.getElementById('apellidos').value;
  const documento = document.getElementById('documento').value;
  const celular = document.getElementById('celular').value;
  const email = document.getElementById('email').value;
  const torre = document.getElementById('torre').value;
  const apartamento = document.getElementById('apartamento').value;
  const usuario = document.getElementById('usuario').value;
  const clave = document.getElementById('clave').value;

  const registroData = { nombres, apellidos, documento, celular, email, torre, apartamento, usuario, clave, rol: 'Propietario' };

  try {
    const response = await fetch("/api/registro", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registroData),
    });

    const data = await response.json();

    if (data.success) {
      alert("¡Registro completado con éxito!");
      window.location.href = "/index.html";  // Redirige al login
    } else {
      alert(data.message || "Error al registrar el usuario.");
    }
  } catch (error) {
    alert("Error de conexión, intente nuevamente.");
  }
});


function validarPaso1() {
  const campos = ['nombres', 'apellidos', 'documento', 'celular', 'email'];
  for (let id of campos) {
    const valor = document.getElementById(id).value.trim();
    if (valor === '') {
      alert("Por favor, completa todos los campos requeridos.");
      return false;
    }
  }
  return true;
}

function validarPaso2() {
  const clave = document.getElementById('clave').value;
  const confirmar = document.getElementById('confirmarClave').value;
  const checkbox = document.getElementById('terminosCheckbox');

  if (clave.length < 6) {
    alert("La contraseña debe tener al menos 6 caracteres.");
    return false;
  }

  if (clave !== confirmar) {
    alert("Las contraseñas no coinciden.");
    return false;
  }

  if (!checkbox.checked) {
    alert("Debes aceptar los Términos y Condiciones.");
    return false;
  }

  return true;
}
