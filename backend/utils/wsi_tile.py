import os
import subprocess


def convert_wsi_to_dzi(svs_path, output_dir):
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
    dzi_path = output_dir

    # 定义命令和参数
    command = ["vips", "dzsave", svs_path, dzi_path, "--tile-size", "512", "--compression", "9", "--overlap", "2"]

    # 执行命令
    try:
        subprocess.run(command, check=True)
        print(f"Conversion successful. Output saved to {dzi_path}")
    except subprocess.CalledProcessError as e:
        print(f"An error occurred: {e}")
