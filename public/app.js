// Configuration de la base de données
const DB_NAME = 'PortailAppliDB';
const DB_VERSION = 3;

// **IMPORTANT : Remplacez par votre propre clé API OpenWeatherMap**
// Inscrivez-vous gratuitement sur https://openweathermap.org/api
const WEATHER_API_KEY = 'votre_cle_api_ici';

// Coordonnées pour Noneville
const LAT = 48.93091298084958;
const LON = 2.4856556085876904;

// Configuration pour l'API RATP (utilisation d'une API alternative sans clé API)
// API non officielle mais fonctionnelle sans clé : https://api-ratp.pierre-grimaud.fr
const RATP_API_URL = 'http://localhost:3000/api/ratp';

// Suppression de la dépendance à Navitia et au proxy CORS Heroku (qui ne fonctionne plus)
// const RATP_PROXY_URL = 'https://cors-anywhere.herokuapp.com/' + RATP_API_URL;

// Variable pour la base de données et le graphique
let db;
let weatherChart;
let currentWeatherData = null;
let rerBStatus = 'inconnu';
let rerBLastUpdate = null;
let rerBMessage = 'Aucun message disponible';

// Initialisation de l'application
window.addEventListener('DOMContentLoaded', () => {
    initDB();
    setupEventListeners();
    setupRobotEventListeners();
    setupRerBEventListeners();
    loadSites();
    
    // Vérifier la clé API au démarrage
    checkApiKey();
    
    // Charger la météo toutes les 10 minutes
    setInterval(loadWeather, 10 * 60 * 1000);
    
    // Charger l'état du RER B toutes les 2 minutes
    loadRerBStatus();
    setInterval(loadRerBStatus, 2 * 60 * 1000);
});

// Initialisation de la base de données IndexedDB
function initDB() {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = (event) => {
        console.error('Erreur lors de l\'ouverture de la base de données:', event.target.error);
        showApiStatus('error', 'Erreur base de données');
    };
    
    request.onsuccess = (event) => {
        db = event.target.result;
        console.log('Base de données ouverte avec succès');
    };
    
    request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Création du store pour les sites
        if (!db.objectStoreNames.contains('sites')) {
            const store = db.createObjectStore('sites', { keyPath: 'id', autoIncrement: true });
            store.createIndex('name', 'name', { unique: false });
            store.createIndex('url', 'url', { unique: true });
            store.createIndex('icon', 'icon', { unique: false });
            store.createIndex('createdAt', 'createdAt', { unique: false });
        }
        
        console.log('Base de données initialisée');
    };
}

// Vérification de la clé API
function checkApiKey() {
    // Vérifier si la clé API est vide ou non configurée
    if (!WEATHER_API_KEY || WEATHER_API_KEY === 'votre_cle_api_ici' || WEATHER_API_KEY.trim() === '') {
        console.error('❌ Clé API OpenWeatherMap non configurée ou vide. Veuillez la configurer dans app.js.');
        showApiStatus('error', 'Clé API OpenWeatherMap non configurée');
        updateWeatherError('❌ Clé API OpenWeatherMap non configurée. Veuillez la configurer dans app.js.');
        return false;
    }
    
    console.log('🔍 Vérification de la clé API OpenWeatherMap...');
    
    // Tester la clé API avec un appel simple
    const testUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&appid=${WEATHER_API_KEY}&units=metric&lang=fr`;
    
    fetch(testUrl)
        .then(response => {
            console.log('📡 Réponse de l\'API OpenWeatherMap:', response.status, response.statusText);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('✅ Réponse de l\'API:', data);
            if (data.cod === 200) {
                console.log('✅ Clé API valide. Chargement de la météo...');
                showApiStatus('success', 'API active');
                loadWeather();
                return true;
            } else {
                console.error('❌ Erreur de l\'API OpenWeatherMap:', data.message || 'Code d\'erreur: ' + data.cod);
                throw new Error(`API Error: ${data.message || 'Code d\'erreur: ' + data.cod}`);
            }
        })
        .catch(error => {
            console.error('❌ Erreur de vérification API:', error);
            showApiStatus('error', 'Clé API invalide');
            updateWeatherError(`❌ Erreur avec l\'API OpenWeatherMap: ${error.message}. Vérifiez votre clé API ou votre connexion.`);
            return false;
        });
}

// Affichage du statut de l'API (icône seulement)
function showApiStatus(status, message) {
    const statusElement = document.getElementById('apiStatus');
    const iconElement = document.getElementById('apiStatusIcon');
    
    // Retirer les classes précédentes
    statusElement.classList.remove('success', 'error', 'warning');
    
    // Ajouter la nouvelle classe
    statusElement.classList.add(status);
    
    // Mettre à jour l'icône
    switch(status) {
        case 'success':
            iconElement.className = 'fas fa-check-circle';
            break;
        case 'error':
            iconElement.className = 'fas fa-exclamation-circle';
            break;
        case 'warning':
            iconElement.className = 'fas fa-spinner fa-spin';
            break;
        default:
            iconElement.className = 'fas fa-circle';
    }
}

