import crypto from "crypto";

export const createToken = () => {
  const token = `${crypto.randomBytes(64).toString("base64")}}`;
  return token;
}

export const createPassword = () => {
  const password = `${crypto.randomBytes(16).toString("base64")}}`;
  return password;
}

const daysFrom = (date: string) => {
  const formatDate = new Date(date);
  const currentDate = new Date();
  const differenceInTime = currentDate.getTime() - formatDate.getTime();
  const differenceInDays = differenceInTime / (1000 * 3600 * 24);
  return Math.abs(Math.round(differenceInDays));
}

export const dateIsValid = (date: string) => {
  const days = daysFrom(date);
  return days <= 10;
}