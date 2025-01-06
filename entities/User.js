import db from "../dbConfig.js";
import { Sequelize, DataTypes } from "sequelize";

const User = db.define(
  "User",
  {
    id_user: {
      type: Sequelize.INTEGER,
      primarykey: true,
      autoIncrement: false,
      allowNull: false,
    },
    nume: {
      type: Sequelize.STRING(20),
      allowNull: false,
    },
    prenume: {
      type: Sequelize.STRING(20),
      allowNull: false,
    },
    data_nastere: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING(20),
      allowNull: false,
      unique: true,
    },
    password: {
      type: Sequelize.STRING(20),
      allowNull: false,
    },
    friends: {
      type: Sequelize.JSON,
      allowNull: false,
    },
    friends_date: {
      type: Sequelize.JSON,
      allowNull: false,
    },
  },
  {
    tableName: "User",
    timestamp: false,
  }
);

export default User;
