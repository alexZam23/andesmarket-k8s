const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const APP_VERSION = process.env.APP_VERSION || 'v1';
const DATA_DIR = process.env.DATA_DIR || '/data';
const DATA_FILE = path.join(DATA_DIR, 'registros.json');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const productos = [
  { id: 1, nombre: 'Poncho de alpaca', precio: 250 },
  { id: 2, nombre: 'Café de altura', precio: 45 },
  { id: 3, nombre: 'Sombrero de sao', precio: 80 },
  { id: 4, nombre: 'Chocolate artesanal', precio: 30 }
];

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
  }
}

function leerRegistros() {
  ensureDataDir();
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
}

function guardarRegistro(entrada) {
  const registros = leerRegistros();
  registros.push({ ...entrada, fecha: new Date().toISOString() });
  fs.writeFileSync(DATA_FILE, JSON.stringify(registros, null, 2));
  return registros;
}

app.get('/', (req, res) => {
  const filas = productos
    .map(p => `<tr><td>${p.id}</td><td>${p.nombre}</td><td>$${p.precio}</td></tr>`)
    .join('');
  res.send(`
    <html>
      <head><title>AndesMarket</title></head>
      <body style="font-family: sans-serif; margin: 40px;">
        <h1>AndesMarket</h1>
        <h2 style="color:red;">⚠️ VERSIÓN DEFECTUOSA</h2>
        <h3>Catálogo de productos</h3>
        <table border="1" cellpadding="8" cellspacing="0">
          <tr><th>ID</th><th>Producto</th><th>Precio</th></tr>
          ${filas}
        </table>
        <p><b>Empresa:</b> ${process.env.EMPRESA || 'AndesMarket'} &nbsp;
           <b>Ciudad:</b> ${process.env.CIUDAD || 'N/D'}</p>
        <p>Pods vivo desde: ${new Date().toISOString()}</p>
      </body>
    </html>
  `);
});

app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

app.post('/data', (req, res) => {
  const { mensaje } = req.body;
  if (!mensaje) return res.status(400).json({ error: 'Falta "mensaje"' });
  const registros = guardarRegistro({ mensaje });
  res.status(201).json({ ok: true, total: registros.length });
});

app.get('/data', (req, res) => {
  res.json(leerRegistros());
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`AndesMarket ${APP_VERSION} escuchando en puerto ${PORT}`);
});
