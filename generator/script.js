// Lógica inicial - sólo mostrar datos en consola
// Comentarios en argentino

document.getElementById('generatorForm').addEventListener('submit', function(e) {
  e.preventDefault();

  // Tomar datos del formulario
  const nombre = document.getElementById('nombre').value;
  const descripcion = document.getElementById('descripcion').value;
  const wallet = document.getElementById('wallet').value;
  const crypto = document.getElementById('crypto').value;
  const monto = document.getElementById('monto').value;
  const logo = document.getElementById('logo').files[0];

  // Mostrar datos en consola para testear
  console.log({ nombre, descripcion, wallet, crypto, monto, logo });
  
  alert('Formulario enviado (ver consola)');
});

// Lógica para el botón "Crear wallet" — más adelante
document.getElementById('crearWallet').addEventListener('click', function() {
  alert('¡Función de generación de wallet próximamente!');
});
