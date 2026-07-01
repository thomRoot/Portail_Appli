# f4c3 **Tutoriel : Déploiement de Portail_Appli avec Proxy Local**

Ce tutoriel vous guide **étape par étape** pour déployer votre application **Portail_Appli** sur votre réseau local à la maison.

---

## f4cb **Prérequis**
Avant de commencer, assurez-vous d'avoir :
1. **Un ordinateur** (Windows, macOS ou Linux) connecté à votre réseau local.
2. **Node.js** installé (version 14 ou supérieure).
   - Téléchargez-le depuis [https://nodejs.org/](https://nodejs.org/).
   - Vérifiez l'installation avec :
     ```bash
     node --version
     npm --version
     ```
3. **Git** installé (pour cloner ou mettre à jour le dépôt).
   - Téléchargez-le depuis [https://git-scm.com/](https://git-scm.com/).
4. **Un navigateur web** (Chrome, Firefox, Edge, etc.).

---

## f680 **Étapes de déploiement**

### **Étape 1 : Cloner ou mettre à jour le dépôt**
Si vous n'avez pas encore le dépôt localement, clonez-le :
```bash
cd ~
git clone https://github.com/thomRoot/Portail_Appli.git
cd Portail_Appli
```

Si vous avez déjà le dépôt, mettez-le à jour :
```bash
cd Portail_Appli
git pull origin main
```

---

### **Étape 2 : Installer les dépendances Node.js**
Dans le dossier `Portail_Appli`, installez les dépendances nécessaires pour le serveur proxy :
```bash
npm install
```
Cela installera :
- `express` : Pour créer le serveur web.
- `axios` : Pour effectuer des requêtes HTTP.
- `cors` : Pour gérer les en-têtes CORS.

---

### **Étape 3 : Configurer votre clé API OpenWeatherMap**
1. Ouvrez le fichier `public/app.js` avec un éditeur de texte (VS Code, Notepad++, etc.).
2. Cherchez la ligne :
   ```javascript
   const WEATHER_API_KEY = 'votre_cle_api_ici';
   ```
3. Remplacez `'votre_cle_api_ici'` par **votre clé API OpenWeatherMap** (obtenue gratuitement sur [https://openweathermap.org/api](https://openweathermap.org/api)).
   Exemple :
   ```javascript
   const WEATHER_API_KEY = 'a1b2c3d4e5f6g7h8i9j0k1l2m3';
   ```
4. Sauvegardez le fichier.

---

### **Étape 4 : Configurer les robots aspirateurs (optionnel)**
Si vous souhaitez utiliser la fonctionnalité de contrôle des robots aspirateurs Xiaomi :
1. Ouvrez le fichier `public/app.js`.
2. Cherchez la section `ROBOT_CONFIG` (vers la fin du fichier).
3. Remplacez les valeurs par défaut par :
   - L'**adresse IP** de votre robot.
   - Le **token** de votre robot (obtenu via l'application Mi Home ou `miio discover`).
   Exemple :
   ```javascript
   const ROBOT_CONFIG = {
       ipAddress: '192.168.1.100',  // Remplacez par l'IP de votre robot
       token: 'votre_token_miio_ici',  // Remplacez par votre token
       robots: {
           rdc: {
               mapName: 'Carte1',
               cleaning: {
                   repeat: 2,
                   mode: 'turbo',
                   waterLevel: 3,
                   returnAfterArea: 8,
                   returnToClean: true
               }
           },
           etage: {
               mapName: 'Carte2',
               cleaning: {
                   repeat: 1,
                   mode: 'turbo',
                   waterLevel: 3,
                   returnAfterArea: null,
                   returnToClean: false
               }
           }
       }
   };
   ```

---

### **Étape 5 : Démarrer le serveur proxy**
1. Dans le terminal, exécutez :
   ```bash
   npm start
   ```
   Cela démarrera le serveur proxy sur le **port 8000**.

2. Vous devriez voir un message comme :
   ```
   Serveur proxy démarré sur http://0.0.0.0:8000
   Accédez à votre application sur http://localhost:8000 ou http://<VOTRE_IP_LOCALE>:8000
   ```

---

### **Étape 6 : Accéder à l'application**
1. **Sur votre ordinateur** :
   - Ouvrez votre navigateur et allez sur :
     ```
     http://localhost:8000
     ```

2. **Depuis un autre appareil sur votre réseau local** :
   - Trouvez l'**adresse IP locale** de votre ordinateur (ex: `192.168.1.100`).
     - **Sur Linux/macOS** : Exécutez `ifconfig` ou `ip a` et cherchez `inet`.
     - **Sur Windows** : Exécutez `ipconfig` et cherchez `Adresse IPv4`.
   - Sur un autre appareil (tablette, smartphone, etc.), ouvrez le navigateur et allez sur :
     ```
     http://<VOTRE_IP_LOCALE>:8000
     ```
     Exemple : `http://192.168.1.100:8000`.

---

### **Étape 7 : Vérifier le fonctionnement**
1. **Voyant API** :
   - En haut à droite, vérifiez que le voyant est **vert** (✅) avec le message "API active".
   - Si ce n'est pas le cas, vérifiez que votre clé API OpenWeatherMap est correcte.

2. **Météo** :
   - Vérifiez que les données météo (température, graphiques, etc.) s'affichent correctement.

3. **Robots aspirateurs** (optionnel) :
   - Si vous avez configuré les robots, testez les boutons "Lancer" pour vérifier qu'ils fonctionnent.

---

## f310 **Accéder à l'application depuis votre réseau local**
Pour que votre application soit accessible depuis **n'importe quel appareil** sur votre réseau local (smartphone, tablette, autre ordinateur) :

1. **Trouvez l'adresse IP locale de votre ordinateur** (ex: `192.168.1.100`).
2. **Assurez-vous que le serveur proxy est démarré** (`npm start`).
3. **Sur un autre appareil**, ouvrez le navigateur et allez sur :
   ```
   http://<VOTRE_IP_LOCALE>:8000
   ```
   Exemple : `http://192.168.1.100:8000`.

---

## f504 **Démarrer automatiquement le serveur au démarrage**
Pour que le serveur proxy démarre automatiquement quand vous allumez votre ordinateur, vous pouvez utiliser **PM2** (un gestionnaire de processus pour Node.js) :

1. Installez PM2 globalement :
   ```bash
   npm install -g pm2
   ```

2. Démarrez le serveur avec PM2 :
   ```bash
   pm2 start server.js --name "PortailAppli"
   ```

3. Sauvegardez la liste des processus PM2 :
   ```bash
   pm2 save
   ```

4. Activez le démarrage automatique de PM2 :
   - **Sur Linux/macOS** :
     ```bash
     pm2 startup
     pm2 save
     ```
   - **Sur Windows** :
     ```bash
     pm2-startup install
     ```

5. Vérifiez que le serveur est en cours d'exécution :
   ```bash
   pm2 list
   ```

---

## f7e0 **Dépannage**

### **Problème : Le serveur ne démarre pas**
- **Vérifiez que Node.js est installé** :
  ```bash
  node --version
  ```
- **Vérifiez que les dépendances sont installées** :
  ```bash
  npm install
  ```
- **Vérifiez les erreurs dans le terminal** :
  Si vous voyez une erreur comme `Error: listen EADDRINUSE :::8000`, cela signifie que le port 8000 est déjà utilisé. Changez le port dans `server.js` :
  ```javascript
  const PORT = 8080; // Changez pour un autre port
  ```

---

### **Problème : La météo ne s'affiche pas**
- **Vérifiez votre clé API OpenWeatherMap** :
  Assurez-vous qu'elle est correcte dans `public/app.js`.
- **Testez l'API OpenWeatherMap** :
  Ouvrez votre navigateur et allez sur :
  ```
  https://api.openweathermap.org/data/2.5/weather?lat=48.93091298084958&lon=2.4856556085876904&appid=VOTRE_CLE_API&units=metric&lang=fr
  ```
  Remplacez `VOTRE_CLE_API` par votre clé. Vous devriez voir des données JSON.

---

### **Problème : Les robots aspirateurs ne répondent pas**
- **Vérifiez que les robots sont connectés au même réseau WiFi** que votre ordinateur.
- **Vérifiez l'adresse IP et le token** dans `public/app.js`.
- **Testez manuellement avec `miio CLI`** :
  Installez `miio-cli` et exécutez :
  ```bash
  npm install -g miio-cli
  miio raw --ip ADRESSE_IP --token VOTRE_TOKEN start_clean
  ```

---

## f4c2 **Structure du projet après déploiement**
```
Portail_Appli/
├──── public/                  # Fichiers statiques
│   ├── index.html           # Page principale
│   ├── app.js               # Logique JavaScript
│   └── styles.css           # Styles CSS
├──── server.js                # Serveur proxy Node.js/Express
├──── package.json             # Dépendances Node.js
└──── README.md                # Documentation
```

---

## f512 **Sécurité (optionnel)**
Si vous souhaitez sécuriser l'accès à votre application sur votre réseau local :
1. **Changez le port** dans `server.js` pour éviter les conflits :
   ```javascript
   const PORT = 8080; // ou un autre port
   ```
2. **Utilisez un mot de passe** :
   Vous pouvez ajouter une authentification basique avec Express :
   ```javascript
   const basicAuth = require('express-basic-auth');
   app.use(basicAuth({
       users: { 'admin': 'votre_mot_de_passe' },
       challenge: true,
       realm: 'Portail_Appli'
   }));
   ```
   Installez `express-basic-auth` :
   ```bash
   npm install express-basic-auth
   ```

---

## f389 **Félicitations !**
Votre application **Portail_Appli** est maintenant déployée sur votre réseau local avec :
- ✅ Un **proxy local** pour servir les fichiers statiques.
- ✅ Une **météo fonctionnelle** (si votre clé API OpenWeatherMap est valide).
- ✅ La possibilité de **contrôler vos robots aspirateurs** (si configurés).

---

## f4cc **Résumé des commandes utiles**
| Commande | Description |
|----------|-------------|
| `npm start` | Démarre le serveur proxy. |
| `npm install` | Installe les dépendances Node.js. |
| `pm2 start server.js --name "PortailAppli"` | Démarre le serveur avec PM2. |
| `pm2 list` | Affiche les processus PM2 en cours. |
| `pm2 stop PortailAppli` | Arrête le serveur PM2. |
| `pm2 restart PortailAppli` | Redémarre le serveur PM2. |

---

## f4de **Support**
Si vous rencontrez des problèmes :
1. Vérifiez les **logs du serveur** (dans le terminal où vous avez exécuté `npm start`).
2. Ouvrez la **console du navigateur** (F12) pour voir les erreurs.
3. Consultez la section **Dépannage** ci-dessus.

---

**Bon déploiement !** f680
Si vous avez des questions, n'hésitez pas à demander.
