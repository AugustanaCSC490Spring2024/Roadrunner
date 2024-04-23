from flask import Flask
from .bigrammodel import BigramLanguageModel
import torch
from .train import Train

device = 'cuda' if torch.cuda.is_available() else 'cpu'

model = BigramLanguageModel()
m = model.to(device)


def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'jeinfuernicneri2o3@'
    from .routes.train import train
    app.register_blueprint(train, url_prefix='/t/')
    _start_pretraining()
    return app

def _start_pretraining():
    pretraining = Train("biglam/gutenberg-poetry-corpus", 20000)
    pretraining.train_model(m)