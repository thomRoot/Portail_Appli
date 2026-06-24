# Portail Appli - ThomRoot

## 📋 Description

**Portail Appli** est une application web complète qui fait office de portail pour tous vos sites web. Elle vous permet de :

- ✅ Afficher vos sites sous forme d'icônes d'applications cliquables
- ✅ Ajouter de nouveaux sites via une popup intuitive
- ✅ Personnaliser l'icône de chaque site avec une image
- ✅ **Visualiser la météo en temps réel avec graphiques et précipitations**
- ✅ **Voyant d'état pour vérifier que votre clé API est active**
- ✅ Stocker toutes vos données localement dans votre navigateur

## 🚀 Fonctionnalités

### 1. Interface Utilisateur
- **Grille d'applications** : Affichage responsive de vos sites sous forme de cartes avec icônes
- **Design moderne** : Interface épurée avec animations et ombres
- **Responsive** : Adapté aux mobiles, tablettes et ordinateurs

### 2. Gestion des Sites
- **Ajout de sites** : Bouton "+" dans l'en-tête pour ouvrir la popup d'ajout
- **Formulaire complet** :
  - Nom du site
  - URL du site (validation automatique)
  - Icône personnalisée (upload d'image)
- **Aperçu instantané** : Visualisation de l'image avant validation
- **Stockage local** : Toutes les données sont sauvegardées dans IndexedDB

### 3. Widget Météo Avancé ⚡ NOUVEAU

#### 📊 **Graphique des températures et précipitations**
- **Courbe des températures** sur la journée (toutes les 3 heures)
- **Courbe des précipitations** (pluie et neige) en mm
- **Deux axes Y** : Température à gauche, précipitations à droite
- **Design interactif** avec Chart.js

#### 📋 **Détails horaires**
- Affichage des prévisions **heure par heure** pour la journée
- **Icônes météo** pour chaque période
- **Températures** et **précipitations** pour chaque tranche de 3h
- **8 prévisions** affichées pour éviter la surcharge

#### 📌 **Résumé météo**
- Température actuelle
- Humidité (%)
- Vitesse du vent (km/h)
- Précipitations actuelles (mm)

#### ✅ **Voyant d'état de l'API**
- **🟢 Vert** : Clé API valide et fonctionnelle
- **🔴 Rouge** : Clé API non configurée ou invalide
- **🟡 Jaune** : Chargement en cours
- **Affichage clair** dans l'en-tête de l'application

### 4. Base de Données
- **Technologie** : IndexedDB (stockage côté client)
- **Structure** :
  - `id` : Identifiant unique auto-incrémenté
  - `name` : Nom du site
  - `url` : URL du site (unique)
  - `icon` : Image de l'icône (stockée en base64)
  - `createdAt` : Date de création

## 🛠 Technologies Utilisées

- **Frontend** : HTML5, CSS3, JavaScript (ES6+)
- **Graphiques** : [Chart.js](https://www.chartjs.org/)
- **Base de données** : IndexedDB API
- **API Météo** : [OpenWeatherMap](https://openweathermap.org/api)
- **Icônes** : [Font Awesome 6](https://fontawesome.com/)
- **Design** : CSS Grid, Flexbox, Animations CSS

## 📦 Installation

### Prérequis
- Un navigateur web moderne (Chrome, Firefox, Edge, Safari)
- **Une clé API OpenWeatherMap gratuite** (voir ci-dessous)
- Connexion internet pour la météo

### 1. Obtenir une clé API OpenWeatherMap (GRATUIT)

1. Allez sur [https://openweathermap.org/api](https://openweathermap.org/api)
2. Cliquez sur "Sign Up" et créez un compte gratuit
3. Allez dans votre compte → "API Keys"
4. Copiez votre clé API (ex: `a1b2c3d4e5f6g7h8i9j0k1l2m3`)

### 2. Configurer votre clé API

Dans le fichier `app.js`, remplacez :
```javascript
const WEATHER_API_KEY = 'votre_cle_api_ici';
```
par :
```javascript
const WEATHER_API_KEY = 'votre_clé_api_personnelle';
```

### 3. Installation locale

1. **Cloner le dépôt** :
   ```bash
   git clone https://github.com/thomRoot/Portail_Appli.git
   cd Portail_Appli
   ```

2. **Configurer la clé API** (voir étape 2)

3. **Ouvrir l'application** :
   - Double-cliquez sur le fichier `index.html`
   - Ou utilisez un serveur local :
     ```bash
     # Avec Python 3
     python -m http.server 8000
     # Puis ouvrez http://localhost:8000
     ```

4. **Vérifier que ça fonctionne** :
   - Le voyant en haut à gauche doit devenir **vert** avec "API active"
   - Le graphique météo doit s'afficher

## 🌐 Déploiement

### Sur GitHub Pages

1. Poussez votre code sur GitHub
2. Allez dans les paramètres du dépôt
3. Activez GitHub Pages dans la section "Pages"
4. Sélectionnez la branche `main` et le dossier `/ (root)`
5. Votre site sera disponible à l'URL : `https://thomroot.github.io/Portail_Appli/`

### Sur un serveur web

Copiez simplement les fichiers sur votre serveur web. Aucune configuration serveur n'est nécessaire.

## 📊 Structure du Projet

```
Portail_Appli/
├── index.html          # Page principale
├── styles.css          # Styles CSS
├── app.js              # Logique JavaScript
└── README.md           # Documentation
```

## 🎨 Personnalisation

### Changer la ville pour la météo

Modifiez les coordonnées dans `app.js` :
```javascript
const LAT = 48.9412;  // Latitude d'Aulnay-sous-Bois
const LON = 2.4833;   // Longitude d'Aulnay-sous-Bois
```

Vous pouvez trouver les coordonnées d'une ville sur [LatLong.net](https://www.latlong.net/)

### Changer l'API Key OpenWeatherMap

Remplacez dans `app.js` :
```javascript
const WEATHER_API_KEY = 'votre_nouvelle_clé_api';
```

### Personnaliser les couleurs

Modifiez les variables CSS dans `styles.css` :
```css
:root {
    --primary-color: #4a6fa5;
    --primary-dark: #166088;
    --secondary-color: #4fc3f7;
    /* ... */
}
```

## 💡 Utilisation

### Ajouter un site
1. Cliquez sur le bouton "➕ Ajouter un site" en haut à droite
2. Remplissez le formulaire :
   - **Nom du site** : Le nom qui s'affichera sous l'icône
   - **URL du site** : L'adresse web (ex: https://google.com)
   - **Icône** : Une image qui représentera votre site
3. Cliquez sur "Ajouter"
4. Votre site apparaîtra dans le portail

### Accéder à un site
- Cliquez simplement sur la carte du site pour l'ouvrir dans un nouvel onglet

### Vérifier l'état de l'API
- Regardez le **voyant** en haut à gauche de l'application
- **🟢 Vert** = Tout fonctionne
- **🔴 Rouge** = Problème avec la clé API

### Consulter la météo
- **Onglet "Graphique"** : Voir la courbe des températures et précipitations
- **Onglet "Détails"** : Voir les prévisions heure par heure
- **Résumé** : Température, humidité, vent et précipitations actuelles

### Supprimer un site (Fonctionnalité bonus)
Ouvrez la console du navigateur (F12) et utilisez :
```javascript
deleteSite(id);
```
(Remplacez `id` par l'identifiant du site)

## 🔧 Dépannage

### La météo ne s'affiche pas / "Météo indisponible"

**Causes possibles** :

1. **Clé API non configurée**
   - Vérifiez que vous avez remplacé `votre_cle_api_ici` dans `app.js`
   - Le voyant doit être **rouge** avec "Clé API non configurée"

2. **Clé API invalide**
   - Vérifiez que votre clé est correcte (sans espace, sans caractère spécial)
   - Le voyant doit être **rouge** avec "Clé API invalide"

3. **Problème de CORS**
   - Si vous testez localement avec `file://`, essayez avec un serveur local :
     ```bash
     python -m http.server 8000
     ```

4. **Limite de l'API atteinte**
   - La version gratuite permet 60 appels/minute
   - Attendez quelques minutes si vous avez fait trop de tests

5. **Problème de connexion internet**
   - Vérifiez que vous êtes connecté

### Les sites ne se sauvegardent pas
- Vérifiez que votre navigateur supporte IndexedDB
- Assurez-vous que vous n'êtes pas en mode navigation privée
- Vérifiez les erreurs dans la console (F12)

### L'image ne s'affiche pas
- Vérifiez que le fichier est bien une image (JPG, PNG, etc.)
- Assurez-vous que le fichier n'est pas trop volumineux (>5Mo)

### Le graphique ne s'affiche pas
- Vérifiez que vous avez une connexion internet
- Vérifiez que votre clé API est valide
- Essayez de rafraîchir la page (F5)

## 📱 Compatibilité

| Navigateur | Support | Testé |
|------------|---------|-------|
| Chrome | ✅ Oui | ✅ Oui |
| Firefox | ✅ Oui | ✅ Oui |
| Edge | ✅ Oui | ✅ Oui |
| Safari | ✅ Oui | ❌ Non |
| Opera | ✅ Oui | ❌ Non |

## 🎯 Améliorations Futures

- [ ] Suppression de sites via l'interface
- [ ] Édition des sites existants
- [ ] Organisation par catégories/dossiers
- [ ] Recherche de sites
- [ ] Import/Export des données
- [ ] Synchronisation entre appareils
- [ ] Thèmes sombres/clairs
- [ ] Personnalisation de la disposition
- [ ] Prévisions sur 5 jours (au lieu d'1 jour)
- [ ] Carte météo interactive

## 📜 Licence

Ce projet est sous licence **MIT**. Vous êtes libre de l'utiliser, le modifier et le distribuer.

## 🙏 Remerciements

- [Font Awesome](https://fontawesome.com/) pour les icônes
- [OpenWeatherMap](https://openweathermap.org/) pour l'API météo
- [Chart.js](https://www.chartjs.org/) pour les graphiques
- Tous les contributeurs et utilisateurs

---

**Créé avec ❤️ par ThomRoot**

*Dernière mise à jour : 24 juin 2025*

---

## 💬 Support

Si vous avez des problèmes :
1. Vérifiez d'abord la section **Dépannage** ci-dessus
2. Assurez-vous que votre clé API est valide
3. Ouvrez la console du navigateur (F12) pour voir les erreurs
4. Vérifiez que vous avez bien remplacé `votre_cle_api_ici`
