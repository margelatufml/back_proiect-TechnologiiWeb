import db from "../dbConfig.js";
import { Sequelize } from "sequelize";

const Postari = db.define(
  "Postari",
  {
    id_postare: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: false,
    },
    id_utilizator: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    continut: {
      type: Sequelize.STRING(50),
      allowNull: false,
    },
    data_postare: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    image: {
      type: Sequelize.BLOB("long"),
      allowNull: true,
    },
  },
  {
    tableName: "Postari",
    timestamp: false,
  }
);

export default Postari;
