from flask import Flask, send_from_directory, g, request, jsonify
import sqlite3
import os
from werkzeug.utils import secure_filename
from image_compression import compress_image
from decorators import validate_token
from db import get_db
from datetime import datetime

app = Flask(__name__, static_folder='../public')

class CountRow:
  def __init__(self, count: int):
    self.count = count

  def to_json(self):
    return vars(self)

class ImagesRow:
  def __init__(self, id: int, title: str, description: str, date: str, category: str):
    self.id = id
    self.title = title
    self.description = description
    self.date = date
    self.category = category

  def to_json(self):
    return vars(self)

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

items_to_get = "id, title, description, date, category"

@app.teardown_appcontext
def close_connection(exception: Exception):
  db = g.pop("db", None)

  if db is not None:
    db.close()

@app.route("/api/get-slice", methods=["GET"])
def get_slice():
  limit_param = request.args.get("limit")
  offset_param = request.args.get("offset")
  loaded_items = request.headers.get("loadedItems") or ""

  if not limit_param or not offset_param:
    return { "message": "Limit and offset are required!" }, 400
  
  split_loaded_items = loaded_items.split(",")

  exclude_vars = ""

  # Create a of "?"s instead of their literal values to prevent SQL injection
  if loaded_items:
    exclude_vars = ", ".join(["?" for _ in split_loaded_items])

  query = f"SELECT {items_to_get} FROM images WHERE id NOT IN ({exclude_vars}) ORDER BY id ASC LIMIT ? OFFSET ?"
  query_params = (limit_param, offset_param)

  if len(split_loaded_items) == 0:
    query_params = (*split_loaded_items, *query_params)

  db = get_db()

  cursor = db.cursor()

  cursor.execute(query, query_params)

  items = cursor.fetchall()

  cursor.execute("SELECT COUNT(*) AS count FROM images")
  total_items: tuple[str] = cursor.fetchone()
  cursor.close()

  has_more: bool = int(offset_param) + int(limit_param) <= total_items[0]

  returned_items: list[ImagesRow] = []

  for item in items:
    returned_items.append(ImagesRow(*item).to_json())

  return {"data": returned_items, "hasMore": has_more}, 200

@validate_token
@app.route("/api/get", methods=["GET"])
def get():
  id_param = request.args.get("id")

  db = get_db()
  cursor = db.cursor()
  
  if id_param:
    cursor.execute(f"SELECT {items_to_get} FROM images WHERE id = ?", (id_param,))

    items = cursor.fetchone()

    cursor.close()

    return ImagesRow(*items).to_json(), 200
  
  cursor.execute(f"SELECT {items_to_get} FROM images")

  items = cursor.fetchall()

  cursor.close()

  returned_items = []

  for item in items:
    returned_items.append(ImagesRow(*item).to_json())

  return returned_items, 200
  

@app.route("/api/validate-token", methods=["GET"])
@validate_token
def validate_token_route():
  return { "tokenIsValid": True }

@app.route("/api/form", methods=["POST"])
@validate_token
def form():
  title = request.form['title']
  description = request.form['description']
  category = request.form['category']

  image = request.files["file"]

  if not title or not description or not category or not image:
    return { "message": "All fields are required! (title, description, category, image)" }

  large_image = compress_image(image.read(), quality=60)
  medium_image = compress_image(large_image, width=384, quality=40)
  small_image = compress_image(medium_image, width=16, quality=40)

  db = get_db()

  cursor = db.cursor()

  cursor.execute("INSERT INTO images (title, description, category, largeImage, mediumImage, smallImage) VALUES (?, ?, ?, ?, ?, ?)", (title, description, category, large_image, medium_image, small_image))
  last_row_id = cursor.lastrowid

  db.commit()
  cursor.close()

  return { "message": "Image uploaded successfully!", "id": last_row_id, "date": datetime.now().isoformat() }, 200


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)

    return send_from_directory(app.static_folder, 'index.html')


if __name__ == '__main__':
  app.run(host="localhost", port=8080)