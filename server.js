/**
 * NORD EDIL S.R.L. - Server Express
 * Server per il sito web di NORD EDIL
 */

// Caricamento delle variabili d'ambiente
require('dotenv').config();

const express = require('express');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');
const morgan = require('morgan');

// Inizializzazione dell'app Express
const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Configurazione in base all'ambiente
if (NODE_ENV === 'production') {
  // Middleware per la sicurezza in produzione
  app.use(helmet({
    contentSecurityPolicy: false, // Disabilitato per permettere il caricamento di script esterni
  }));
  
  // Middleware per la compressione
  app.use(compression());
  
  // Middleware per il logging in produzione (formato più conciso)
  app.use(morgan('combined'));
} else {
  // Middleware per la sicurezza in sviluppo (meno restrittivo)
  app.use(helmet({
    contentSecurityPolicy: false,
  }));
  
  // Middleware per la compressione anche in sviluppo
  app.use(compression());
  
  // Middleware per il logging in sviluppo (formato più dettagliato)
  app.use(morgan('dev'));
}

// Servire file statici
app.use(express.static(path.join(__dirname)));

// Gestione delle route per le pagine principali
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Gestione delle route per le pagine nella cartella public
app.get('/privacy', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'privacy.html'));
});

app.get('/cookie-policy', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'cookie-policy.html'));
});

// Gestione della pagina 404
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Avvio del server
app.listen(PORT, () => {
  console.log(`Server NORD EDIL in esecuzione sulla porta ${PORT}`);
  console.log(`Visita http://localhost:${PORT} per visualizzare il sito`);
});