import db from "../dbConfig.js";
import { Sequelize, DataTypes } from "sequelize";

const Prieten = db.define(
  "Prieten",
  {
    id_prietenie: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },

    id_utilizator: {
      type: Sequelize.INTEGER,
      allowNull: false
    },

    id_prieten_utilizator: {
      type: Sequelize.INTEGER,
      allowNull: false
    },

    eticheta_prieten: {
      type: Sequelize.STRING,
      allowNull: false
    },
  },
  {
    tableName: "Prieteni",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["id_utilizator", "id_prieten_utilizator"],
      },
    ],
  }
);

export default Prieten;
