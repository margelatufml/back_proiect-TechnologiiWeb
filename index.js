// index.js
import express from "express";
import env from "dotenv";
import userRoutes from "./route/userRoutes.js";
import alimentRoutes from "./route/alimentRoutes.js";
import prietenRoutes from "./route/prietenRoutes.js";
import createDBRouter from "./route/createDb.js";
import metaRoutes from "./route/metaRoutes.js";
import cors from "cors";

import http from "http";
import { WebSocketServer } from "ws";

env.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", createDBRouter);
app.use("/api", userRoutes);
app.use("/api", alimentRoutes);
app.use("/api", prietenRoutes);
app.use("/meta", metaRoutes);

const server = http.createServer(app);

const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("New WebSocket client connected.");

  ws.send("Hello from the WebSocket server!");

  ws.on("message", (message) => {
    console.log("Received:", message.toString());
    ws.send(`Server echo: ${message}`);
  });

  ws.on("close", () => {
    console.log("WebSocket client disconnected.");
  });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