// Chargement de l'état du RER B (via API alternative sans clé API)
function loadRerBStatus() {
    // Afficher un état de chargement
    updateRerBStatus('chargement', 'Chargement de l\'état du RER B...');
    
    // Utiliser l'API alternative directement (sans proxy CORS)
    fetch(RATP_API_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Analyser les données RATP
            const result = analyzeRATPData(data);
            updateRerBStatus(result.status, result.message);
        })
        .catch(error => {
            console.error('Erreur avec l\'API RATP:', error);
            // En cas d'erreur, afficher un message d'erreur clair (plus de simulation)
            updateRerBStatus('error', 'API RER B indisponible. Veuillez vérifier votre connexion ou configurer une solution alternative.');
        });
}

// Analyse des données RATP pour déterminer l'état
function analyzeRATPData(data) {
    // Structure typique de la réponse RATP
    if (!data || !data.message) {
        return { status: 'inconnu', message: 'Données incomplètes reçues de l\'API RATP.' };
    }
    
    // Vérifier si le message contient des mots-clés de perturbation
    const message = data.message.toLowerCase();
    if (message.includes('perturbation') || message.includes('interruption') || message.includes('ralenti') || message.includes('incident')) {
        return {
            status: 'perturbé',
            message: data.message || 'Perturbations signalées sur la ligne RER B.'
        };
    } else if (message.includes('trafic normal') || message.includes('normal') || message.includes('circulation normale')) {
        return {
            status: 'normal',
            message: data.message || 'Circulation normale sur la ligne RER B.'
        };
    } else if (message.includes('interrompu') || message.includes('suspendu')) {
        return {
            status: 'interrompu',
            message: data.message || 'Trafic interrompu sur la ligne RER B.'
        };
    } else {
        return {
            status: 'inconnu',
            message: data.message || 'État inconnu du RER B.'
        };
    }
}

// Mise à jour de l'affichage de l'état du RER B
function updateRerBStatus(status, message = null) {
    rerBStatus = status;
    rerBLastUpdate = new Date();
    if (message) {
        rerBMessage = message;
    }
    
    const statusElement = document.getElementById('rerBStatus');
    const iconElement = document.getElementById('rerBIcon');
    const textElement = document.getElementById('rerBText');
    
    // Retirer les classes précédentes
    statusElement.classList.remove('normal', 'perturbed', 'interrupted', 'unknown', 'chargement');
    
    // Mettre à jour en fonction du statut
    switch(status) {
        case 'normal':
            statusElement.classList.add('normal');
            iconElement.className = 'fas fa-subway';
            textElement.textContent = 'RER B: Normal';
            rerBMessage = 'Circulation normale sur la ligne RER B.';
        case 'chargement':
            statusElement.classList.add('chargement');
            iconElement.className = 'fas fa-spinner fa-spin';
            textElement.textContent = 'RER B: Chargement...';
            break;
            break;
        case 'perturbé':
            statusElement.classList.add('perturbed');
            iconElement.className = 'fas fa-exclamation-triangle';
            textElement.textContent = 'RER B: Perturbé';
            rerBMessage = message || 'Perturbations signalées sur la ligne RER B. Vérifiez les annonces.';
            break;
        case 'interrompu':
            statusElement.classList.add('interrupted');
            iconElement.className = 'fas fa-times-circle';
            textElement.textContent = 'RER B: Interrompu';
            rerBMessage = message || 'Trafic interrompu sur la ligne RER B.';
            break;
        default:
            statusElement.classList.add('unknown');
            iconElement.className = 'fas fa-question-circle';
            textElement.textContent = 'RER B: Inconnu';
            rerBMessage = 'Impossible de récupérer le statut du RER B.';
    }
    
    // Mettre à jour la modal si elle est ouverte
    updateRerBModal();
}

