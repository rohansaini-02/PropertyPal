import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import postRoute from "./routes/post.route.js";
import authRoute from "./routes/auth.route.js";
import testRoute from "./routes/test.route.js";
import userRoute from "./routes/user.route.js";
import chatRoute from "./routes/chat.route.js";
import messageRoute from "./routes/message.route.js";
import dotenv from "dotenv";
import prisma from "./lib/prisma.js";
dotenv.config();

const app = express();

const allowedOrigins = ["http://localhost:5173"];

process.on("uncaughtException", function (err) {
  console.log(err);
});

// CORS middleware for preflight requests:
const corsSetting = {
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.options("*", cors(corsSetting));

// CORS middleware to handle requests
app.use(cors(corsSetting));

// Error handling middleware for CORS errors
app.use((err, req, res, next) => {
  if (err.name === "CORSError") {
    res.status(403).json({ error: "CORS error: " + err.message });
  } else {
    next(err);
  }
});

// Application-level middleware for setting Access-Control-Allow-Origin header:
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  next();
});

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/test", testRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);

app.get("/api", (req, res) => {
  res.send("API is running!");
});

prisma
  .$connect()
  .then(() => {
    console.log("Database connected!");
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });

app.listen(8000, () => {
  console.log("Server is running!");
});
