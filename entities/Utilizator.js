import db from "../dbConfig.js";
import { Sequelize, DataTypes } from "sequelize";

const Utilizator = db.define(
  "Utilizator",
  {
    id_utilizator: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },

    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },

    parola: {
      type: Sequelize.STRING,
      allowNull: false
    },
  },
  {
    tableName: "Utilizatori",
    timestamp: false,
  }
);

export default Utilizator;
