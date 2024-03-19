from flask import Blueprint, request
from emailvalidator import user_validate_email
from password_hash_algorithm import check_password_strength

auth = Blueprint('auth', __name__)

@auth.route('/login', methods=['GET', 'POST'])
def login():
    data = request.form

@auth.route('/signup', methods=['GET', 'POST'])
def signup():
    user_data = request.form
    if request.method == 'POST':
        username = user_data.get('username')
        email = user_data.get('email')
        password = user_data.get('password')
        if user_validate_email(password) is not None and check_password_strength(password):
            print('Ready for sign up')
        else:
            print('check user email or password strength')
            

@auth.route('/logout', methods=['GET', 'POST'])
def logout():
    pass
