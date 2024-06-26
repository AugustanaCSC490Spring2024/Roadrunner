from flask import Flask
from .bigrammodel import BigramLanguageModel
import torch

device = 'cuda' if torch.cuda.is_available() else 'cpu'

model = BigramLanguageModel()
m = model.to(device)


def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'jeinfuernicneri2o3@'
    from .routes.train import train
    app.register_blueprint(train, url_prefix='/t/')
    return app

