import mysql from "mysql2/promise.js";
import env from "dotenv";
import Grup from "./Grup.js";
import User from "./User.js";
import Postari from "./Postare.js";
import UtilizatoriGrupuri from "./UtilizatoriGrupuri.js";
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
      `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_DATABASE}\`;`
    );
    console.log("Database created or already exists.");
    await conn.end();
  } catch (err) {
    console.warn("Error creating database:", err.stack);
  }
}

function FK_Config() {
  User.hasMany(Postari, {
    foreignKey: "id_utilizator",
    as: "posts",
  });
  Postari.belongsTo(User, {
    foreignKey: "id_utilizator",
    as: "user",
  });

  User.belongsToMany(Grup, {
    through: UtilizatoriGrupuri,
    foreignKey: "id_utilizatori",
    otherKey: "id_grup",
    as: "groups",
  });

  Grup.belongsToMany(User, {
    through: UtilizatoriGrupuri,
    foreignKey: "id_grup",
    otherKey: "id_utilizatori",
    as: "users",
  });

  Grup.hasMany(UtilizatoriGrupuri, {
    foreignKey: "id_grup",
    as: "groupMembers",
  });
  UtilizatoriGrupuri.belongsTo(Grup, {
    foreignKey: "id_grup",
    as: "group",
  });

  User.hasMany(UtilizatoriGrupuri, {
    foreignKey: "id_utilizator_admin",
    as: "adminGroups",
  });
  UtilizatoriGrupuri.belongsTo(User, {
    foreignKey: "id_utilizator_admin",
    as: "admin",
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
