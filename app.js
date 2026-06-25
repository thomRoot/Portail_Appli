// Configuration de la base de données
const DB_NAME = 'PortailAppliDB';
const DB_VERSION = 3;

// **IMPORTANT : Remplacez par votre propre clé API OpenWeatherMap**
// Inscrivez-vous gratuitement sur https://openweathermap.org/api
const WEATHER_API_KEY = 'votre_cle_api_ici';

// Coordonnées par défaut (Aulnay-sous-Bois)
let LAT = 48.9412;
let LON = 2.4833;
let CURRENT_LOCATION_NAME = 'Aulnay-sous-Bois';

// Variable pour la base de données et le graphique
let db;
let weatherChart;
let currentWeatherData = null;
let locationSearchTimeout = null;

// Initialisation de l'application
window.addEventListener('DOMContentLoaded', () => {
    initDB();
    setupEventListeners();
    loadSites();
    loadSavedLocation(); // Charger la localisation sauvegardée
    
    // Vérifier la clé API au démarrage
    checkApiKey();
    
    // Charger la météo toutes les 10 minutes
    setInterval(loadWeather, 10 * 60 * 1000);
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
    if (!WEATHER_API_KEY || WEATHER_API_KEY === 'votre_cle_api_ici') {
        showApiStatus('error', 'Clé API non configurée');
        return false;
    }
    
    // Tester la clé API avec un appel simple
    const testUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&appid=${WEATHER_API_KEY}&units=metric&lang=fr`;
    
    fetch(testUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.cod === 200) {
                showApiStatus('success', 'API active');
                loadWeather();
                return true;
            } else {
                throw new Error(`API Error: ${data.message}`);
            }
        })
        .catch(error => {
            console.error('Erreur de vérification API:', error);
            showApiStatus('error', 'Clé API invalide');
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
    const container = document.getElementById('appsContainer');
    container.innerHTML = '';
    
    if (sites.length === 0) {
        container.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: var(--text-light);">Aucun site ajouté. Cliquez sur "Ajouter un site" pour commencer.</p>';
        return;
    }
    
    sites.forEach(site => {
        const card = document.createElement('div');
        card.className = 'app-card';
        card.style.animationDelay = `${sites.indexOf(site) * 0.1}s`;
        
        card.innerHTML = `
            <img src="${site.icon}" alt="${site.name}" class="app-icon" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSIjNjY2Ii8+PC9zdmc+'">
            <div class="app-name">${site.name}</div>
        `;
        
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
    
    // Bouton Localisation
    const locationBtn = document.getElementById('locationBtn');
    locationBtn.addEventListener('click', openLocationModal);
    
    // Bouton Fermer des modals
    const closeButtons = document.querySelectorAll('.close');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    });
    
    // Bouton Annuler du formulaire site
    const cancelBtn = document.getElementById('cancelBtn');
    cancelBtn.addEventListener('click', closeAddSiteModal);
    
    // Bouton Annuler du formulaire localisation
    const cancelLocationBtn = document.getElementById('cancelLocationBtn');
    cancelLocationBtn.addEventListener('click', closeLocationModal);
    
    // Fermer les modals en cliquant en dehors
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
    
    // Soumission du formulaire site
    const form = document.getElementById('addSiteForm');
    form.addEventListener('submit', handleFormSubmit);
    
    // Aperçu de l'image
    const iconInput = document.getElementById('siteIcon');
    iconInput.addEventListener('change', previewImage);
    
    // Fermer avec la touche Échap
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
    
    // Onglets météo
    const weatherTabs = document.querySelectorAll('.weather-tab');
    weatherTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            weatherTabs.forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.weather-tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            tab.classList.add('active');
            const type = tab.getAttribute('data-type');
            document.getElementById(`weather${type.charAt(0).toUpperCase() + type.slice(1)}Content`).classList.add('active');
        });
    });
    
    // Onglets de localisation
    const locationTabs = document.querySelectorAll('.location-tab');
    locationTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            locationTabs.forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.location-tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            tab.classList.add('active');
            const method = tab.getAttribute('data-method');
            document.getElementById(`${method}LocationContent`).classList.add('active');
        });
    });
    
    // Recherche de localisation
    const locationSearch = document.getElementById('locationSearch');
    locationSearch.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        if (query.length > 2) {
            clearTimeout(locationSearchTimeout);
            locationSearchTimeout = setTimeout(() => {
                searchLocation(query);
            }, 500);
        } else {
            document.getElementById('searchResults').innerHTML = '';
        }
    });
    
    // Bouton de géolocalisation
    const getCurrentLocationBtn = document.getElementById('getCurrentLocationBtn');
    getCurrentLocationBtn.addEventListener('click', getCurrentLocation);
    
    // Bouton Enregistrer la localisation
    const saveLocationBtn = document.getElementById('saveLocationBtn');
    saveLocationBtn.addEventListener('click', saveLocation);
    
    // Exemples GPS
    const gpsExamples = document.querySelectorAll('.gps-example');
    gpsExamples.forEach(btn => {
        btn.addEventListener('click', () => {
            const lat = parseFloat(btn.getAttribute('data-lat'));
            const lon = parseFloat(btn.getAttribute('data-lon'));
            document.getElementById('latInput').value = lat;
            document.getElementById('lonInput').value = lon;
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

// Fermeture du modal d'ajout de site
function closeAddSiteModal() {
    const modal = document.getElementById('addSiteModal');
    modal.style.display = 'none';
}

// Ouverture du modal de localisation
function openLocationModal() {
    const modal = document.getElementById('locationModal');
    modal.style.display = 'block';
    
    // Réinitialiser
    document.getElementById('locationSearch').value = '';
    document.getElementById('searchResults').innerHTML = '';
    document.getElementById('latInput').value = LAT;
    document.getElementById('lonInput').value = LON;
    document.getElementById('currentLocationStatus').textContent = '';
    
    // Sélectionner le premier onglet
    document.querySelector('.location-tab.active')?.click();
}

// Fermeture du modal de localisation
function closeLocationModal() {
    const modal = document.getElementById('locationModal');
    modal.style.display = 'none';
}

// Fermer tous les modals
function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}

// Recherche de localisation
function searchLocation(query) {
    if (!WEATHER_API_KEY || WEATHER_API_KEY === 'votre_cle_api_ici') {
        showApiStatus('error', 'Clé API non configurée');
        return;
    }
    
    const searchUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${WEATHER_API_KEY}`;
    
    fetch(searchUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            displaySearchResults(data);
        })
        .catch(error => {
            console.error('Erreur de recherche:', error);
            document.getElementById('searchResults').innerHTML = '<div class="search-result-item"><small>Erreur de recherche</small></div>';
        });
}

