import io
import os
import shutil

import numpy as np
import SimpleITK as sitk
from flask import Flask, abort, jsonify, request, send_file, send_from_directory
from flask_cors import CORS
from PIL import Image

from blueprints.multimodal import multimodal
from blueprints.survival_prediction import survival_prediction
from utils.wsi_tile import convert_wsi_to_dzi

app = Flask(__name__)
CORS(app)

app.register_blueprint(multimodal)
app.register_blueprint(survival_prediction)


@app.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory('static', filename)


@app.route('/api/nii/<path:niiname>/<int:index>', methods=['GET'])
def serve_nii(niiname, index):
    try:
        # 读取 Nii.gz 文件
        img = sitk.ReadImage(f"./static/nii/{niiname}")
        img_list = sitk.GetArrayFromImage(img)

        # 检查索引是否在有效范围内
        if index < 0 or index >= img_list.shape[0]:
            abort(404, description="Index out of range")

        # 获取指定的切片
        target_image = img_list[index]

        # 将切片转换为图像
        target_image = ((target_image - np.min(target_image)) / (np.max(target_image) - np.min(target_image)) * 255).astype(np.uint8)
        pil_img = Image.fromarray(target_image)

        # 保存图像到 BytesIO
        img_io = io.BytesIO()
        pil_img.save(img_io, 'JPEG')
        img_io.seek(0)

        # 返回图像
        return send_file(img_io, mimetype='image/jpeg')

    except Exception as e:
        print(f"Error: {e}")
        abort(500, description="Internal Server Error")


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


@app.route('/api/nii/upload', methods=['POST'])
def upload_dicom():
    # 文件保存到static/dicom目录下
    f = request.files['file']
    # 如果文件已存在，则删除
    if os.path.exists(f'static/dicom/{f.filename}'):
        os.remove(f'static/dicom/{f.filename}')
    f.save(f'static/nii/{f.filename}')
    return f.filename


if __name__ == "__main__":
    # path = "./static/wsi"
    # for root, dirs, files in os.walk(path):
    #     for file in files:
    #         if file.endswith(".svs"):
    #             convert_wsi_to_dzi(os.path.join(path, file), os.path.join("./static/dzi", file, "image"))
    app.run(host='0.0.0.0', port=10023)
