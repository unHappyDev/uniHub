import { performance } from "perf_hooks";
import prisma from "@/lib/prisma";

type DatabaseDependencyStatus = {
  status: string;
  max_connections?: number | undefined;
  opened_connections?: number | undefined;
  latency?: {
    first_query?: number | undefined;
    second_query?: number | undefined;
    third_query?: number | undefined;
  };
  version?: string | undefined;
};

type WebserverDependencyStatus = {
  provider: string;
  environment: string;
  aws_region: string;
  vercel_region: string;
  timezone: string;
  last_commit_author: string;
  last_commit_message: string;
  last_commit_message_sha: string;
  version: string;
};

type DependencyResult = DatabaseDependencyStatus | WebserverDependencyStatus;

async function getDependencies(): Promise<Record<string, DependencyResult>> {
  const dependenciesHandlersToCheck = [
    {
      name: "database",
      handler: checkDatabaseDependency,
    },
    {
      name: "webserver",
      handler: checkWebserverDependency,
    },
  ];

  const checkedDependencies = await Promise.all(
    dependenciesHandlersToCheck.map(async ({ name, handler }) => {
      const result = await handler();
      return { name, result };
    }),
  );

  return checkedDependencies.reduce<Record<string, DependencyResult>>(
    (acc, { name, result }) => {
      acc[name] = result;
      return acc;
    },
    {},
  );
}

async function checkDatabaseDependency() {
  let result;
  try {
    const firstQueryTimer = performance.now();
    const [maxConnectionsResult] = await prisma.$queryRawUnsafe<
      { max_connections: string }[]
    >("SHOW max_connections;");
    const [superuserReservedConnectionsResult] = await prisma.$queryRawUnsafe<
      { superuser_reserved_connections: string }[]
    >("SHOW superuser_reserved_connections;");

    const maxConnectionsValue = maxConnectionsResult.max_connections;
    const superuserReservedConnectionsValue =
      superuserReservedConnectionsResult.superuser_reserved_connections;
    const firstQueryDuration = performance.now() - firstQueryTimer;

    const secondQueryTimer = performance.now();
    const openConnectionsResult = await prisma.$queryRaw<{
      opened_connections: string;
    }>`
      SELECT numbackends as opened_connections FROM pg_stat_database where datname = ${process.env.POSTGRES_DB};
    `;
    const openConnectionsValue = openConnectionsResult.opened_connections;
    const secondQueryDuration = performance.now() - secondQueryTimer;

    const thirdQueryTimer = performance.now();
    const versionResult = await prisma.$queryRawUnsafe<{
      server_version: string;
    }>("SHOW server_version;");
    const versionResultValue = versionResult.server_version;
    const thirdQueryDuration = performance.now() - thirdQueryTimer;

    result = {
      status: "healthy",
      max_connections:
        parseInt(maxConnectionsValue) -
        parseInt(superuserReservedConnectionsValue),
      opened_connections: parseInt(openConnectionsValue),
      latency: {
        first_query: firstQueryDuration,
        second_query: secondQueryDuration,
        third_query: thirdQueryDuration,
      },
      version: versionResultValue,
    };
  } catch (error) {
    console.error(error);
    result = {
      status: "unhealthy",
    };
  }

  return result;
}

function checkWebserverDependency() {
  return {
    status: "healthy",
    provider: process.env.VERCEL ? "vercel" : "local",
    environment: process.env.VERCEL_ENV ? process.env.VERCEL_ENV : "local",
    aws_region: process.env.AWS_REGION,
    vercel_region: process.env.VERCEL_REGION,
    timezone: process.env.TZ,
    last_commit_author: process.env.VERCEL_GIT_COMMIT_AUTHOR_LOGIN,
    last_commit_message: process.env.VERCEL_GIT_COMMIT_MESSAGE,
    last_commit_message_sha: process.env.VERCEL_GIT_COMMIT_SHA,
    version: process.version,
  };
}

export default Object.freeze({
  getDependencies,
});
