import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Business = sequelize.define("Business", {
  business_id: {
    type: DataTypes.INTEGER,
    unique: true,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  highlights: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0,
    },
  },
  current_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0,
    },
    defaultValue: 0,
  },
  is_featured: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  is_investment: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  is_ours: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  coverImage: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

export default Business;
