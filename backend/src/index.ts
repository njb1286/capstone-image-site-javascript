import express from "express";
import multer from "multer";

import { Database } from "sqlite3";

interface TextRequest extends express.Request {
  body: string;
}

const db = new Database("database.sqlite");

db.exec(`CREATE TABLE IF NOT EXISTS images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  image BLOB NOT NULL,
  description TEXT NOT NULL
);`);

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.post("/api/form", upload.single("image"), (req, res) => {
  console.log("Received title:", req.body.title);
  console.log("Received description:", req.body.description);
  console.log("Received file:", req.file?.buffer.toString("base64"));

  res.status(200).send("It worked!!!");
})

app.post("/api/sample", express.text(), (req: TextRequest, res) => {
  console.log("Received request:", req.body);

  res.status(201).send("It worked!!!");
});

app.listen(8080, () => {
  console.log("Listening on port 8080");
});