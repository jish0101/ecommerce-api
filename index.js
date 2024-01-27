/** @format */

const http = require("http");
const path = require("path");
const { log } = require("console");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const corsOptions = require("./utils/corsOptions");
const credentials = require("./middlewares/credentials");
const mongoose = require("mongoose");
const connectDB = require("./utils/dbConnect");
const cookieParser = require("cookie-parser");
const verifyJWT = require("./middlewares/verifyJWT");

require("dotenv").config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT;
const BASE_URL = process.env.BASE_URL;

connectDB();

// routes
const userRouter = require("./routers/users/usersRouter");
const authRouter = require("./routers/auth/authRouter");
const refreshRouter = require("./routers/auth/refresh");

app.use("/", express.static(path.join(__dirname, "/public")));
app.set("view engine", "ejs");
app.use(credentials);
app.use(cors(corsOptions));
app.use(morgan("common"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/refresh", refreshRouter);
app.use(verifyJWT);
app.use("/users", userRouter);

app.get("/", (req, res) => {
  res.render(path.join(__dirname, "views", "apiHome.ejs"));
});

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not found" });
  } else {
    res.type("txt").send("404 Not found");
  }
});

mongoose.connection.once("open", () => {
  server.listen(PORT, () =>
    log(`Server is running on URL => ${BASE_URL}${PORT}`)
  );
});
