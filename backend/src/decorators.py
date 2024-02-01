from flask import request
from typing import Callable, TypedDict
from sqlite3 import Connection
from datetime import datetime
from db import get_db
from functools import wraps

expire_time = 10

def error_message(message: str, status: int):
  return { "message": message }, status


def validate_token(func: Callable):
  @wraps(func)
  def wrapper(*args):
    database = get_db()
    token = request.headers.get("token")

    if not token or token == "":
      return error_message("Token is required!", 401)
    
    cursor = database.cursor()
    cursor.execute("SELECT * FROM tokens WHERE token = ?", (token,))
    record: tuple[str, str] = cursor.fetchone()
    cursor.close()

    if not record or not record[0]:
      return error_message("Invalid token!", 401)
    
    current_date = datetime.now()
    token_date = datetime.strptime(record[1], "%Y-%m-%d %H:%M:%S")

    days_difference = (current_date - token_date).days

    if days_difference > expire_time:
      cursor = database.cursor()
      cursor.execute("DELETE FROM tokens WHERE token = ?", (token,))
      database.commit()
      cursor.close()
      return error_message("Token has expired!", 401)

    return func(*args)
  return wrapper