// Mise à jour de la modal RER B
function updateRerBModal() {
    const statusLargeElement = document.getElementById('rerBStatusLarge');
    const iconLargeElement = document.getElementById('rerBIconLarge');
    const statusTextElement = document.getElementById('rerBStatusText');
    const lastUpdateElement = document.getElementById('rerBLastUpdate');
    const messageElement = document.getElementById('rerBMessage');
    const nextUpdateElement = document.getElementById('rerBNextUpdate');
    
    // Retirer les classes précédentes
    statusLargeElement.classList.remove('normal', 'perturbed', 'interrupted', 'unknown', 'chargement');
    
    // Mettre à jour en fonction du statut
    switch(rerBStatus) {
        case 'normal':
            statusLargeElement.classList.add('normal');
            iconLargeElement.className = 'fas fa-subway';
            statusTextElement.textContent = 'Normal';
            break;
        case 'perturbé':
            statusLargeElement.classList.add('perturbed');
            iconLargeElement.className = 'fas fa-exclamation-triangle';
            statusTextElement.textContent = 'Perturbé';
            break;
        case 'interrompu':
            statusLargeElement.classList.add('interrupted');
            iconLargeElement.className = 'fas fa-times-circle';
            statusTextElement.textContent = 'Interrompu';
            break;
        case 'chargement':
            statusLargeElement.classList.add('chargement');
            iconLargeElement.className = 'fas fa-spinner fa-spin';
            statusTextElement.textContent = 'Chargement...';
            break;
        default:
            statusLargeElement.classList.add('unknown');
            iconLargeElement.className = 'fas fa-question-circle';
            statusTextElement.textContent = 'Inconnu';
    }
    
    // Mettre à jour les informations
    if (rerBLastUpdate) {
        lastUpdateElement.textContent = rerBLastUpdate.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }
    
    messageElement.textContent = rerBMessage;
    
    // Calculer la prochaine mise à jour
    if (rerBLastUpdate) {
        const nextUpdate = new Date(rerBLastUpdate.getTime() + 2 * 60 * 1000);
        nextUpdateElement.textContent = nextUpdate.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}

// Configuration des écouteurs pour le RER B
function setupRerBEventListeners() {
    const rerBStatusElement = document.getElementById('rerBStatus');
    const rerBModal = document.getElementById('rerBModal');
    const rerBCloseBtn = document.querySelector('.rer-b-close');
    
    // Ouvrir la modal au clic sur le statut RER B
    rerBStatusElement.addEventListener('click', () => {
        updateRerBModal();
        rerBModal.style.display = 'block';
    });
    
    // Fermer la modal au clic sur la croix
    rerBCloseBtn.addEventListener('click', () => {
        rerBModal.style.display = 'none';
    });
    
    // Fermer la modal en cliquant en dehors
    rerBModal.addEventListener('click', (e) => {
        if (e.target === rerBModal) {
            rerBModal.style.display = 'none';
        }
    });
}

// Chargement des sites depuis la base de données
function loadSites() {
    if (!db) {
        setTimeout(loadSites, 100);
        return;
    }
    
    const transaction = db.transaction(['sites'], 'readonly');
    const store = transaction.objectStore('sites');
    const request = store.getAll();
    
    request.onsuccess = (event) => {
        const sites = event.target.result;
        displaySites(sites);
    };
    
    request.onerror = (event) => {
        console.error('Erreur lors du chargement des sites:', event.target.error);
    };
}

// Affichage des sites dans l'interface
function displaySites(sites) {
    const container = document.getElementById('cardsContainer');
    
    // Conserver les cartes des robots
    const robotCards = container.querySelectorAll('.app-card:not([data-site-id])');
    const tempContainer = document.createElement('div');
    
    // Déplacer temporairement les cartes des robots
    robotCards.forEach(card => {
        tempContainer.appendChild(card.cloneNode(true));
    });
    
    container.innerHTML = '';
    
    // Réajouter les cartes des robots
    tempContainer.querySelectorAll('.app-card').forEach(card => {
        container.appendChild(card);
    });
    
    if (sites.length === 0) {
        const noSitesMsg = document.createElement('div');
        noSitesMsg.className = 'app-card no-sites-msg';
        noSitesMsg.innerHTML = `
            <div class="app-icon">
                <i class="fas fa-globe"></i>
            </div>
            <div class="app-name">Aucun site ajouté</div>
            <div class="app-actions">
                <span style="font-size: 0.8rem; color: var(--text-light);">Cliquez sur "Ajouter un site"</span>
            </div>
        `;
        container.appendChild(noSitesMsg);
        return;
    }
    
    sites.forEach(site => {
        const card = document.createElement('div');
        card.className = 'app-card';
        card.setAttribute('data-site-id', site.id);
        card.style.animationDelay = `${sites.indexOf(site) * 0.1}s`;
        
        card.innerHTML = `
            <div class="app-icon">
                <img src="${site.icon}" alt="${site.name}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSIjNjY2Ii8+PC9zdmc+'">
            </div>
            <div class="app-name">${site.name}</div>
            <div class="app-actions">
                <button class="card-action-btn" data-action="open">
                    <i class="fas fa-external-link-alt"></i> Ouvrir
                </button>
            </div>
        `;
        
        // Gestion du clic sur le bouton Ouvrir
        const openBtn = card.querySelector('.card-action-btn');
        openBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            window.open(site.url, '_blank');
        });
        
        // Gestion du clic sur la carte (pour ouvrir aussi)
        card.addEventListener('click', () => {
            window.open(site.url, '_blank');
        });
        
        container.appendChild(card);
    });
}

