import express from "express";
import UtilizatoriGrupuri from "../entities/UtilizatoriGrupuri.js";

const router = express.Router();

// Add a user to a group
router.post("/", async (req, res) => {
  try {
    const { id_utilizatori, id_grup, id_utilizator_admin } = req.body;
    const relation = await UtilizatoriGrupuri.create({
      id_utilizatori,
      id_grup,
      id_utilizator_admin,
    });
    res.status(201).json(relation);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error adding user to group", details: err.message });
  }
});

export default router;
