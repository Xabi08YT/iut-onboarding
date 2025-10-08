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
    .setExpirationTime("30m")
    .sign(secretKey);
}

export async function exchangeToken(token) {
  const verified = await verifyToken(token);
  if (!verified) return -1;

  verified.id = uuid.v4();
  return await createToken(verified);
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
    console.error(e);
    return false;
  }
}

export async function getUID(token) {
  return verifyToken(token) ? verifyToken(token).uid : -1;
}

export async function getRole(token) {
  const payload = await verifyToken(token);
  if(payload === false) {
    return -1;
  }
  return payload.user.role;
}

