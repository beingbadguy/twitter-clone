import express, { urlencoded } from "express";
import authRouter from "./routes/auth.route.js";
import databaseConnection from "./config/dbConnection.js";
import { configDotenv } from "dotenv";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route.js";
import { cloudinaryConnect } from "./config/cloudinaryConnection.js";
import postRouter from "./routes/post.route.js";

configDotenv();
const app = express();
const PORT = process.env.PORT || 8000;

app.use(cookieParser());
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use("/v1/auth", authRouter);
app.use("/v1/user", userRouter);
app.use("/v1/post", postRouter);

app.get("/", (req, res) => {
  res.send("Hey , welcome to the twitter");
});

app.listen(PORT, (req, res) => {
  databaseConnection();
  cloudinaryConnect();
  console.log("App has started Listening on" + PORT);
});
