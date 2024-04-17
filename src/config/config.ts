import dotenv from "dotenv";

dotenv.config();

const _config = {
  PORT: process.env.PORT,
  MONGODB_URI: process.env.MONGODB_URI,
  ENV: process.env.NODE_ENV,
  JWT_SECRET: process.env.JWT_SECRET,
};

export const config = Object.freeze(_config);
