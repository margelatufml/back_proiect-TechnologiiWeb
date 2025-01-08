import express from "express";
import User from "../entities/Utilizator.js";

const router = express.Router();

// Create a new user
router.post("/", async (req, res) => {
  try {
    const {
      nume,
      prenume,
      data_nastere,
      email,
      password,
      friends,
      friends_date,
    } = req.body;
    const user = await User.create({
      nume,
      prenume,
      data_nastere,
      email,
      password,
      friends,
      friends_date,
    });
    res.status(201).json(user);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error creating user", details: err.message });
  }
});

// Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error fetching users", details: err.message });
  }
});

// Get a user by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error fetching user", details: err.message });
  }
});

// Update a user
router.put("/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    await user.update(req.body);
    res.status(200).json(user);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error updating user", details: err.message });
  }
});

// Delete a user
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    await user.destroy();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error deleting user", details: err.message });
  }
});

export default router;
