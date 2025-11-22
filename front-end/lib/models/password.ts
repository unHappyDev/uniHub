import bcryptjs from "bcrypt";
import webserver from "@infra/webserver";

const PEPPER = process.env.PEPPER;

async function hash(password: string) {
  return await bcryptjs.hash(addPepper(password), getNumberOfSaltRounds());
}

async function compare(providedPassword: string, storedPassword: string) {
  return await bcryptjs.compare(addPepper(providedPassword), storedPassword);
}

function getNumberOfSaltRounds() {
  let saltRounds = 14;

  if (!webserver.isServerlessRuntime) {
    saltRounds = 1;
  }

  return saltRounds;
}

function addPepper(password: string) {
  return password + PEPPER;
}

export default Object.freeze({
  hash,
  compare,
});
