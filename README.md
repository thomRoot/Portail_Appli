# Portail Appli - ThomRoot
**Style V1.3e : MIDNIGHT BLUE**

## 🌙 Description du Style

Ce style **"Midnight Blue"** s'inspire des **nuits étoilées** et des ciels profonds, avec une palette de bleus riches et élégants. Parfait pour ceux qui aiment les **ambiances calmes et sophistiquées**, comme un ciel nocturne parsemé d'étoiles.

### 🎯 Caractéristiques principales :
- **Couleurs** : Bleu nuit (#0a0a1a) + Bleu électrique (#4f46e5) + Violet (#8b5cf6)
- **Effets** : Dégradés bleutés, ombres violettes, lueurs bleues, étoiles animées
- **Ambiance** : Calme, sophistiquée, immersive, élégante
- **Inspiration** : Ciel nocturne, univers spatial, designs de luxe

### ✨ Effets visuels :
- **Fond dégradé bleu nuit** : Transition douce entre différentes nuances de bleu
- **Effet d'étoiles scintillantes** : Animation subtile d'étoiles en arrière-plan
- **Lueurs bleues** : Effets de glow sur les éléments interactifs
- **Ombres violettes** : Pour un contraste élégant
- **Dégradés sur les cartes** : Effet de profondeur avec des bleus plus clairs
- **Bordures lumineuses** : Contours qui s'illuminent au survol

---

## 📋 Fonctionnalités

### 1. Interface Utilisateur
- **Grille d'applications** : Affichage responsive de vos sites sous forme de cartes avec icônes
- **Design Midnight Blue** : Interface sombre avec des bleus profonds et des accents violets
- **Responsive** : Adapté aux mobiles, tablettes et ordinateurs
- **Animations fluides** : Transitions douces et effets de survol élégants

### 2. Gestion des Sites
- **Ajout de sites** : Bouton "+" dans l'en-tête pour ouvrir la popup d'ajout
- **Formulaire complet** :
  - Nom du site
  - URL du site (validation automatique)
  - Icône personnalisée (upload d'image)
- **Aperçu instantané** : Visualisation de l'image avant validation
- **Stockage local** : Toutes les données sont sauvegardées dans IndexedDB

### 3. Widget Météo Avancé

#### 📊 **Graphique des températures et précipitations**
- **Courbe des températures** sur la journée (toutes les 3 heures)
- **Courbe des précipitations** (pluie et neige) en mm
- **Deux axes Y** : Température à gauche, précipitations à droite
- **Design interactif** avec Chart.js

#### 🕒 **Détails horaires**
- Affichage des prévisions **heure par heure** pour la journée
- **Icônes météo** pour chaque période
- **Températures** et **précipitations** pour chaque tranche de 3h

#### 📌 **Résumé météo**
- Température actuelle
- Tendance température (hausse/baisse/stable)
- Vitesse du vent (km/h)
- Précipitations actuelles (mm)

#### ✅ **Voyant d'état de l'API**
- **🟢 Vert** : Clé API valide et fonctionnelle
- **🔴 Rouge** : Clé API non configurée ou invalide
- **🟡 Jaune** : Chargement en cours

### 4. **Statut du RER B en temps réel**

**Fonctionnalités** :
- **Affichage dans le header** : Statut du RER B visible en haut de l'application
- **Icônes indicatives** : 🚇 (normal), ⚠️ (perturbé), ❌ (annulé)
- **Mise à jour automatique** : Toutes les 2 minutes
- **Couleurs thématiques** : Vert (normal), Orange (perturbé), Rouge (annulé)
- **Modal détaillée** : Cliquez sur l'icône pour plus d'informations

**Technologie** :
- Utilisation de l'API Navitia (alternative à l'API RATP officielle)
- Simulation pour la démo si aucune clé API n'est configurée

### 5. **Contrôle des Robots Aspirateurs Xiaomi**

**Fonctionnalités** :
- **Deux robots configurables** : Aspirateur RdC et Aspirateur étage
- **Chargement de carte** : Chaque robot charge sa propre carte (Carte1 pour RdC, Carte2 pour étage)
- **Nettoyage personnalisé** :
  - **Aspirateur RdC** : Nettoyage 2 fois la surface en mode turbo, niveau d'eau 3, retour automatique après 8m²
  - **Aspirateur étage** : Nettoyage 1 fois la surface en mode turbo, niveau d'eau 3, sans retour automatique
- **Notifications** : Notifications visuelles pour le statut des commandes
- **Intégration comme app-card** : Les boutons sont intégrés comme des cartes d'application

**Prérequis** :
- Robot aspirateur Xiaomi connecté au réseau local
- miio CLI installé sur votre système
- Token d'accès miio valide

---

## 🛠 Technologies Utilisées

- **Frontend** : HTML5, CSS3, JavaScript (ES6+)
- **Graphiques** : [Chart.js](https://www.chartjs.org/)
- **Base de données** : IndexedDB API
- **API Météo** : [OpenWeatherMap](https://openweathermap.org/api)
- **API Transport** : [Navitia](https://www.navitia.io/) (pour le statut RER B)
- **Icônes** : [Font Awesome 6](https://fontawesome.com/)
- **Design** : CSS Grid, Flexbox, Animations CSS
- **Contrôle Robot** : [miio CLI](https://github.com/OpenMiHome/miio-cli) pour le contrôle des appareils Xiaomi

---

## 📥 Installation

### Prérequis
- Un navigateur web moderne (Chrome, Firefox, Edge, Safari)
- **Une clé API OpenWeatherMap gratuite** (voir ci-dessous)
- Connexion internet pour la météo

### 1. Obtenir une clé API OpenWeatherMap (GRATUIT)

1. Allez sur [https://openweathermap.org/api](https://openweathermap.org/api)
2. Cliquez sur "Sign Up" et créez un compte gratuit
3. Allez dans votre compte → "API Keys"
4. Copiez votre clé API (ex: `a1b2c3d4e5f6g7h8i9j0k1l2m3`)

### 2. Configurer votre robot aspirateur Xiaomi

Pour utiliser la fonctionnalité de contrôle du robot aspirateur :

1. **Installer miio CLI** :
   ```bash
   npm install -g miio-cli
   ```

2. **Obtenir le token de votre robot** :
   - Utilisez l'application Mi Home pour obtenir le token
   - Ou utilisez la commande :
     ```bash
     miio discover
     ```

3. **Trouver l'adresse IP de votre robot** :
   - Vérifiez dans votre routeur
   - Ou utilisez :
     ```bash
     miio discover
     ```

4. **Configurer dans app.js** :
   Remplacez dans le fichier `app.js` :
   ```javascript
   const ROBOT_CONFIG = {
       ipAddress: '192.168.1.100',  // Remplacez par l'IP de votre robot
       token: 'votre_token_miio_ici',  // Remplacez par votre token
       robots: {
           rdc: {
               mapName: 'Carte1',  // Carte pour le RdC
               cleaning: {
                   repeat: 2,        // Nettoyer 2 fois
                   mode: 'turbo',    // Mode turbo
                   waterLevel: 3,    // Niveau d'eau 3
                   returnAfterArea: 8, // Retour après 8m²
                   returnToClean: true  // Retourne au nettoyage
               }
           },
           etage: {
               mapName: 'Carte2',  // Carte pour l'étage
               cleaning: {
                   repeat: 1,        // Nettoyer 1 fois
                   mode: 'turbo',    // Mode turbo
                   waterLevel: 3,    // Niveau d'eau 3
                   returnAfterArea: null, // Pas de retour automatique
                   returnToClean: false  // Ne retourne pas
               }
           }
       }
   };
   ```

### 3. Configurer votre clé API OpenWeatherMap

Dans le fichier `app.js`, remplacez :
```javascript
const WEATHER_API_KEY = 'votre_cle_api_ici';
```
par :
```javascript
const WEATHER_API_KEY = 'votre_clé_api_personnelle';
```

### 4. Configurer votre clé API Navitia (optionnel)

Pour activer le suivi du RER B, configurez votre clé Navitia dans `app.js` :
```javascript
const NAVITIA_API_KEY = 'votre_clé_navitia_ici';
```

> **Note** : Si vous ne configurez pas de clé Navitia, une simulation sera utilisée pour la démo.

### 5. Installation locale

1. **Cloner le dépôt** :
   ```bash
   git clone https://github.com/thomRoot/Portail_Appli.git
   cd Portail_Appli
   git checkout V1.3e  # Pour utiliser ce style
   ```

2. **Configurer la clé API** (voir étape 3)

3. **Ouvrir l'application** :
   - Double-cliquez sur le fichier `index.html`
   - Ou utilisez un serveur local :
     ```bash
     # Avec Python 3
     python -m http.server 8000
     # Puis ouvrez http://localhost:8000
     ```

4. **Vérifier que ça fonctionne** :
   - Le voyant en haut à droite doit devenir **vert** avec "API active"
   - Le graphique météo doit s'afficher
   - Les étoiles en arrière-plan doivent scintiller

---

## 🚀 Déploiement

### Sur GitHub Pages

1. Poussez votre code sur GitHub (branche `V1.3e`)
2. Allez dans les paramètres du dépôt
3. Activez GitHub Pages dans la section "Pages"
4. Sélectionnez la branche `V1.3e` et le dossier `/ (root)`
5. Votre site sera disponible à l'URL : `https://thomroot.github.io/Portail_Appli/`

### Sur un serveur web

Copiez simplement les fichiers sur votre serveur web. Aucune configuration serveur n'est nécessaire.

---

## 📁 Structure du Projet

```
Portail_Appli/
├── index.html          # Page principale
├── styles.css          # Styles CSS (Style Midnight Blue)
├── app.js              # Logique JavaScript
└── README.md           # Documentation
```

---

## ✨ Personnalisation

### Changer la ville pour la météo

Modifiez les coordonnées dans `app.js` :
```javascript
const LAT = 48.9412;  // Latitude d'Aulnay-sous-Bois
const LON = 2.4833;   // Longitude d'Aulnay-sous-Bois
```

Vous pouvez trouver les coordonnées d'une ville sur [LatLong.net](https://www.latlong.net/)

### Personnaliser les paramètres des robots aspirateurs

Modifiez la configuration dans `app.js` pour chaque robot :

**Pour l'Aspirateur RdC** :
```javascript
rdc: {
    mapName: 'Carte1',  // Nom de la carte à charger
    cleaning: {
        repeat: 2,        // Nombre de répétitions (1-3)
        mode: 'turbo',    // Mode: 'silent', 'standard', 'turbo', 'max'
        waterLevel: 3,    // Niveau d'eau: 0 (sec), 1 (faible), 2 (moyen), 3 (élevé)
        returnAfterArea: 8, // Surface en m² avant retour automatique
        returnToClean: true  // Retourne au nettoyage après la zone
    }
}
```

**Options disponibles** :
- **Modes de nettoyage** : `silent`, `standard`, `turbo`, `max`
- **Niveaux d'eau** : `0` (sec), `1` (faible), `2` (moyen), `3` (élevé)

### Changer l'API Key OpenWeatherMap

Remplacez dans `app.js` :
```javascript
const WEATHER_API_KEY = 'votre_nouvelle_clé_api';
```

### Personnaliser les couleurs (Style Midnight Blue)

Modifiez les variables CSS dans `styles.css` :
```css
:root {
    /* Couleurs principales */
    --primary-color: #4f46e5;          /* Bleu électrique */
    --primary-dark: #4338ca;          /* Bleu foncé */
    --secondary-color: #8b5cf6;       /* Violet */
    --accent-color: #06b6d4;          /* Cyan */
    
    /* Couleurs de fond et texte */
    --background-color: #0a0a1a;      /* Bleu nuit très foncé */
    --card-color: #16213e;            /* Bleu nuit */
    --text-color: #e0e0ff;           /* Blanc bleuté */
    --text-light: #a3b8d1;           /* Texte léger bleuté */
    
    /* Effets */
    --background-gradient: linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 50%, #0f172a 100%);
    --card-gradient: linear-gradient(145deg, #1e293b 0%, #0f172a 100%);
    --shadow-glow: 0 0 20px rgba(79, 70, 229, 0.3);
    --border-glow: 1px solid rgba(79, 70, 229, 0.4);
}
```

---

## 🎯 Utilisation

### Ajouter un site
1. Cliquez sur le bouton **"➕ Ajouter un site"** en haut à droite
2. Remplissez le formulaire :
   - **Nom du site** : Le nom qui s'affichera sous l'icône
   - **URL du site** : L'adresse web (ex: https://google.com)
   - **Icône** : Une image qui représentera votre site
3. Cliquez sur **"Ajouter"**
4. Votre site apparaîtra dans le portail avec un style Midnight Blue

### Accéder à un site
- Cliquez simplement sur la carte du site pour l'ouvrir dans un nouvel onglet

### Lancer le nettoyage des robots aspirateurs

**Pour l'Aspirateur RdC** :
1. Assurez-vous que votre robot est connecté au même réseau WiFi
2. Configurez l'adresse IP et le token dans `app.js`
3. Cliquez sur le bouton **"Lancer"** dans la carte **"Aspirateur RdC"** (icône 🧹)
4. Le robot va :
   - Charger la carte "Carte1"
   - Nettoyer 2 fois la surface en mode turbo
   - Utiliser le niveau d'eau 3
   - Retourner au nettoyage après avoir nettoyé 8m²
5. Une notification s'affichera pour confirmer le démarrage

**Pour l'Aspirateur étage** :
1. Assurez-vous que votre robot est connecté au même réseau WiFi
2. Configurez l'adresse IP et le token dans `app.js`
3. Cliquez sur le bouton **"Lancer"** dans la carte **"Aspirateur étage"** (icône 🧹)
4. Le robot va :
   - Charger la carte "Carte2"
   - Nettoyer 1 fois la surface en mode turbo
   - Utiliser le niveau d'eau 3
   - **Ne pas** retourner au nettoyage après avoir nettoyé
5. Une notification s'affichera pour confirmer le démarrage

### Vérifier l'état de l'API
- Regardez le **voyant** en haut à droite de l'application
- **🟢 Vert** = Tout fonctionne
- **🔴 Rouge** = Problème avec la clé API

### Consulter l'état du RER B
- **Affichage dans le header** : Le statut du RER B s'affiche en haut à gauche
- **Icônes** :
  - 🚇 = Circulation normale
  - ⚠️ = Perturbations
  - ❌ = Service annulé
- **Couleurs** : Vert (normal), Orange (perturbé), Rouge (annulé)
- **Mise à jour** : Toutes les 2 minutes

### Consulter la météo
- **Onglet "Graphique"** : Voir la courbe des températures et précipitations
- **Onglet "Détails"** : Voir les prévisions heure par heure
- **Résumé** : Température, vent et précipitations actuelles

---

## 🐛 Dépannage

### La météo ne s'affiche pas / "Météo indisponible"

**Causes possibles** :
1. **Clé API non configurée** → Vérifiez que vous avez remplacé `votre_cle_api_ici` dans `app.js`
2. **Clé API invalide** → Vérifiez que votre clé est correcte
3. **Problème de CORS** → Essayez avec un serveur local : `python -m http.server 8000`
4. **Limite de l'API atteinte** → Attendez quelques minutes
5. **Problème de connexion internet** → Vérifiez votre connexion

### Les étoiles ne scintillent pas
- **Vérifiez votre navigateur** : Les animations CSS sont supportées par tous les navigateurs modernes
- **Vérifiez les paramètres** : Certains navigateurs réduisent les animations pour économiser la batterie
- **Testez sur un autre appareil** : Pour confirmer que l'effet est bien présent

### Les sites ne se sauvegardent pas
- Vérifiez que votre navigateur supporte IndexedDB
- Assurez-vous que vous n'êtes pas en mode navigation privée
- Vérifiez les erreurs dans la console (F12)

### Le robot aspirateur ne répond pas
- **Vérifiez la connexion réseau** : Robot et appareil sur le même WiFi
- **Vérifiez l'adresse IP** : Utilisez `miio discover` pour la trouver
- **Vérifiez le token** : Obtenez un nouveau token via l'application Mi Home
- **Vérifiez que miio CLI est installé** : Exécutez `miio --version`
- **Testez manuellement** : `miio raw --ip ADRESSE_IP --token VOTRE_TOKEN start_clean`

---

## 📊 Compatibilité

| Navigateur | Support | Testé | Animations CSS |
|------------|---------|-------|-----------------|
| Chrome | ✅ Oui | ✅ Oui | ✅ Oui |
| Firefox | ✅ Oui | ✅ Oui | ✅ Oui |
| Edge | ✅ Oui | ✅ Oui | ✅ Oui |
| Safari | ✅ Oui | ❌ Non | ✅ Oui |
| Opera | ✅ Oui | ❌ Non | ✅ Oui |

---

## 🚀 Améliorations Futures

- [ ] Suppression de sites via l'interface
- [ ] Édition des sites existants
- [ ] Organisation par catégories/dossiers
- [ ] Recherche de sites
- [ ] Import/Export des données
- [ ] Synchronisation entre appareils
- [ ] Thèmes personnalisables
- [ ] Effets d'étoiles plus réalistes
- [ ] Mode "nuit" avec étoiles plus visibles
- [ ] Animations de transition entre les pages

---

## 📜 Licence

Ce projet est sous licence **MIT**. Vous êtes libre de l'utiliser, le modifier et le distribuer.

---

**Créé avec ❤️ par ThomRoot**

*Style : V1.3e - Midnight Blue*
*Dernière mise à jour : 30 juin 2025*

---

## 💬 Support

Si vous avez des problèmes :
1. Vérifiez d'abord la section **Dépannage** ci-dessus
2. Assurez-vous que votre clé API est valide
3. Ouvrez la console du navigateur (F12) pour voir les erreurs
4. Vérifiez que vous avez bien remplacé `votre_cle_api_ici`
5. Pour les étoiles scintillantes, assurez-vous que les animations CSS sont activées
