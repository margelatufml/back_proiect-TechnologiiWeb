import express from "express";
import env from "dotenv";
import userRoutes from "./route/userRoutes.js";
import alimentRoutes from "./route/alimentRoutes.js";
import prietenRoutes from "./route/prietenRoutes.js";
import createDBRouter from "./route/createDb.js";
import metaRoutes from "./route/metaRoutes.js";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000;

env.config();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", createDBRouter);
// Register routes
app.use("/api", userRoutes);
app.use("/api", alimentRoutes);
app.use("/api", prietenRoutes);
app.use("/meta", metaRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
