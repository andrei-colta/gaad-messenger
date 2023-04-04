import express, { Express } from "express";
import cors from "cors";
import bodyParser from "body-parser";

const port = 8080;

const app: Express = express();

app.use(cors());
app.use(bodyParser.json());

// AUTH ENDPOINTS

app.listen(port, () => {
  return console.log(`server is listening on ${port}`);
});

app.get("/profile", (req, res) => {

  res.send({ });
});

// HELPERS
