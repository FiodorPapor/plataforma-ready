// 🔎 Función para obtener parámetros desde la URL
function getParam(key) {
    const url = new URL(window.location.href);
    return url.searchParams.get(key);
  }
  
  // 📦 Función para cargar los datos del cliente
  async function cargarDatos() {
    const clientId = getParam("id");
    if (!clientId) {
      alert("No se proporcionó un ID válido.");
      return;
    }
  
    try {
      const res = await fetch("/usuarios.json");
      const data = await res.json();
      const cliente = data.find(c => c.client_id === clientId);
  
      if (!cliente) {
        alert("Cliente no encontrado.");
        return;
      }
  
      // Rellenar datos en el HTML
      document.getElementById("nombre").textContent = cliente.nombre || "Comercio";
      document.getElementById("descripcion").textContent = cliente.descripcion || "Descripción del pago";
      document.getElementById("wallet").textContent = cliente.wallet || "Sin wallet";
      
      // Mostrar logo si existe
      if (cliente.logo) {
        const logo = document.getElementById("logo");
        logo.src = cliente.logo;
        logo.classList.remove("hidden");
      }
  
      // Generar QR
      const qr = new QRious({
        element: document.createElement("canvas"),
        value: cliente.wallet || "",
        size: 200
      });
      document.getElementById("qr-container").appendChild(qr.element);
  
      // Mostrar input si el escenario es editable
      if (cliente.escenario === "editable") {
        document.getElementById("montoEditable").classList.remove("hidden");
      }
  
    } catch (error) {
      console.error("Error al cargar los datos del cliente:", error);
    }
  }
  
  // 📋 Función para copiar la wallet
  function copiarWallet() {
    const texto = document.getElementById("wallet").textContent;
    navigator.clipboard.writeText(texto).then(() => {
      alert("Dirección copiada al portapapeles");
    });
  }
  
  // 🧪 Función de simulación de pago (modo demo)
  function simularPago() {
    const monto = document.getElementById("inputMonto")?.value || "(monto fijo)";
    alert("Simulación de pago exitosa.\nMonto: " + monto);
  }
  
  // 🚀 Ejecutar al cargar
  window.onload = cargarDatos;
  