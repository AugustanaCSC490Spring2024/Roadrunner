from flask import Blueprint, request, jsonify
from ..utils.emailvalidator import user_validate_email
from ..utils.password_hash_algorithm import check_password_strength, hash_password
from ..schema.user import User
from .. import db

auth = Blueprint('auth', __name__)

@auth.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        data = request.json
        email = data.get('email')
        password = data.get('password')
        user = User.query.filter_by(email=email).first()
        response = {"username": None, "email": None}
        
        if user:
            if user.password == hash_password(password):
                response["username"] = user.username
                response["email"] = user.email
                return jsonify(response), 200
            else:
                res = {"error": "Password is wrong"}
                return jsonify(res), 400
        else:
            res = {"error": "User does not exist"}
            return jsonify(res), 400

@auth.route('/signup', methods=['GET', 'POST'])
def signup():
    user_data = request.json
    if request.method == 'POST':
        username = user_data.get('username')
        email = user_data.get('email')
        password = user_data.get('password')
        response = {"username": None, "email": None}
        user = User.query.filter_by(email=email).first()
        if user:
            res = {"error": "User already exists!"}
            return jsonify(res), 400
        if user_validate_email(email) is not None and check_password_strength(password):
            hashed_password = hash_password(password)
            new_user = User(username=username, email=email, password=hashed_password)
            db.session.add(new_user)
            db.session.commit()
            response["username"] = new_user.username
            response["email"] = new_user.email
            return jsonify(response), 200
        else:
            res = {"error": "Error creating an account"}
            return jsonify(res), 400
            

@auth.route('/logout', methods=['GET', 'POST'])
def logout():
    pass
