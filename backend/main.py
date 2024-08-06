# from flask import Flask

# from blueprints.multimodal import multimodal
# from blueprints.survival_prediction import survival_prediction
# from utils.wsi_tile import wsi2tile

# app = Flask(__name__)

# app.register_blueprint(multimodal)
# app.register_blueprint(survival_prediction)

# if __name__ == "__main__":
#     app.run(port=9002)

import os
import subprocess

import openslide
import pyvips
from flask import Flask, send_from_directory
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app, resources={r"/static/*": {"origins": "*"}})


def convert_svs_to_dzi(svs_path, output_dir):
    """
    将 .svs 文件转换为 .dzi 文件，并保存到指定的输出目录中。

    :param svs_path: 输入 .svs 文件的路径
    :param output_dir: 输出目录路径
    """
    # 确保输出目录存在
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    # 生成输出文件名
    base_name = os.path.basename(svs_path)
    name, _ = os.path.splitext(base_name)
    dzi_path = os.path.join(output_dir, f"{name}.dzi")

    # 定义命令和参数
    command = ["vips", "dzsave", svs_path, dzi_path, "--tile-size", "512", "--compression", "9", "--overlap", "2"]

    # 执行命令
    try:
        subprocess.run(command, check=True)
        print(f"Conversion successful. Output saved to {dzi_path}")
    except subprocess.CalledProcessError as e:
        print(f"An error occurred: {e}")


@app.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory('static', filename)


if __name__ == '__main__':
    # Define paths
    svs_file_path = './C3L-00503-21.svs'
    dzi_file_path = 'static/image'

    # Create the static folder if it doesn't exist
    static_folder = 'static'
    if not os.path.exists(static_folder):
        os.makedirs(static_folder)

    # # Convert SVS to DZI and store in the static folder
    # levels = convert_svs_to_dzi(svs_file_path, dzi_file_path)

    app.run(debug=True, port=8888)
