import * as jose from "jose";
import * as uuid from "uuid";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

interface UserRole {
  role: string;
}

export interface JWTPayload extends jose.JWTPayload {
  id: string;
  uid?: number;
  user?: UserRole;
  [key: string]: any;
}

const secretKey = crypto.createSecretKey(
  process.env.JWT_SECRET as string,
  "utf-8"
);

export async function createToken(data: Record<string, any>): Promise<string> {
  const payload: JWTPayload = {
    ...data,
    id: uuid.v4(),
  };

  return await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer(process.env.JWT_ISSUER!)
    .setAudience(process.env.JWT_AUDIENCE!)
    .setExpirationTime("30m")
    .sign(secretKey);
}

export async function verifyToken(
  token: string
): Promise<JWTPayload | false> {
  try {
    const { payload } = await jose.jwtVerify(token, secretKey, {
      issuer: process.env.JWT_ISSUER,
      audience: process.env.JWT_AUDIENCE,
    });

    return payload as JWTPayload;
  } catch (e) {
    console.error("Token is invalid:", e);
    return false;
  }
}

export async function exchangeToken(
  token: string
): Promise<string | -1> {
  const verified = await verifyToken(token);
  if (!verified) return -1;

  const newPayload: JWTPayload = {
    ...verified,
    id: uuid.v4(),
  };

  return await createToken(newPayload);
}

export async function getUID(token: string): Promise<number> {
  const payload = await verifyToken(token);
  return payload && typeof payload.uid === "number" ? payload.uid : -1;
}

export async function getRole(token: string): Promise<string | -1> {
  const payload = await verifyToken(token);
  if (!payload || !payload.user || !payload.user.role) return -1;
  return payload.user.role;
}
