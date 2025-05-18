// --- Generación de wallet Polygon y PDF ---
document.getElementById('crearWallet').addEventListener('click', function () {
  const wallet = ethers.Wallet.createRandom();
  document.getElementById('wallet').value = wallet.address;
  generarPDF(wallet.address, wallet.privateKey);
  // Por seguridad, vaciamos la variable en memoria
  wallet.privateKey = null;
});

// --- Generar ID único para cada página ---
function generarID() {
  return 'id-' + Math.random().toString(36).substr(2, 8) + '-' + Date.now();
}

// --- Lógica del formulario ---
document.getElementById('generatorForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value;
  const descripcion = document.getElementById('descripcion').value;
  const wallet = document.getElementById('wallet').value;
  const moneda = document.getElementById('moneda').value;
  const monto = document.getElementById('monto').value;
  const logoFile = document.getElementById('logo').files[0];

  if (!wallet) {
    alert('Por favor, ingresá o generá una wallet.');
    return;
  }
  if (!moneda) {
    alert('Seleccioná una moneda.');
    return;
  }

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
    const datos = { nombre, descripcion, wallet, moneda, monto, logoBase64 };
    localStorage.setItem('plataforma_pago_' + id, JSON.stringify(datos));
    window.location.href = 'pagos.html?id=' + encodeURIComponent(id);
  }
});

// --- PDF de la wallet generada ---
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

// --- Mostrar/Cerrar modal de info wallet ---
function mostrarModalInfo() {
  document.getElementById('modalInfo').style.display = 'flex';
}
function cerrarModalInfo() {
  document.getElementById('modalInfo').style.display = 'none';
}

// -------------------------------------------------------------------------
// --- Conversión ARS → USDT según selección (solo si elige ARS) --------

// Elementos del DOM para la moneda y monto
const selectMoneda = document.getElementById('moneda');
const inputMonto = document.getElementById('monto');
const divEquivalente = document.getElementById('equivalenteCripto');

let cotizacionUSDT = null;

// Traer cotización USDT/ARS desde Binance
async function obtenerCotizacionUSDT() {
  try {
    const resUSDT = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=USDTARS');
    const dataUSDT = await resUSDT.json();
    cotizacionUSDT = parseFloat(dataUSDT.price);
  } catch (e) {
    cotizacionUSDT = null;
  }
}

// Calcular и mostrar эквивалент только para ARS
async function actualizarEquivalente() {
  const moneda = selectMoneda.value;
  const monto = parseFloat(inputMonto.value.replace(',', '.'));

  if (moneda !== 'ARS' || !monto || monto <= 0) {
    divEquivalente.textContent = '';
    return;
  }

  if (!cotizacionUSDT) await obtenerCotizacionUSDT();

  if (cotizacionUSDT && cotizacionUSDT > 0) {
    const eqUSDT = (monto / cotizacionUSDT).toFixed(4);
    divEquivalente.textContent = `${monto} ARS ≈ ${eqUSDT} USDT   (1 USDT = ${cotizacionUSDT.toFixed(2)} ARS)`;
  } else {
    divEquivalente.textContent = 'No disponible';
  }
}

// Escuchar cambios en moneda y monto
selectMoneda.addEventListener('change', actualizarEquivalente);
inputMonto.addEventListener('input', actualizarEquivalente);

// Traer cotización inicial al cargar la página
window.addEventListener('DOMContentLoaded', obtenerCotizacionUSDT);
