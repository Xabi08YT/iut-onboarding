const prisma = require("@prisma/client");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const fs = require("fs");

const cfg = dotenv.config();
const client = new prisma.PrismaClient();
const defaultSlides = [
  {name: "plannings", active: true, time: 10},
  {name: "meme", active: false, time: 7},
  {name: "transport", active: true, time: 7},
  {name: "menu", active: true, time: 10},
  {name: "discord", active: false, time: 7},
  {name: "maintainer", active: true, time: 10},
  {name: "announcements", active: true, time: 7},
  {name: "weather", active: true, time: 7},
  {name: "cultureclub", active: true, time: 7},
];

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
//Creating user
client.user.create({
  data:
      {username: "admin",
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(parseInt(cfg.parsed.SALT_ROUNDS))),
        role: ["ADMIN"],}
}).then();

//Adding all default slides to database
for(let slide of defaultSlides) {
  client.slide.create({data: slide}).then();
}
client.$disconnect();
