from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from os import path

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'fjiderj@'
    return app

if __name__ =='__main__':
    app = create_app()
    app.run(debug=True)