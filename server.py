from flask import Flask, request, jsonify, send_from_directory, redirect, session
from flask_cors import CORS
from flask_session import Session
import os
import json
import requests
from datetime import datetime, timedelta
from dotenv import load_dotenv

# Charger les variables d'environnement
load_dotenv()

app = Flask(__name__)
CORS(app, supports_credentials=True)

# Configuration de la session
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'votre_cle_secrete_ici')
app.config['SESSION_TYPE'] = 'filesystem'
Session(app)

# Configuration OAuth2 Garmin
GARMIN_CLIENT_ID = os.getenv('GARMIN_CLIENT_ID')
GARMIN_CLIENT_SECRET = os.getenv('GARMIN_CLIENT_SECRET')
GARMIN_AUTH_URL = "https://connectapi.garmin.com/oauth-service/oauth/authorize"
GARMIN_TOKEN_URL = "https://connectapi.garmin.com/oauth-service/token"
GARMIN_API_BASE = "https://connectapi.garmin.com"

# Chemin vers le dossier des fichiers statiques
STATIC_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'public')


# Servir les fichiers statiques (HTML, CSS, JS)
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_static(path):
    if path != "" and os.path.exists(os.path.join(STATIC_FOLDER, path)):
        return send_from_directory(STATIC_FOLDER, path)
    else:
        return send_from_directory(STATIC_FOLDER, 'index.html')


# Route pour initier l'authentification OAuth2
@app.route('/api/garmin/auth')
def garmin_auth():
    # Générer un état aléatoire pour la sécurité
    state = os.urandom(16).hex()
    session['oauth_state'] = state

    # URL de redirection vers Garmin
    auth_url = (
        f"{GARMIN_AUTH_URL}?client_id={GARMIN_CLIENT_ID}"
        f"&redirect_uri=http://localhost:8000/api/garmin/callback"
        f"&response_type=code"
        f"&scope=activity:read"
        f"&state={state}"
    )
    return redirect(auth_url)


# Route de callback pour récupérer le token
@app.route('/api/garmin/callback')
def garmin_callback():
    code = request.args.get('code')
    state = request.args.get('state')
    error = request.args.get('error')

    if error:
        return jsonify({"error": f"Erreur OAuth2: {error}"}), 400

    if state != session.get('oauth_state'):
        return jsonify({"error": "Invalid state"}), 403

    if not code:
        return jsonify({"error": "No authorization code received"}), 400

    # Échanger le code contre un token
    token_data = {
        'client_id': GARMIN_CLIENT_ID,
        'client_secret': GARMIN_CLIENT_SECRET,
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': 'http://localhost:8000/api/garmin/callback'
    }

    response = requests.post(GARMIN_TOKEN_URL, data=token_data)
    if response.status_code != 200:
        return jsonify({"error": f"Failed to fetch token: {response.text}"}), 500

    token_info = response.json()
    access_token = token_info.get('access_token')
    refresh_token = token_info.get('refresh_token')

    # Stocker le token en session
    session['garmin_access_token'] = access_token
    session['garmin_refresh_token'] = refresh_token

    # Rediriger vers la page principale avec un paramètre de succès
    return redirect('/?garmin_auth=success')


# Route pour récupérer les activités (avec token)
@app.route('/api/garmin/activities', methods=['GET'])
def get_garmin_activities():
    access_token = session.get('garmin_access_token')
    if not access_token:
        return jsonify({"error": "Non autorisé. Veuillez vous authentifier via /api/garmin/auth"}), 401

    try:
        # Récupérer les activités via l'API Garmin
        headers = {
            'Authorization': f'Bearer {access_token}',
            'Content-Type': 'application/json'
        }

        # Exemple : Récupérer les activités récentes
        activities_url = f"{GARMIN_API_BASE}/wellness-service/wellness/dailySummaryChart/activity"
        response = requests.get(activities_url, headers=headers)

        if response.status_code != 200:
            return jsonify({"error": f"Erreur API Garmin: {response.text}"}), response.status_code

        activities = response.json()
        return jsonify({"success": True, "activities": activities})

    except Exception as e:
        return jsonify({"error": f"Erreur inattendue: {str(e)}"}), 500


# Route pour servir les données météo (à adapter selon votre API)
@app.route('/api/weather', methods=['GET'])
def get_weather():
    return jsonify({
        "message": "Route pour la météo à implémenter avec votre API OpenWeatherMap."
    })


# Route pour gérer les sites (à adapter selon votre logique)
@app.route('/api/sites', methods=['GET', 'POST', 'DELETE'])
def manage_sites():
    if request.method == 'GET':
        try:
            with open(os.path.join(STATIC_FOLDER, 'sites.json'), 'r') as f:
                sites = json.load(f)
            return jsonify(sites)
        except FileNotFoundError:
            return jsonify([])
    
    elif request.method == 'POST':
        data = request.json
        try:
            with open(os.path.join(STATIC_FOLDER, 'sites.json'), 'r+') as f:
                sites = json.load(f)
                sites.append(data)
                f.seek(0)
                json.dump(sites, f, indent=4)
            return jsonify({"success": True, "site": data})
        except FileNotFoundError:
            with open(os.path.join(STATIC_FOLDER, 'sites.json'), 'w') as f:
                json.dump([data], f, indent=4)
            return jsonify({"success": True, "site": data})
    
    elif request.method == 'DELETE':
        site_id = request.json.get('id')
        try:
            with open(os.path.join(STATIC_FOLDER, 'sites.json'), 'r+') as f:
                sites = json.load(f)
                sites = [site for site in sites if site.get('id') != site_id]
                f.seek(0)
                f.truncate()
                json.dump(sites, f, indent=4)
            return jsonify({"success": True})
        except FileNotFoundError:
            return jsonify({"error": "Fichier sites.json introuvable"}), 404


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
