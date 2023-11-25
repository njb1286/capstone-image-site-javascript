import express from "express";

const app = express();

app.get("/api", (_, res) => {
  res.send("API");
});

app.get("/api/hello", (_, res) => {
  res.send("Fishsticks2");
});

app.listen(8080, () => {
  console.log("Listening on port 8080");
});