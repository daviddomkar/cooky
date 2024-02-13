import fs from "node:fs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const sql = fs.readFileSync("./scripts/seed.sql", "utf-8");

async function main() {
  await prisma.$executeRawUnsafe(sql);
}

main();
