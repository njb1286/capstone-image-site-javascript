import express from "express";
import multer from "multer";
import sharp from "sharp";

import { Database } from "sqlite3";

const db = new Database("database.sqlite");

// TODO if desired: make a tiny version of the image to display before the full size image is loaded

db.exec(`CREATE TABLE IF NOT EXISTS images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  image BLOB NOT NULL,
  smallImage BLOB NOT NULL,
  description TEXT NOT NULL,
  date DATETIME DEFAULT CURRENT_TIMESTAMP,
  category TEXT NOT NULL
);`);

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

const compressSmallImage = async (image: Buffer) => {
  return await sharp(image)
    .resize(16)
    .jpeg({ quality: 40 })
    .toBuffer();
}

const compressImage = async (image: Buffer) => {
  return await sharp(image)
    .jpeg({ quality: 60 })
    .toBuffer();
}

app.post("/api/form", upload.single("image"), async (req, res) => {
  const { title, description, category } = req.body;
  let image = req.file?.buffer;
  let smallImage: Buffer | null = null;

  if (image) {
    smallImage = await compressSmallImage(image);
    image = await compressImage(image);
  }

  const insertQuery = `INSERT INTO images (title, image, smallImage, description, category) VALUES (?, ?, ?, ?, ?)`;
  const values = [title, image, smallImage, description, category];

  db.run(insertQuery, values, function (err) {
    if (err) {
      res.status(500).send("Error inserting data");
      return;
    }

    res.status(200).send("Data inserted successfully");
  });
});

interface Table {
  id: number;
  title: string;
  description: string;
  image: Blob;
  smallImage: Blob;
  category: string;
  date: string;
}

app.get("/api/get", (req, res) => {
  const selectQuery = `SELECT id, title, description, category, date FROM images WHERE id = ?`;

  if (!req.query.id) {
    let query = `SELECT id, title, description, category, date FROM images`
    const categoryParam = req.query.category;
    const titleParam = req.query.title;
    
    const values = [] as string[];

    if (categoryParam) {
      query += ` WHERE LOWER(category) = ?`;
      values.push(categoryParam as string);
    }

    if (titleParam) {
      if (categoryParam) query += " AND";

      query += ` WHERE LOWER(title) LIKE ?`;

      values.push(`%${titleParam as string}%`);
    }

    db.all(query, values, (err: unknown, row: Table) => {
      if (err) {
        res.status(500).send("Error getting data");
        return;
      }

      if (!row) {
        res.status(200).send("No data found");
        return;
      }

      res.status(200).send(row);
    })

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

app.get("/api/last", (_, res) => {
  const selectQuery = `SELECT id, title, description, category, date FROM images ORDER BY id DESC LIMIT 1`;

  db.get(selectQuery, (err, row) => {
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
})

app.get("/api/get-slice", (req, res) => {
  const limitParam = req.query.limit;
  const offsetParam = req.query.offset;

  if (!limitParam) {
    res.status(400).send("No limit provided");
    return;
  }

  if (isNaN(+limitParam)) {
    res.status(400).send("Limit must be a number");
    return;
  }

  if (!offsetParam) {
    res.status(400).send("No offset provided");
    return;
  }

  if (isNaN(+offsetParam)) {
    res.status(400).send("Offset must be a number");
    return;
  }

  const query = `SELECT id, title, description, category, date FROM images ORDER BY id ASC LIMIT ? OFFSET ?`;

  const values = [limitParam, offsetParam];

  db.get<{ count: number }>("SELECT COUNT(*) AS count FROM images", (err, itemCountRow) => {
    if (err) {
      res.status(500).send("Error getting data");
      return;
    }

    if (!itemCountRow) {
      res.status(404).send("No data found");
      return;
    }

    db.all(query, values, (err, sliceRows) => {
      if (err) {
        res.status(500).send("Error getting data");
        return;
      }

      if (!sliceRows) {
        res.status(404).send("No data found");
        return;
      }      

      res.status(200).send({ data: sliceRows, hasMore: (+offsetParam + +limitParam < itemCountRow.count)});
    });
  });
});

app.get("/api/get-image", (req, res) => {
  if (!req.query.id) {
    res.status(400).send("No id provided");
    return;
  }

  const selectQuery = `SELECT image FROM images where id = ?`;

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

app.get("/api/get-small-image", (req, res) => {
  if (!req.query.id) {
    res.status(400).send("No id provided");
    return;
  }

  const selectQuery = `SELECT smallImage FROM images where id = ?`;

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
    res.send(row.smallImage);
  });
})

app.get("/api/delete", (req, res) => {
  const id = req.query.id;

  if (!id) {
    res.status(400).send("No id provided");
    return;
  }

  const deleteQuery = `DELETE FROM images WHERE id = ?`;

  db.run(deleteQuery, [id], (err) => {
    if (err) {
      res.status(500).send("Error deleting data");
      return;
    }

    res.status(200).send("Data deleted successfully");
  })
});

app.post("/api/update", upload.single("image"), async (req, res) => {

  const { id, title, description, category } = req.body;
  let image = req.file?.buffer;
  let smallImage: Buffer | null = null;

  if (image) {
    image = await compressImage(image);
    smallImage = await compressSmallImage(image);
  }

  if (!id) {
    res.status(400).send("No id provided");
    return;
  }

  const updateQuery = `UPDATE images SET title = ?, description = ?, category = ?${image ? ", image = ?, smallImage = ?" : ""} WHERE id = ?`;
  const values = [title, description, category];

  if (image) {
    values.push(image, smallImage);
  }

  values.push(id);

  db.run(updateQuery, values, (err) => {
    if (err) {
      res.status(500).send("Error updating data");
      return;
    }

    res.status(200).send("Data updated successfully");
  });
});

app.listen(8080, () => {
  console.log("Listening on port 8080");
});