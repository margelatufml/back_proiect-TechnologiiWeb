// src/routes/alimentRoutes.js

import express from "express";
import Aliment from "../entities/Aliment.js";
import Sequelize from "sequelize";
import axios from "axios";

// IMPORTANT: import the authMiddleware
import authMiddleware from "../authMiddleware.js";

const alimentRoutes = express.Router();
alimentRoutes.use(express.json());

// CREATE (protected)
alimentRoutes.post("/aliment", authMiddleware, async (req, res) => {
  try {
    const { id_utilizator, categorie, continut, data_expirare, disponibil } =
      req.body;

    // Validate required fields
    if (
      !id_utilizator ||
      !categorie ||
      !continut ||
      !data_expirare ||
      disponibil === undefined
    ) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Validate date format DD-MM-YYYY
    const dateParts = data_expirare.split("-");
    if (
      dateParts.length !== 3 ||
      dateParts[0].length !== 2 ||
      dateParts[1].length !== 2 ||
      dateParts[2].length !== 4
    ) {
      return res
        .status(400)
        .json({ error: "data_expirare must be in the format DD-MM-YYYY." });
    }

    const day = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10);
    const year = parseInt(dateParts[2], 10);

    // Validate month and day
    if (month < 1 || month > 12) {
      return res
        .status(400)
        .json({ error: "Invalid month. Must be between 1 and 12." });
    }

    // Validate day based on month
    const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (day < 1 || day > monthDays[month - 1]) {
      return res
        .status(400)
        .json({ error: "Invalid day for the given month." });
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
      return res
        .status(400)
        .json({ error: "data_expirare cannot be in the past." });
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
    return res
      .status(500)
      .json({ error: "Error creating aliment", details: err.message });
  }
});

// GET ALL (protected)
alimentRoutes.get("/alimente", authMiddleware, async (req, res) => {
  try {
    const posts = await Aliment.findAll();
    return res.status(200).json(posts);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Error fetching posts", details: err.message });
  }
});

// GET ALL FROM UTILIZATOR ID (protected)
alimentRoutes.get(
  "/aliment/:id_utilizator",
  authMiddleware,
  async (req, res) => {
    try {
      const { id_utilizator } = req.params;
      const posts = await Aliment.findAll({ where: { id_utilizator } });
      return res.status(200).json(posts);
    } catch (err) {
      return res.status(500).json({
        error: "Error fetching posts for utilizator",
        details: err.message,
      });
    }
  }
);

// GET ALL FROM UTILIZATOR ID & DISPONIBIL = TRUE (protected)
alimentRoutes.get(
  "/aliment/disponibil/:id_utilizator",
  authMiddleware,
  async (req, res) => {
    try {
      const { id_utilizator } = req.params;
      const posts = await Aliment.findAll({
        where: { id_utilizator, disponibil: true },
      });
      return res.status(200).json(posts);
    } catch (err) {
      return res.status(500).json({
        error: "Error fetching posts for utilizator",
        details: err.message,
      });
    }
  }
);

// UPDATE ID_UTILIZATOR FROM ALIMENTE (claim pe aliment) (protected)
alimentRoutes.put("/aliment/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params; // Extract aliment ID
    const { id_utilizator } = req.body; // Extract new id_utilizator

    console.log(`Updating aliment with id: ${id}, new id_utilizator: ${id_utilizator}`);

    const updated = await Aliment.update(
      { id_utilizator, disponibil: false }, // Fields to update
      { where: { id_aliment: id } } // Which aliment to update
    );

    console.log(`Update result: ${updated}`);

    if (updated[0] === 0) {
      return res.status(404).json({ error: "Aliment not found" });
    }

    return res
      .status(200)
      .json({ message: "id_utilizator updated successfully" });
  } catch (err) {
    console.error("Error updating id_utilizator:", err);
    return res
      .status(500)
      .json({ error: "Error updating id_utilizator", details: err.message });
  }
});

