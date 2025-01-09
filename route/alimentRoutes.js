import express from "express";
import Aliment from "../entities/Aliment.js";

const alimentRoutes = express.Router();
alimentRoutes.use(express.json());

//CREATE
alimentRoutes.post("/aliment", async (req, res) => {
  try {
    const { id_utilizator, categorie, continut, data_expirare, disponibil } = req.body;

    // Validate required fields
    if (!id_utilizator || !categorie || !continut || !data_expirare || disponibil === undefined) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Validate date format DD-MM-YYYY
    const dateParts = data_expirare.split('-');
    if (dateParts.length !== 3 || dateParts[0].length !== 2 || dateParts[1].length !== 2 || dateParts[2].length !== 4) {
      return res.status(400).json({ error: "data_expirare must be in the format DD-MM-YYYY." });
    }

    const day = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10);
    const year = parseInt(dateParts[2], 10);

    // Validate month and day
    if (month < 1 || month > 12) {
      return res.status(400).json({ error: "Invalid month. Must be between 1 and 12." });
    }

    // Validate day based on month
    const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (day < 1 || day > monthDays[month - 1]) {
      return res.status(400).json({ error: "Invalid day for the given month." });
    }

    // Adjust month for 0-based indexing
    const monthIndex = month - 1;

    // Create Date object in UTC
    const expirationDate = new Date(Date.UTC(year, monthIndex, day));

    // Check if the date is valid
    if (isNaN(expirationDate.getTime())) {
      return res.status(400).json({ error: "Invalid date." });
    }

    const currentDate = new Date();
    if (expirationDate < currentDate) {
      return res.status(400).json({ error: "data_expirare cannot be in the past." });
    }

    const post = await Aliment.create({
      id_utilizator,
      categorie,
      continut,
      data_expirare: expirationDate,
      disponibil,
    });
    return res.status(201).json(post);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error creating aliment", details: err.message });
  }
});

//GET ALL
alimentRoutes.get("/alimente", async (req, res) => {
  try {
    const posts = await Aliment.findAll();
    return res.status(200).json(posts);
  } 
  catch (err) {
    return res.status(500).json({ error: "Error fetching posts", details: err.message });
  }
});

//GET ALL FROM UTILIZATOR ID 
alimentRoutes.get("/aliment/:id_utilizator", async (req, res) => {
  try {
    const { id_utilizator } = req.params; 
    const posts = await Aliment.findAll({where: { id_utilizator }});
    return res.status(200).json(posts);
  } 
  catch (err) {
    return res.status(500).json({ error: "Error fetching posts for utilizator", details: err.message });
  }
});

//GET ALL FROM UTILIZATOR ID & DISPONIBIL = TRUE
alimentRoutes.get("/aliment/disponibil/:id_utilizator", async (req, res) => {
  try {
    const { id_utilizator } = req.params; 
    const posts = await Aliment.findAll({where: { id_utilizator, disponibil: true}});
    return res.status(200).json(posts);
  } 
  catch (err) {
    return res.status(500).json({ error: "Error fetching posts for utilizator", details: err.message });
  }
});

//UPDATE ID_UTILIZATOR FROM ALIMENTE (claim pe aliment)
alimentRoutes.put("/aliment/:id", async (req, res) => {
  try {
    const { id } = req.params; // Extract aliment ID from the route parameter
    const { id_utilizator } = req.body; // Extract new id_utilizator from request body

    // Update using the correct primary key
    const updated = await Aliment.update(
      { id_utilizator, disponibil: false }, // Fields to update
      { where: { id_aliment: id } } // Specify which aliment to update
    );

    if (updated[0] === 0) {
      return res.status(404).json({ error: "Aliment not found" });
    }

    return res.status(200).json({ message: "id_utilizator updated successfully" });
  } catch (err) {
    return res.status(500).json({ error: "Error updating id_utilizator", details: err.message });
  }
});
//UPDATE DISPONIBIL(toggle) FROM ALIMENTE
alimentRoutes.put("/aliment/:id/toggle", async (req, res) => {
  try {
    const { id } = req.params;

    const aliment = await Aliment.findByPk(id);
    if (!aliment) {
      return res.status(404).json({ error: "Aliment not found" });
    }

    aliment.disponibil = !aliment.disponibil;
    await aliment.save(); // Save changes to the database

    return res.status(200).json({ message: "disponibil toggled successfully", aliment });
  } 
  catch (err) {
    return res.status(500).json({ error: "Error toggling disponibil", details: err.message });
  }
});

// DELETE ALIMENT
alimentRoutes.delete("/aliment/:id", async (req, res) => {
  try {
    const { id } = req.params;
  
    const deleted = await Aliment.destroy({ where: { id_aliment:id } });
    if (deleted === 0) {
      return res.status(404).json({ error: "Aliment not found" });
    }

    return res.status(200).json({ message: "Aliment deleted successfully" });
  } 
  catch (err) {
    return res.status(500).json({ error: "Error deleting aliment", details: err.message });
  }
});

// GET ALL ALIMENTE FROM UTILIZATOR ID & CATEGORY
alimentRoutes.get("/aliment/:id_utilizator/:categorie", async (req, res) => {
  try {
    const { id_utilizator, categorie } = req.params;

    const alimente = await Aliment.findAll({
      where: {
        id_utilizator, // Match the user ID
        categorie // Match the category
      }
    });

    if (alimente.length === 0) {
      return res.status(404).json({ error: "No alimente found for the given utilizator and category" });
    }

    return res.status(200).json(alimente);
  } 
  catch (err) {
    return res.status(500).json({ error: "Error fetching alimente by utilizator and category", details: err.message });
  }
});


export default alimentRoutes;