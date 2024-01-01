from flask import Flask, jsonify, send_from_directory
import os
import json

app = Flask(__name__)

root_folder = 'file'

@app.route('/file/<path:path>', methods=['GET'])
def get_file(path):
    file_path = os.path.join(root_folder, path)

    if os.path.exists(file_path):
        return send_from_directory(root_folder, path)
    else:
        return jsonify({"error": "File not found"}), 404

if __name__ == '__main__':
    app.run(host='172.27.107.215', port=5000, debug=True)