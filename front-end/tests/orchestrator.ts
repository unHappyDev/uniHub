import webserver from "@/infra/webserver";
import { PrismaClient } from "@prisma/client";
import retry from "async-retry";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);
const prisma = new PrismaClient();

const webserverUrl = webserver.host;
const emailServiceUrl = `http://${process.env.EMAIL_HTTP_HOST}:${process.env.EMAIL_HTTP_PORT}`;

async function waitForAllServices() {
  await waitForWebServer();
  await waitForBackend();
  await waitForDatabase();
  await waitForEmailService();

  async function waitForWebServer() {
    return await retry(
      async (_bail, tries) => {
        if (tries >= 25) {
          console.log(
            `> Trying to connect to Webserver #${tries}. Are you running the server with "npm run dev"?`,
          );
        }
        await fetch(`${webserverUrl}/api/v1/status`);
      },
      {
        retries: 50,
        minTimeout: 10,
        maxTimeout: 1000,
        factor: 1.1,
      },
    );
  }

  async function waitForBackend() {
    return await retry(
      async (_bail, tries) => {
        if (tries >= 25) {
          console.log(
            `> Trying to connect to Webserver #${tries}. Are you running the server with "npm run dev"?`,
          );
        }
        await fetch(`http://18.188.33.134:8080/user`);
      },
      {
        retries: 50,
        minTimeout: 10,
        maxTimeout: 1000,
        factor: 1.1,
      },
    );
  }

  async function waitForDatabase() {
    return await retry(
      async (_bail, tries) => {
        if (tries >= 25) {
          console.log(
            `> Trying to connect to Database #${tries}. Are you running the Postgres container?`,
          );
        }
        await prisma.$queryRaw`SELECT 1`;
      },
      {
        retries: 50,
        minTimeout: 10,
        maxTimeout: 1000,
        factor: 1.1,
      },
    );
  }

  async function waitForEmailService() {
    return await retry(
      async (_bail, tries) => {
        if (tries >= 25) {
          console.log(
            `> Trying to connect to Email Service #${tries}, Are you running the MailCatcher container?`,
          );
        }
        await fetch(emailServiceUrl);
      },
      {
        retries: 50,
        minTimeout: 10,
        maxTimeout: 1000,
        factor: 1.1,
      },
    );
  }
}

async function resetDatabase() {
  try {
    await execAsync(`npx prisma migrate reset --force --skip-seed`);
  } catch (error) {
    console.error("❌ Database reset failed:", error);
    throw error;
  }
}

async function deleteAllEmails() {
  await fetch(`${emailServiceUrl}/messages`, {
    method: "DELETE",
  });
}

async function waitForNthEmail(
  n: number,
  { intervalMs = 1, maxAttempts = 500 } = {},
) {
  const logInterval = 5;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const response = await fetch(`${emailServiceUrl}/messages`);
    const emailList = await response.json();

    if (emailList.length >= n) {
      if (attempt >= logInterval) process.stdout.write("\n");
      const nthEmail = emailList[n - 1];
      await setEmailTextHtml(nthEmail);
      return nthEmail;
    }

    if (attempt < maxAttempts) {
      if (attempt === logInterval) {
        process.stdout.write(`⏳ Waiting for email #${n}`);
      } else if (attempt % logInterval === 0) {
        process.stdout.write(".");
      }

      await delay(intervalMs);
    }
  }

  process.stdout.write("\n⚠️ Failed to get email after max attempts.\n");
  return null;
}

async function setEmailTextHtml(email: {
  text: string;
  html: string;
  id: string;
}) {
  const emailTextResponse = await fetch(
    `${emailServiceUrl}/messages/${email.id}.plain`,
  );
  const emailText = await emailTextResponse.text();
  email.text = emailText;

  const emailHtmlResponse = await fetch(
    `${emailServiceUrl}/messages/${email.id}.html`,
  );
  const emailHtml = await emailHtmlResponse.text();
  email.html = emailHtml;

  return email;
}

function delay(ms: number | undefined) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function withTransaction(testFn: () => Promise<void>) {
  await prisma.$transaction(async (tx) => {
    try {
      await testFn();
    } finally {
      await tx.$executeRaw`ROLLBACK`;
    }
  });
}

async function deactivateFirewall() {
  return await prisma.$queryRaw`
    CREATE OR REPLACE FUNCTION firewall_create_user(clientIp inet) RETURNS boolean AS $$
    BEGIN
      RETURN true;
    END;
    $$ LANGUAGE plpgsql;
`;
}

async function getEmails(
  minCount = 1,
  { maxAttempts = 500, intervalMs = 1 } = {},
) {
  const logInterval = 5;
  let emailList = [];

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const response = await fetch(`${emailServiceUrl}/messages`);
    emailList = await response.json();

    if (emailList.length >= minCount) {
      if (attempt >= logInterval) process.stdout.write("\n");
      break;
    }

    if (attempt === maxAttempts) {
      process.stdout.write(
        `\n⚠️ Reached max attempts (${maxAttempts}). Proceeding with available emails.\n`,
      );
      break;
    }

    if (attempt === logInterval) {
      process.stdout.write(`⏳ Waiting for at least ${minCount} email(s)...`);
    } else if (attempt % logInterval === 0) {
      process.stdout.write(".");
    }

    await delay(intervalMs);
  }

  const parsed = await Promise.allSettled(emailList.map(setEmailTextHtml));

  const fulfilledResults = parsed
    .filter(
      (p): p is PromiseFulfilledResult<unknown> => p.status === "fulfilled",
    )
    .map((p) => p.value);

  return fulfilledResults;
}

function waitForFirstEmail(options: {
  intervalMs: number;
  maxAttempts: number;
}) {
  return waitForNthEmail(1, options);
}

const orchestrator = {
  deleteAllEmails,
  waitForAllServices,
  resetDatabase,
  withTransaction,
  waitForNthEmail,
  deactivateFirewall,
  getEmails,
  waitForFirstEmail,
};

export default orchestrator;
