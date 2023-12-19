import express from "express";

const app = express();

app.use(express.json());

app.get("/api", (_, res) => {
  res.send("API");
});

app.get("/api/hello", (_, res) => {
  res.send("Fishsticks2");
});

app.post("/api/image-upload", (req, res) => {
  console.log("Recieved request:", req.body);

  res.send("It worked!!!");
});

app.listen(8080, () => {
  console.log("Listening on port 8080");
});