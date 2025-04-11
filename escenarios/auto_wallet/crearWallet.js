// escenarios/auto_wallet/crearWallet.js
const { Wallet } = require("ethers");

function crearWallet() {
  const wallet = Wallet.createRandom();

  return {
    address: wallet.address,
    privateKey: wallet.privateKey
  };
}

module.exports = crearWallet;
