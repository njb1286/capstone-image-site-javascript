from flask import Flask, request, jsonify
from flask_marshmallow import Marshmallow
from flask_sqlalchemy import SQLAlchemy
from typing import Callable
import os
from image_compression import compress_image
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity, decode_token

app = Flask(__name__, static_folder="../public")

basedir = os.path.abspath(os.path.dirname(__file__))
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///" + os.path.join(basedir, "app.db")
# app.config["JWT_SECRET_KEY"] = os.environ.get("TOKEN_KEY")
app.config["JWT_SECRET_KEY"] = "key" # TODO: Remove this

app.config["JWT_ACCESS_TOKEN_EXPIRES"] = 3600 * 24 * 30

# global_password = os.environ.get("SITE_PASSWORD")
global_password = "password" # TODO: Remove this

jwt = JWTManager(app)

db = SQLAlchemy(app)
ma = Marshmallow(app)

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

class ImagesRowSchema(ma.Schema):
  class Meta:
    fields = ("id", "title", "description", "date", "category")

image_schema = ImagesRowSchema()
images_schema = ImagesRowSchema(many=True)

@app.get("/api/validate-token")
def validate_token():
  provided_token: str | None = request.form.get("token")

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

  if password == None or password == "":
    return jsonify({"message": "Password is required"}), 400

  if password != global_password:
    return jsonify({"message": "Password is incorrect"}), 400

  if provided_token:
    try:
      decode_token(provided_token)
      return jsonify({ "message": "Token is already valid!" }), 400

    except:
      pass

  new_token = create_access_token(identity=global_password)
  return jsonify({ "token": new_token }), 200
  

@app.post("/api/form")
@jwt_required()
def post():
  title = request.form.get("title")
  description = request.form.get("description")
  category = request.form.get("category")
  image = request.files.get("image")

  if not (title and description and category and image):
    return jsonify({ "message": "All fields are required! (title, description, category, image)" }), 400

  large_image = compress_image(image.read(), quality=60)
  medium_image = compress_image(large_image, width=384, quality=40)
  small_image = compress_image(medium_image, width=16, quality=40)

  new_item = ImagesRow(title, description, category, small_image, medium_image, large_image)

  db.session.add(new_item)
  db.session.commit()

  return image_schema.jsonify(new_item)



if __name__ == "__main__":
  app.run(debug=True, host="localhost", port=8080)