// Configuration des écouteurs d'événements
function setupEventListeners() {
    // Bouton Ajouter un site
    const addBtn = document.getElementById('addSiteBtn');
    addBtn.addEventListener('click', openAddSiteModal);
    
    // Bouton Fermer du modal
    const closeBtn = document.querySelector('.close');
    closeBtn.addEventListener('click', closeAddSiteModal);
    
    // Bouton Annuler du formulaire
    const cancelBtn = document.getElementById('cancelBtn');
    cancelBtn.addEventListener('click', closeAddSiteModal);
    
    // Fermer le modal en cliquant en dehors
    const modal = document.getElementById('addSiteModal');
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeAddSiteModal();
        }
    });
    
    // Soumission du formulaire
    const form = document.getElementById('addSiteForm');
    form.addEventListener('submit', handleFormSubmit);
    
    // Aperçu de l'image
    const iconInput = document.getElementById('siteIcon');
    iconInput.addEventListener('change', previewImage);
    
    // Fermer avec la touche Échap
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAddSiteModal();
        }
    });
    
    // Onglets météo
    const tabs = document.querySelectorAll('.weather-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Retirer la classe active de tous les onglets
            tabs.forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.weather-tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Ajouter la classe active à l'onglet cliqué
            tab.classList.add('active');
            
            // Afficher le contenu correspondant
            const type = tab.getAttribute('data-type');
            document.getElementById(`weather${type.charAt(0).toUpperCase() + type.slice(1)}Content`).classList.add('active');
        });
    });
}

// Ouverture du modal d'ajout de site
function openAddSiteModal() {
    const modal = document.getElementById('addSiteModal');
    modal.style.display = 'block';
    
    // Réinitialiser le formulaire
    document.getElementById('addSiteForm').reset();
    document.getElementById('imagePreview').innerHTML = '<p>Aucune image sélectionnée</p>';
    
    // Focus sur le premier champ
    document.getElementById('siteName').focus();
}

// Fermeture du modal
function closeAddSiteModal() {
    const modal = document.getElementById('addSiteModal');
    modal.style.display = 'none';
}

// Aperçu de l'image sélectionnée
function previewImage(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const preview = document.getElementById('imagePreview');
    const reader = new FileReader();
    
    reader.onload = (e) => {
        preview.innerHTML = `<img src="${e.target.result}" alt="Aperçu">`;
    };
    
    reader.readAsDataURL(file);
}

// Gestion de la soumission du formulaire
function handleFormSubmit(event) {
    event.preventDefault();
    
    const name = document.getElementById('siteName').value.trim();
    const url = document.getElementById('siteUrl').value.trim();
    const iconInput = document.getElementById('siteIcon');
    
    // Validation
    if (!name || !url || !iconInput.files[0]) {
        alert('Veuillez remplir tous les champs.');
        return;
    }
    
    // Validation de l'URL
    try {
        new URL(url);
    } catch (e) {
        alert('Veuillez entrer une URL valide (ex: https://exemple.com)');
        return;
    }
    
    // Lecture de l'image
    const reader = new FileReader();
    reader.onload = (e) => {
        const iconDataUrl = e.target.result;
        
        // Ajout du site à la base de données
        addSiteToDB({
            name: name,
            url: url.startsWith('http') ? url : `https://${url}`,
            icon: iconDataUrl,
            createdAt: new Date().toISOString()
        });
    };
    
    reader.readAsDataURL(iconInput.files[0]);
    
    // Fermer le modal
    closeAddSiteModal();
}

// Ajout d'un site à la base de données
function addSiteToDB(site) {
    if (!db) {
        alert('La base de données n\'est pas prête. Veuillez réessayer.');
        return;
    }
    
    const transaction = db.transaction(['sites'], 'readwrite');
    const store = transaction.objectStore('sites');
    const request = store.add(site);
    
    request.onsuccess = () => {
        console.log('Site ajouté avec succès');
        loadSites(); // Recharger la liste des sites
    };
    
    request.onerror = (event) => {
        console.error('Erreur lors de l\'ajout du site:', event.target.error);
        alert('Une erreur est survenue lors de l\'ajout du site.');
    };
}

