import Sequelize from "sequelize";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

// Connection without specifying a database (used for creating the database dynamically)
export const dbWithoutDatabase = new Sequelize({
  dialect: "mysql", // Specifies MySQL as the dialect
  username: process.env.DB_USERNAME, // Username from .env
  password: process.env.DB_PASSWORD, // Password from .env
  host: process.env.DB_HOST || "127.0.0.1", // Host (default: 127.0.0.1)
  port: process.env.DB_PORT || 3306, // MySQL port (default: 3306)
  logging: false, // Disable logging of SQL queries
});

// Connection to the specific database (used for creating tables and running queries)
export const db = new Sequelize({
  dialect: "mysql", // Specifies MySQL as the dialect
  database: process.env.DB_DATABASE, // Database name from .env
  username: process.env.DB_USERNAME, // Username from .env
  password: process.env.DB_PASSWORD, // Password from .env
  host: process.env.DB_HOST || "127.0.0.1", // Host (default: 127.0.0.1)
  port: process.env.DB_PORT || 3306, // MySQL port (default: 3306)
  logging: console.log, // Log SQL queries (useful for debugging)
  define: {
    timestamps: false, // Disable automatic timestamps for createdAt/updatedAt
    freezeTableName: true, // Prevent Sequelize from pluralizing table names
  },
});

// Test the connection (optional, but helpful for debugging)
(async () => {
  try {
    await dbWithoutDatabase.authenticate();
    console.log("Connected to MySQL server successfully!");
  } catch (error) {
    console.error("Unable to connect to MySQL server:", error.message);
  }
})();
export default db;
