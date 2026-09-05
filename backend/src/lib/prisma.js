const { PrismaClient } = require("@prisma/client");

// Reuse a single PrismaClient instance across the app
// Prevents too many open connections in development (due to hot reload)
const prisma = global.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

module.exports = prisma;
