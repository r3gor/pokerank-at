import { config } from 'dotenv';

config();

const cfg = {
  PORT: process.env.PORT,
  SECRET_KEY: 'asdasfddsaf',
  JWT_EXPIRES: '1h',
  API_PREFIX: process.env.API_PREFIX,

  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,

  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,

  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
  GITHUB_CALLBACK_URL: process.env.GITHUB_CALLBACK_URL,

  WEB_URL: process.env.WEB_URL,
  API_URL: process.env.API_URL,
}

export default cfg;
