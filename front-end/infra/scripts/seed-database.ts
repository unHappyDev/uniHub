import { Prisma, PrismaClient } from "@prisma/client";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

const prisma = new PrismaClient();

async function main() {
  console.log("> Seeding database...");
  await execAsync(`npx prisma migrate reset --force --skip-seed`);

  await seedUser(
    "admin",
    "admin@admin.com",
    "$2a$04$LfBpkw0M8qaMr/JvrafNjuD6EFp58MSCY6JHl3VgEGxSolAV9uhjy",
    "ADMIN",
  );
  await seedUser(
    "user",
    "user@user.com",
    "$2a$04$LfBpkw0M8qaMr/JvrafNjuD6EFp58MSCY6JHl3VgEGxSolAV9uhjy",
    "USER",
  );
  await seedUser(
    "joao",
    "joao@user.com",
    "$2a$04$LfBpkw0M8qaMr/JvrafNjuD6EFp58MSCY6JHl3VgEGxSolAV9uhjy",
    "USER",
  );
  await seedUser(
    "professor",
    "professor@user.com",
    "$2a$04$LfBpkw0M8qaMr/JvrafNjuD6EFp58MSCY6JHl3VgEGxSolAV9uhjy",
    "PROFESSOR",
  );

  console.log("\n> Database seeded!");
  console.log("------------------------------");
  console.log("> You can now log in with:");
  console.log("> admin@admin.com / 12341234");
  console.log("> user@user.com / 12341234");
  console.log("------------------------------");
}

async function seedUser(
  username: string,
  email: string,
  password: string,
  role: "USER" | "ADMIN" | "PROFESSOR",
) {
  try {
    await prisma.user.create({
      data: {
        username,
        email,
        password,
        role,
        is_active: true,
      },
    });
    console.log(`✔ Created user: ${email}`);
  } catch (err: unknown) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        console.log(`✘ User already exists: ${email}`);
        return;
      }
    }

    throw err;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
