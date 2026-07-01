from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import garminexport
import os
import json
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)  # Autoriser les requêtes CORS

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


# Route pour récupérer les activités Garmin
@app.route('/api/garmin/activities', methods=['POST'])
def get_garmin_activities():
    try:
        data = request.json
        if not data:
            return jsonify({"error": "Aucune donnée reçue"}), 400

        email = data.get('email')
        password = data.get('password')
        days = data.get('days', 365)  # Par défaut, récupérer 1 an

        if not email or not password:
            return jsonify({"error": "Email et mot de passe requis"}), 400

        try:
            # Se connecter avec garminexport (nouvelle API : connect())
            garminexport.connect(email=email, password=password)
        except Exception as auth_error:
            return jsonify({"error": f"Erreur d'authentification Garmin: {str(auth_error)}"}), 401

        try:
            # Calculer la date de début au format AAAA-MM-JJ
            start_date = (datetime.now() - timedelta(days=days)).strftime('%Y-%m-%d')
            activities = garminexport.get_activities(start_date) or []
        except Exception as activities_error:
            return jsonify({"error": f"Erreur lors de la récupération des activités: {str(activities_error)}"}), 500

        # Filtrer pour la musculation (type_id = 2)
        strength_activities = [
            activity for activity in activities
            if activity.get("type_id") == 2
        ]

        return jsonify({
            "success": True,
            "activities": strength_activities
        })

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
        # Récupérer les sites (exemple : depuis un fichier JSON)
        try:
            with open(os.path.join(STATIC_FOLDER, 'sites.json'), 'r') as f:
                sites = json.load(f)
            return jsonify(sites)
        except FileNotFoundError:
            return jsonify([])
    
    elif request.method == 'POST':
        # Ajouter un site
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
        # Supprimer un site
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
