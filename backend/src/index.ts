import express from "express";
import multer from "multer";

import { Database } from "sqlite3";

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
  const { title, description } = req.body;
  const image = req.file?.buffer;

  const insertQuery = `INSERT INTO images (title, image, description) VALUES (?, ?, ?)`;
  const values = [title, image, description];

  db.run(insertQuery, values, function (err) {
    if (err) {
      console.error("Error inserting data:", err);
      res.status(500).send("Error inserting data");
      return;
    }

    console.log("Data inserted successfully");
    res.status(200).send("Data inserted successfully");
  });
});

interface Table {
  id: number;
  title: string;
  description: string;
  image: Blob;
}

app.get("/api/get-item", (req, res) => {
  const selectQuery = `SELECT title, description, id FROM images where id = ?`;

  if (!req.query.id) {
    res.status(400).send("Missing required parameter: id");
    return;
  }

  db.get(selectQuery, [req.query.id], (err, row) => {
    if (err) {
      res.status(500).send("Error getting data");
      return;
    }

    if (!row) {
      res.status(404).send("No data found");
      return;
    }

    res.status(200).send(row);
  });
});

app.get("/api/get-image", (req, res) => {
  const selectQuery = `SELECT image FROM images where id = ?`;

  if (!req.query.id) {
    res.status(400).send("Missing required parameter: id");
    return;
  }

  db.get(selectQuery, [req.query.id], (err, row: Table) => {
    if (err) {
      res.status(500).send("Error getting data");
      return;
    }

    if (!row) {
      res.status(404).send("No data found");
      return;
    }

    res.contentType("image/png");
    res.send(row.image);
  });
})

app.listen(8080, () => {
  console.log("Listening on port 8080");
});