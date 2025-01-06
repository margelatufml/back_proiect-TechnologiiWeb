import express from "express";
import Postari from "../entities/Postare.js";

const router = express.Router();

// Create a new post
router.post("/", async (req, res) => {
  try {
    const { id_utilizator, continut, data_postare, image } = req.body;
    const post = await Postari.create({
      id_utilizator,
      continut,
      data_postare,
      image,
    });
    res.status(201).json(post);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error creating post", details: err.message });
  }
});

// Get all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Postari.findAll();
    res.status(200).json(posts);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error fetching posts", details: err.message });
  }
});

export default router;
