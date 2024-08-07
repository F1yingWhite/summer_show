import os

import numpy as np
import torch
import torch.nn

import models.mutilmodel.dsmil as mil
from models.mutilmodel.ResNet3d import ResNet, generate_model


class JointModel(torch.nn.Module):
    def __init__(
        self,
        pathology_model: mil.MILNet,
        dicom_model: ResNet,
        pathology_model_extractor_grad=False,
        dicom_model_extractor_grad=False,
    ):
        super(JointModel, self).__init__()
        self.pathology_model = pathology_model
        self.dicom_model = dicom_model
        self.fc1 = torch.nn.Linear(4096, 2048)  # 统一构建为4096维度的向量
        self.relu = torch.nn.ReLU()
        self.dropout = torch.nn.Dropout()
        self.fc2 = torch.nn.Linear(2048, 2)
        # 对bag_embedding进行重构后再拼接在一起
        self.pre_fc = torch.nn.Sequential(
            torch.nn.Conv1d(2, 2, kernel_size=4, stride=4),
            torch.nn.ReLU(),
            torch.nn.Flatten(),
        )  # 1 x 2 x 4096 -> 1 x 2 x 1024 -> 1 x 2048

        self.after_fc = torch.nn.Sequential(
            torch.nn.Linear(8192, 2048),
            torch.nn.ReLU(),
            torch.nn.Linear(2048, 2048),
            torch.nn.ReLU(),
        )

        self.reconstruction = torch.nn.Sequential(
            torch.nn.Linear(2048, 512),
            torch.nn.ReLU(),
            torch.nn.Linear(512, 20),
        )

        if not pathology_model_extractor_grad:  # 不训练病理特征提取器
            for p in self.pathology_model.parameters():
                p.requires_grad_(False)

        if not dicom_model_extractor_grad:  # 不训练CT特征提取器
            for p in self.dicom_model.parameters():
                p.requires_grad_(False)

    def forward(self, dicom, pathology, pathology_mask, pathology_mean=None):
        dicom_features = self.dicom_model(dicom, mode="two")
        pathology_features = torch.zeros(dicom_features.size(0), 2048).to(dicom.device)

        # 直接计算有病理特征的那些样本
        for i in range(pathology_mask.size(0)):
            if pathology_mask[i].any():
                _, _, _, B = self.pathology_model(pathology[i])
                pathology_features[i] = self.pre_fc(B)
        # 处理缺失的病理数据，使用重建网络
        if not pathology_mask.all():
            non_mask_indices = (~pathology_mask).nonzero(as_tuple=True)[0]
            reconstructed_features = self.reconstruct_pathology_features(dicom_features[non_mask_indices], pathology_mean)
            pathology_features[non_mask_indices] = reconstructed_features

        combined_features = torch.cat([pathology_features, dicom_features], dim=1)
        x = self.fc1(combined_features)
        x = self.relu(x)
        x = self.dropout(x)
        x = x + dicom_features
        x = self.fc2(x)
        return x

    def reconstruct_pathology_features(self, dicom_features, pathology_mean):
        pathology_mean = pathology_mean.expand(dicom_features.shape[0], -1, -1).to("cuda")  # batchsize, 2048, 2
        weight = self.reconstruction(dicom_features).unsqueeze(-1)
        pathology_feature = pathology_mean @ weight

        for i in range(pathology_feature.shape[0]):
            pathology_feature[i] = pathology_feature[i].clone() / weight.sum(1)[i]

        pathology_feature = pathology_feature.view(pathology_feature.shape[0], -1)
        pathology_feature = self.after_fc(pathology_feature)
        return pathology_feature
