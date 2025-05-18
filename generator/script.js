document.getElementById('crearWallet').addEventListener('click', function () {
  const wallet = ethers.Wallet.createRandom();
  document.getElementById('wallet').value = wallet.address;
  generarPDF(wallet.address, wallet.privateKey);
  // Очищаем приватный ключ из памяти
  wallet.privateKey = null;
});

function generarID() {
  return 'id-' + Math.random().toString(36).substr(2, 8) + '-' + Date.now();
}

// Обработка формы (пока просто лог для теста)
document.getElementById('generatorForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value;
  const descripcion = document.getElementById('descripcion').value;
  const wallet = document.getElementById('wallet').value;
  const crypto = document.getElementById('crypto').value;
  const monto = document.getElementById('monto').value;
  const logoFile = document.getElementById('logo').files[0];

  if (logoFile) {
    const reader = new FileReader();
    reader.onload = function(event) {
      guardarYRedirigir(event.target.result);
    };
    reader.readAsDataURL(logoFile);
  } else {
    guardarYRedirigir(null);
  }

  function guardarYRedirigir(logoBase64) {
    const id = generarID();
    const datos = { nombre, descripcion, wallet, crypto, monto, logoBase64 };
    localStorage.setItem('plataforma_pago_' + id, JSON.stringify(datos));
    window.location.href = 'pagos.html?id=' + encodeURIComponent(id);
  }
});

function generarPDF(address, privateKey) {
  const doc = new window.jspdf.jsPDF();
  doc.setFont("helvetica");
  doc.setFontSize(16);
  doc.text("Tu wallet Polygon (red blockchain)", 15, 18);

  doc.setFontSize(11);
  doc.setTextColor(10, 10, 10);
  doc.text("Esta wallet (billetera cripto) es 100% tuya y sólo vos tenés acceso.", 15, 28, { maxWidth: 180 });
  doc.text("PlataformA no guarda ni conoce tu clave privada.", 15, 35, { maxWidth: 180 });

  doc.setFontSize(12);
  doc.setTextColor(10, 10, 10);
  doc.text("Dirección pública:", 15, 49);
  doc.text(address, 15, 57);

  doc.text("Llave privada:", 15, 71);
  doc.text(privateKey, 15, 79);

  doc.setFontSize(11);
  doc.setTextColor(70, 70, 70);
  doc.text("Recomendaciones:", 15, 93);
  doc.setTextColor(20, 90, 220);
  doc.text("- Guardá este PDF en un pendrive o gestor seguro (1Password, Bitwarden, etc.)", 15, 100);
  doc.text("- No lo compartas ni lo envíes por email o WhatsApp.", 15, 107);
  doc.text("- Si perdés la clave privada, perdés el acceso a tus fondos.", 15, 114);
  doc.setTextColor(220, 50, 50);
  doc.text("¡Nunca compartas tu clave privada con nadie!", 15, 125);

  doc.save("Wallet_Polygon.pdf");
  mostrarModalInfo();
}

// Показать/скрыть модалку с инструкцией
function mostrarModalInfo() {
  document.getElementById('modalInfo').style.display = 'flex';
}
function cerrarModalInfo() {
  document.getElementById('modalInfo').style.display = 'none';
}
