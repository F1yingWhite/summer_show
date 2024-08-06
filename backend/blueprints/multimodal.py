import json
import os
import warnings

import pandas as pd
import torch
from flask import Blueprint, Response, request
from models import mutilmodel
from utils.mutilmodel.dataprepare import prepare_dicom, prepare_pathology

warnings.filterwarnings("ignore")

import models.mutilmodel.dsmil as mil
from models.mutilmodel.joint_model import JointModel
from models.mutilmodel.ResNet3d import ResNet, generate_model

# 创建 Blueprint
multimodal = Blueprint("multimodal", __name__, url_prefix="/api/multimodal")


# # 初始化模型
# device = torch.device(f"cuda" if torch.cuda.is_available() else "cpu")
# pathology_feat_size = 2048
# feature_path = "./checkpoints/joint_model/kmeans.pth"
# feature = torch.load(feature_path)
# feature = torch.tensor(feature).to(device).T.float()
# milnet, _, _, _ = mil.init_model(feat_size=2048)
# resnet_50 = generate_model(50)
# joint_model = JointModel(
#     milnet,
#     resnet_50,
#     pathology_size=2048,
#     dicom_size=2048,
#     dicom_model_extractor_grad=True,
# ).to(device)
# joint_model.load_state_dict(torch.load("./checkpoints/joint_model/joint_model.pth"))
# joint_model.eval()


# @multimodal.route("/predict", methods=["POST"])
# def predict():
#     data = request.json
#     dicom_path = data["dicom_path"]
#     pathology_path = data["pathology_path"]
#     dicom = prepare_dicom(dicom_path, "test").to(device)
#     pathology = prepare_pathology(pathology_path).to(device)
#     pathology_mask = torch.tensor([1] * pathology.size(0)).to(device)
#     with torch.no_grad():
#         output = joint_model(dicom, pathology, pathology_mask)
#     output = output.cpu().numpy()
#     return Response(json.dumps(output.tolist()), mimetype="application/json")


@multimodal.route("/wsi_lists", methods=["GET"])
def wsi_lists():
    """
    获取所有的WSI列表
    :return: WSI列表
    """
    wsi_list = pd.read_csv("./static/wsi_list.csv")
    wsi_list = wsi_list.to_dict(orient="records")
    wsi_files = os.listdir("./static/wsi")

    wsi_names = [item['wsi_name'] for item in wsi_list]

    for i in wsi_files:
        if i not in wsi_names:
            # wsi_name,label
            wsi_list.append({"wsi_name": i, "label": "unknow"})

    return Response(json.dumps(wsi_list), mimetype="application/json")
