import mysql from "mysql2/promise.js";
import env from "dotenv";
import Prieten from "./Prieten.js";
import Utilizator from "./Utilizator.js";
import Aliment from "./Aliment.js";
import { db } from "../dbConfig.js";

env.config();

async function Create_DB() {
  try {
    const conn = await mysql.createConnection({
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
    });

    // Create the database if it doesn't exist
    await conn.query(
      `CREATE DATABASE IF NOT EXISTS ${process.env.DB_DATABASE};`
    );
    console.log("Database created or already exists.");
    await conn.end();
  } catch (err) {
    console.warn("Error creating database:", err.stack);
  }
}

function FK_Config() {
  // 1-n Utilizator-Aliment
  Utilizator.hasMany(Aliment, {
    foreignKey: "id_utilizator",
    as: "Alimente",
  });
  Aliment.belongsTo(Utilizator, {
    foreignKey: "id_utilizator",
    as: "Utilizator",
  });

  // 1-n Utilizator-Prieten (user who owns the friendship)
  Utilizator.hasMany(Prieten, { 
    foreignKey: "id_utilizator",
    as: "OwnedFriends",
  });
  Prieten.belongsTo(Utilizator, {
    foreignKey: "id_utilizator",
    as: "Owner",
  });

  // 1-n Utilizator-Prieten (user who is the friend)
  Utilizator.hasMany(Prieten, {
    foreignKey: "id_prieten_utilizator",
    as: "FriendOf",
  });
  Prieten.belongsTo(Utilizator, {
    foreignKey: "id_prieten_utilizator",
    as: "Friend",
  });

  console.log("Foreign key relationships configured.");
}


async function DB_init() {
  await Create_DB(); // Ensure the database exists
  FK_Config(); // Configure relationships

  // Sync all models with the database
  try {
    await db.sync({ force: true }); // Use `force: true` only during development
    console.log("Tables created successfully.");
  } catch (err) {
    console.error("Error syncing tables:", err);
  }
}

export default DB_init;
