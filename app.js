// Configuration de la base de données
const DB_NAME = 'PortailAppliDB';
const DB_VERSION = 1;

// Clé API OpenWeatherMap (gratuite)
const WEATHER_API_KEY = 'd4b576b8e9f64c1a8f0123456789abc0';
const CITY = 'Aulnay-sous-Bois';
const COUNTRY_CODE = 'FR';

// Variable pour la base de données
let db;

// Initialisation de l'application
window.addEventListener('DOMContentLoaded', () => {
    initDB();
    loadWeather();
    setupEventListeners();
    loadSites();
    
    // Rafraîchir la météo toutes les 10 minutes
    setInterval(loadWeather, 10 * 60 * 1000);
});

// Initialisation de la base de données IndexedDB
function initDB() {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = (event) => {
        console.error('Erreur lors de l\'ouverture de la base de données:', event.target.error);
        alert('Impossible d\'accéder à la base de données. Veuillez réessayer.');
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
    // Coordonnées d'Aulnay-sous-Bois (Noneville)
    const lat = 48.9412;
    const lon = 2.4833;
    
    // Utilisation de l'API OpenWeatherMap
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric&lang=fr`;
    
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Réponse réseau non valide');
            }
            return response.json();
        })
        .then(data => {
            updateWeatherDisplay(data);
        })
        .catch(error => {
            console.error('Erreur lors du chargement de la météo:', error);
            // Afficher une météo par défaut en cas d'erreur
            document.getElementById('temperature').textContent = '--°C';
            document.getElementById('weatherDescription').textContent = 'Météo indisponible';
            document.getElementById('weatherIcon').innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
        });
}

// Mise à jour de l'affichage de la météo
function updateWeatherDisplay(data) {
    const tempElement = document.getElementById('temperature');
    const descElement = document.getElementById('weatherDescription');
    const iconElement = document.getElementById('weatherIcon');
    
    // Température
    const temperature = Math.round(data.main.temp);
    tempElement.textContent = `${temperature}°C`;
    
    // Description
    descElement.textContent = data.weather[0].description;
    
    // Icône météo
    const weatherId = data.weather[0].id;
    const iconClass = getWeatherIconClass(weatherId, data.weather[0].main);
    iconElement.innerHTML = `<i class="fas ${iconClass}"></i>`;
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