// Chargement de la météo
function loadWeather() {
    // Vérifier si la clé API est valide
    if (!WEATHER_API_KEY || WEATHER_API_KEY === 'votre_cle_api_ici') {
        showApiStatus('error', 'Clé API non configurée');
        updateWeatherError();
        return;
    }
    
    showApiStatus('warning', 'Chargement...');
    
    // Appel pour la météo actuelle
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&appid=${WEATHER_API_KEY}&units=metric&lang=fr`;
    
    // Appel pour les prévisions (5 jours / 3 heures)
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${LAT}&lon=${LON}&appid=${WEATHER_API_KEY}&units=metric&lang=fr`;
    
    // Charger les deux en parallèle
    Promise.all([
        fetch(currentWeatherUrl).then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        }),
        fetch(forecastUrl).then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        })
    ])
    .then(([currentData, forecastData]) => {
        if (currentData.cod === 200 && forecastData.cod === '200') {
            showApiStatus('success', 'API active');
            currentWeatherData = { current: currentData, forecast: forecastData };
            updateWeatherDisplay(currentData, forecastData);
            updateWeatherSummary(currentData, forecastData);
            updateWeatherDetails(forecastData);
            createWeatherChart(forecastData);
        } else {
            throw new Error(`API Error: ${currentData.message || forecastData.message}`);
        }
    })
    .catch(error => {
        console.error('Erreur lors du chargement de la météo:', error);
        showApiStatus('error', 'Erreur API');
        updateWeatherError();
    });
}

// Mise à jour de l'affichage de la météo
function updateWeatherDisplay(currentData, forecastData) {
    // Cette fonction est gardée pour compatibilité
}

// Mise à jour du résumé météo
function updateWeatherSummary(data, forecastData = null) {
    const tempElement = document.getElementById('currentTemp');
    const trendElement = document.getElementById('tempTrend');
    const windElement = document.getElementById('currentWind');
    const rainElement = document.getElementById('currentRain');
    
    // Mise à jour des éléments du header
    const headerTempElement = document.getElementById('headerCurrentTemp');
    const headerWeatherIconElement = document.getElementById('headerWeatherIcon');
    
    // Température
    const temperature = Math.round(data.main.temp);
    tempElement.textContent = `${temperature}°C`;
    if (headerTempElement) headerTempElement.textContent = `${temperature}°C`;
    
    // Mise à jour de l'icône météo dans le header
    if (headerWeatherIconElement) {
        const weatherId = data.weather[0].id;
        const iconClass = getWeatherIconClass(weatherId, data.weather[0].main);
        headerWeatherIconElement.className = `fas ${iconClass}`;
    }
    
    // Tendance des températures
    if (forecastData && forecastData.list && forecastData.list.length > 0) {
        const currentTemp = data.main.temp;
        const futureTemps = forecastData.list.map(f => f.main.temp);
        const avgFutureTemp = futureTemps.reduce((sum, temp) => sum + temp, 0) / futureTemps.length;
        
        if (avgFutureTemp > currentTemp + 1) {
            trendElement.textContent = '↑ Hausse';
            trendElement.style.color = '#81c784'; // Vert atténué
        } else if (avgFutureTemp < currentTemp - 1) {
            trendElement.textContent = '↓ Baisse';
            trendElement.style.color = '#e57373'; // Rouge atténué
        } else {
            trendElement.textContent = '→ Stable';
            trendElement.style.color = '#ffb74d'; // Orange atténué
        }
    } else {
        trendElement.textContent = '--';
        trendElement.style.color = '';
    }
    
    // Vent (convertir de m/s à km/h)
    const windSpeed = Math.round(data.wind.speed * 3.6);
    windElement.textContent = `${windSpeed} km/h`;
    
    // Précipitations (si disponibles)
    if (data.rain && data.rain['1h']) {
        rainElement.textContent = `${data.rain['1h']} mm`;
    } else if (data.snow && data.snow['1h']) {
        rainElement.textContent = `${data.snow['1h']} mm (neige)`;
    } else {
        rainElement.textContent = '0 mm';
    }
}

// Mise à jour des détails météo (grille)
function updateWeatherDetails(forecastData) {
    const grid = document.getElementById('weatherDetailsGrid');
    grid.innerHTML = '';
    
    // Trier les prévisions par date
    const sortedForecasts = [...forecastData.list].sort((a, b) => a.dt - b.dt);
    
    // Prendre les 16 prochaines prévisions (48h glissantes)
    const forecastsToShow = sortedForecasts.slice(0, 16);
    
    forecastsToShow.forEach(forecast => {
        const card = document.createElement('div');
        card.className = 'weather-detail-card';
        
        const date = new Date(forecast.dt * 1000);
        const hours = date.getHours();
        const temp = Math.round(forecast.main.temp);
        const iconClass = getWeatherIconClass(forecast.weather[0].id, forecast.weather[0].main);
        
        // Calculer les précipitations (si disponibles)
        let rainInfo = '';
        if (forecast.rain && forecast.rain['3h']) {
            rainInfo = `${forecast.rain['3h']}mm`;
        } else if (forecast.snow && forecast.snow['3h']) {
            rainInfo = `${forecast.snow['3h']}mm❄️`;
        }
        
        // Afficher uniquement l'heure (sans la date)
        card.innerHTML = `
            <div class="time">${hours}h</div>
            <div class="icon"><i class="fas ${iconClass}"></i></div>
            <div class="temp">${temp}°C</div>
            <div class="rain">${rainInfo || '0mm'}</div>
        `;
        
        grid.appendChild(card);
    });
}

