from flask import Flask
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
DB_NAME = "database.db"

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'fjiderj@'
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{DB_NAME}'
    db.init_app(app)
    
    from .routes.auth import auth
    from .routes.llm import llm
    
    app.register_blueprint(auth, url_prefix='/auth')
    app.register_blueprint(llm, url_prefix='/llm')
    
    return app

if __name__ =='__main__':
    app = create_app()
    app.run(debug=True)