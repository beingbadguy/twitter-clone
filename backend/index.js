import express from "express";
import authRouter from "./routes/auth.route.js";
import databaseConnection from "./config/dbConnection.js";
import { configDotenv } from "dotenv";
import cookieParser from "cookie-parser";

configDotenv();
const app = express();
app.use(cookieParser());
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use("/v1/auth", authRouter);

app.get("/", (req, res) => {
  res.send("Hey , welcome to the twitter");
});

app.listen(PORT, (req, res) => {
  databaseConnection();
  console.log("App has started Listening on" + PORT);
});
