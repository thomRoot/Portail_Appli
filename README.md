# Portail Appli - ThomRoot

## 📋 Description

**Portail Appli** est une application web complète qui fait office de portail pour tous vos sites web. Elle vous permet de :

- ✅ Afficher vos sites sous forme d'icônes d'applications cliquables
- ✅ Ajouter de nouveaux sites via une popup intuitive
- ✅ Personnaliser l'icône de chaque site avec une image
- ✅ **Visualiser la météo en temps réel avec graphiques et précipitations**
- ✅ **Voyant d'état pour vérifier que votre clé API est active**
- ✅ **Contrôler votre robot aspirateur Xiaomi avec des paramètres avancés**
- ✅ **Suivre l'état du RER B en temps réel (normal, perturbé, annulé)** ⚡ NOUVEAU
- ✅ **Thème bleu/noir inspiré du widget météo** ⚡ NOUVEAU
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
- **Courbe des précipitations** (pluie et neige) en mm **avec couleur orange vif (rgba(255, 215, 0)) pour une meilleure lisibilité**
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

### 4. **Statut du RER B en temps réel** ⚡ NOUVEAU

**Fonctionnalités** :
- **Affichage dans le header** : Statut du RER B visible en haut de l'application
- **Icône indicative** : 🚇 (normal), ⚠️ (perturbé), ❌ (annulé)
- **Mise à jour automatique** : Toutes les 2 minutes
- **Couleurs thématiques** : Vert (normal), Orange (perturbé), Rouge (annulé)
- **Message de perturbation** : Affichage du message officiel (ex: "Retards de 10 minutes")

**Technologie** :
- Utilisation de l'**API Île-de-France Mobilités (PRIM)** : [https://prim.iledefrance-mobilites.fr/](https://prim.iledefrance-mobilites.fr/)
- **Gratuite et sans clé API** : Accès public aux données officielles
- **Dataset utilisé** : `etat-du-trafic-par-ligne` pour le statut en temps réel

**Configuration** :
Aucune clé API nécessaire ! Le code utilise directement l'API publique :
```javascript
const IDFM_API_URL = 'https://prim.iledefrance-mobilites.fr/api/records/1.0/search/?dataset=etat-du-trafic-par-ligne&q=RER+B&rows=1';
```

### 5. **Thème Bleu/Noir** ⚡ NOUVEAU

