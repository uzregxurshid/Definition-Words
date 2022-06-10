require("dotenv").config();
const production = process.env.NODE_ENV === "production";

// your configs
// edit example.env file and rename to .env
const DEV_ID = process.env.DEV_ID;
const TOKEN = process.env.TOKEN;
const CHAT_ID = process.env.CHAT_ID;
const API_URL = process.env.API_URL;
module.exports = {
  production,
  DEV_ID,
  CHAT_ID,
  API_URL,
  TOKEN,
};
