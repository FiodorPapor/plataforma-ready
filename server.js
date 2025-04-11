require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const ethers = require("ethers");
const crearWallet = require("./escenarios/auto_wallet/crearWallet");
const generarPdfWallet = require("./utils/pdfWallet");
const subirArchivo = require("./utils/ipfs");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

const USERS_FILE = path.join(__dirname, "usuarios.json");

let usuarios = [];
try {
  if (fs.existsSync(USERS_FILE)) {
    const data = fs.readFileSync(USERS_FILE, "utf-8");
    usuarios = JSON.parse(data || "[]");
  }
} catch (err) {
  console.error("⚠️ Error leyendo usuarios.json:", err.message);
  usuarios = [];
}

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));
app.get("/dashboard.html", (req, res) => res.sendFile(path.join(__dirname, "public", "dashboard.html")));
app.get("/login.html", (req, res) => res.sendFile(path.join(__dirname, "public", "login.html")));

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Faltan datos" });

  const user = usuarios.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ error: "Email o contraseña incorrectos" });

  res.json({ client_id: user.client_id });
});

app.post("/registro", (req, res) => {
  const { nombre, email, password, negocio, web, pais, id } = req.body;
  if (!nombre || !email || !password || !pais) return res.status(400).json({ error: "Faltan campos obligatorios" });

  const yaExiste = usuarios.find(user => user.email === email);
  if (yaExiste) return res.status(409).json({ error: "Ese email ya está registrado" });

  const nuevoUsuario = {
    client_id: id,
    nombre,
    email,
    password,
    negocio,
    web,
    pais,
    fecha_registro: new Date().toISOString()
  };

  usuarios.push(nuevoUsuario);
  fs.writeFileSync(USERS_FILE, JSON.stringify(usuarios, null, 2));
  res.json({ client_id: id });
});

// ✅ Crear wallet + PDF + IPFS
app.post("/generar-wallet", async (req, res) => {
  const { client_id } = req.body;
  const userIndex = usuarios.findIndex(u => u.client_id === client_id);
  if (!client_id || userIndex === -1) return res.status(400).json({ error: "Usuario no encontrado o sin ID" });

  try {
    const { address, privateKey } = crearWallet();

    usuarios[userIndex].wallet_address = address;
    usuarios[userIndex].fecha_wallet = new Date().toISOString();
    fs.writeFileSync(USERS_FILE, JSON.stringify(usuarios, null, 2));

    const pdfBuffer = await generarPdfWallet({ address, privateKey });
    const ipfsUrl = null; // IPFS отключён временно

    res.json({
      address,
      privateKey,
      ipfsUrl,
      mensaje: "Guardá tu clave privada en un lugar seguro. No podrá recuperarse más adelante."
    });
  } catch (err) {
    console.error("🚫 Error al generar wallet:", err);
    res.status(500).json({ error: "No se pudo crear la wallet" });
  }
});

app.post("/api/guardar-wallet-manual", async (req, res) => {
  const { client_id, nombre_wallet, direccion_wallet } = req.body;

  if (!client_id || !nombre_wallet || !direccion_wallet) {
    return res.status(400).json({ error: "Faltan datos" });
  }

  if (!ethers.isAddress(direccion_wallet)) {
    return res.status(400).json({ error: "Dirección inválida" });
  }

  const userIndex = usuarios.findIndex(u => u.client_id === client_id);
  if (userIndex === -1) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }

  try {
    const contractUSDT = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F";
    const apiKey = "YP2ICEJ2T7UFVPC6G224AB53ADVCA98D6J";
    const url = `https://api.polygonscan.com/api?module=account&action=tokenbalance&contractaddress=${contractUSDT}&address=${direccion_wallet}&tag=latest&apikey=${apiKey}`;

    const response = await axios.get(url);
    if (!response.data || response.data.status !== "1") {
      return res.status(400).json({ error: "No se pudo verificar en Polygon" });
    }

    usuarios[userIndex].wallet_address = direccion_wallet;
    usuarios[userIndex].wallet_nombre = nombre_wallet;
    usuarios[userIndex].fecha_wallet = new Date().toISOString();

    fs.writeFileSync(USERS_FILE, JSON.stringify(usuarios, null, 2));
    res.json({ ok: true });

  } catch (err) {
    console.error("🚫 Error al guardar wallet manual:", err.message);
    res.status(500).json({ error: "Error al verificar o guardar la wallet" });
  }
});

