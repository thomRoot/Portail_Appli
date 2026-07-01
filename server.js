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

// Endpoint pour récupérer le statut du RER B via l'API Open Data Île-de-France Mobilités
app.get('/api/ratp', async (req, res) => {
    try {
        // API Open Data Île-de-France Mobilités (sans clé API)
        const idfmApiUrl = 'https://api.iledefrance-mobilites.fr/api/v1/coverage/fr-idf/lines/line:RER:B';
        
        const response = await axios.get(idfmApiUrl, { timeout: 10000 });
        
        // Extraire le statut et le message
        const lineData = response.data.lines?.[0] || {};
        const status = lineData.status || 'inconnu';
        const message = lineData.messages?.[0]?.text || 'Aucune information disponible';
        
        res.json({
            message: message,
            status: status
        });
    } catch (error) {
        console.error('Erreur avec l\'API IDFM:', error.message);
        // En cas d'erreur, retourner une erreur claire SANS simulation
        res.status(500).json({
            error: 'Impossible de récupérer les données du RER B',
            details: error.message
        });
    }
});

// Démarrer le serveur
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Serveur proxy démarré sur http://0.0.0.0:${PORT}`);
    console.log(`Accédez à votre application sur http://localhost:${PORT} ou http://<VOTRE_IP_LOCALE>:${PORT}`);
});
