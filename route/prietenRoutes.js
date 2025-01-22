// src/routes/prietenRoutes.js

import express from "express";
import Prieten from "../entities/Prieten.js";

// IMPORTANT: import the authMiddleware
import authMiddleware from "../authMiddleware.js";

const prietenRoutes = express.Router();
prietenRoutes.use(express.json());

// adauga prieten (protected)
prietenRoutes.post("/prieten", authMiddleware, async (req, res) => {
  try {
    const { id_utilizator, id_prieten_utilizator, eticheta_prieten } = req.body;

    // Validate required fields
    if (!id_utilizator || !id_prieten_utilizator || !eticheta_prieten) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Check if the friend relationship already exists
    const existingPrieten = await Prieten.findOne({
      where: {
        id_utilizator,
        id_prieten_utilizator,
      },
    });

    if (existingPrieten) {
      return res
        .status(400)
        .json({ error: "Friend relationship already exists." });
    }

    // Create the new friend relationship
    const newPrieten = await Prieten.create({
      id_utilizator,
      id_prieten_utilizator,
      eticheta_prieten,
    });

    return res.status(201).json(newPrieten);
  } catch (err) {
    return res.status(500).json({
      error: "Error creating friend relationship",
      details: err.message,
    });
  }
});

// get all friends (protected)
prietenRoutes.get("/prieteni", authMiddleware, async (req, res) => {
  try {
    const prieteni = await Prieten.findAll();
    return res.status(200).json(prieteni);
  } catch (err) {
    return res.status(500).json({
      error: "Error fetching friend relationships",
      details: err.message,
    });
  }
});

// Retrieve all friend relationships for a specific user (protected)
prietenRoutes.get(
  "/prieteni/utilizator/:id_utilizator",
  authMiddleware,
  async (req, res) => {
    try {
      const { id_utilizator } = req.params;

      const prieteni = await Prieten.findAll({ where: { id_utilizator } });
      return res.status(200).json(prieteni);
    } catch (err) {
      return res.status(500).json({
        error: "Error fetching friend relationships",
        details: err.message,
      });
    }
  }
);

// update (protected)
// Route to update eticheta_prieten based on id_utilizator and id_prieten_utilizator
prietenRoutes.put(
  "/prieten/:id_utilizator",
  authMiddleware,
  async (req, res) => {
    try {
      const { id_utilizator } = req.params;
      const { id_prieten_utilizator, eticheta_prieten } = req.body;

      // Validate required fields
      if (!id_prieten_utilizator || !eticheta_prieten) {
        return res.status(400).json({
          error: "id_prieten_utilizator and eticheta_prieten are required.",
        });
      }

      // Find the friend relationship by id_utilizator and id_prieten_utilizator
      const prieten = await Prieten.findOne({
        where: {
          id_utilizator,
          id_prieten_utilizator,
        },
      });

      if (!prieten) {
        return res
          .status(404)
          .json({ error: "Friend relationship not found." });
      }

      // Update the eticheta_prieten field
      await prieten.update({ eticheta_prieten });

      return res
        .status(200)
        .json({ message: "eticheta_prieten updated successfully.", prieten });
    } catch (err) {
      return res.status(500).json({
        error: "Error updating eticheta_prieten",
        details: err.message,
      });
    }
  }
);

// Update friend label (protected)
// (Note: this is effectively a duplicate route definition with the same path/method)
prietenRoutes.put(
  "/prieten/:id_utilizator",
  authMiddleware,
  async (req, res) => {
    try {
      const { id_utilizator } = req.params;
      const { id_prieten_utilizator, eticheta_prieten } = req.body;

      if (!id_prieten_utilizator || !eticheta_prieten) {
        return res.status(400).json({
          error: "id_prieten_utilizator and eticheta_prieten are required.",
        });
      }

      const prieten = await Prieten.findOne({
        where: { id_utilizator, id_prieten_utilizator },
      });

      if (!prieten) {
        return res
          .status(404)
          .json({ error: "Friend relationship not found." });
      }

      await prieten.update({ eticheta_prieten });
      return res
        .status(200)
        .json({ message: "Friend label updated successfully.", prieten });
    } catch (err) {
      return res
        .status(500)
        .json({ error: "Error updating friend label", details: err.message });
    }
  }
);

// Delete friend by ID (protected)
prietenRoutes.delete(
  "/prieten/:id_prietenie",
  authMiddleware,
  async (req, res) => {
    try {
      const { id_prietenie } = req.params;

      const prieten = await Prieten.findByPk(id_prietenie);
      if (!prieten) {
        return res
          .status(404)
          .json({ error: "Friend relationship not found." });
      }

      await prieten.destroy();
      return res
        .status(200)
        .json({ message: "Friend relationship deleted successfully." });
    } catch (err) {
      return res.status(500).json({
        error: "Error deleting friend relationship",
        details: err.message,
      });
    }
  }
);

// delete by primary key (protected)
// (Again, effectively a duplicate route for the same path, but we preserve it verbatim)
prietenRoutes.delete(
  "/prieten/:id_prietenie",
  authMiddleware,
  async (req, res) => {
    try {
      const { id_prietenie } = req.params;

      const prieten = await Prieten.findByPk(id_prietenie);

      if (!prieten) {
        return res
          .status(404)
          .json({ error: "Friend relationship not found." });
      }

      await prieten.destroy();
      return res
        .status(200)
        .json({ message: "Friend relationship deleted successfully." });
    } catch (err) {
      return res.status(500).json({
        error: "Error deleting friend relationship",
        details: err.message,
      });
    }
  }
);

export default prietenRoutes;
