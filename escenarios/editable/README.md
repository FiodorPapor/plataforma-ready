Escenario 1 — Monto Editable (CoinGate)

🎯 Propósito

Permitir al cliente final ingresar manualmente el monto que desea pagar en criptomonedas.
Ideal para donaciones, POS físico, servicios personalizados o consumo variable.

🔧 Tecnologías utilizadas

CoinGate API (modo sandbox/test por ahora)

HTML dinámico con pagar.html

Lógica backend en server.js

Config individual por comercio (usuarios.json)

🧩 Lógica de funcionamiento

El cliente accede a: /pagar.html?id=panaderia123

El sistema carga datos desde /comercio/:id

Si el escenario es editable, se muestra un input para el monto

Al enviar el formulario, se hace POST a /crear-pago

El backend genera una orden en CoinGate

Se redirige al cliente a la URL de pago provista por CoinGate

🧪 Estado actual



📉 Limitaciones de NOWPayments

No permite USDT como moneda

Conversión poco clara cuando se usa ARS

Checkout poco confiable para usuarios comunes

✅ Ventajas de CoinGate

Admite múltiples monedas (BTC, ETH, USDT, etc.)

Checkout profesional y amigable

Mejores tasas de conversión

API clara y estable

💡 Mejoras futuras

Modularizar crear-pago según procesador

Agregar validaciones de monto mínimo/máximo

Feedback visual al cliente (pantalla de éxito o error)

Activar logs internos y alertas si el pago falla

📁 Estructura de archivos

/public
  pagar.html
  pagar.js

server.js
usuarios.json

✍ Registro del comercio (usuarios.json)

{
  "client_id": "panaderia123",
  "escenario": "editable",
  "procesador": "coingate",
  "moneda": "ARS",
  "descripcion": "Pagá lo que consumiste",
  "logo": "logo.png"
}

📌 Notas

Este escenario es el más flexible, pero también el más riesgoso si el monto no es controlado. Debe usarse solo cuando se justifica el pago variable.