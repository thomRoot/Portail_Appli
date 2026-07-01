const express = require('express');
const path = require('path');

const app = express();
const PORT = 8000; // Port pour le serveur proxy

// Activer CORS pour permettre les requêtes depuis votre application
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Servir les fichiers statiques (index.html, app.js, styles.css, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Démarrer le serveur
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Serveur démarré sur http://0.0.0.0:${PORT}`);
    console.log(`Accédez à votre application sur http://localhost:${PORT} ou http://<VOTRE_IP_LOCALE>:${PORT}`);
});
