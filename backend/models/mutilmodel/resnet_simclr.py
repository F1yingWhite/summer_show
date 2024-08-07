import os

import timm
import torch
import torch.nn as nn
import torch.nn.functional as F
from torchvision import models


class ViTSimCLR(nn.Module):
    def __init__(self, base_model, out_dim):
        super(ViTSimCLR, self).__init__()
        model = timm.create_model(
            "vit_large_patch16_224",
            img_size=224,
            patch_size=16,
            init_values=1e-5,
            num_classes=0,
            dynamic_img_size=True,
        )
        self.model_dict = {
            "vit_l_16": model,
        }

        model = self._get_basemodel(base_model)

        if "resnet" in base_model:
            num_ftrs = model.fc.in_features
            self.features = nn.Sequential(*list(model.children())[:-1])
        elif "vit_b_16" in base_model:
            num_ftrs = model.heads.head.in_features
            self.features = model
            self.features.heads = nn.Identity()  # Remove the classification head
        elif "vit_l_16" in base_model:
            num_ftrs = 1024
            self.features = model

        # projection MLP
        self.l1 = nn.Linear(num_ftrs, num_ftrs)
        self.l2 = nn.Linear(num_ftrs, out_dim)

    def _get_basemodel(self, model_name):
        try:
            model = self.model_dict[model_name]
            print("Feature extractor:", model_name)
            return model
        except KeyError:
            raise ValueError("Invalid model name. Check the config file and pass one of: resnet18, resnet50, vit_b_16, vit_b_32, vit_l_16, or vit_l_32")

    def forward(self, x):
        h = self.features(x)
        if isinstance(h, torch.Tensor):
            h = h.squeeze()  # Ensure the shape is [batch_size, num_features] for both ResNet and ViT

        x = self.l1(h)
        x = F.relu(x)
        x = self.l2(x)
        return h, x
