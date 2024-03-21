from email_validator import validate_email, EmailNotValidError

def user_validate_email(email):
    try:
        email_info = validate_email(email)
        print(email_info)
        email = email_info.normalized
        
        return email
    except EmailNotValidError as e:
        print(str(e))
        return None