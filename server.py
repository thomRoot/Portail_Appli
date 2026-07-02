from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import json

app = Flask(__name__)
CORS(app, supports_credentials=True)

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
