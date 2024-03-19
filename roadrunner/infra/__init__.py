from flask import Flask


def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'fjiderj@'
    
    from .routes.auth import auth
    from .routes.llm import llm
    
    app.register_blueprint(auth, url_prefix='/auth')
    app.register_blueprint(llm, url_prefix='/llm')
    
    return app
