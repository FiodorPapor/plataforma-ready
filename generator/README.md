📝 Especificación Técnica — Generador de Páginas PlataformA

1. 📌 Objetivo
Crear un generador automatizado de páginas para recibir pagos en cripto, sin registro, como módulo de la plataforma PlataformA. Enfocado en PyMEs, freelancers y emprendimientos.

2. ⚙️ Estructura de Archivos (módulo generador)
generator/index.html — página principal del generador

generator/styles.css — estilos del generador

generator/script.js — lógica del generador

generator/assets/ — imágenes y logos

Este módulo es parte del repo principal de PlataformA.

3. 🖊️ Formulario de generación de página
Nombre del negocio (obligatorio)

Descripción del servicio/producto (obligatorio)

Dirección pública de la wallet (obligatorio, con opción “Crear wallet”)

Si no tiene wallet:

Se genera automáticamente en la red Polygon,

Se completa el campo con la dirección,

El usuario recibe un archivo PDF generado solo una vez con:

Dirección pública de la wallet (con botón "Copiar")

Llave privada (con advertencia y botón "Copiar")

Recomendaciones de seguridad

La llave privada no se guarda ni se envía por email

Cripto elegida (obligatorio): BTC / ETH / USDT / USDC

Red (opcional, para versiones futuras)

Monto (opcional, si no se define lo pone quien paga)

Logo (opcional)

4. 🧩 Lógica de funcionamiento
Creación instantánea de página única para el cliente

Generación de QR para cobrar (según dirección y cripto)

Diseño minimalista y ágil

Validación de campos obligatorios

Si elige “Crear wallet”:

La wallet se genera solamente en el navegador (client-side) para máxima descentralización y seguridad

El usuario descarga un PDF con la dirección y la llave privada solo una vez, con advertencia y recomendaciones

Advertencia en el PDF:

“Vos sos responsable de la custodia de tu llave privada. ¡Nunca la compartas con nadie!”

5. 💾 Almacenamiento y analítica
Guardar datos de las páginas creadas (JSON o base simple)

Limitar la cantidad de páginas por usuario

Más adelante: registro de emails, analítica (no en MVP)

6. 💲 Monetización
Gratis hasta 3–5 páginas por usuario (limitado por IP/email)

Luego: suscripción o pago único

Extras: comisión por transacción, funciones pagas (analítica, customización)

7. 🚀 Roadmap MVP
Crear formulario y validación

Generación automática de wallet en caso necesario (Polygon, client-side, PDF con dirección y llave privada, botones “Copiar”, advertencia)

Generar página única después de completar formulario

QR automático

Estilos mínimos, sin recargar

Mini-base JSON para guardar datos

Registro de email y analítica: después del MVP

8. 📝 Requisitos de código
Siempre enviar archivos completos (no fragmentos)

Indentar con 2 espacios

Todos los comentarios en español argentino

Mantener simpleza en MVP

Cada etapa: commit separado y descriptivo

9. 💻 GitHub
Repo: PlataformA Ready

Cambios o nuevas funciones solo tras charlar y aprobar

10. 📚 Estrategia y visión
Tomar en cuenta misión, objetivos y valores de PlataformA,
visión a largo plazo y docs clave (como Planificación) antes de cualquier mejora o decisión.

Este documento es el estándar para desarrollo, testeo y escalado del MVP del generador de páginas PlataformA.

