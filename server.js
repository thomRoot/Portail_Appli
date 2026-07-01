const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 8000; // Port pour le serveur proxy

// Activer CORS pour permettre les requêtes depuis votre application
app.use(cors());

// Servir les fichiers statiques (index.html, app.js, styles.css, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint pour proxyfier les requêtes vers l'API RATP
app.get('/api/ratp', async (req, res) => {
    try {
        const ratpApiUrl = 'https://api-ratp.pierre-grimaud.fr/v4/lines/RERB/status';
        const response = await axios.get(ratpApiUrl);
        res.json(response.data);
    } catch (error) {
        console.error('Erreur lors de la récupération des données RATP :', error.message);
        res.status(500).json({
            error: 'Impossible de récupérer les données RATP',
            details: error.message
        });
    }
});

// Démarrer le serveur
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Serveur proxy démarré sur http://0.0.0.0:${PORT}`);
    console.log(`Accédez à votre application sur http://localhost:${PORT} ou http://<VOTRE_IP_LOCALE>:${PORT}`);
});
