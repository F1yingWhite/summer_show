import json

import torch
from flask import Blueprint, Response, request

from middleware.no_grad import no_grad

# 创建 Blueprint
survival_prediction = Blueprint("survival_prediction", __name__, url_prefix="/api/survival_prediction")

device = torch.device(f"cuda" if torch.cuda.is_available() else "cpu")
