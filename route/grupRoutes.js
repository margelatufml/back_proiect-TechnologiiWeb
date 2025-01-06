import express from "express";
import Grup from "../entities/Grup.js";

const router = express.Router();

// Create a new group
router.post("/", async (req, res) => {
  try {
    const { nume_grup, descriere, image, data_infiintare } = req.body;
    const grup = await Grup.create({
      nume_grup,
      descriere,
      image,
      data_infiintare,
    });
    res.status(201).json(grup);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error creating group", details: err.message });
  }
});

// Get all groups
router.get("/", async (req, res) => {
  try {
    const groups = await Grup.findAll();
    res.status(200).json(groups);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error fetching groups", details: err.message });
  }
});

// Add more endpoints as needed (update, delete, etc.)
export default router;
