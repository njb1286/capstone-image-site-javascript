const express = require("express");
const { Request, Response } = require("express");

const multer = require("multer");

const sharp = require("sharp");

const { Database } = require("sqlite3");

const { password } = require("./password");

const { createPassword, createToken, dateIsValid } = require("./tokens");

const path = require("path");

const rateLimit = require("express-rate-limit");

const db = new Database("database.sqlite");

db.exec(`CREATE TABLE IF NOT EXISTS images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  largeImage BLOB NOT NULL,
  smallImage BLOB NOT NULL,
  description TEXT NOT NULL,
  date DATETIME DEFAULT CURRENT_TIMESTAMP,
  category TEXT NOT NULL,
  mediumImage BLOB NOT NULL
);`);

db.exec(`CREATE TABLE IF NOT EXISTS tokens (
  token TEXT NOT NULL,
  date DATETIME DEFAULT CURRENT_TIMESTAMP
);`);

db.exec(`CREATE TABLE IF NOT EXISTS tempPasswords (
  password TEXT NOT NULL,
  date DATETIME DEFAULT CURRENT_TIMESTAMP
);`);

const app = express();

// Help prevent DDoS attacks
const limiter = rateLimit({
  windowMs: 10 * 1000,
  max: 1000,
});

app.use(limiter);

app.use(express.static(path.resolve(__dirname, "..", "public")))

app.use((req, res, next) => {
  if (req.path.startsWith("/api")) {
    next();
    return;
  }
  res.sendFile(path.resolve(__dirname, "..", "public", "index.html"));
})


const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    // Test the mimetype of the file
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype) {
      return cb(null, true);
    }

    cb(new Error('Invalid file type. Only jpeg, jpg, and png image files are allowed.'));
  },
});

/** @param {Buffer} image */
const compressSmallImage = async (image) => {
  return await sharp(image)
    .resize(16)
    .jpeg({ quality: 40 })
    .toBuffer();
}

/** @param {Buffer} image */
const compressMediumImage = async (image) => {
  return await sharp(image)
    .resize(384)
    .jpeg({ quality: 40 })
    .toBuffer();
}

/** @param {Buffer} image */
const compressImage = async (image) => {
  return await sharp(image)
    .jpeg({ quality: 60 })
    .toBuffer();
}

/**
 * @param {Request} req 
 * @param {Response | undefined} res 
 */
const validateToken = async (req, res) => {
  const token = req.get("token");
  let returnValue = false;

  if (!token) {
    res?.status(401).send({ message: "No token provided" });
    return returnValue;
  }

  /** @type {boolean | null} */
  const value = await new Promise((resolve, reject) => {
    db.get("SELECT token, date FROM tokens WHERE token = ?", token, /** @param {{ token: string, date: string } | null} row */(err, row) => {
      if (err) {
        const message = { message: "Failed to get token" };
        resolve(false);
        res?.status(401).send(message);
        return;
      }

      if (!row) {
        resolve(false);
        return;
      }

      const validDate = dateIsValid(row.date);

      if (!validDate) {
        db.run("DELETE FROM tokens WHERE token = ?", row.token);
        resolve(false);
        return;
      }

      if (row.token === token) {
        resolve(true);
      }

      resolve(false);
    });
  })

  res?.status(201).send({ tokenIsValid: value })
  return value;
}

app.get("/api/generate-password", async (req, res) => {
  const tokenIsValid = await validateToken(req);

  if (!tokenIsValid) {
    res.status(401).send({ message: "Invalid token" })
    return;
  }

  const password = createPassword();

  db.get("SELECT * FROM tempPasswords", /** @param {{ date: string, password: string }} row */(err, row) => {
    if (err) return;

    if (!row) return;

    const validDate = dateIsValid(row.date);

    if (validDate) return;

    db.run("DELETE FROM tempPasswords WHERE password = ?", row.password);
  });

  db.run("INSERT INTO tempPasswords (password) VALUES (?)", password, (err) => {
    if (err) {
      res.status(500).send({ message: "Error inserting data:" + err });
      return;
    }

    res.status(200).send({ password });
  });
});

app.get("/api/validate-token", express.json(), validateToken);

