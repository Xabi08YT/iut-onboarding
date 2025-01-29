const prisma = require("@prisma/client");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const fs = require("fs");

const cfg = dotenv.config();
const client = new prisma.PrismaClient();

function createRandomString(length) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#_!";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

let password = createRandomString(16);

console.log("THIS WILL ONLY BE DISPLAYED ONCE");
console.log("Username: admin");
console.log(`Password:${password}`);

client.$connect();
client.user.create({
  data:
      {username: "admin",
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(parseInt(cfg.parsed.SALT_ROUNDS))),
        role: ["ADMIN"],}
}).then();
client.$disconnect();