// UPDATE DISPONIBIL (toggle) FROM ALIMENTE (protected)
alimentRoutes.put("/aliment/:id/toggle", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const aliment = await Aliment.findByPk(id);
    if (!aliment) {
      return res.status(404).json({ error: "Aliment not found" });
    }

    aliment.disponibil = !aliment.disponibil;
    await aliment.save();

    return res
      .status(200)
      .json({ message: "disponibil toggled successfully", aliment });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Error toggling disponibil", details: err.message });
  }
});

// DELETE ALIMENT (protected)
alimentRoutes.delete("/aliment/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Aliment.destroy({ where: { id_aliment: id } });
    if (deleted === 0) {
      return res.status(404).json({ error: "Aliment not found" });
    }

    return res.status(200).json({ message: "Aliment deleted successfully" });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Error deleting aliment", details: err.message });
  }
});

// GET ALL ALIMENTE FROM UTILIZATOR ID & CATEGORY (protected)
alimentRoutes.get(
  "/aliment/:id_utilizator/:categorie",
  authMiddleware,
  async (req, res) => {
    try {
      const { id_utilizator, categorie } = req.params;

      const alimente = await Aliment.findAll({
        where: {
          id_utilizator,
          categorie,
        },
      });

      if (alimente.length === 0) {
        return res.status(404).json({
          error: "No alimente found for the given utilizator and category",
        });
      }

      return res.status(200).json(alimente);
    } catch (err) {
      return res.status(500).json({
        error: "Error fetching alimente by utilizator and category",
        details: err.message,
      });
    }
  }
);

// GET ALERTS (protected)
alimentRoutes.get(
  "/alerts/:id_utilizator",
  authMiddleware,
  async (req, res) => {
    try {
      const { id_utilizator } = req.params;

      const threeDaysFromNow = new Date();
      threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

      const alerts = await Aliment.findAll({
        where: {
          id_utilizator,
          data_expirare: {
            [Sequelize.Op.lte]: threeDaysFromNow,
          },
          disponibil: true,
        },
      });

      if (alerts.length === 0) {
        return res.status(404).json({ message: "No expiring products found." });
      }

      return res.status(200).json(alerts);
    } catch (err) {
      console.error("Error fetching alerts:", err);
      return res
        .status(500)
        .json({ error: "Error fetching alerts", details: err.message });
    }
  }
);

// NEW ENDPOINT: POST /aliment/instagram/post (protected)
alimentRoutes.post(
  "/aliment/instagram/post",
  authMiddleware,
  async (req, res) => {
    try {
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({ error: "userId is required." });
      }

      // Fetch available alimente for the user
      const availableAlimente = await Aliment.findAll({
        where: { id_utilizator: userId, disponibil: true },
      });

      if (availableAlimente.length === 0) {
        return res
          .status(400)
          .json({ error: "No available alimente to share." });
      }

      // Format the message
      const messageLines = availableAlimente.map(
        (aliment) => `• ${aliment.continut} (${aliment.categorie})`
      );
      const message = `I have the following products available to claim:\n${messageLines.join(
        "\n"
      )}`;

      // Instagram Graph API credentials
      const instagramAccountId = process.env.INSTAGRAM_ACCOUNT_ID;
      const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;

      if (!instagramAccountId || !accessToken) {
        return res.status(500).json({
          error: "Instagram Account ID or Access Token is not configured.",
        });
      }

      // Step 1: Create a media object with the message as a caption
      const mediaUrl = `https://graph.facebook.com/v15.0/${instagramAccountId}/media`;

      const mediaResponse = await axios.post(mediaUrl, {
        caption: message,
        access_token: accessToken,
      });

      const creationId = mediaResponse.data.id;

      // Step 2: Publish the media object
      const publishUrl = `https://graph.facebook.com/v15.0/${instagramAccountId}/media_publish`;

      const publishResponse = await axios.post(publishUrl, {
        creation_id: creationId,
        access_token: accessToken,
      });

      const postId = publishResponse.data.id;

      return res
        .status(200)
        .json({ message: "Post created successfully.", postId });
    } catch (error) {
      console.error(
        "Error posting to Instagram:",
        error.response?.data || error.message
      );
      return res.status(500).json({
        error: "Error posting to Instagram.",
        details: error.message,
      });
    }
  }
);

export default alimentRoutes;
