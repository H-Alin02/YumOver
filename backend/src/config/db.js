import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

const prisma = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" 
        ? ["query", "error", "warn"]
        : ["error"],
});

const connectDB = async () => {
    try {
        await prisma.$connect()
        console.log("DB Connected via Prisma");
    } catch (error) {
        console.error("Database connection error: ", error.message);
        process.exit(1);
    }
};

const disconnectDB = async () => {
    await prisma.$disconnect();
};

export { prisma, connectDB, disconnectDB };