from flask import Flask, request, jsonify, send_file, send_from_directory
from flask_marshmallow import Marshmallow
from flask_sqlalchemy import SQLAlchemy
from typing import Callable, Literal
import os
from image_compression import compress_image
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, decode_token
from werkzeug.datastructures import FileStorage
import secrets
import base64
from io import BytesIO

app = Flask(__name__, static_folder="../public")

basedir = os.path.abspath(os.path.dirname(__file__))
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///" + os.path.join(basedir, "app.db")
# app.config["JWT_SECRET_KEY"] = os.environ.get("TOKEN_KEY")
app.config["JWT_SECRET_KEY"] = "secret"

app.config["JWT_ACCESS_TOKEN_EXPIRES"] = 3600 * 24 * 30

# global_password = os.environ.get("SITE_PASSWORD")
global_password = "password"

jwt = JWTManager(app)

db = SQLAlchemy(app)
ma = Marshmallow(app)

messages = {
  "not_found": "Item not found",
  "id_required": "ID is required",
}

def get_compressed_images(image: FileStorage):
  large_image = compress_image(image.read(), quality=60)
  medium_image = compress_image(large_image, width=384, quality=40)
  small_image = compress_image(medium_image, width=16, quality=40)

  return small_image, medium_image, large_image

class Types:
  INTEGER: int = db.Integer
  STRING: Callable[[int], str] = db.String
  TEXT: str = db.Text
  DATETIME: str = db.DateTime
  BOOLEAN: bool = db.Boolean
  FLOAT: float = db.Float
  BLOB: bytes = db.BLOB

class ImagesRow(db.Model):
  id = db.Column(Types.INTEGER, primary_key=True)
  title = db.Column(Types.STRING(128), nullable=False)
  description = db.Column(Types.TEXT, nullable=False)
  date = db.Column(Types.DATETIME, server_default=db.func.now())
  category = db.Column(Types.STRING(16), nullable=False)
  smallImage = db.Column(Types.BLOB, nullable=False)
  mediumImage = db.Column(Types.BLOB, nullable=False)
  largeImage = db.Column(Types.BLOB, nullable=False)

  def __init__(
      self,
      title: str,
      description: str,
      category: str,
      small_image: bytes,
      medium_image: bytes,
      large_image: bytes,
  ):
    self.title = title
    self.largeImage = large_image
    self.smallImage = small_image
    self.mediumImage = medium_image
    self.description = description
    self.category = category

  def to_string(self):
    return (
      f"""
      {{
        "id": {self.id},
        "title": "{self.title}",
        "description": "{self.description}",
        "date": "{self.date}",
        "category": "{self.category}"
      }}
      """
    )

class TempPassword(db.Model):
  id = db.Column(Types.INTEGER, primary_key=True)
  password = db.Column(Types.STRING(16), unique=True)

  def __init__(self, password: str):
    self.password = password


class ImagesRowSchema(ma.Schema):
  class Meta:
    fields = ("id", "title", "description", "date", "category")

class TempPasswordSchema(ma.Schema):
  class Meta:
    fields = ("password",)

image_schema = ImagesRowSchema()
images_schema = ImagesRowSchema(many=True)
password_schema = TempPasswordSchema()

@app.get("/api/validate-token")
def validate_token():
  provided_token = request.headers.get("token")

  if provided_token == None:
    return jsonify({"message": "Token is required"}), 400

  try:
    decode_token(provided_token)
    return jsonify({ "tokenIsValid": True }), 200
  except:
    pass

  return jsonify({ "tokenIsValid": False }), 200

