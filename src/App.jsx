import React from 'react'

function App() {
  const handleClick = async () => {
    const apiKey = "W7YVGKM-ZFB4NP8-NF0HQQZ-KP6Y01B"; // ✅ Твой API-ключ NOWPayments

    const body = {
      price_amount: 100, // 💰 Сумма в ARS
      price_currency: "ars",
      order_id: "pedido-" + Date.now(),
      order_description: "Pago libre con cripto en PlataformA",
      success_url: "https://tusitio.com/success",
      cancel_url: "https://tusitio.com/cancel"
      // ❌ No se incluye pay_currency → el cliente elige la moneda
    };

    try {
      const response = await fetch("https://api.nowpayments.io/v1/invoice", {
        method: "POST",
        headers: {
          "x-api-key": apiKey,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();
      console.log("📩 Invoice creado:", data);

      if (data.invoice_url) {
        window.open(data.invoice_url, "_blank"); // 🔗 Abre la página de pago
      } else {
        alert("Hubo un error creando la factura.");
        console.error("Respuesta sin invoice_url:", data);
      }
    } catch (error) {
      console.error("Error al crear la factura:", error);
      alert("Ocurrió un error en el proceso.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        PlataformA — Pagos en Cripto
      </h1>

      <button
        onClick={handleClick}
        className="px-6 py-3 bg-blue-600 text-white rounded-xl text-lg hover:bg-blue-700 transition"
      >
        Pagar 1600 ARS 💸
      </button>
    </div>
  );
}

export default App;