app.post("/api/login", express.json(), async (req, res) => {
  const passwordHeader = req.get("password");
  const tokenHeader = req.get("token");

  /** @type {"true" | "false" | undefined} */
  const isSingleUse = req.get("singleUse");

  if (!passwordHeader) {
    res.status(401).send({ message: "No password provided!" });
    return;
  }

  let singleUseSuccess = false;

  if (isSingleUse === "true") {

    const result = await new Promise < boolean | string > ((resolve, reject) => {
      db.get("SELECT * FROM tempPasswords WHERE password = ?", passwordHeader, /** @param {{ date: string, password: string }} row */(err, row) => {
        if (err) {
          resolve("Error getting data:" + err);
          return;
        }

        if (!row) {
          resolve("Invalid password");
          return;
        }

        const validDate = dateIsValid(row.date);
        if (!validDate) {
          db.run("DELETE FROM tempPasswords WHERE password = ?", row.password); // Delete the password if it's expired
          resolve("Invalid password");
          return;
        }

        db.run("DELETE FROM tempPasswords WHERE password = ?", row.password); // Delete the password that has been used
        resolve(true);
      });
    });

    if (typeof result === "string") {
      res.status(401).send({ message: result });
      return;
    }

    singleUseSuccess = result;
  }

  if (passwordHeader !== password && !singleUseSuccess) {
    res.status(401).send({ message: "Incorrect password!" });
    return;
  }

  if (tokenHeader) {
    const includesQuery = `SELECT token, date FROM tokens WHERE token = ?`;
    const includesValues = [tokenHeader];

    db.get(includesQuery, includesValues, /** @param {{ token: string, date: string } | null} row */(err, row) => {
      if (row) {
        const isValid = dateIsValid(row.date);

        if (isValid) {
          res.status(204).send({ message: "Token already valid!" })
        }
      }
    })
  }

  const token = createToken();

  const insertQuery = `INSERT INTO tokens (token) VALUES (?)`;
  const values = [token];

  db.run(insertQuery, values, (err) => {
    if (err) {
      res.status(500).send({ message: "Error inserting data:" + err });
      return;
    }

    res.status(200).send({ token });
  })
})

app.post("/api/form", upload.single("image"), async (req, res) => {
  const tokenIsValid = await validateToken(req);

  if (!tokenIsValid) {
    res.status(401).send({ message: "Invalid token" })
    return;
  }

  const { title, description, category } = req.body;
  let image = req.file?.buffer;

  /** @type {Buffer | null} */
  let smallImage = null;

  /** @type {Buffer | null} */
  let mediumImage = null;

  if (image) {
    smallImage = await compressSmallImage(image);
    mediumImage = await compressMediumImage(image);
    image = await compressImage(mediumImage);
  }

  const insertQuery = `INSERT INTO images (title, largeImage, smallImage, mediumImage, description, category) VALUES (?, ?, ?, ?, ?, ?)`;
  const values = [title, image, smallImage, mediumImage, description, category];

  db.run(insertQuery, values, (err) => {
    if (err) {
      res.status(500).send("Error inserting data: " + err);

      return;
    }

    /** @type {number} */
    const lastId = this.lastID;

    res.status(200).send({message: "Data inserted successfully", id: lastId, date: new Date().toISOString()});
  });
});

/**
 * @typedef {Object} Table
 * @property {number} id  
 * @property {string} title
 * @property {string} description
 * @property {Blob} largeImage
 * @property {Blob} smallImage
 * @property {string} category
 * @property {string} date
 * @property {Blob} mediumImage
 */

