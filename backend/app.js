import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.use(
  cors({
    origin: ["http://localhost:5173", "http://192.168.29.180:5173/"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Authorization", "Content-Type"],
  }),
);
app.use(helmet());

import healthCheckRouter from "./src/routes/healthcheck.routes.js";
import authRouter from "./src/routes/auth.routes.js";
import aiRouter from "./src/routes/ai.routes.js";

app.use("/api/v1/healthcheck", healthCheckRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/ai", aiRouter);

export default app;
