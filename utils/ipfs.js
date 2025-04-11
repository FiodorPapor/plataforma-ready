const { create } = require("ipfs-http-client");

const projectId = process.env.INFURA_PROJECT_ID;
const projectSecret = process.env.INFURA_PROJECT_SECRET;

const auth =
  "Basic " + Buffer.from(`${projectId}:${projectSecret}`).toString("base64");

const client = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});

async function subirArchivo(buffer) {
  const result = await client.add(buffer);
  return `https://ipfs.io/ipfs/${result.path}`;
}

module.exports = subirArchivo;