**Caractéristiques** :
- **Couleurs principales** : Bleu (#1e88e5) inspiré du widget météo, mélangé avec du noir (#121212)
- **Fond sombre** : Réduction de la fatigue oculaire
- **Cartes avec bordures subtiles** : Effet moderne et élégant
- **Ombres adaptées** : Meilleure visibilité sur fond sombre
- **Scrollbar personnalisée** : Intégration harmonieuse avec le thème

**Personnalisation** :
Modifiez les variables CSS dans `styles.css` :
```css
:root {
    --primary-color: #1e88e5;  /* Bleu principal */
    --primary-dark: #1565c0;   /* Bleu foncé */
    --secondary-color: #0d47a1; /* Bleu secondaire */
    --background-color: #121212; /* Fond noir profond */
    --card-color: #1e1e1e;      /* Cartes noires */
    --text-color: #e0e0e0;     /* Texte clair */
}
```

### 6. Base de Données
- **Technologie** : IndexedDB (stockage côté client)
- **Structure** :
  - `id` : Identifiant unique auto-incrémenté
  - `name` : Nom du site
  - `url` : URL du site (unique)
  - `icon` : Image de l'icône (stockée en base64)
  - `createdAt` : Date de création

### 5. Contrôle des Robots Aspirateurs Xiaomi ⚡ NOUVEAU

**Fonctionnalités** :
- **Deux robots configurables** : Aspirateur RdC et Aspirateur étage
- **Chargement de carte** : Chaque robot charge sa propre carte (Carte1 pour RdC, Carte2 pour étage)
- **Nettoyage personnalisé** :
  - **Aspirateur RdC** : Nettoyage 2 fois la surface en mode turbo, niveau d'eau 3, retour automatique après 8m²
  - **Aspirateur étage** : Nettoyage 1 fois la surface en mode turbo, niveau d'eau 3, sans retour automatique
- **Notifications** : Notifications visuelles pour le statut des commandes
- **Intégration comme app-card** : Les boutons sont intégrés comme des cartes d'application agrandies

**Prérequis** :
- Robot aspirateur Xiaomi connecté au réseau local
- miio CLI installé sur votre système
- Token d'accès miio valide

## 🛠 Technologies Utilisées

- **Frontend** : HTML5, CSS3, JavaScript (ES6+)
- **Graphiques** : [Chart.js](https://www.chartjs.org/)
- **Base de données** : IndexedDB API
- **API Météo** : [OpenWeatherMap](https://openweathermap.org/api)
- **API Transport** : [Île-de-France Mobilités PRIM](https://prim.iledefrance-mobilites.fr/) (pour le statut RER B, **gratuite et sans clé API**)
- **Icônes** : [Font Awesome 6](https://fontawesome.com/)
- **Design** : CSS Grid, Flexbox, Animations CSS
- **Contrôle Robot** : [miio CLI](https://github.com/OpenMiHome/miio-cli) pour le contrôle des appareils Xiaomi

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

### 2. Configurer votre clé API OpenWeatherMap

Dans le fichier `app.js`, remplacez :
```javascript
const WEATHER_API_KEY = 'votre_cle_api_ici';
```
par :
```javascript
const WEATHER_API_KEY = 'votre_clé_api_personnelle';
```

### 3. Statut du RER B (aucune configuration nécessaire)

Le statut du RER B est **automatiquement récupéré** depuis l'API **Île-de-France Mobilités (PRIM)**.
**Aucune clé API n'est nécessaire** : l'API est publique et gratuite.

> **Note** : Si l'API est temporairement indisponible, un message d'erreur sera affiché.

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

**Pour l'Aspirateur étage** :
```javascript
etage: {
    mapName: 'Carte2',  // Nom de la carte à charger
    cleaning: {
        repeat: 1,        // Nombre de répétitions (1-3)
        mode: 'turbo',    // Mode: 'silent', 'standard', 'turbo', 'max'
        waterLevel: 3,    // Niveau d'eau: 0 (sec), 1 (faible), 2 (moyen), 3 (élevé)
        returnAfterArea: null, // Pas de retour automatique
        returnToClean: false  // Ne retourne pas au nettoyage
    }
}
```

**Options disponibles** :
- **Modes de nettoyage** : `silent`, `standard`, `turbo`, `max`
- **Niveaux d'eau** : `0` (sec), `1` (faible), `2` (moyen), `3` (élevé)
- **Noms de carte** : Dépend des cartes enregistrées dans votre application Mi Home
- **returnAfterArea** : Surface en m² avant retour automatique (null pour désactiver)
- **returnToClean** : `true` pour retourner au nettoyage, `false` pour ne pas retourner
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

**Note** : Les deux cartes d'aspirateur et les sites apparaissent dans un conteneur unique avec le même style. Toutes les cartes ont la même taille (180px x 220px) et sont alignées dans une grille responsive.

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

### Le robot aspirateur ne répond pas
- **Vérifiez la connexion réseau** : Assurez-vous que le robot et votre appareil sont sur le même réseau WiFi
- **Vérifiez l'adresse IP** : L'adresse IP du robot peut changer. Utilisez `miio discover` pour la trouver
- **Vérifiez le token** : Le token peut expirer. Obtenez un nouveau token via l'application Mi Home
- **Vérifiez que miio CLI est installé** : Exécutez `miio --version` pour vérifier l'installation
- **Vérifiez les erreurs dans la console** : Ouvrez la console du navigateur (F12) pour voir les messages d'erreur
- **Testez manuellement** : Essayez la commande suivante dans votre terminal :
  ```bash
  miio raw --ip ADRESSE_IP --token VOTRE_TOKEN start_clean
  ```

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
- [ ] **Contrôle avancé du robot** : Programmer des horaires de nettoyage
- [ ] **Suivi en temps réel** : Afficher l'état actuel du robot (batterie, statut)
- [ ] **Historique des nettoyages** : Conserver un historique des sessions de nettoyage
- [ ] **Contrôle vocal** : Intégration avec les assistants vocaux

## 📜 Licence

Ce projet est sous licence **MIT**. Vous êtes libre de l'utiliser, le modifier et le distribuer.

## 🙏 Remerciements

- [Font Awesome](https://fontawesome.com/) pour les icônes
- [OpenWeatherMap](https://openweathermap.org/) pour l'API météo
- [Chart.js](https://www.chartjs.org/) pour les graphiques
- Tous les contributeurs et utilisateurs

---

**Créé avec ❤️ par ThomRoot**

*Dernière mise à jour : 25 juin 2025 - Ajout du statut RER B et du thème bleu/noir*

---

## 💬 Support

Si vous avez des problèmes :
1. Vérifiez d'abord la section **Dépannage** ci-dessus
2. Assurez-vous que votre clé API est valide
3. Ouvrez la console du navigateur (F12) pour voir les erreurs
4. Vérifiez que vous avez bien remplacé `votre_cle_api_ici`
