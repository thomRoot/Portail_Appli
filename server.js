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

// Endpoint pour récupérer le statut du RER B via l'API SNCF
app.get('/api/ratp', async (req, res) => {
    try {
        // Utilisation de l'API SNCF avec votre clé API
        const sncfApiUrl = 'https://api.sncf.com/v1/coverage/sncf/lines/line:RER:B/disruptions?token=5411095f-b156-4453-83e2-19c03d71a3bb';
        
        const response = await axios.get(sncfApiUrl, { 
            timeout: 10000 
        });
        
        // Analyser les données SNCF pour déterminer le statut
        const disruptions = response.data.disruptions || [];
        
        if (disruptions.length > 0) {
            // Si des perturbations sont détectées
            const firstDisruption = disruptions[0];
            res.json({
                message: firstDisruption.title || 'Perturbations sur la ligne RER B',
                status: 'perturbé',
                severity: firstDisruption.severity || 'unknown',
                details: firstDisruption.description || 'Aucune description disponible'
            });
        } else {
            // Si aucune perturbation
            res.json({
                message: 'Trafic normal sur la ligne RER B',
                status: 'normal'
            });
        }
    } catch (error) {
        console.error('Erreur avec l\'API SNCF:', error.message);
        
        // Si l'API SNCF échoue, retourner une erreur claire
        res.status(500).json({
            error: 'Impossible de récupérer les données SNCF',
            details: error.message,
            message: 'Trafic normal sur la ligne RER B (API SNCF indisponible)',
            status: 'normal'
        });
    }
});

// Démarrer le serveur
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Serveur proxy démarré sur http://0.0.0.0:${PORT}`);
    console.log(`Accédez à votre application sur http://localhost:${PORT} ou http://<VOTRE_IP_LOCALE>:${PORT}`);
});
