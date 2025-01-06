import db from "../dbConfig.js";
import { Sequelize, DataTypes } from "sequelize";

const UtilizatoriGrupuri = db.define(
  "UtilizatoriGrupuri",
  {
    id_utilizatorgrupuri: {
      type: Sequelize.INTEGER,
      primarykey: true,
      autoIncrement: false,
      allowNull: false,
    },
    id_utilizatori: {
      type: Sequelize.JSON,
      allowNull: false,
    },
    id_grup: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    id_utilizator_admin: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "UtilizatoriGrupuri",
    timestamp: false,
  }
);

export default UtilizatoriGrupuri;