// Affichage des résultats de recherche
function displaySearchResults(results) {
    const resultsContainer = document.getElementById('searchResults');
    
    if (!results || results.length === 0) {
        resultsContainer.innerHTML = '<div class="search-result-item"><small>Aucun résultat trouvé</small></div>';
        return;
    }
    
    resultsContainer.innerHTML = '';
    
    results.forEach(result => {
        const item = document.createElement('div');
        item.className = 'search-result-item';
        item.innerHTML = `
            <strong>${result.name}</strong>
            <small>${result.country} - Lat: ${result.lat.toFixed(4)}, Lon: ${result.lon.toFixed(4)}</small>
        `;
        
        item.addEventListener('click', () => {
            document.getElementById('latInput').value = result.lat;
            document.getElementById('lonInput').value = result.lon;
            CURRENT_LOCATION_NAME = `${result.name}, ${result.country}`;
            
            // Basculer vers l'onglet GPS
            document.querySelector('[data-method="gps"]').click();
        });
        
        resultsContainer.appendChild(item);
    });
}

// Géolocalisation actuelle
function getCurrentLocation() {
    const statusElement = document.getElementById('currentLocationStatus');
    statusElement.textContent = 'Recherche en cours...';
    statusElement.className = '';
    
    if (!navigator.geolocation) {
        statusElement.textContent = 'Géolocalisation non supportée par votre navigateur';
        statusElement.className = 'error';
        return;
    }
    
    navigator.geolocation.getCurrentPosition(
        (position) => {
            LAT = position.coords.latitude;
            LON = position.coords.longitude;
            CURRENT_LOCATION_NAME = 'Ma position actuelle';
            
            document.getElementById('latInput').value = LAT.toFixed(4);
            document.getElementById('lonInput').value = LON.toFixed(4);
            
            statusElement.textContent = 'Position trouvée !';
            statusElement.className = 'success';
            
            // Basculer vers l'onglet GPS
            document.querySelector('[data-method="gps"]').click();
        },
        (error) => {
            let errorMessage = 'Erreur de géolocalisation';
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    errorMessage = 'Permission refusée. Veuillez autoriser la géolocalisation.';
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMessage = 'Position indisponible.';
                    break;
                case error.TIMEOUT:
                    errorMessage = 'Délai dépassé. Essayez à nouveau.';
                    break;
            }
            statusElement.textContent = errorMessage;
            statusElement.className = 'error';
        }
    );
}

