import db from "../dbConfig.js";
import { Sequelize, DataTypes } from "sequelize";

const Grup = db.define(
  "Grup",
  {
    id_grup: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: false,
    },
    id_utilizatori_grupuri: {
      type: Sequelize.JSON,
      allowNull: false,
    },
    nume_grup: {
      type: Sequelize.STRING(50),
      allowNull: false,
    },
    descriere: {
      type: Sequelize.STRING(50),
      allowNull: false,
    },
    image: {
      type: Sequelize.BLOB("long"),
      allowNull: true,
    },
    data_infiintare: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  },
  {
    tableName: "Grup",
    timestamp: false,
  }
);

export default Grup;
