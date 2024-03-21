from flask import Blueprint, request, Response
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
        
        if user:
            if user.password == hash_password(password):
                return "User successfully logged in"
            else:
                return "Password is wrong"
        else:
            return "User does not exist"
        
    print('Login working correctly')

@auth.route('/signup', methods=['GET', 'POST'])
def signup():
    user_data = request.json
    if request.method == 'POST':
        username = user_data.get('username')
        email = user_data.get('email')
        password = user_data.get('password')
        if user_validate_email(email) is not None and check_password_strength(password):
            hashed_password = hash_password(password)
            new_user = User(username=username, email=email, password=hashed_password)
            db.session.add(new_user)
            db.session.commit()
            print("Account was created successfully")
            return "Account created"
        else:
            return "ERROR creating account"
            

@auth.route('/logout', methods=['GET', 'POST'])
def logout():
    pass
