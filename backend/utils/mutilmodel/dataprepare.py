import warnings

import numpy as np
import SimpleITK as sitk
import torch
from monai.transforms import Compose, RandRotate

# 禁用所有警告
warnings.filterwarnings("ignore")


def prepare_dicom(dicom_path, mode):
    def normalize(img):
        max_val = np.max(img)
        min_val = np.min(img)
        img_1 = (img - min_val) / (max_val - min_val)
        return img_1

    img = sitk.ReadImage(dicom_path)
    img_list = sitk.GetArrayFromImage(img)
    img_list = np.array(img_list)
    if img_list.shape[-1] == 3:
        img_list = np.mean(img_list, axis=-1)
    img_list = normalize(img_list)
    if mode == "train":
        transforms = Compose(
            [
                RandRotate(
                    range_x=(-15, 15),
                    prob=0.5,
                    keep_size=True,
                    padding_mode="reflection",
                ),  # 随机旋转-15~15度
            ]
        )
        normalized_tensor = transforms(img_list).float()
    else:
        normalized_tensor = img_list
    img_list = np.array(normalized_tensor)[np.newaxis, ...]  # .transpose(1, 0, 2, 3)
    normalized_tensor = torch.from_numpy(img_list).float().unsqueeze(0)
    return normalized_tensor


def prepare_pathology(pathology_path):
    stacked_data = torch.load(pathology_path)
    stacked_data = torch.tensor(stacked_data.values, dtype=torch.float32)
    # Create the tensor correctly by cloning and detaching
    bag_feats = stacked_data.clone().detach().float()
    bag_feats = bag_feats.view(-1, 2048)
    return bag_feats
