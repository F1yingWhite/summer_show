import json
import os
import warnings

import numpy as np
import pandas as pd
import torch
from flask import Blueprint, Response, request

from utils.mutilmodel.dataprepare import prepare_dicom, prepare_pathology
from utils.wsi_tile import convert_wsi_to_dzi

warnings.filterwarnings("ignore")
import models.mutilmodel.dsmil as mil
from middleware.no_grad import no_grad
from models.mutilmodel.joint_model import JointModel
from models.mutilmodel.ResNet3d import ResNet, generate_model
from models.mutilmodel.resnet_simclr import ViTSimCLR

# 创建 Blueprint
multimodal = Blueprint("multimodal", __name__, url_prefix="/api/multimodal")


# 初始化模型
device = torch.device(f"cuda" if torch.cuda.is_available() else "cpu")
pathology_feat_size = 2048
feature_path = "./checkpoints/joint_model/kmeans_center2.pt"
feature = torch.load(feature_path)
feature = torch.tensor(feature).to(device).T.float()
print(feature.shape)
milnet, _, _, _ = mil.init_model(feat_size=pathology_feat_size, device=device)
milnet2, _, _, _ = mil.init_model(feat_size=4096, num_class=2, device=device)
resnet_50 = generate_model(50)
joint_model = JointModel(
    milnet2,
    resnet_50,
).to(device)
joint_model.load_state_dict(torch.load("./checkpoints/joint_model/joint_model.pth", map_location=device))
joint_model.eval()
milnet.load_state_dict(torch.load("./checkpoints/joint_model/milnet.pth", map_location=device))
milnet = milnet.to(device)
milnet.eval()
resnet_50.load_state_dict(torch.load("./checkpoints/joint_model/resnet503d.pth"))
resnet_50 = resnet_50.to(device)
resnet_50.eval()


@multimodal.route("/predict_mutil", methods=["POST"])
@no_grad
def predict_mutil():
    data = request.json
    print(data)
    if "nii_name" not in data and "wsi_name" not in data:
        return Response("error", mimetype="application/json")
    if data["wsi_name"] != '-':
        wsi_name = data["wsi_name"]
        if data['nii_name'] == '-':
            # 把请求导向/api/multimodal/predict_wsi
            df = pd.read_csv(f"./static/target_slides/{wsi_name[:-4]}.csv")
            tree_feats = df.values
            with torch.no_grad():
                classes, prediction_bag, A, B = milnet(torch.tensor(tree_feats).to(device).float())
            prediction_bag = torch.sigmoid(prediction_bag).cpu().numpy().reshape(-1)
            print(prediction_bag)
            if prediction_bag < 0.4402223527431488:
                output = "LSCC"
            else:
                output = "LUAD"
            return Response(output, mimetype="application/json")
        else:
            mask = torch.tensor((True), dtype=torch.bool).to(device).unsqueeze(0)
            dicom_data = prepare_dicom(f"./static/nii/{data['nii_name']}", "test").to(device)
            pathology_path = f"./static/target_slides_resnet/{data['wsi_name'][:-4]}.csv"
            df = pd.read_csv(pathology_path)
            pathology_feature = torch.tensor(df.values).to(device).float().unsqueeze(0)
            output = joint_model(dicom_data, pathology_feature, mask)
            output = torch.sigmoid(output).cpu().numpy().reshape(-1)
            if output[1] >= 0.9404373168945312:
                output = "LUAD"
            else:
                output = "LSCC"
            return Response(output, mimetype="application/json")
    else:
        pathology_feature = torch.zeros(1, 20, 4096).to(device)
        dicom_data = prepare_dicom(f"./static/nii/{data['nii_name']}", "test").to(device)
        mask = torch.tensor((False), dtype=torch.bool).to(device).unsqueeze(0)
        output = joint_model(dicom_data, pathology_feature, mask, feature)
        output = torch.sigmoid(output).cpu().numpy().reshape(-1)
        if output[1] >= 0.9404373168945312:
            output = "LUAD"
        else:
            output = "LSCC"
        return Response(output, mimetype="application/json")


