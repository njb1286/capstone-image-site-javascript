import secrets
import base64
from db import get_db
from datetime import datetime

def generate_token():
  random_bytes = secrets.token_bytes(64)
  token = base64.b64encode(random_bytes).decode("utf-8")

  db = get_db()

  cursor = db.cursor()
  cursor.execute("INSERT INTO tokens (token) VALUES (?)", (token,))
  db.commit()

  cursor.close()

  return token

def days_from(date: str):
  return (datetime.now() - datetime.fromisoformat(date)).days

def date_is_valid(date: str):
  return days_from(date) >= 10

def generate_password():
  random_bytes = secrets.token_bytes(16)
  password = base64.b64encode(random_bytes).decode("utf-8")

  db = get_db()

  cursor = db.cursor()
  cursor.execute("INSERT INTO tempPasswords (password) VALUES (?)", (password,))
  db.commit()

  cursor.close()

  return password