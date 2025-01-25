import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import * as uuid from "uuid";

let cfg = dotenv.config();

export async function createToken(data) {
  data.id = uuid.v4();
  return jwt.sign(data, cfg.JWT_SECRET,{ expiresIn: "10m" });
}

export async function exchangeToken(token) {
  return verifyToken(token) ? createToken(verifyToken(token).id = uuid.v4()) : -1;
}

export async function verifyToken(token) {
  return jwt.verify(token, cfg.JWT_SECRET);
}

export async function getUID(token) {
  return jwt.verify(token, cfg.JWT_SECRET) ? jwt.verify(token, cfg.JWT_SECRET).uid : -1;
}
