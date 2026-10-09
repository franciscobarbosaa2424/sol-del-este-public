import dotenv from 'dotenv';
dotenv.config();

export default {
  PORT: process.env.PORT,
  JWT_SECRET: process.env.JWT_SECRET,
  CLOUDINARY_NAME: process.env.CLOUDINARY_NAME,
  CLOUDINARY_KEY: process.env.CLOUDINARY_KEY,
  CLOUDINARY_SECRET: process.env.CLOUDINARY_SECRET,
  DB_HOST:process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_USER: process.env.DB_USER,
  DB_NAME: process.env.DB_NAME,
  DB_PASS: process.env.DB_PASS
};