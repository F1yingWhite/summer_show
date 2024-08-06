import os
import shutil

from blueprints.multimodal import multimodal
from blueprints.survival_prediction import survival_prediction
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from utils.wsi_tile import convert_wsi_to_dzi

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

app.register_blueprint(multimodal)
app.register_blueprint(survival_prediction)


@app.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory('static', filename)


@app.route('/api/wsi/upload', methods=['POST'])
def upload():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if file:
        if not os.path.exists('static/wsi'):
            os.makedirs('static/wsi')
        file_path = os.path.join('static/wsi', file.filename)
        file.save(file_path)
        if os.path.exists(f'static/dzi/{file.filename}'):
            shutil.rmtree(f'static/dzi/{file.filename}')
        convert_wsi_to_dzi(file_path, f'static/dzi/{file.filename}/image')
        return jsonify({'message': f'File uploaded successfully: {file.filename}'}), 200
    return jsonify({'error': 'File upload failed'}), 500


@app.route('/dicom/upload', methods=['POST'])
def upload_dicom():
    # 文件保存到static/dicom目录下
    f = request.files['file']
    # 如果文件已存在，则删除
    if os.path.exists(f'static/dicom/{f.filename}'):
        os.remove(f'static/dicom/{f.filename}')
    f.save(f'static/dicom/{f.filename}')
    return f.filename


if __name__ == "__main__":
    path = "./static/wsi"
    for root, dirs, files in os.walk(path):
        for file in files:
            convert_wsi_to_dzi(f'{path}/{file}', f'static/dzi/{file}/image')
    # app.run(port=9002, debug=True)
