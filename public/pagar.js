// public/pagar.js

document.addEventListener("DOMContentLoaded", async () => {
  const clientId = new URLSearchParams(window.location.search).get("id");
  const infoDiv = document.getElementById("infoComercio");
  const montoInput = document.getElementById("monto");

  let escenario = null;

  try {
    const res = await fetch(`/comercio/${clientId}`);
    const data = await res.json();

    if (!data) {
      infoDiv.innerHTML = "<p class='text-red-600'>Comercio no encontrado</p>";
      return;
    }

    escenario = data.escenario;

    infoDiv.innerHTML = `
      <h2 class="text-xl font-bold mb-2">${data.nombre}</h2>
      <p class="text-gray-600 mb-1">${data.descripcion}</p>
      <p class="text-sm text-gray-500">Moneda: ${data.moneda}</p>
    `;

    if (escenario === "editable") {
      montoInput.style.display = "block";
    }
  } catch (err) {
    infoDiv.innerHTML = "<p class='text-red-600'>Error al cargar el comercio</p>";
  }

  document.getElementById("formPago").addEventListener("submit", async (e) => {
    e.preventDefault();

    let monto = 0;

    if (escenario === "editable") {
      monto = parseFloat(montoInput.value);
      if (isNaN(monto) || monto <= 0) {
        alert("Ingresá un monto válido");
        return;
      }
    } else {
      // en el futuro: cargar monto desde config para escenario "fijo"
      alert("Este escenario todavía no está implementado");
      return;
    }

    try {
      const res = await fetch("/crear-pago", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ client_id: clientId, monto })
      });

      const result = await res.json();

      if (res.ok && result.payment_url) {
        window.location.href = result.payment_url;
      } else {
        alert(result.error || "Hubo un error al crear el pago");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("No se pudo generar el pago");
    }
  });
});
