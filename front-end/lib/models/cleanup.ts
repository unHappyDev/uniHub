import session from "@/lib/domain/session";
import activationToken from "@/lib/domain/activation-token";
import user from "@/lib/domain/user";

async function cleanupDanglingDataFromDatabase() {
  const sessions = await session.deleteExpiredSessions();
  const activationTokens =
    await activationToken.deleteExpiredActivationTokens();
  const users = await user.deleteUsersNotActivatedForMoreThanOneDay();

  return {
    sessions,
    activationTokens,
    users,
  };
}

const cleanup = {
  cleanupDanglingDataFromDatabase,
};

export default cleanup;
