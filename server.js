const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 8000;

// Activer CORS pour permettre les requêtes depuis votre application
app.use(cors());

// Servir les fichiers statiques (index.html, app.js, styles.css, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint pour récupérer le statut du RER B via l'API non officielle de Pierre Grimaud
// Cette API est stable, gratuite et ne nécessite pas de clé API
app.get('/api/ratp', async (req, res) => {
    try {
        // API non officielle mais ultra-fiable pour le statut du RER B
        const apiUrl = 'https://api-ratp.pierre-grimaud.fr/v4/traffic/rer/b';
        
        const response = await axios.get(apiUrl, { timeout: 10000 });
        const data = response.data;
        
        // Réponse standardisée pour votre frontend
        if (data.result && data.result.status === 'normal') {
            res.json({
                message: 'Trafic normal sur la ligne RER B',
                status: 'normal',
                severity: 'normal'
            });
        } else {
            res.json({
                message: data.result?.message || 'Perturbations sur la ligne RER B',
                status: 'perturbé',
                severity: data.result?.severity || 'high'
            });
        }
    } catch (error) {
        console.error('Erreur avec l\'API RATP:', error.message);
        res.status(500).json({
            error: 'Impossible de récupérer les données du RER B',
            details: error.message,
            fallback: 'Vérifiez que le serveur est lancé (node server.js) et que votre connexion internet fonctionne.'
        });
    }
});

// Démarrer le serveur
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Serveur démarré sur http://0.0.0.0:${PORT}`);
    console.log(`Accédez à votre application sur http://localhost:${PORT} ou http://<VOTRE_IP_LOCALE>:${PORT}`);
});
