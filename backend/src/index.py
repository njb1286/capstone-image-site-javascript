from flask import Flask, send_from_directory, g, request
import sqlite3
import os
from werkzeug.utils import secure_filename
from image_compression import compress_image
from decorators import validate_token
from db import get_db

app = Flask(__name__, static_folder='../public')

@app.before_request
def setup():
  db = get_db()
  cursor = db.cursor()
  cursor.execute("""CREATE TABLE IF NOT EXISTS images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  largeImage BLOB NOT NULL,
  smallImage BLOB NOT NULL,
  description TEXT NOT NULL,
  date DATETIME DEFAULT CURRENT_TIMESTAMP,
  category TEXT NOT NULL,
  mediumImage BLOB NOT NULL
);""")
  
  cursor.execute("""CREATE TABLE IF NOT EXISTS tokens (
  token TEXT NOT NULL,
  date DATETIME DEFAULT CURRENT_TIMESTAMP
);""")

  cursor.execute("""CREATE TABLE IF NOT EXISTS tempPasswords (
  password TEXT NOT NULL,
  date DATETIME DEFAULT CURRENT_TIMESTAMP
);""")

@app.teardown_appcontext
def close_connection(exception: Exception):
  db = g.pop("db", None)

  if db is not None:
    db.close()

@app.route("/api/toast", methods=["GET"])
@validate_token
def index():
  return { "message": "Hello, World!" }, 200

@app.route("/api/form", methods=["POST"])
@validate_token
def login():
  title = request.form['title']
  description = request.form['description']
  category = request.form['category']

  image = request.files["file"]

  large_image = None
  medium_image = None
  small_image = None

  if not title or not description or not category:
    return { "message": "All fields are required!" }

  if image:
    large_image = compress_image(image.read(), quality=60)
    medium_image = compress_image(large_image, width=384, quality=40)
    small_image = compress_image(medium_image, width=16, quality=40)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)

    return send_from_directory(app.static_folder, 'index.html')


if __name__ == '__main__':
  app.run(host="localhost", port=8080)