app.get("/api/get", async (req, res) => {
  const tokenIsValid = await validateToken(req);

  if (!tokenIsValid) {
    res.status(401).send({ message: "Invalid token" })
    return;
  }

  const selectQuery = `SELECT id, title, description, category, date FROM images WHERE id = ? ORDER BY id ASC`;

  if (!req.query.id) {
    const loadedItems = req.get("loadedItems");
    const splitLoadedItems = loadedItems ? loadedItems.split(",") : null;

    const excludeQuery = loadedItems ? ` id NOT IN (${splitLoadedItems.map(() => "?").join(",")})` : null;

    let query = `SELECT id, title, description, category, date FROM images`
    const categoryParam = req.query.category;
    const titleParam = req.query.title;

    /** @type {string[]} */
    const values = [];

    if (categoryParam) {
      query += ` WHERE LOWER(category) = ?`;
      values.push(categoryParam);
    }

    if (titleParam) {
      if (categoryParam) query += " AND";
      if (!query.includes("WHERE")) query += " WHERE";

      query += ` LOWER(title) LIKE ?`;

      values.push(`%${titleParam}%`);
    }

    if (excludeQuery) {
      if (categoryParam || titleParam) query += " AND";
      if (!query.includes("WHERE")) query += " WHERE";
      query += excludeQuery;
      values.push(...splitLoadedItems);
    }

    db.all(query, values, /** @param {Table} row */(err, row) => {
      if (err) {
        res.status(500).send("Error getting data:" + err);

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

  const values = [req.query.id];


  db.get(selectQuery, values, (err, row) => {
    if (err) {
      res.status(500).send("Error getting data: " + err);
      return;
    }

    if (!row) {
      res.status(404).send("No data found");
      return;
    }

    res.status(200).send(row);
  });
});

app.get("/api/last", async (req, res) => {
  const tokenIsValid = await validateToken(req);

  if (!tokenIsValid) {
    res.status(401).send({ message: "Invalid token" })
    return;
  }

  const selectQuery = `SELECT id, title, description, category, date FROM images ORDER BY id DESC LIMIT 1`;

  db.get(selectQuery, (err, row) => {
    if (err) {
      res.status(500).send("Error getting data: " + err);
      return;
    }

    if (!row) {
      res.status(404).send("No data found");
      return;
    }

    res.status(200).send(row);
  });
})

app.get("/api/get-slice", async (req, res) => {
  const tokenIsValid = await validateToken(req);

  if (!tokenIsValid) {
    res.status(401).send({ message: "Invalid token" })
    return;
  }

  const limitParam = req.query.limit;
  const offsetParam = req.query.offset;
  const loadedItems = req.get("loadedItems");

  const splitLoadedItems = loadedItems ? loadedItems.split(",") : null;

  const excludeQuery = loadedItems ? `id NOT IN (${splitLoadedItems.map(() => "?").join(",")})` : null;

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

  db.get("SELECT COUNT(*) AS count FROM images", /** @param {{count: number}} itemCountRow */(err, itemCountRow) => {
    if (err) {
      res.status(500).send("Error getting data: " + err);
      return;
    }

    if (!itemCountRow) {
      res.status(404).send("No data found");
      return;
    }

    const query = `SELECT id, title, description, category, date FROM images ${excludeQuery ? "WHERE " + excludeQuery : ""} ORDER BY id ASC LIMIT ? OFFSET ?`;

    const values = [+limitParam, offsetParam];
    if (loadedItems) {
      values.unshift(...splitLoadedItems);
    }

    db.all(query, values, (err, sliceRows) => {
      if (err) {
        res.status(500).send("Error getting data: " + err);
        return;
      }

      if (!sliceRows) {
        res.status(404).send("No data found");
        return;
      }

      const hasMore = (+offsetParam + +limitParam <= itemCountRow.count)

      res.status(200).send({ data: sliceRows, hasMore });
    });
  });
});

app.get("/api/get-image", (req, res) => {

  const validSizes = ["large", "medium", "small"];
  
  /** @typedef {"large" | "medium" | "small"} Size */
  const sizeParam = (/** @type {Size} */ req.query.size) ?? "large";

  if (!validSizes.includes(sizeParam)) {
    res.status(400).send("Invalid size");
    return;
  }

  if (!req.query.id) {
    res.status(400).send("No id provided");
    return;
  }

  const selectQuery = `SELECT ${sizeParam}Image FROM images where id = ?`;

  db.get(selectQuery, [req.query.id], /** @param {Table} row */ (err, row) => {
    if (err) {
      res.status(500).send("Error getting data: " + err);
      return;
    }

    if (!row) {
      res.status(404).send("No data found");
      return;
    }

    res.contentType("image/png");
    res.send(row[`${sizeParam}Image`]);
  });
})

app.delete("/api/delete", async (req, res) => {
  const tokenIsValid = await validateToken(req);

  if (!tokenIsValid) {
    res.status(401).send({ message: "Invalid token" })
    return;
  }

  const id = req.query.id;

  if (!id) {
    res.status(400).send("No id provided");
    return;
  }

  const deleteQuery = `DELETE FROM images WHERE id = ?`;

  db.run(deleteQuery, [id], (err) => {
    if (err) {
      res.status(500).send("Error deleting data: " + err);
      return;
    }

    res.status(200).send("Data deleted successfully");
  })
});

app.post("/api/update", upload.single("image"), async (req, res) => {
  const tokenIsValid = await validateToken(req);

  if (!tokenIsValid) {
    res.status(401).send({ message: "Invalid token" })
    return;
  }

  const { id, title, description, category } = req.body;
  let largeImage = req.file?.buffer;
  
  /** @type {Buffer | null} */
  let smallImage = null;

  /** @type {Buffer | null} */
  let mediumImage = null;

  if (largeImage) {
    largeImage = await compressImage(largeImage);
    mediumImage = await compressMediumImage(largeImage);
    smallImage = await compressSmallImage(mediumImage);
  }

  if (!id) {
    res.status(400).send("No id provided");
    return;
  }

  const updateQuery = `UPDATE images SET ${largeImage ? "largeImage = ?, smallImage = ?, mediumImage = ?," : ""} title = ?, description = ?, category = ? WHERE id = ?`;
  const values = [title, description, category];

  if (largeImage) {
    values.unshift(largeImage, smallImage, mediumImage);
  }

  values.push(id);


  db.run(updateQuery, values, (err) => {
    if (err) {
      res.status(500).send("Error updating data: " + err);

      return;
    }

    res.status(200).send("Data updated successfully");
  });
});

const port = process.env.PORT ?? 8080;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});