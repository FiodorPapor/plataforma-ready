// utils/pdfWallet.js
const PDFDocument = require("pdfkit");
const { Buffer } = require("buffer");

function generarPdfWallet({ address, privateKey }) {
  const doc = new PDFDocument();
  const chunks = [];

  doc.on("data", chunk => chunks.push(chunk));
  doc.on("end", () => {});

  doc.fontSize(20).fillColor("green").text("📄 Tu nueva Wallet", { align: "center" });
  doc.moveDown();

  doc.fontSize(14).fillColor("white").text("Dirección pública:", { underline: true });
  doc.fillColor("cyan").text(address, { paragraphGap: 10 });

  doc.fontSize(14).fillColor("white").text("Clave privada:", { underline: true });
  doc.fillColor("red").text(privateKey, { paragraphGap: 10 });

  doc.fontSize(12).fillColor("yellow").text("⚠ Esta clave NO se guarda en la plataforma. Guardala en un lugar seguro y privado.");
  doc.moveDown().text("✅ Podés imprimir este documento y guardarlo offline.");

  doc.end();

  return new Promise(resolve => {
    doc.on("end", () => {
      const pdfBuffer = Buffer.concat(chunks);
      resolve(pdfBuffer);
    });
  });
}

module.exports = generarPdfWallet;