@app.post("/api/login")
def login():
  password = request.form.get("password")
  provided_token = request.form.get("token")
  password_is_single_use: Literal["true"] | None = request.form.get("singleUse")

  def invalid_password():
    return jsonify({ "message": "Password is incorrect" }), 400

  def success():
    new_token = create_access_token(identity=global_password)
    return jsonify({ "token": new_token }), 200

  if provided_token:
    try:
      decode_token(provided_token)
      return jsonify({ "message": "Token is already valid!" }), 400

    except:
      pass

  if password == None or password == "":
    return jsonify({"message": "Password is required"}), 400

  if password_is_single_use == "true":
    temp_password: str | None = TempPassword.query.filter(TempPassword.password == password).first()

    print("Temp password", temp_password)
    print("Password", password)

    if not temp_password:
      return invalid_password()

    db.session.delete(temp_password)
    db.session.commit()

    return success()
  
  if password != global_password:
    return jsonify({"message": "Password is incorrect"}), 400

  return success()

@app.post("/api/form")
@jwt_required()
def post():
  title = request.form.get("title")
  description = request.form.get("description")
  category = request.form.get("category")
  image = request.files.get("image")

  if not (title and description and category and image):
    return jsonify({ "message": "All fields are required! (title, description, category, image)" }), 400

  small_image, medium_image, large_image = get_compressed_images(image)

  new_item = ImagesRow(title, description, category, small_image, medium_image, large_image)

  db.session.add(new_item)
  db.session.commit()

  return jsonify({ "id": new_item.id }), 200

@app.get("/api/get")
@jwt_required()
def get():
  id_param = request.args.get("id")

  if id_param:
    item: ImagesRow | None = ImagesRow.query.get(id_param)

    if item == None:
      return jsonify({ "message": messages["not_found"] }), 404

    return image_schema.jsonify(item), 200

  items = ImagesRow.query.all()
  return images_schema.jsonify(items), 200

@app.put("/api/update")
@jwt_required()
def update():
  id_param = request.args.get("id")

  title = request.form.get("title")
  description = request.form.get("description")
  category = request.form.get("category")
  image = request.files.get("image")

  if not id_param:
    return jsonify({ "message": messages["id_required"] }), 400

  item: ImagesRow | None = ImagesRow.query.get(id_param)

  if item == None:
    return jsonify({ "message": messages["not_found"] }), 404

  if title:
    item.title = title

  if description:
    item.description = description

  if category:
    item.category = category

  if image:
    small_image, medium_image, large_image = get_compressed_images(image)

    item.smallImage = small_image
    item.mediumImage = medium_image
    item.largeImage = large_image

  db.session.commit()

  return jsonify({ "message": "Item updated successfully!" }), 200


@app.delete("/api/delete")
@jwt_required()
def delete():
  id_param = request.args.get("id")

  if not id_param:
    return jsonify({ "message": messages["id_required"] }), 400

  item: ImagesRow | None = ImagesRow.query.get(id_param)

  if item == None:
    return jsonify({ "message": "Item not found" }), 404

  print("Deleted item", item.to_string())

  db.session.delete(item)
  return jsonify({ "message": "Item deleted successfully!" }), 200

@app.get("/api/generate-password")
@jwt_required()
def generate_password():
  random_bytes = secrets.token_bytes(16)
  password = base64.b64encode(random_bytes).decode("utf-8")

  password_row = TempPassword(password)
  db.session.add(password_row)
  db.session.commit()

  return password_schema.jsonify(password_row), 200

@app.get("/api/get-image")
def get_image():
  valid_sizes = ("large", "medium", "small")

  size_param = request.args.get("size") or "large"
  id_param = request.args.get("id")

  if not id_param:
    return jsonify({ "message": "ID is required!" }), 400

  if size_param not in valid_sizes:
    return jsonify({ "message": "Invalid size!" }), 400

  item: ImagesRow | None = ImagesRow.query.get(id_param)

  if not item:
    return jsonify({ "message": "Item not found!" }), 404

  image: bytes = getattr(item, f"{size_param}Image")
  image_io = BytesIO(image)

  return send_file(image_io, mimetype="image/jpeg"), 200

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)

    return send_from_directory(app.static_folder, 'index.html')

if __name__ == "__main__":
  app.run(debug=True, host="localhost", port=8080)