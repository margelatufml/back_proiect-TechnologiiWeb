import db from "../dbConfig.js";
import { Sequelize } from "sequelize";

const Aliment = db.define(
  "Aliment",
  {
    id_aliment: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },

    id_utilizator: {
      type: Sequelize.INTEGER,
      allowNull: false
    },

    categorie: {
      type: Sequelize.STRING,
      allowNull: false
    },

    continut: {
      type: Sequelize.STRING,
      allowNull: false
    },

    data_expirare: {
      type: Sequelize.DATE,
      allowNull: false
    },
    
    disponibil:{
      type: Sequelize.BOOLEAN,
      allowNull: false
    }
  },
  {
    tableName: "Alimente",
    timestamp: false,
  }
);

export default Aliment;