// Sauvegarde de la localisation
function saveLocation() {
    const method = document.querySelector('.location-tab.active')?.getAttribute('data-method');
    
    switch(method) {
        case 'gps':
            const lat = parseFloat(document.getElementById('latInput').value);
            const lon = parseFloat(document.getElementById('lonInput').value);
            
            if (isNaN(lat) || isNaN(lon)) {
                alert('Veuillez entrer des coordonnées GPS valides.');
                return;
            }
            
            LAT = lat;
            LON = lon;
            
            // Essayer de trouver le nom de la localisation
            reverseGeocode(lat, lon);
            break;
            
        case 'search':
            // Si une recherche a été sélectionnée, les coordonnées sont déjà dans les champs GPS
            const searchLat = parseFloat(document.getElementById('latInput').value);
            const searchLon = parseFloat(document.getElementById('lonInput').value);
            
            if (!isNaN(searchLat) && !isNaN(searchLon)) {
                LAT = searchLat;
                LON = searchLon;
            }
            break;
            
        case 'current':
            // La position a déjà été récupérée
            break;
    }
    
    // Sauvegarder dans localStorage
    saveLocationToStorage();
    
    // Mettre à jour l'interface
    updateLocationDisplay();
    
    // Recharger la météo
    loadWeather();
    
    // Fermer le modal
    closeLocationModal();
}

// Géocodage inverse pour trouver le nom d'une localisation
function reverseGeocode(lat, lon) {
    if (!WEATHER_API_KEY || WEATHER_API_KEY === 'votre_cle_api_ici') {
        CURRENT_LOCATION_NAME = `Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}`;
        updateLocationDisplay();
        return;
    }
    
    const reverseUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${WEATHER_API_KEY}`;
    
    fetch(reverseUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data && data.length > 0) {
                CURRENT_LOCATION_NAME = `${data[0].name}, ${data[0].country}`;
            } else {
                CURRENT_LOCATION_NAME = `Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}`;
            }
            updateLocationDisplay();
        })
        .catch(error => {
            console.error('Erreur de géocodage inverse:', error);
            CURRENT_LOCATION_NAME = `Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}`;
            updateLocationDisplay();
        });
}

// Mise à jour de l'affichage de la localisation
function updateLocationDisplay() {
    const locationText = document.getElementById('currentLocationText');
    const weatherLocationText = document.getElementById('weatherLocationText');
    
    // Tronquer le nom si trop long
    const displayName = CURRENT_LOCATION_NAME.length > 20 ? 
        CURRENT_LOCATION_NAME.substring(0, 17) + '...' : 
        CURRENT_LOCATION_NAME;
    
    if (locationText) {
        locationText.textContent = displayName;
    }
    
    if (weatherLocationText) {
        weatherLocationText.textContent = `Météo à ${CURRENT_LOCATION_NAME} - Prévisions 48h`;
    }
}

// Sauvegarde de la localisation dans localStorage
function saveLocationToStorage() {
    try {
        localStorage.setItem('portailAppli_location', JSON.stringify({
            lat: LAT,
            lon: LON,
            name: CURRENT_LOCATION_NAME
        }));
    } catch (e) {
        console.error('Erreur de sauvegarde de la localisation:', e);
    }
}

// Chargement de la localisation sauvegardée
function loadSavedLocation() {
    try {
        const saved = localStorage.getItem('portailAppli_location');
        if (saved) {
            const location = JSON.parse(saved);
            LAT = location.lat || 48.9412;
            LON = location.lon || 2.4833;
            CURRENT_LOCATION_NAME = location.name || 'Aulnay-sous-Bois';
            updateLocationDisplay();
        }
    } catch (e) {
        console.error('Erreur de chargement de la localisation:', e);
    }
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
            updateWeatherSummary(currentData);
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
    // Cette fonction est gardée pour compatibilité, mais on utilise maintenant les nouvelles fonctions
}

// Mise à jour du résumé météo
function updateWeatherSummary(data) {
    const tempElement = document.getElementById('currentTemp');
    const humidityElement = document.getElementById('currentHumidity');
    const windElement = document.getElementById('currentWind');
    const rainElement = document.getElementById('currentRain');
    
    // Température
    const temperature = Math.round(data.main.temp);
    tempElement.textContent = `${temperature}°C`;
    
    // Humidité
    humidityElement.textContent = `${data.main.humidity}%`;
    
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
                    borderColor: 'rgba(74, 144, 226, 0.8)',
                    backgroundColor: 'rgba(74, 144, 226, 0.2)',
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
                    title: {
                        display: true,
                        text: 'Précipitations (mm)',
                        color: 'rgba(74, 144, 226, 0.8)'
                    },
                    ticks: {
                        color: 'rgba(74, 144, 226, 0.8)'
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
function updateWeatherError() {
    document.getElementById('currentTemp').textContent = '--°C';
    document.getElementById('currentHumidity').textContent = '--%';
    document.getElementById('currentWind').textContent = '-- km/h';
    document.getElementById('currentRain').textContent = '-- mm';
    
    // Effacer le graphique
    const ctx = document.getElementById('weatherChart');
    if (ctx) {
        ctx.innerHTML = '<p style="color: white; text-align: center; padding: 20px;">Météo indisponible - Vérifiez votre clé API</p>';
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

// Export des fonctions pour le débogage
window.addSiteToDB = addSiteToDB;
window.loadSites = loadSites;
window.deleteSite = deleteSite;
window.loadWeather = loadWeather;
window.checkApiKey = checkApiKey;
