import express from "express";
import env from "dotenv";

import userRoutes from "./route/userRoutes.js";
import grupRoutes from "./route/grupRoutes.js";
import postariRoutes from "./route/postariRoutes.js";
import utilizatoriGrupuriRoutes from "./route/utilizatoriGrupuriRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

env.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register routes
app.use("/api/users", userRoutes);
app.use("/api/groups", grupRoutes);
app.use("/api/posts", postariRoutes);
app.use("/api/usergroups", utilizatoriGrupuriRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
