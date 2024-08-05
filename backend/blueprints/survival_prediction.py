import json

from flask import Blueprint, Response, request

# 创建 Blueprint
survival_prediction = Blueprint("survival_prediction", __name__, url_prefix="/api/survival_prediction")
