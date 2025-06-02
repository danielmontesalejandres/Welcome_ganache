// backend/server.js

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const { Web3 } = require('web3');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Permite recibir JSON y peticiones CORS del frontend
app.use(express.json());
app.use(cors());

// Lee la ABI y dirección del contrato desde los archivos JSON
const contractABI = JSON.parse(fs.readFileSync('./contractABI.json'));
const contractAddress = JSON.parse(fs.readFileSync('./contractAddress.json')).address;

// Conecta a Ganache local
const web3 = new Web3('http://127.0.0.1:7545');

// Para firmar transacciones, usa la clave privada de la primera cuenta de Ganache
// ⚠️ ¡No uses esto en producción! La clave privada debe protegerse adecuadamente.
const PRIVATE_KEY = process.env.PRIVATE_KEY || 'TU_CLAVE_PRIVADA_GANACHE';
const account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);
web3.eth.accounts.wallet.add(account);
web3.eth.defaultAccount = account.address;

// Instancia el contrato
const saludoContract = new web3.eth.Contract(contractABI, contractAddress);

/**
 * GET /api/mensaje
 * Obtiene el mensaje actual del contrato.
 */
app.get('/api/mensaje', async (req, res) => {
  try {
    const mensaje = await saludoContract.methods.getMensaje().call();
    res.json({ mensaje });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error al leer el mensaje: ' + error.message });
  }
});

/**
 * POST /api/mensaje
 * Modifica el mensaje en el contrato (requiere firmar la transacción).
 * Cuerpo esperado: { "nuevoMensaje": "Texto" }
 */
app.post('/api/mensaje', async (req, res) => {
  const { nuevoMensaje } = req.body;
  if (typeof nuevoMensaje !== 'string' || nuevoMensaje.trim() === '') {
    return res.status(400).json({ status: 'error', message: 'El nuevo mensaje no puede estar vacío.' });
  }
  try {
    const tx = saludoContract.methods.setMensaje(nuevoMensaje);
    const gas = await tx.estimateGas({ from: account.address });

    const txData = {
      from: account.address,
      to: contractAddress,
      gas,
      data: tx.encodeABI()
    };

    const receipt = await web3.eth.sendTransaction(txData);
    res.json({ status: 'success', txHash: receipt.transactionHash });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error al modificar el mensaje: ' + error.message });
  }
});

// Inicio del servidor
app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
});
