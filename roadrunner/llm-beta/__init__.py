from flask import Flask
from .bigrammodel import BigramLanguageModel
import torch

device = 'cuda' if torch.cuda.is_available() else 'cpu'

model = BigramLanguageModel()
m = model.to(device)


def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'fjiderj@'
    return app

if __name__ =='__main__':
    app = create_app()
    app.run(debug=True)