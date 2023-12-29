import express from "express";
import multer from "multer";

interface TextRequest extends express.Request {
  body: string;
}

const app = express();
const upload = multer({ dest: "uploads/" });

app.post("/api/image-upload", upload.single("image"), (req, res) => {
  console.log("Recieved request:", req.body);

  res.status(201).send("It worked!!!");
});

app.post("/api/sample", express.text(), (req: TextRequest, res) => {
  console.log("Recieved request:", req.body);

  res.status(201).send("It worked!!!");
});

app.listen(8080, () => {
  console.log("Listening on port 8080");
});