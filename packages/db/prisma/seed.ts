import "dotenv/config";
import prisma from "../src/index";
import { hashPassword } from "better-auth/crypto";

async function main() {
  console.log("🌱 Seeding database via Prisma (Manual Auth Logic)...");

  const adminEmail = "admin@solarflow.com";
  const orgSlug = "smart-energy";

  // 1. Check and Create Admin User
  console.log("🔍 Checking for admin user...");
  let adminUser = await prisma.users.findUnique({
    where: { email: adminEmail },
  });

  if (!adminUser) {
    console.log("👤 Creating admin user...");
    const hashedPassword = await hashPassword("password123");

    adminUser = await prisma.users.create({
      data: {
        email: adminEmail,
        name: "Admin",
        role: "admin",
        emailVerified: true,
        accounts: {
          create: {
            providerId: "credential",
            accountId: adminEmail,
            password: hashedPassword,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
      },
    });
    console.log("✅ Admin user created.");
  } else {
    console.log("ℹ️ Admin user already exists. Checking for account...");
    const account = await prisma.accounts.findFirst({
      where: {
        userId: adminUser.id,
        providerId: "credential",
      },
    });

    if (!account) {
      console.log("🔑 Creating missing credential account for admin...");
      const hashedPassword = await hashPassword("password123");
      await prisma.accounts.create({
        data: {
          userId: adminUser.id,
          providerId: "credential",
          accountId: adminEmail,
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }
  }

  // 2. Check and Create Organization
  console.log("🔍 Checking for organization...");
  let organization = await prisma.organizations.findUnique({
    where: { slug: orgSlug },
  });

  if (!organization) {
    console.log("🏢 Creating organization...");
    organization = await prisma.organizations.create({
      data: {
        name: "Smart Energy",
        slug: orgSlug,
        createdAt: new Date(),
        members: {
          create: {
            userId: adminUser.id,
            role: "owner",
            createdAt: new Date(),
          },
        },
      },
    });
    console.log("✅ Organization created.");
  } else {
    console.log("ℹ️ Organization already exists.");
  }

  console.log("🌱 Seeding complete!");
}

main()
  .catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
