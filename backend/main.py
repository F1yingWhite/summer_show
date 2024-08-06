import os

from blueprints.multimodal import multimodal
from blueprints.survival_prediction import survival_prediction
from flask import Flask, request, send_from_directory
from flask_cors import CORS
from utils.wsi_tile import convert_wsi_to_dzi

app = Flask(__name__)
CORS(app)

app.register_blueprint(multimodal)
app.register_blueprint(survival_prediction)


@app.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory('static', filename)


# 上传文件
@app.route('/wsi/upload', methods=['POST'])
def upload():
    # 文件保存到static/wsi目录下
    f = request.files['file']
    # 如果文件已存在，则删除
    if os.path.exists(f'static/wsi/{f.filename}'):
        os.remove(f'static/wsi/{f.filename}')
    f.save(f'static/wsi/{f.filename}')
    convert_wsi_to_dzi(f'static/wsi/{f.filename}', f'./static/dzi/{f.filename}/image')
    return f.filename


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
    # path = "./static/wsi"
    # for root, dirs, files in os.walk(path):
    #     for file in files:
    #         convert_wsi_to_dzi(f'{path}/{file}', f'static/dzi/{file}/image')
    app.run(port=9002, debug=True)
