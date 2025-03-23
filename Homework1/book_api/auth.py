import jwt
import datetime

# Cheie secretă pentru semnarea token-ului (păstreaz-o ascunsă!)
SECRET_KEY = "your_super_secret_key"

# Utilizatori fictivi (în loc de bază de date)
USERS = {
    "admin": "password123",
    "user": "userpass"
}

def generate_token(username):
    """
    Generează un token JWT valid pentru 1 oră.
    """
    payload = {
        "username": username,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
    return token

def verify_token(token):
    """
    Verifică validitatea token-ului JWT.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload["username"]
    except jwt.ExpiredSignatureError:
        return None  # Token expirat
    except jwt.InvalidTokenError:
        return None  # Token invalid
