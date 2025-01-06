import express from "express";
import DB_init from "../entities/DB_init.js";

const createDBRouter = express.Router();

createDBRouter.route("/create").get(async (req, res) => {
  try {
    await DB_init(); // Initialize the database and tables
    res
      .status(201)
      .json({ message: "Database and tables created successfully!" });
  } catch (error) {
    console.error("Error creating database and tables:", error);
    res.status(500).json({
      message: "Error creating database and tables.",
      error: error.message,
    });
  }
});

export default createDBRouter;
