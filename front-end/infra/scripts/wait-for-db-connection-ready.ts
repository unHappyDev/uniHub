import retry from "async-retry";
import { exec } from "child_process";

const healthCheckDB = async (): Promise<void> => {
  return await retry(
    async (_bail: (err: Error) => void, attempt: number) => {
      if (attempt > 25) {
        console.log(
          `> Attempt #${attempt}: Still trying to connect to Postgres... Have you started the container? (Try: npm run services:up)`,
        );
      }

      return await new Promise<void>((resolve, reject) => {
        exec(`docker exec auth-postgres-dev pg_isready`, (error, stdout) => {
          if (error) {
            console.error("Exec error:", error.message);
            return reject(error);
          }

          const output = stdout?.trim();
          console.log("Health check:", output);

          if (output.includes("accepting connections")) {
            resolve();
          } else {
            reject(new Error("Postgres not ready. Retrying in 3 seconds..."));
          }
        });
      });
    },
    {
      forever: true,
      minTimeout: 3000,
      maxTimeout: 3000,
      factor: 1.1,
    },
  );
};

(async () => {
  try {
    await healthCheckDB();
    console.log("> Postgres is ready for connections.");
  } catch (err) {
    console.error("> Failed to connect to Postgres:", err);
    process.exit(1);
  }
})();
