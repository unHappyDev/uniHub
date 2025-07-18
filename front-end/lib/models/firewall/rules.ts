import event from "@/lib/domain/event";
import { sendFirewallEmail } from "@/lib/email";
import TooManyRequestsError from "@/lib/errors/too-many-requests-error";
import prisma from "@lib/prisma";

export async function createUserRule(clientIp: string, userId: string) {
  const results = await prisma.$queryRawUnsafe<{ allowed: boolean }[]>(
    `SELECT firewall_create_user($1::inet) as allowed`,
    clientIp,
  );

  const pass = results[0]?.allowed ?? false;

  if (!pass) {
    await createUserRuleSideEffect(clientIp, userId);

    throw new TooManyRequestsError({
      message:
        "We've identified the create of many users in a short period of time, so recently created users may have been blocked",
    });
  }
}

async function createUserRuleSideEffect(clientIp: string, userId: string) {
  const results = await prisma.$queryRaw<
    { id: string; username: string; email: string }[]
  >`SELECT * FROM firewall_create_user_side_effect(${clientIp}::inet)`;

  const affectedUsersIds = results.map((user) => user.id);

  const dbEvent = await event.createEvent(
    "firewall:block_users",
    userId,
    clientIp,
    {
      from_rule: "create:user",
      users: affectedUsersIds,
    },
  );

  for (const user of results) {
    sendFirewallEmail({
      to: user.email,
      eventId: dbEvent.id,
      username: user.username,
    });
  }
}
