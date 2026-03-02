import { Sequelize } from "sequelize";
import dotnv from "dotenv";

dotnv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  protocol: "postgres",
  logging: false,
  dialectOptions:
    process.env.NODE_ENV === "production"
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        }
      : {},
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Successfullly connected to the db");
  } catch (err) {
    console.error("Failed to connnect to db", err);
  }
})();

export default sequelize;