// Création du graphique météo
function createWeatherChart(forecastData) {
    const ctx = document.getElementById('weatherChart');
    
    // Si le graphique existe déjà, le détruire
    if (weatherChart) {
        weatherChart.destroy();
    }
    
    // Trier les prévisions par date et prendre les 16 prochaines (48h glissantes)
    const sortedForecasts = [...forecastData.list].sort((a, b) => a.dt - b.dt);
    const forecastsToShow = sortedForecasts.slice(0, 16);
    
    // Préparer les données pour le graphique
    const labels = forecastsToShow.map(forecast => {
        const date = new Date(forecast.dt * 1000);
        const hours = date.getHours();
        // Afficher uniquement l'heure (sans la date)
        return `${hours}h`;
    });
    
    const temps = forecastsToShow.map(forecast => Math.round(forecast.main.temp));
    const rains = forecastsToShow.map(forecast => {
        if (forecast.rain && forecast.rain['3h']) {
            return forecast.rain['3h'];
        } else if (forecast.snow && forecast.snow['3h']) {
            return forecast.snow['3h'];
        }
        return 0;
    });
    
    // Créer le graphique
    weatherChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Température (°C)',
                    data: temps,
                    borderColor: 'rgba(255, 255, 255, 0.8)',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true,
                    yAxisID: 'y'
                },
                {
                    label: 'Précipitations (mm)',
                    data: rains,
                    borderColor: 'rgba(30, 136, 229, 0.8)',
                    backgroundColor: 'rgba(30, 136, 229, 0.2)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: false,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: 'white'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: 'white'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.2)'
                    }
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Température (°C)',
                        color: 'white'
                    },
                    ticks: {
                        color: 'white'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.2)'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    min: 0,
                    max: 50,
                    title: {
                        display: true,
                        text: 'Précipitations (mm)',
                        color: 'rgba(30, 136, 229, 0.8)'
                    },
                    ticks: {
                        color: 'rgba(30, 136, 229, 0.8)'
                    },
                    grid: {
                        drawOnChartArea: false
                    }
                }
            }
        }
    });
}

// Affichage d'erreur pour la météo
function updateWeatherError(message = 'Météo indisponible - Vérifiez votre clé API OpenWeatherMap') {
    document.getElementById('currentTemp').textContent = '--°C';
    document.getElementById('tempTrend').textContent = '--';
    document.getElementById('tempTrend').style.color = '';
    document.getElementById('currentWind').textContent = '-- km/h';
    document.getElementById('currentRain').textContent = '-- mm';
    
    // Mise à jour des éléments du header
    const headerTempElement = document.getElementById('headerCurrentTemp');
    const headerWeatherIconElement = document.getElementById('headerWeatherIcon');
    if (headerTempElement) headerTempElement.textContent = '--°C';
    if (headerWeatherIconElement) headerWeatherIconElement.className = 'fas fa-cloud-sun';
    
    // Effacer le graphique
    const ctx = document.getElementById('weatherChart');
    if (ctx) {
        ctx.innerHTML = `<p style="color: white; text-align: center; padding: 20px;">${message}</p>`;
    }
    
    // Effacer les détails
    document.getElementById('weatherDetailsGrid').innerHTML = '';
}

// Obtention de la classe Font Awesome en fonction du code météo
function getWeatherIconClass(weatherId, mainWeather) {
    // Pluie
    if (weatherId >= 200 && weatherId < 300) {
        return 'fa-bolt'; // Orage
    } else if (weatherId >= 300 && weatherId < 400) {
        return 'fa-cloud-rain'; // Bruine
    } else if (weatherId >= 500 && weatherId < 600) {
        return 'fa-cloud-showers-heavy'; // Pluie
    } 
    // Neige
    else if (weatherId >= 600 && weatherId < 700) {
        return 'fa-snowflake'; // Neige
    } 
    // Atmosérique (brouillard, etc.)
    else if (weatherId >= 700 && weatherId < 800) {
        return 'fa-smog'; // Brouillard
    } 
    // Ciel clair
    else if (weatherId === 800) {
        return 'fa-sun'; // Ciel dégagé
    } 
    // Nuages
    else if (weatherId > 800 && weatherId < 900) {
        if (weatherId < 802) {
            return 'fa-cloud-sun'; // Peu nuageux
        } else if (weatherId < 804) {
            return 'fa-cloud'; // Nuageux
        } else {
            return 'fa-cloud-meatball'; // Très nuageux
        }
    }
    
    // Par défaut
    return 'fa-cloud-sun-rain';
}

