import * as jose from "jose";
import * as uuid from "uuid";
import dotenv from "dotenv";
import crypto from "crypto";

const cfg = dotenv.config();
const secretKey = crypto.createSecretKey(cfg.parsed.JWT_SECRET, "utf-8");

export async function createToken(data) {
  data.id = uuid.v4();
  return await new jose.SignJWT(data).setProtectedHeader({alg: "HS256"})
    .setIssuedAt()
    .setIssuer(cfg.parsed.JWT_ISSUER)
    .setAudience(cfg.parsed.JWT_AUDIENCE)
    .setExpirationTime("10m")
    .sign(secretKey);
}

export async function exchangeToken(token) {
  return verifyToken(token) ? createToken(verifyToken(token).id = uuid.v4()) : -1;
}

export async function verifyToken(token) {
  try {
    // verify token
    const { payload, protectedHeader } = await jose.jwtVerify(token, secretKey, {
      issuer: cfg.parsed.JWT_ISSUER, // issuer
      audience: cfg.parsed.JWT_AUDIENCE, // audience
    });
    return payload;
  } catch (e) {
    // token verification failed
    console.log("Token is invalid");
    return false;
  }
}

export async function getUID(token) {
  return verifyToken(token) ? verifyToken(token).uid : -1;
}

export async function getRole(token) {
  return verifyToken(token) ? verifyToken(token).role : -1;
}