@multimodal.route("/predict_wsi", methods=["POST"])
@no_grad
def predict_wsi():
    """
    预测WSI的标签
    :return: 预测结果
    """
    Tensor = torch.FloatTensor
    data = request.json
    wsi_name = data["wsi_name"]
    # wsi_path = f"./static/wsi/{wsi_name}"
    # patch_extraction(wsi_path)
    # pyramid_path = f"./static/wsi/pyramid/wsi/{wsi_name}"[:-4]
    # i_classifier_h = ViTSimCLR("vit_l_16", 256)
    # i_classifier_h = torch.nn.DataParallel(i_classifier_h, device_ids=[0, 2]).to(device)
    # i_classifier_h.load_state_dict(torch.load("./checkpoints/embedder-high.pth"))
    # i_classifier_h.eval()

    # i_classifier_l = ViTSimCLR("vit_l_16", 256)
    # i_classifier_l = torch.nn.DataParallel(i_classifier_l, device_ids=[0, 2]).to(device)
    # i_classifier_l.load_state_dict(torch.load("./checkpoints/embedder-low.pth", map_location=device))
    # i_classifier_l.eval()

    # # 计算特征
    # tree_feats = []
    # high_path = glob.glob(os.path.join(pyramid_path, "*.jpeg"))
    # with torch.no_grad():
    #     for path in high_path:
    #         img = Image.open(path).convert("RGB")
    #         high_feats, _ = i_classifier_h(torch.tensor(np.array(img)).permute(2, 0, 1).unsqueeze(0).float().to(device))
    #         high_feats = high_feats.cpu().numpy().reshape(-1)
    #         low_feats_list = []
    #         low_path = glob.glob(os.path.join(path[:-5], "*.jpeg"))
    #         for low in low_path:
    #             img = Image.open(low).convert("RGB")
    #             low_feats, _ = i_classifier_l(torch.tensor(np.array(img)).permute(2, 0, 1).unsqueeze(0).float().to(device))
    #             low_feats = low_feats.cpu().numpy().reshape(-1)
    #             low_feats_list.append(low_feats)
    #         for i in range(len(low_feats_list)):
    #             tree_feats.append(np.concatenate([low_feats_list[i], high_feats]))
    # tree_feats = np.array(tree_feats)
    df = pd.read_csv(f"./static/target_slides/{wsi_name[:-4]}.csv")
    tree_feats = df.values
    with torch.no_grad():
        classes, prediction_bag, A, B = milnet(torch.tensor(tree_feats).to(device).float())
    prediction_bag = torch.sigmoid(prediction_bag).cpu().numpy().reshape(-1)
    print(prediction_bag)
    if prediction_bag < 0.4402223527431488:
        output = "LSCC"
    else:
        output = "LUAD"
    # shutil.rmtree("./static/wsi/pyramid")
    return Response(output, mimetype="application/json")


@multimodal.route("/predict_nii", methods=["POST"])
@no_grad
def predict_nii():
    """
    预测DICOM的标签
    :return: 预测结果
    """
    data = request.json
    nii_name = data["nii_name"]
    nii_path = f"./static/nii/{nii_name}"
    dicom = prepare_dicom(nii_path, "test").to(device)
    with torch.no_grad():
        output = resnet_50(dicom)
    output = output.cpu().numpy().reshape(-1)
    if output[0] < output[1]:
        output = "LUAD"
    else:
        output = "LSCC"
    return Response(json.dumps(output), mimetype="application/json")


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


@multimodal.route("/nii_lists", methods=["GET"])
def nii_lists():
    """
    获取所有的NII列表
    :return: NII列表
    """
    nii_files = os.listdir("./static/nii")
    return Response(json.dumps(nii_files), mimetype="application/json")


@multimodal.route("/multilmodel_lists", methods=["GET"])
def multilmodel_lists():
    """
    获取所有的配对以及不配对的数据
    """
    csv_path = "./static/pair_list.csv"
    df = pd.read_csv(csv_path)
    df = df.to_dict(orient="records")
    # 读取所有的nii文件,如果nii_name没有出现过,说明没有对应的wsi_name
    nii_files = os.listdir("./static/nii")
    wsi_files = os.listdir("./static/wsi")
    for i in nii_files:
        if i not in [item["nii_name"] for item in df]:
            df.append({"nii_name": i, "wsi_name": "-"})
    for i in wsi_files:
        if i not in [item["wsi_name"] for item in df]:
            df.append({"nii_name": "-", "wsi_name": i})
    return Response(json.dumps(df), mimetype="application/json")


@multimodal.route("/upload_pair", methods=["POST"])
def upload_pair():
    """
    上传配对数据
    :return:
    """
    file = request.files["file"]
    pair_name = request.form["pair_name"]
    if file.filename.endswith(".nii") and pair_name.endswith(".svs"):
        file.save(f"./static/nii/{file.filename}")
        df = pd.read_csv("./static/pair_list.csv")
        new_row = pd.DataFrame({"nii_name": [file.filename], "wsi_name": [pair_name]})
        df = pd.concat([df, new_row], ignore_index=True)
        df.to_csv("./static/pair_list.csv", index=False)
        return Response("success", mimetype="application/json")
    elif file.filename.endswith(".svs") and pair_name.endswith(".nii"):
        file.save(f"./static/wsi/{file.filename}")
        convert_wsi_to_dzi(f"./static/wsi/{file.filename}", f"./static/dzi/{file.filename}/image")
        df = pd.read_csv("./static/pair_list.csv")
        new_row = pd.DataFrame({"nii_name": [pair_name], "wsi_name": [file.filename]})
        df = pd.concat([df, new_row], ignore_index=True)
        df.to_csv("./static/pair_list.csv", index=False)
        return Response("success", mimetype="application/json")
    else:
        return Response("error", mimetype="application/json")
