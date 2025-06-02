// frontend/app.js

const apiUrl = "http://localhost:3000/api/mensaje";

const mensajeActualDiv = document.getElementById('mensaje-actual');
const formulario = document.getElementById('formulario-mensaje');
const inputMensaje = document.getElementById('nuevo-mensaje');
const estadoDiv = document.getElementById('estado');

// Función para mostrar mensajes de estado al usuario
function mostrarEstado(mensaje, tipo = '') {
  estadoDiv.textContent = mensaje;
  estadoDiv.className = 'estado ' + tipo;
}

// Cargar el mensaje actual desde el backend al cargar la página
async function cargarMensajeActual() {
  mensajeActualDiv.textContent = "Cargando mensaje...";
  mostrarEstado('');
  try {
    const res = await fetch(apiUrl);
    const data = await res.json();
    if (res.ok) {
      mensajeActualDiv.textContent = data.mensaje;
    } else {
      mensajeActualDiv.textContent = "Error al cargar mensaje";
      mostrarEstado(data.message || "Error inesperado.", "error");
    }
  } catch (error) {
    mensajeActualDiv.textContent = "Error al conectar con el backend";
    mostrarEstado(error.message, "error");
  }
}

// Evento: enviar nuevo mensaje
formulario.addEventListener('submit', async (e) => {
  e.preventDefault();
  mostrarEstado('');
  const nuevoMensaje = inputMensaje.value.trim();
  if (!nuevoMensaje) {
    mostrarEstado("El mensaje no puede estar vacío.", "error");
    return;
  }
  mostrarEstado("Enviando transacción a la blockchain...");
  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ nuevoMensaje })
    });
    const data = await res.json();
    if (res.ok && data.status === "success") {
      mostrarEstado("Mensaje actualizado en blockchain ✅", "success");
      inputMensaje.value = "";
      await cargarMensajeActual();
    } else {
      mostrarEstado(data.message || "Error al actualizar mensaje.", "error");
    }
  } catch (error) {
    mostrarEstado("Error de conexión: " + error.message, "error");
  }
});

// Cargar mensaje inicial al abrir la página
cargarMensajeActual();