app.get("/usuario/:id", (req, res) => {
  const id = req.params.id;
  const user = usuarios.find(u => u.client_id === id);
  if (!user) return res.status(404).json({ mensaje: "Usuario no encontrado" });

  const { password, ...datosPublicos } = user;
  res.json(datosPublicos);
});

app.get("/comercio/:client_id", (req, res) => {
  const clientId = req.params.client_id;
  const comercio = usuarios.find(u => u.client_id === clientId);
  if (!comercio) return res.status(404).json({ error: "Comercio no encontrado" });

  const { nombre = "Comercio", descripcion = "Descripción no disponible", moneda = "USD", escenario = "editable" } = comercio;
  res.json({ nombre, descripcion, moneda, escenario });
});

app.post("/crear-pago", async (req, res) => {
  const { client_id, monto } = req.body;
  const comercio = usuarios.find(u => u.client_id === client_id);
  if (!comercio) return res.status(404).json({ error: "Comercio no encontrado" });

  try {
    const response = await axios.post("https://api.nowpayments.io/v1/invoice", {
      price_amount: monto,
      price_currency: "ARS",
      pay_currency: "USDT",
      order_description: `Pago a ${comercio.nombre}`,
      success_url: "https://plataforma.ar/gracias",
      cancel_url: "https://plataforma.ar/cancelado"
    }, {
      headers: {
        "x-api-key": "W7YVGKM-ZFB4NP8-NF0HQQZ-KP6Y01B",
        "Content-Type": "application/json"
      }
    });

    res.json({ payment_url: response.data.invoice_url });
  } catch (error) {
    console.error("❌ Error creando el pago:", error.response?.data || error.message);
    res.status(500).json({ error: "Error al crear el pago" });
  }
});

app.get("/pagar/:id", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "pagar.html"));
});

app.get("/api/datos-cliente/:id", (req, res) => {
  const id = req.params.id;
  const user = usuarios.find(u => u.client_id === id);
  if (!user) return res.status(404).json({ error: "Cliente no encontrado" });

  res.json({
    nombre: user.nombre || "Negocio",
    wallet: user.wallet_address || "",
    wallet_manual: user.wallet_manual || null,
    logo: user.logo || null
  });
});

app.get("/saldo/:id", async (req, res) => {
  const id = req.params.id;
  const user = usuarios.find(u => u.client_id === id);
  if (!user || !user.wallet_address) return res.status(404).json({ error: "Wallet no encontrada" });

  const wallet = user.wallet_address;
  const contractUSDT = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F"; // ✅ PoS USDT (Polygon Bridged)
  const apiKey = "YP2ICEJ2T7UFVPC6G224AB53ADVCA98D6J";
  const url = `https://api.polygonscan.com/api?module=account&action=tokenbalance&contractaddress=${contractUSDT}&address=${wallet}&tag=latest&apikey=${apiKey}`;

  try {
    const response = await axios.get(url);
    const rawBalance = response.data.result;
    const balanceUSDT = parseFloat(rawBalance) / 10 ** 6;
    res.json({ wallet, balance_usdt: balanceUSDT.toFixed(2) });
  } catch (error) {
    console.error("❌ Error al consultar Polygonscan:", error.message);
    res.status(500).json({ error: "No se pudo obtener el saldo" });
  }
});

app.listen(PORT, () => {
  console.log(`🟢 Servidor corriendo en http://localhost:${PORT}`);
});
