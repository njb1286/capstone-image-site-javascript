const dotenv = require("dotenv");

dotenv.config();

const password = process.env.SITE_PASSWORD;

module.exports.password = password;