// Suppression d'un site (fonctionnalité bonus)
function deleteSite(id) {
    if (!db) return;
    
    if (confirm('Êtes-vous sûr de vouloir supprimer ce site ?')) {
        const transaction = db.transaction(['sites'], 'readwrite');
        const store = transaction.objectStore('sites');
        const request = store.delete(id);
        
        request.onsuccess = () => {
            loadSites();
        };
        
        request.onerror = (event) => {
            console.error('Erreur lors de la suppression:', event.target.error);
        };
    }
}

// Configuration pour les robots aspirateurs Xiaomi
const ROBOT_CONFIG = {
    // Adresse IP de votre robot sur le réseau local
    // Remplacez par l'adresse IP de votre robot Xiaomi
    ipAddress: '192.168.1.100',
    
    // Token d'accès pour miio CLI
    // Remplacez par votre token personnel
    token: 'votre_token_miio_ici',
    
    // Configurations pour chaque robot
    robots: {
        rdc: {
            mapName: 'Carte1',
            cleaning: {
                repeat: 2,        // Nettoyer 2 fois la surface
                mode: 'turbo',    // Mode turbo
                waterLevel: 3,    // Niveau de sortie d'eau (0-3)
                returnAfterArea: 8, // Retour au nettoyage après 8m²
                returnToClean: true  // Retourne au nettoyage après avoir nettoyé la zone
            }
        },
        etage: {
            mapName: 'Carte2',
            cleaning: {
                repeat: 1,        // Nettoyer 1 fois la surface
                mode: 'turbo',    // Mode turbo
                waterLevel: 3,    // Niveau de sortie d'eau (0-3)
                returnAfterArea: null, // Pas de retour automatique
                returnToClean: false  // Ne retourne pas au nettoyage
            }
        }
    }
};

// Fonction pour exécuter la commande miio
async function executeMioCommand(command, params = []) {
    try {
        // Vérifier que miio CLI est disponible
        // Cette fonction suppose que miio CLI est installé et accessible
        // Dans un environnement web, cela nécessiterait un backend ou une API locale
        
        console.log(`Exécution de la commande miio: ${command} ${params.join(' ')}`);
        
        // Pour un environnement Node.js ou avec un backend :
        // const { exec } = require('child_process');
        // return new Promise((resolve, reject) => {
        //     exec(`miio ${command} ${params.join(' ')} --ip ${ROBOT_CONFIG.ipAddress} --token ${ROBOT_CONFIG.token}`, 
        //         (error, stdout, stderr) => {
        //             if (error) {
        //                 reject(error);
        //             } else {
        //                 resolve(stdout);
        //             }
        //         });
        // });
        
        // Pour une démo dans le navigateur, on simule le comportement
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log(`Commande simulée: ${command} ${params.join(' ')}`);
                resolve(`Commande ${command} exécutée avec succès`);
            }, 1500);
        });
        
    } catch (error) {
        console.error('Erreur lors de l\'exécution de la commande miio:', error);
        throw error;
    }
}

// Fonction pour charger une carte spécifique
async function loadRobotMap(mapName) {
    try {
        console.log(`Chargement de la carte: ${mapName}`);
        // Commande miio pour charger une carte
        // Note: La commande exacte dépend du modèle de votre robot
        // Pour les robots Xiaomi, on utilise généralement:
        // miio raw --ip IP --token TOKEN load_map --map_id MAP_ID
        
        const result = await executeMioCommand('raw', [
            '--ip', ROBOT_CONFIG.ipAddress,
            '--token', ROBOT_CONFIG.token,
            'load_map',
            '--map_id', mapName
        ]);
        
        console.log(`Carte ${mapName} chargée avec succès`);
        return result;
    } catch (error) {
        console.error(`Erreur lors du chargement de la carte ${mapName}:`, error);
        throw error;
    }
}

