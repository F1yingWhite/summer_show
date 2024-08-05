from flask import Flask

from blueprints.multimodal import multimodal
from blueprints.survival_prediction import survival_prediction

app = Flask(__name__)

app.register_blueprint(multimodal)
app.register_blueprint(survival_prediction)

if __name__ == "__main__":
    app.run(port=9002)
