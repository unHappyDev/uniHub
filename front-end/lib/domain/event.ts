import prisma from "@lib/prisma";

async function createEvent(
  type: string,
  originator_user_id: string,
  originator_ip: string,
  metadata:
    | {
        from_rule: string;
        users: string[];
      }
    | {
        id: string;
      },
) {
  const event = await prisma.event.create({
    data: {
      type,
      originator_user_id: originator_user_id || null,
      originator_ip,
      metadata,
    },
  });
  return event;
}

async function getLastEvent() {
  const lastEvent = await prisma.event.findFirst({
    orderBy: { created_at: "desc" },
  });
  return lastEvent;
}

const event = {
  createEvent,
  test: {
    getLastEvent,
  },
};

export default event;
