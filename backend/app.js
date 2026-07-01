import fs from "fs";
import path from "path";
import express from "express";
import session from "express-session";
import connectMongoDBSession from "connect-mongodb-session";
import mongoose from "mongoose";

import rootDir from "./utils/pathUtil.js";
import "./utils/env.js";
import loginRouter from "./routes/loginRouter.js";
import storeRouter from "./routes/storeRouter.js";
import hostRouter from "./routes/hostRouter.js";

const MongoDBStore = connectMongoDBSession(session);

const dbPath =
  process.env.MONGODB_URI;
const sessionSecret = process.env.SESSION_SECRET || "airbnb";

if (!dbPath) {
  throw new Error("Missing MONGODB_URI environment variable");
}

const app = express();
const frontendDistPath = path.join(rootDir, "frontend", "dist");
const frontendIndexPath = path.join(frontendDistPath, "index.html");
const hasFrontendBuild = fs.existsSync(frontendIndexPath);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/houseRules", express.static(path.join(rootDir, "houseRules")));
app.use("/host/uploads", express.static(path.join(rootDir, "uploads")));
app.use("/homes/uploads", express.static(path.join(rootDir, "uploads")));
app.use("/uploads", express.static(path.join(rootDir, "uploads")));

const store = new MongoDBStore({
  uri: dbPath,
  collection: "sessions",
});

app.use(
  session({
    secret: sessionSecret,
    saveUninitialized: true,
    resave: false,
    store,
  }),
);

app.use((req, res, next) => {
  req.isLoggedIn = req.session.isLoggedIn;
  next();
});

app.use("/api", loginRouter);
app.use("/api", storeRouter);
app.use("/api", hostRouter);

if (hasFrontendBuild) {
  app.use(express.static(frontendDistPath));

  app.get(/^(?!\/api).*/, (req, res, next) => {
    if (req.method !== "GET") {
      next();
      return;
    }
    res.sendFile(frontendIndexPath);
  });
} else {
  app.get("/", (req, res) => {
    res.json({
      message:
        "Backend API is running. Build and start the React frontend from /frontend to use the UI.",
      frontendReady: false,
    });
  });
}

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong!" });
});

const PORT = 3000;

mongoose
  .connect(dbPath)
  .then(() => {
    console.log("connected to mongoose");
    app.listen(PORT, () => {
      console.log(`Server running on address http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log("error while connecting to mongoose", err);
  });
