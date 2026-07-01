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

// Endpoint pour récupérer le statut du RER B via l'API Open Data Île-de-France Mobilités (v2)
app.get('/api/ratp', async (req, res) => {
    try {
        // Nouvelle URL de l'API IDFM v2 pour les perturbations du RER B
        const idfmApiUrl = 'https://api.iledefrance-mobilites.fr/v2/coverage/fr-idf/disruptions?filter=line.code=RERB';
        
        const response = await axios.get(idfmApiUrl, { timeout: 10000 });
        
        // Analyser les perturbations pour le RER B
        const disruptions = response.data.disruptions || [];
        
        if (disruptions.length > 0) {
            // Si des perturbations sont trouvées
            const firstDisruption = disruptions[0];
            res.json({
                message: firstDisruption.title || 'Perturbations sur la ligne RER B',
                status: 'perturbé',
                severity: firstDisruption.severity || 'unknown'
            });
        } else {
            // Si aucune perturbation
            res.json({
                message: 'Trafic normal sur la ligne RER B',
                status: 'normal'
            });
        }
    } catch (error) {
        console.error('Erreur avec l\'API IDFM:', error.message);
        
        // Gestion spécifique des erreurs 404
        if (error.response && error.response.status === 404) {
            res.status(404).json({
                error: 'Endpoint API IDFM introuvable.',
                details: 'Vérifiez l\'URL ou les paramètres de l\'API IDFM.',
                suggestion: 'Essayez avec : https://api.iledefrance-mobilites.fr/v2/coverage/fr-idf/disruptions?filter=line.code=RERB'
            });
        } else {
            // En cas d'erreur, retourner une erreur claire SANS simulation
            res.status(500).json({
                error: 'Impossible de récupérer les données du RER B',
                details: error.message
            });
        }
    }
});

// Démarrer le serveur
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Serveur proxy démarré sur http://0.0.0.0:${PORT}`);
    console.log(`Accédez à votre application sur http://localhost:${PORT} ou http://<VOTRE_IP_LOCALE>:${PORT}`);
});
