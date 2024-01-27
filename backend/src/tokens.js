const crypto = require("crypto");

const createToken = () => {
  const token = `${crypto.randomBytes(64).toString("base64")}}`;
  return token;
}

module.exports.createToken = createToken;

const createPassword = () => {
  const password = `${crypto.randomBytes(16).toString("base64")}}`;
  return password;
}

module.exports.createPassword = createPassword;

/** @param {string} date */
const daysFrom = (date) => {
  const formatDate = new Date(date);
  const currentDate = new Date();
  const differenceInTime = currentDate.getTime() - formatDate.getTime();
  const differenceInDays = differenceInTime / (1000 * 3600 * 24);
  return Math.abs(Math.round(differenceInDays));
}

/** @param {string} date */
const dateIsValid = (date) => {
  const days = daysFrom(date);
  return days <= 10;
}

module.exports.dateIsValid = dateIsValid;