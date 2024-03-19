from flask import Blueprint, request

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
             

@auth.route('/logout', methods=['GET', 'POST'])
def logout():
    pass
