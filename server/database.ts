import Prisma from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import createPrismaRedisCache from "prisma-redis-extension";
import Redis from "ioredis";

const redis = new Redis(); // Uses default options for Redis connection

const prisma = new PrismaClient();

const cacheextension = Prisma.Prisma.defineExtension(createPrismaRedisCache({
  models: [
    { model: "User", excludeMethods: ["findMany"] },
    { model: "Post", cacheTime: 180, cacheKey: "article" },
  ],
  storage: { type: "redis", options: { client: redis, invalidation: { referencesTTL: 300 }, log: console } },
  cacheTime: 300,
  excludeModels: ["Product", "Cart"],
  excludeMethods: ["count", "groupBy"],
  onHit: (key) => {
    console.log("hit", key);
  },
  onMiss: (key) => {
    console.log("miss", key);
  },
  onError: (key) => {
    console.log("error", key);
  },
}));

let client = new PrismaClient().$extends(cacheextension);
