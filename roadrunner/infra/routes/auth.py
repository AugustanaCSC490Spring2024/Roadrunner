from flask import Blueprint, request, Response
from ..utils.emailvalidator import user_validate_email
from ..utils.password_hash_algorithm import check_password_strength
from ..schema.user import User
from .. import db

auth = Blueprint('auth', __name__)

@auth.route('/login', methods=['GET', 'POST'])
def login():
    # data = request.form
    print('Login working correctly')

@auth.route('/signup', methods=['GET', 'POST'])
def signup():
    user_data = request.form
    if request.method == 'POST':
        username = user_data.get('username')
        email = user_data.get('email')
        password = user_data.get('password')
        if check_password_strength(password):
            new_user = User(username=username, email=email, password=password)
            db.session.add(new_user)
            db.session.commit()
            print("Account was created successfully")
            return "Account created"
        else:
            return "ERROR creating account"
            

@auth.route('/logout', methods=['GET', 'POST'])
def logout():
    pass
