import path from "path";

import express, { urlencoded } from "express";
import authRouter from "./routes/auth.route.js";
import databaseConnection from "./config/dbConnection.js";
import { configDotenv } from "dotenv";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route.js";
import { cloudinaryConnect } from "./config/cloudinaryConnection.js";
import postRouter from "./routes/post.route.js";
import cors from "cors";
import fileUpload from "express-fileupload";

configDotenv();
const app = express();
const PORT = process.env.PORT || 8000;

const __dirname = path.resolve();

// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//   })
// );
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/uploads/",
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use("/v1/auth", authRouter);
app.use("/v1/user", userRouter);
app.use("/v1/post", postRouter);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

app.get("/", (req, res) => {
  res.send("Hey , welcome to the twitter");
});

app.listen(PORT, (req, res) => {
  databaseConnection();
  cloudinaryConnect();
  console.log("App has started Listening on" + PORT);
});
