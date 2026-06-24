# Portail Appli - ThomRoot

## 📋 Description

**Portail Appli** est une application web qui fait office de portail pour tous vos sites web. Elle vous permet de :

- ✅ Afficher vos sites sous forme d'icônes d'applications cliquables
- ✅ Ajouter de nouveaux sites via une popup intuitive
- ✅ Personnaliser l'icône de chaque site avec une image
- ✅ Visualiser la météo en temps réel à Aulnay-sous-Bois (Noneville)
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

### 3. Widget Météo
- **Localisation** : Aulnay-sous-Bois (Noneville), France
- **Données en temps réel** : Température, description et icône météo
- **Mise à jour automatique** : Rafraîchissement toutes les 10 minutes
- **Gestion des erreurs** : Affichage alternatif si l'API est indisponible

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
- **Base de données** : IndexedDB API
- **API Météo** : OpenWeatherMap
- **Icônes** : Font Awesome 6
- **Design** : CSS Grid, Flexbox, Animations CSS

## 📦 Installation

### Prérequis
- Un navigateur web moderne (Chrome, Firefox, Edge, Safari)
- Connexion internet pour la météo (optionnelle)

### Installation locale

1. **Cloner le dépôt** :
   ```bash
   git clone https://github.com/thomRoot/Portail_Appli.git
   cd Portail_Appli
   ```

2. **Ouvrir l'application** :
   - Double-cliquez sur le fichier `index.html`
   - Ou utilisez un serveur local :
     ```bash
     # Avec Python 3
     python -m http.server 8000
     # Puis ouvrez http://localhost:8000
     ```

3. **Utilisation** :
   - Cliquez sur "Ajouter un site"
   - Remplissez le formulaire
   - Votre site apparaîtra dans le portail

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
const lat = 48.9412;  // Latitude d'Aulnay-sous-Bois
const lon = 2.4833;   // Longitude d'Aulnay-sous-Bois
```

Vous pouvez trouver les coordonnées d'une ville sur [LatLong.net](https://www.latlong.net/)

### Changer l'API Key OpenWeatherMap

1. Inscrivez-vous sur [OpenWeatherMap](https://openweathermap.org/)
2. Obtenez une clé API gratuite
3. Remplacez dans `app.js` :
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

### Supprimer un site (Fonctionnalité bonus)
Ouvrez la console du navigateur (F12) et utilisez :
```javascript
deleteSite(id);
```
(Remplacez `id` par l'identifiant du site)

## 🔧 Dépannage

### La météo ne s'affiche pas
- Vérifiez votre connexion internet
- Assurez-vous que l'API Key OpenWeatherMap est valide
- Vérifiez dans la console du navigateur (F12) les erreurs éventuelles

### Les sites ne se sauvegardent pas
- Vérifiez que votre navigateur supporte IndexedDB
- Assurez-vous que vous n'êtes pas en mode navigation privée
- Vérifiez les erreurs dans la console

### L'image ne s'affiche pas
- Vérifiez que le fichier est bien une image (JPG, PNG, etc.)
- Assurez-vous que le fichier n'est pas trop volumineux (>5Mo)

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

## 📜 Licence

Ce projet est sous licence **MIT**. Vous êtes libre de l'utiliser, le modifier et le distribuer.

## 🙏 Remerciements

- [Font Awesome](https://fontawesome.com/) pour les icônes
- [OpenWeatherMap](https://openweathermap.org/) pour l'API météo
- Tous les contributeurs et utilisateurs

---

**Créé avec ❤️ par ThomRoot**

*Dernière mise à jour : 24 juin 2025*
