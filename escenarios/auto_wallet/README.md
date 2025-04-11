⚙️ ESCENARIO: “Wallet auto-generada para el cliente”
💡 Ideal cuando el cliente no tiene wallet y quiere cobrar en cripto, sin complicarse.

🧠 OBJETIVO
Cuando el cliente hace clic en “Conectar Wallet” en tu plataforma:

Se le genera una billetera nueva (automáticamente)

Se le asigna esa wallet en su cuenta (usuarios.json)

Se le muestra la dirección y se le entrega su clave privada

A partir de ahí, cualquier pago llega a su wallet directamente

🧩 FLUJO COMPLETO DEL ESCENARIO
🔹 1. Cliente se registra en tu plataforma
Con datos básicos: nombre, email, negocio...

🔹 2. En el dashboard ve un botón:
🪙 “Generar billetera automáticamente”

🔹 3. Tu backend ejecuta (Node.js + ethers.js):
js
Copy
Edit
const ethers = require("ethers");
const wallet = ethers.Wallet.createRandom();

const nueva_wallet = {
  direccion: wallet.address,
  clave_privada: wallet.privateKey
};
🔹 4. Guardás la dirección en su cuenta:
json
Copy
Edit
{
  "client_id": "panaderia123",
  "wallet": "0xABC123...",
  "escenario": "auto_wallet",
  "procesador": "metamask_custom"
}
💾 Importante: la clave privada no se guarda. Solo se muestra una vez al cliente para que la descargue y la importe.

🔹 5. Le mostrás al cliente su nueva wallet:
html
Copy
Edit
✅ ¡Tu wallet fue creada!
📬 Dirección: `0xABC...`
🧾 Clave privada (¡guardala con seguridad!): `0x...`
[Descargar PDF con datos]
🔹 6. Ya puede recibir pagos
Ahora el escenario editable funciona así:

El cliente ingresa el monto

Tu sistema genera un link o QR para que otro pague a esa address

Los pagos entran directo a la wallet generada

✅ BENEFICIOS
✔ No necesita usar MetaMask
✔ No necesita registrarse en Binance ni CoinGate
✔ Todo fluye dentro de tu plataforma

⚠️ RIESGOS / DESAFÍOS
🔐 Clave privada debe ser entregada una sola vez y NO almacenarse en backend
🧯 El cliente es el único responsable si la pierde
🧪 Tenés que dejar bien claro cómo hacer backup / restauración
📄 Para más seguridad: podés generar un PDF descargable con info

🔜 OPCIONAL MÁS ADELANTE:
Encriptar la clave con una contraseña del cliente

Enviar backup al mail

Agregar botón de “Ver mi wallet” para seguimiento