// Fonction pour démarrer le nettoyage avec les paramètres spécifiés
async function startRobotCleaning(robotType = 'rdc') {
    try {
        const config = ROBOT_CONFIG.robots[robotType];
        if (!config) {
            throw new Error(`Configuration non trouvée pour le robot: ${robotType}`);
        }
        
        console.log(`Démarrage du nettoyage pour ${robotType} avec les paramètres configurés...`);
        
        // 1. Charger la carte spécifiée
        await loadRobotMap(config.mapName);
        console.log(`Carte "${config.mapName}" chargée`);
        
        // 2. Configurer les paramètres de nettoyage
        // Pour les robots Xiaomi, on peut utiliser des commandes comme:
        // miio raw --ip IP --token TOKEN set_clean_mode --mode MODE --water_level LEVEL
        
        await executeMioCommand('raw', [
            '--ip', ROBOT_CONFIG.ipAddress,
            '--token', ROBOT_CONFIG.token,
            'set_clean_mode',
            '--mode', config.cleaning.mode,
            '--water_level', config.cleaning.waterLevel
        ]);
        
        console.log(`Mode de nettoyage configuré: ${config.cleaning.mode}, niveau d'eau: ${config.cleaning.waterLevel}`);
        
        // 3. Démarrer le nettoyage avec répétition
        // Commande pour démarrer le nettoyage
        await executeMioCommand('raw', [
            '--ip', ROBOT_CONFIG.ipAddress,
            '--token', ROBOT_CONFIG.token,
            'start_clean',
            '--repeat', config.cleaning.repeat
        ]);
        
        console.log(`Nettoyage démarré avec ${config.cleaning.repeat} répétition(s)`);
        
        // 4. Configurer le retour automatique si nécessaire
        if (config.cleaning.returnAfterArea && config.cleaning.returnToClean) {
            await executeMioCommand('raw', [
                '--ip', ROBOT_CONFIG.ipAddress,
                '--token', ROBOT_CONFIG.token,
                'set_clean_area',
                '--area', config.cleaning.returnAfterArea,
                '--return_after', 'true'
            ]);
            
            console.log(`Configuration: retour au nettoyage après ${config.cleaning.returnAfterArea}m²`);
        } else {
            console.log('Pas de retour automatique configuré');
        }
        
        // Afficher un message de succès à l'utilisateur
        const robotName = robotType === 'rdc' ? 'Aspirateur RdC' : 'Aspirateur étage';
        showRobotNotification(`✅ ${robotName}: Nettoyage démarré avec succès!`, 'success');
        
        return { 
            success: true, 
            message: `Nettoyage démarré avec les paramètres configurés pour ${robotType}` 
        };
        
    } catch (error) {
        console.error(`Erreur lors du démarrage du nettoyage pour ${robotType}:`, error);
        const robotName = robotType === 'rdc' ? 'Aspirateur RdC' : 'Aspirateur étage';
        showRobotNotification(`❌ ${robotName}: ${error.message}`, 'error');
        return { 
            success: false, 
            message: error.message 
        };
    }
}

// Fonction pour afficher les notifications du robot
function showRobotNotification(message, type = 'info') {
    // Créer un élément de notification
    const notification = document.createElement('div');
    notification.className = `robot-notification robot-notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Ajouter des styles
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${type === 'success' ? '#00aa44' : type === 'error' ? '#d32f2f' : '#2196f3'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        font-weight: 500;
    `;
    
    // Ajouter l'animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Supprimer la notification après 5 secondes
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Fonction pour vérifier la configuration du robot
function checkRobotConfig() {
    const errors = [];
    
    if (!ROBOT_CONFIG.ipAddress || ROBOT_CONFIG.ipAddress === '192.168.1.100') {
        errors.push('Adresse IP du robot non configurée');
    }
    
    if (!ROBOT_CONFIG.token || ROBOT_CONFIG.token === 'votre_token_miio_ici') {
        errors.push('Token miio non configuré');
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

// Gestionnaire d'événement pour les boutons des robots
function setupRobotEventListeners() {
    const robotButtons = document.querySelectorAll('.robot-start-btn');
    
    robotButtons.forEach(button => {
        button.addEventListener('click', async (e) => {
            const robotType = e.target.closest('.robot-start-btn').dataset.robot;
            console.log(`Bouton robot ${robotType} cliqué`);
            
            // Vérifier la configuration
            const configCheck = checkRobotConfig();
            
            if (!configCheck.isValid) {
                const errorMessage = configCheck.errors.join('\n');
                showRobotNotification(`⚠️ Configuration incomplète: ${errorMessage}`, 'error');
                console.warn('Configuration du robot incomplète:', configCheck.errors);
                return;
            }
            
            try {
                // Désactiver le bouton pendant l'exécution
                button.disabled = true;
                button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> En cours...';
                
                // Démarrer le nettoyage pour ce robot
                const result = await startRobotCleaning(robotType);
                
                if (result.success) {
                    console.log(`Nettoyage démarré avec succès pour ${robotType}`);
                }
                
            } catch (error) {
                console.error(`Erreur lors du démarrage du nettoyage pour ${robotType}:`, error);
            } finally {
                // Réactiver le bouton
                setTimeout(() => {
                    button.disabled = false;
                    button.innerHTML = '<i class="fas fa-play"></i> Lancer';
                }, 2000);
            }
        });
    });
}

// Export des fonctions pour le débogage
window.addSiteToDB = addSiteToDB;
window.loadSites = loadSites;
window.deleteSite = deleteSite;
window.loadWeather = loadWeather;
window.checkApiKey = checkApiKey;
window.startRobotCleaning = startRobotCleaning;
window.checkRobotConfig = checkRobotConfig;
