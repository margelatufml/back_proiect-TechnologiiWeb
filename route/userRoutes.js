import express from "express";
import Utilizator from "../entities/Utilizator.js";

const userRoutes = express.Router();
userRoutes.use(express.json());

// Create a new user(register)
userRoutes.post("/utilizator/register", async (req, res) => {
  try {
    const { username, email, parola } = req.body;

    if (!username || !email || !parola) {
      return res.status(400).json({ message: "Toate câmpurile sunt obligatorii." });
    }

    const newUtilizator = await Utilizator.create({
      username,
      email,
      parola,
    });

    return res.status(201).json(newUtilizator);
  } catch (error) {
    console.error("Eroare la crearea utilizatorului:", error);

    // Handle unique constraint violations (e.g., duplicate username or email)
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ message: "Username sau email deja folosit." });
    }
    return res.status(500).json({ message: "Eroare internă a serverului." });
  }
});

// Get all users
userRoutes.get("/utilizatori", async (req, res) => {
  try {
    const users = await Utilizator.findAll();
    return res.status(200).json(users);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Error fetching users", details: err.message });
  }
});

// Get a user by username
userRoutes.get("/utilizator/:username", async (req, res) => {
  try {
    const { username } = req.params;

    const user = await Utilizator.findOne({
      where: { username },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json(user);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Error fetching user", details: err.message });
  }
});

// Get a user by username and password(login)
userRoutes.post("/utilizator/login", async (req, res) => {
  try {
    const { username, parola } = req.body;

    if (!username || !parola) {
      return res.status(400).json({ error: "Username and password are required." });
    }

    const user = await Utilizator.findOne({ where: { username } });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    if (user.parola !== parola) {
      return res.status(401).json({ error: "Incorrect password." });
    }

    return res.status(200).json({ message: "Login successful.", user: { id: user.id_utilizator, username: user.username } });
    
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error during login.", details: err.message });
  }
});




export default userRoutes;
